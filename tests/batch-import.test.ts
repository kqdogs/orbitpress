import {mockImportFetch} from './import-fetch-fixture';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {discoverArticles,sourceHome,parseArticle} from '../src/lib/article-import';
import {runImportQueue,type ImportRow} from '../src/components/studio/import-queue';
import {postInput,type PostInput} from '../src/lib/schema';
import {toPost} from '../src/lib/repository';
afterEach(()=>vi.unstubAllGlobals());
const home='https://rinfinity.net/';
const article={title:'测试文章',slug:'batch-example',body:'## 测试正文',excerpt:'',cover:'',videoId:'',featured:false,tags:['eSIM'],highlights:[]};
const row=(path:string):ImportRow=>({title:path,url:home+path+'/',key:crypto.randomUUID(),status:'pending',warnings:[],error:''});
describe('批量目录来源与契约',()=>{
 it('纯视频文章保留视频容器中的简介，并排除原站播放器提示',()=>{
  const result=parseArticle('<h1>视频教程</h1><article class="post-content"><div data-youtube-id="8JEkhlZEIE8"><div class="rinfinity-video-player">原站播放器</div><section><h2>视频简介</h2><p>申请流程与需要准备的资料，都保存在视频容器的简介里。</p></section></div></article>',home+'video-example/');
  expect(result.article.videoId).toBe('8JEkhlZEIE8');expect(result.article.body).toContain('申请流程');expect(result.article.body).not.toContain('原站播放器');
 });
 it.each(['https://127.0.0.1/','https://rinfinity.net.evil.test/','https://user@rinfinity.net/','https://rinfinity.net/?url=http://localhost','file:///etc/passwd','https://localhost/'])('拒绝非允许站点首页 %s',url=>expect(()=>sourceHome(url)).toThrow());
 it('只有生成的公共目录被请求，标题安全解码，链接去重且过滤跨域/管理地址',async()=>{
  const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify([{link:home+'one/',title:{rendered:'<b>测试 &amp; 教程</b>'}},{link:home+'one/',title:{rendered:'重复'}},{link:'https://evil.test/a',title:{rendered:'危险'}},{link:home+'wp-admin/',title:{rendered:'管理'}}]),{headers:{'Content-Type':'application/json; charset=UTF-8','X-WP-TotalPages':'3'}}));
  mockImportFetch(fetcher);
  const result=await discoverArticles(home,1);expect(result).toEqual({items:[{url:home+'one/',title:'测试 & 教程'}],nextPage:2});
  expect(String(fetcher.mock.calls[0][0])).toBe(home+'wp-json/wp/v2/posts?per_page=20&page=1&_fields=link,title');
  expect(fetcher.mock.calls[0][1].headers).not.toHaveProperty('Cookie');
 });
 it('不能通过目录重定向访问其它路径或主机',async()=>{
  const fetcher=vi.fn().mockResolvedValue(new Response(null,{status:302,headers:{Location:'http://127.0.0.1/'}}));mockImportFetch(fetcher);
  await expect(discoverArticles(home)).rejects.toMatchObject({code:'IMPORT_URL'});expect(fetcher).toHaveBeenCalledTimes(1);
 });
 it.each(['{}','invalid',JSON.stringify([{link:home+'one/',title:{}}])])('拒绝无效目录：%s',async text=>{
  mockImportFetch(vi.fn().mockResolvedValue(new Response(text,{headers:{'Content-Type':'application/json'}})));
  await expect(discoverArticles(home)).rejects.toMatchObject({code:'IMPORT_TYPE'});
 });
});
describe('批量队列保存与重试',()=>{
 it('默认空分类，逐个下载和保存，成功项跳过，继续处理独立失败项',async()=>{
  const rows=[row('one'),row('bad'),row('two')];const saved:string[]=[];
  const deps={collect:vi.fn(async(url:string)=>{if(url.includes('/bad/'))throw Error('来源失败');return {article,sourceUrl:url,warnings:[]};}),save:vi.fn(async(input:PostInput)=>{saved.push(input.categoryId);return {id:'id-'+saved.length};}),wait:vi.fn(async()=>{})};
  await runImportQueue(rows,'',new AbortController().signal,deps);
  expect(saved).toEqual(['','']);expect(rows.map(row=>row.status)).toEqual(['success','error','success']);expect(deps.wait).toHaveBeenCalledTimes(2);
  await runImportQueue([rows[0]],'',new AbortController().signal,deps);expect(saved).toHaveLength(2);
 });
 it('保存结果不确定时重试同一个payload/幂等键，不重新下载或改变分类',async()=>{
  const rows=[row('one')];const collect=vi.fn(async()=>({article,sourceUrl:rows[0].url,warnings:[]}));
  const save=vi.fn().mockRejectedValueOnce(Error('连接中断')).mockResolvedValue({id:'one'});const deps={collect,save,wait:vi.fn(async()=>{})};
  await runImportQueue(rows,'chosen',new AbortController().signal,deps);const payload=rows[0].payload;
  await runImportQueue(rows,'different',new AbortController().signal,deps);
  expect(collect).toHaveBeenCalledTimes(1);expect(save.mock.calls[0].slice(0,2)).toEqual(save.mock.calls[1].slice(0,2));expect(rows[0].payload).toBe(payload);expect(payload?.categoryId).toBe('chosen');expect(rows[0].status).toBe('success');
 });
 it('停止后不会保存未完成下载或启动后续文章',async()=>{
  const controller=new AbortController();const rows=[row('one'),row('two')];const save=vi.fn();const collect=vi.fn(async()=>{controller.abort();return {article,sourceUrl:rows[0].url,warnings:[]};});
  await runImportQueue(rows,'',controller.signal,{collect,save,wait:vi.fn()});expect(save).not.toHaveBeenCalled();expect(collect).toHaveBeenCalledTimes(1);expect(rows.map(x=>x.status)).toEqual(['pending','pending']);
 });
 it('空分类契约默认空串，读取SQL NULL不会输出字符串null',()=>{
  expect(postInput.parse(article).categoryId).toBe('');expect(postInput.parse({...article,categoryId:''}).categoryId).toBe('');
  expect(toPost({category_id:null,category_name:null,category_slug:null,tags:'[]',excerpt:''})).toMatchObject({categoryId:'',categoryName:'',categorySlug:''});
 });
});

import {mockImportFetch} from './import-fetch-fixture';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {parseArticle,importArticle} from '../src/lib/article-import';
import {headerNavigation} from '../src/lib/header-navigation';
import {mediaResponse} from '../src/lib/media-response';

const url='https://rinfinity.net/import-media-test/';
const cover='https://rinfinity.net/wp-content/uploads/2026/10/cover.png';
const photo='https://rinfinity.net/wp-content/uploads/2026/10/step.png';
const fixture=`<head><meta property="og:image" content="${cover}"><meta property="article:tag" content="eSIM"><meta property="article:tag" content="DITO"><meta name="keywords" content="DITO, 菲律宾手机号"></head><article><h1>实际文章标题 &amp; 完整保留</h1><div class="entry-content"><p>本测试文章的正文足够长，用于验证图片和标签采集，不使用任何原站教程内容。</p><img src="data:image/gif;base64,AA" data-lazy-src="${photo}" alt="步骤图片"><picture><source srcset="${photo} 1200w"><img src="data:image/gif;base64,AA" alt="同一张图片"></picture></div><a rel="category tag" href="/category/demo/">不应变成标签</a><a rel="tag" href="/tag/esim/">eSIM</a><a rel="tag" href="/tag/travel/">出行</a></article>`;
afterEach(()=>vi.unstubAllGlobals());

describe('默认首页与文章媒体采集',()=>{
 it('没有分类或自定义导航时，系统首页仍保留；不会修改设置数组',()=>{
  const headerNav:[]=[];expect(headerNavigation({headerNav})).toEqual([{label:'首页',href:'/'}]);expect(headerNav).toEqual([]);
 });
 it('已有自定义首页时保留名称位置，不重复添加',()=>{
  const headerNav=[{label:'教程',href:'/tutorials/'},{label:'主页',href:'/'}];expect(headerNavigation({headerNav})).toEqual(headerNav);
 });
 it('采集原始标题、多个标签和延迟加载图片；不复制原站固定链接',()=>{
  const parsed=parseArticle(fixture,url);
  expect(parsed.article.title).toBe('实际文章标题 & 完整保留');
  expect(parsed.article.tags).toEqual(['eSIM','DITO','出行','菲律宾手机号']);
  expect(parsed.article.slug).not.toBe('import-media-test');
  expect(parsed.article.slug).toMatch(/^import-[a-f0-9-]{36}$/);
  expect([...parsed.pictures.keys()]).toEqual([cover,photo]);
  expect(parsed.article.body.match(/ORBITPRESS_IMAGE_1/g)).toHaveLength(2);
 });
 it('封面和正文图片写入本站媒体，重复图片只下载一次，失败不会伪报成功',async()=>{
  const bytes=new Uint8Array([137,80,78,71,13,10,26,10,0]);
  const fetcher=vi.fn(async(input:Parameters<typeof fetch>[0])=>new Response(String(input)===url?fixture:bytes,{headers:{'Content-Type':String(input)===url?'text/html':'image/png'}}));
  mockImportFetch(fetcher);
  const put=vi.fn(async()=>({})),run=vi.fn(async()=>({success:true}));
  const env={MEDIA:{put},DB:{prepare:()=>({bind:()=>({run})})}} as unknown as Pick<Env,'MEDIA'|'DB'>;
  const result=await importArticle(url,env);
  expect(result.article.cover).toMatch(/^\/media\/import-[a-f0-9]{64}\.png$/);
  expect(result.article.body.match(/!\[.*?\]\(\/media\/import-[a-f0-9]{64}\.png\)/g)).toHaveLength(2);
  expect(result.article.tags).toEqual(['eSIM','DITO','出行','菲律宾手机号']);
  expect(result.warnings).toEqual([]);expect(fetcher).toHaveBeenCalledTimes(3);expect(put).toHaveBeenCalledTimes(2);expect(run).toHaveBeenCalledTimes(2);
 });
 it('图片失败时列出可辨认的图片名，其他图片仍可导入',async()=>{
  mockImportFetch(vi.fn(async(input:Parameters<typeof fetch>[0])=>new Response(String(input)===url?fixture:null,{status:String(input)===url?200:404,headers:{'Content-Type':'text/html'}})));
  const result=await importArticle(url,{} as Pick<Env,'MEDIA'|'DB'>);
  expect(result.article.cover).toBe('');expect(result.warnings.join(' ')).toContain('文章封面');expect(result.warnings.join(' ')).toContain('步骤图片');
  expect(result.article.body).not.toContain('ORBITPRESS_IMAGE_');
  expect(result.article.body).not.toContain(photo);expect(result.article.body).not.toContain(cover);
 });
});

describe('采集图片的公共访问与安全边界',()=>{
 const bytes=new Uint8Array([137,80,78,71,13,10,26,10]);
 function bucket(){
  const get=vi.fn(async()=>({body:bytes,httpEtag:'"test-etag"',writeHttpMetadata:(headers:Headers)=>headers.set('Content-Type','image/png')}));
  return {get,storage:{get} as unknown as R2Bucket};
 }
 it.each(['import-'+ 'a'.repeat(64)+'.png','01234567-abcd-abcd-abcd-0123456789ab.png'])('新采集和已有上传图片都能访问：%s',async id=>{
  const {get,storage}=bucket();const response=await mediaResponse(storage,id,new Request('https://site.test/media/'+id));
  expect(response.status).toBe(200);expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
  expect(response.headers.get('content-type')).toBe('image/png');expect(response.headers.get('x-content-type-options')).toBe('nosniff');expect(get).toHaveBeenCalledWith(id);
 });
 it('已有采集文件支持条件缓存，304响应没有正文',async()=>{
  const {storage}=bucket();const response=await mediaResponse(storage,'import-'+ 'b'.repeat(64)+'.png',new Request('https://site.test/',{headers:{'If-None-Match':'"test-etag"'}}));
  expect(response.status).toBe(304);expect(await response.text()).toBe('');
 });
 it.each(['../secret','import-'+ 'a'.repeat(63)+'.png','import-'+ 'a'.repeat(64)+'.svg','01234567-xxxx-abcd-abcd-0123456789ab.png','arbitrary.png'])('拒绝非法对象键且不读取R2：%s',async id=>{
  const {get,storage}=bucket();expect((await mediaResponse(storage,id,new Request('https://site.test/'))).status).toBe(404);expect(get).not.toHaveBeenCalled();
 });
});

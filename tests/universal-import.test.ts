import {afterEach,describe,expect,it,vi} from 'vitest';
import {sourceUrl,parseArticle,importArticle,discoverArticles,sourceHome} from '../src/lib/article-import';
import {createImportReader,isPublicImportAddress} from '../src/lib/import-network';
import {mockImportFetch} from './import-fetch-fixture';
afterEach(()=>vi.unstubAllGlobals());
const home='https://blog.example.com/';
const paragraph='这是公开博客正文测试，完整保留标题、文字和图片，不应导入推荐菜单、页脚和站点品牌。';

describe('通用博客正文',()=>{
 it.each(['gh-content','article-entry','post-body','post__content','markdown-body','prose'])('识别常见主题正文 %s',className=>{
  const html=`<header><h1 class="site-title">站点</h1></header><article><h1>主题文章</h1><section class="${className}"><p>${paragraph}</p><pre><code class="language-rust">fn main() {}</code></pre></section><aside>无关推荐</aside></article>`;
  const result=parseArticle(html,home+'2026/10/demo.html');expect(result.article.title).toBe('主题文章');expect(result.article.body).toContain(paragraph);expect(result.article.body).toContain('```rust');expect(result.article.body).not.toContain('无关推荐');
 });
 it('自定义 main 布局通过结构化元数据识别标题、封面、标签',()=>{
  const html=`<script type="application/ld+json">${JSON.stringify({'@graph':[{'@type':'BlogPosting',headline:'自定义文章',description:'文章简介',keywords:['TypeScript','随笔'],image:{url:'https://cdn.example.com/cover.webp'}}]})}</script><main><p>${paragraph}</p><h2>正文内容</h2></main>`;
  const result=parseArticle(html,home+'?p=123');expect(result.article).toMatchObject({title:'自定义文章',excerpt:'文章简介',tags:['TypeScript','随笔']});expect(result.cover).toBe('https://cdn.example.com/cover.webp');
 });
 it('结构化 articleBody 可作纯文本回退，脚本不执行',()=>{
  const result=parseArticle(`<script type="application/ld+json">${JSON.stringify({'@type':'Article',headline:'结构化文章',articleBody:paragraph+' <script>alert(1)</script>'}).replaceAll('<','\\u003c')}</script>`,home+'nested/post');
  expect(result.article.body).toContain(paragraph);expect(result.article.body).not.toContain('<script>');
 });
 it('多级路径、普通查询、子目录首页和其他公开域名可采',()=>{
  expect(sourceUrl(home+'2026/10/你好.html?id=3#title').href).toBe(home+'2026/10/%E4%BD%A0%E5%A5%BD.html?id=3');
  expect(sourceUrl('http://other-blog.org/?p=123').search).toBe('?p=123');expect(sourceHome(home+'blog').pathname).toBe('/blog/');
 });
 it('不同公网 CDN 图片下载为本站媒体地址',async()=>{
  const image='https://cdn.example.com/assets/photo.png';
  mockImportFetch(async input=>new Response(String(input).includes('cdn.example.com')?new Uint8Array([137,80,78,71,13,10,26,10]):`<article><h1>CDN 图片</h1><p>${paragraph}</p><img data-src="${image}" alt="图片"></article>`,{headers:{'content-type':String(input).includes('cdn.example.com')?'image/png':'text/html'}}));
  const put=vi.fn(),run=vi.fn();const env={MEDIA:{put},DB:{prepare:()=>({bind:()=>({run})})}} as unknown as Pick<Env,'DB'|'MEDIA'>;
  const result=await importArticle(home+'article.html',env);expect(result.article.body).toMatch(/!\[图片\]\(\/media\/import-[a-f0-9]{64}\.png\)/);expect(result.warnings).toEqual([]);expect(put).toHaveBeenCalledOnce();
 });
});

describe('通用目录发现',()=>{
 function site(routes:Record<string,{body:string;type?:string}>){return mockImportFetch(async input=>{
  const route=routes[new URL(String(input)).pathname];return new Response(route?.body||'Not found',{status:route?200:404,headers:{'content-type':route?.type||'text/html'}});
 });}
 it.each(['rss','atom'])('自动识别 %s 并保留标题，排除跨站与分类链接',async format=>{
  const feed=format==='rss'?`<rss><channel><item><title>标题 &amp; 教程</title><link>${home}2026/test.html</link></item><item><title>分类</title><link>${home}category/test/</link></item><item><title>外站</title><link>https://other.org/post</link></item></channel></rss>`:`<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>标题 &amp; 教程</title><link href="${home}2026/test.html"/></entry></feed>`;
  site({'/':{body:'<link rel="alternate" type="application/'+format+'+xml" href="/custom-feed.xml">'},'/custom-feed.xml':{body:feed,type:'application/'+format+'+xml'}});
  expect(await discoverArticles(home)).toEqual({items:[{url:home+'2026/test.html',title:'标题 & 教程'}],nextPage:null});
 });
 it('sitemap index 发现子目录并按20条分页、去重和过滤站外地址',async()=>{
  const urls=Array.from({length:25},(_,i)=>`<url><loc>${home}posts/entry-${i}.html</loc></url>`).join('');
  site({'/':{body:'<title>Blog</title>'},'/sitemap.xml':{body:`<sitemapindex><sitemap><loc>${home}posts-map.xml</loc></sitemap></sitemapindex>`,type:'application/xml'},'/posts-map.xml':{body:`<urlset>${urls}<url><loc>https://other.org/post</loc></url></urlset>`,type:'application/xml'}});
  const first=await discoverArticles(home),second=await discoverArticles(home,2);expect(first.items).toHaveLength(20);expect(first.nextPage).toBe(2);expect(second.items).toHaveLength(5);expect(second.nextPage).toBe(null);expect(second.items[0].url).toBe(home+'posts/entry-20.html');
 });
 it('无接口或订阅时扫描文章卡片和下一页，导航及坏链接不会入队',async()=>{
  site({'/':{body:'<nav><a href="/login">登录</a></nav><article><header><h2><a href="/post-one/">文章一</a></h2></header><a href="http://[bad">坏链接</a></article><a rel="next" href="/page/2/">下一页</a>'},'/page/2/':{body:'<h2 class="post-title"><a href="/2026/two.html">文章二</a></h2>'}});
  expect((await discoverArticles(home)).items).toEqual([{url:home+'post-one/',title:'文章一'},{url:home+'2026/two.html',title:'文章二'}]);
 });
 it('纯脚本站点返回可理解的错误，没有伪造文章',async()=>{
  site({'/':{body:'<div id="app"></div><script src="/app.js"></script>'}});
  await expect(discoverArticles(home)).rejects.toMatchObject({status:422,code:'IMPORT_DIRECTORY'});
 });
});

describe('通用采集公网边界',()=>{
 it.each(['http://2130706433/','http://0x7f000001/','http://0177.0.0.1/','https://[::1]/','https://[::ffff:127.0.0.1]/','https://localhost/','https://metadata.google.internal/','https://user:pass@blog.org/','file:///etc/passwd','https://blog.org:8443/a','https://blog.org/%0d%0afoo'])('拒绝危险 URL %s',url=>expect(()=>sourceUrl(url)).toThrow());
 it.each(['127.0.0.1','10.0.0.2','169.254.169.254','100.64.1.2','192.168.1.1','198.18.0.1','192.0.2.1','203.0.113.1','224.0.0.1','::1','fe80::1','fc00::1','::ffff:8.8.8.8','2001:db8::1','2002:7f00:1::','3fff::1'])('阻止私有和保留 DNS 地址 %s',ip=>expect(isPublicImportAddress(ip)).toBe(false));
 it.each(['1.1.1.1','8.8.8.8','93.184.216.34','2606:4700:4700::1111','2001:4860:4860::8888'])('公网 DNS 地址可用 %s',ip=>expect(isPublicImportAddress(ip)).toBe(true));
 it('混合公网和私网 DNS 失败关闭，不发出目标请求',async()=>{
  const fetcher=vi.fn(async()=>Response.json({Status:0,Answer:[{type:1,data:'8.8.8.8'},{type:1,data:'10.1.1.1'}]}));vi.stubGlobal('fetch',fetcher);
  await expect(createImportReader(AbortSignal.timeout(1000))(home)).rejects.toMatchObject({code:'IMPORT_URL'});expect(fetcher.mock.calls).toHaveLength(2);
 });
 it('合法跨域重定向重新解析目标域名，私网目标在连接前拦截',async()=>{
  const fetcher=mockImportFetch(async input=>new Response(null,{status:302,headers:{location:String(input).includes('blog.example.com')?'https://cdn.example.com/post':'http://169.254.169.254/'}}));
  await expect(createImportReader(AbortSignal.timeout(1000))(home)).rejects.toMatchObject({code:'IMPORT_URL'});expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('DNS 服务故障不会继续读取文章',async()=>{
  vi.stubGlobal('fetch',vi.fn(async()=>new Response(null,{status:503})));
  await expect(createImportReader(AbortSignal.timeout(1000))(home)).rejects.toMatchObject({code:'IMPORT_DNS'});
 });
 it('DNS 服务不可用时回退，收到私网答案时不回退',async()=>{
  const fetcher=vi.fn(async(input:Parameters<typeof fetch>[0])=>{
   const url=new URL(String(input));
   if(url.hostname==='cloudflare-dns.com')return new Response(null,{status:503});
   if(url.hostname==='dns.alidns.com')return Response.json({Status:0,Answer:url.searchParams.get('type')==='A'?[{type:1,data:'8.8.8.8'}]:[]});
   return new Response('<article>正常公开页面</article>',{headers:{'content-type':'text/html'}});
  });vi.stubGlobal('fetch',fetcher);
  expect(new TextDecoder().decode((await createImportReader(AbortSignal.timeout(1000))(home)).bytes)).toContain('正常公开页面');
  expect(fetcher).toHaveBeenCalledTimes(5);
  fetcher.mockClear();fetcher.mockImplementation(async()=>Response.json({Status:0,Answer:[{type:1,data:'10.0.0.1'}]}));
  await expect(createImportReader(AbortSignal.timeout(1000))(home)).rejects.toMatchObject({code:'IMPORT_URL'});expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it('DNS 和重定向合计最多32个出站请求',async()=>{
  const fetcher=mockImportFetch(async()=>new Response('正文',{headers:{'content-type':'text/html'}}));const read=createImportReader(AbortSignal.timeout(2000));
  for(let i=0;i<30;i++)await read(home+'article-'+i);
  await expect(read(home+'overflow')).rejects.toMatchObject({code:'IMPORT_NETWORK'});expect(fetcher).toHaveBeenCalledTimes(30);
 });
 it('DNS 重定向不被跟随，保持 Workers 支持的 manual 语义',async()=>{
  const fetcher=vi.fn(async(_input:Parameters<typeof fetch>[0],_init?:RequestInit)=>new Response(null,{status:302,headers:{location:'http://127.0.0.1/'}}));vi.stubGlobal('fetch',fetcher);
  await expect(createImportReader(AbortSignal.timeout(1000))(home)).rejects.toMatchObject({code:'IMPORT_DNS'});
  expect(fetcher.mock.calls.every(call=>['cloudflare-dns.com','dns.alidns.com'].includes(new URL(String(call[0])).hostname)&&call[1]?.redirect==='manual')).toBe(true);
 });
});

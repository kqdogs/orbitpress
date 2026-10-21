import {mockImportFetch} from './import-fetch-fixture';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {articleResourcesInput,postInput,articlePreviewInput,emptyArticleResources} from '../src/lib/schema';
import {parseArticle,sourceUrl,importArticle} from '../src/lib/article-import';
import {renderMarkdown} from '../src/lib/markdown';
import {youtubeUrl} from '../src/lib/video-embed';
import {videoDirective} from '../src/components/studio/video';
import {toPost} from '../src/lib/repository';

const url='https://rinfinity.net/example-article/';
const html='<html><head><meta name="description" content="文章摘要"></head><body><h1>导入测试文章</h1><article class="post-content"><div><p>这是足够长的测试正文，只用于验证采集和代码转换，不包含第三方教程内容。</p><h2>示例代码</h2><pre><code class="language-brainfuck">++ &lt;script&gt;\n\t[&gt;++&lt;-]\n\n```</code></pre><p><a href="javascript:alert(1)">危险链接</a><strong>重点</strong></p><div data-youtube-id="nd-Q0_XcCCk"></div><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe></div><footer>原站作者与关注标识</footer></article><script>window.bad=true</script></body></html>';
afterEach(()=>vi.unstubAllGlobals());
describe('采集的来源与内容边界',()=>{
 it.each(['https://rinfinity.net.evil.test/post/','https://rinfinity.net@127.0.0.1/post/','https://rinfinity.net:444/post/','https://rinfinity.net/wp-admin/','https://rinfinity.net/%E0%A4%A/'])('拒绝非文章或伪造 URL %s',input=>expect(()=>sourceUrl(input)).toThrow());
 it('转换标题、代码语言和空行，排除脚本、作者栏，保留多个视频与来源',()=>{
  const result=parseArticle(html,url);
  expect(result.article).toMatchObject({title:'导入测试文章',excerpt:'文章摘要',videoId:'nd-Q0_XcCCk'});
  expect(result.article.slug).toMatch(/^import-[a-f0-9-]{36}$/);
  expect(result.article.body).toContain('````brainfuck\n++ <script>\n\t[>++<-]\n\n```\n````');
  expect(result.article.body).toContain(':::youtube dQw4w9WgXcQ');
  expect(result.article.body).toContain(url);expect(result.article.body).not.toMatch(/window.bad|原站作者|javascript:/);
  const output=renderMarkdown(result.article.body).html;
  expect(output).toContain('&lt;script&gt;');expect(output).not.toContain('<script>');
 });
 it('没有正文不能伪装成成功',()=>expect(()=>parseArticle('<h1>错误页面</h1>',url)).toThrow());
 it('页面有站名 H1 时优先使用文章标题',()=>{
  const fixture='<header><h1 class="site--title">原站名称</h1></header><article><h1>实际文章标题</h1><div class="entry-content"><p>这是测试文章正文，用于确认标题读取文章区域，而非前面的站点名称。</p></div></article>';
  expect(parseArticle(fixture,url).article.title).toBe('实际文章标题');
 });
 it('拒绝私网重定向且不发送 Cookie/Authorization',async()=>{
  const fetcher=vi.fn().mockResolvedValue(new Response(null,{status:302,headers:{Location:'http://127.0.0.1/secret'}}));
  mockImportFetch(fetcher);
  await expect(importArticle(url,{} as Pick<Env,'DB'|'MEDIA'>)).rejects.toMatchObject({code:'IMPORT_URL'});
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(fetcher.mock.calls[0][1]).toMatchObject({redirect:'manual'});
  expect(fetcher.mock.calls[0][1].headers).not.toHaveProperty('Authorization');expect(fetcher.mock.calls[0][1].headers).not.toHaveProperty('Cookie');
 });
 it('限制响应体实际大小，并返回稳定错误',async()=>{
  mockImportFetch(vi.fn().mockResolvedValue(new Response('x'.repeat(2*1024*1024+1),{headers:{'Content-Type':'text/html'}})));
  await expect(importArticle(url,{} as Pick<Env,'DB'|'MEDIA'>)).rejects.toMatchObject({status:413,code:'IMPORT_SIZE'});
 });
 it('没有图片的真实解析管道不创建文章或写库',async()=>{
  mockImportFetch(vi.fn().mockResolvedValue(new Response(html,{headers:{'Content-Type':'text/html'}})));
  const result=await importArticle(url,{} as Pick<Env,'DB'|'MEDIA'>);
  expect(result.sourceUrl).toBe(url);expect(result.article.title).toBe('导入测试文章');expect(result.article).not.toHaveProperty('status');
 });
});
describe('文章视频资源与任意语言代码',()=>{
 it('资源支持多链接和优惠码，拒绝危险协议、凭据和超限',()=>{
  const resources={title:'本期视频提到的链接',items:[{label:'官网',url:'https://example.com/',code:'YACHIN'}],descriptionUrl:'https://www.youtube.com/watch?v=nd-Q0_XcCCk'};
  expect(articleResourcesInput.parse(resources)).toEqual(resources);
  for(const address of ['javascript:alert(1)','//evil.test/','https://user:password@example.com','http://example.com'])expect(articleResourcesInput.safeParse({...resources,items:[{...resources.items[0],url:address}]}).success).toBe(false);
  expect(articleResourcesInput.safeParse({...resources,items:Array(13).fill(resources.items[0])}).success).toBe(false);
  expect(articlePreviewInput.shape.resources.parse(resources)).toEqual(resources);
  expect(postInput.shape.resources.safeParse(null).success).toBe(false);
 });
 it.each(['python','c++','objective-c','powershell','自定义语言','unknown-language'])('保留 %s 的代码和缩进，并安全转义',language=>{
  const {html}=renderMarkdown('```'+language+'\n  <script>x</script>\n\tline\n```');
  expect(html).toContain(`language-${language}`);expect(html).toContain('data-copy-code="true"');expect(html).toContain('  &lt;script&gt;x&lt;/script&gt;\n\tline');expect(html).not.toContain('<script>');
 });
 it('旧数据库映射为空卡片；新卡片在 API 返回中保留',()=>{
  const row={tags:'[]',excerpt:'',resources:undefined};
  expect(toPost(row).resources).toEqual(emptyArticleResources);
  const value={...emptyArticleResources,items:[{label:'资源',url:'https://example.com',code:'YA'}]};
  expect(toPost({...row,resources:JSON.stringify(value)}).resources).toEqual(value);
 });
 it('视频 URL 带有效 origin、inline 参数和时间，不允许伪造 ID',()=>{
  const embed=new URL(youtubeUrl('nd-Q0_XcCCk',28,'https://example.com/post',true));
  expect(embed.hostname).toBe('www.youtube.com');expect(embed.searchParams.get('origin')).toBe('https://example.com');expect(embed.searchParams.get('start')).toBe('28');expect(embed.searchParams.get('playsinline')).toBe('1');
  expect(videoDirective('youtube','https://www.youtube.com/watch?v=nd-Q0_XcCCk&t=1m28s')).toBe(':::youtube nd-Q0_XcCCk t=88');
  const {html}=renderMarkdown(':::youtube nd-Q0_XcCCk t=28');expect(html).toContain('start=28');expect(html).toContain('在 YouTube 打开视频');expect(html).toContain('strict-origin-when-cross-origin');
  expect(()=>youtubeUrl('bad" onload="x')).toThrow();
 });
});

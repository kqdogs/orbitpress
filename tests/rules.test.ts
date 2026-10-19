import {describe,it,expect} from 'vitest';
import {postInput,slugSchema,settingsInput,articlePreviewInput,navigationHref,navigationCategorySlug,permalinkCustomInput,type Settings} from '../src/lib/schema';
import {renderMarkdown} from '../src/lib/markdown';
import {sameOrigin,constantTimeEqual,verifyPassword,requireScope} from '../src/lib/security';
import {detectImage} from '../src/lib/api-controller';
import {readBody,ApiError} from '../src/lib/http';
import {pbkdf2Sync} from 'node:crypto';
import {openapi} from '../src/lib/openapi';
import {matchPostPath,matchesPublishedPath,postPath} from '../src/lib/permalinks';
const valid={title:'Test',slug:'test-article',excerpt:'',body:'## Hello',categoryId:'ai-tools',cover:'',videoId:'',featured:false,tags:[]};
describe('内容输入与契约',()=>{
 it('接受 false、空字符串、空数组并保留原值',()=>expect(postInput.parse(valid)).toEqual(valid));
 it.each(['admin','api','hello/world','<script>','../escape','My-Post'])('拒绝保留或非法路径 %s',slug=>expect(slugSchema.safeParse(slug).success).toBe(false));
 it('拒绝未知权限字段及null',()=>{expect(postInput.safeParse({...valid,status:'published'}).success).toBe(false);expect(postInput.safeParse({...valid,excerpt:null}).success).toBe(false);});
 it('拒绝外部封面与超过长度标签',()=>{expect(postInput.safeParse({...valid,cover:'https://evil.example/track'}).success).toBe(false);expect(postInput.safeParse({...valid,tags:Array(9).fill('x')}).success).toBe(false);});
 it('OpenAPI输入必填项与运行时schema一致',()=>{expect(openapi.components.schemas.PostInput.required).toEqual(Object.keys(valid));expect(openapi.components.schemas.PostInput.additionalProperties).toBe(false);});
 const brand={title:'我的频道',tagline:'生活与科技',description:'',logo:'/media/my-logo.png',socialFollowText:'关注我的频道 ↗',headerNav:[{label:'首页',href:'/'},{label:'教程',href:'/tutorials/'}],notice:'',youtube:'https://youtube.com/',telegram:'',bilibili:'',twitter:''};
 it('接受本地Logo与可配置关注文案并填充新设置默认值',()=>{const parsed=settingsInput.parse(brand);expect(parsed).toMatchObject(brand);expect(parsed.permalinkFormats).toEqual(['postname']);expect(parsed.homeSections.length).toBe(6);});
 it('单独拒绝非HTTPS社交链接',()=>expect(settingsInput.safeParse({...brand,youtube:'javascript:alert(1)'}).success).toBe(false));
 it.each(['https://evil.example/logo.png','//evil.example/logo.png','/media/../admin','/media/logo.svg?x=1','data:image/png;base64,x'])('拒绝不安全Logo %s',logo=>expect(settingsInput.safeParse({...brand,logo}).success).toBe(false));
 it('拒绝空白关注文案',()=>expect(settingsInput.safeParse({...brand,socialFollowText:'  '}).success).toBe(false));
 it.each(['javascript:alert(1)','data:text/html,x','//evil.example/','/\\evil.example/','https://user:pass@example.com/','/ok\nlocation','http://example.com/'])('拒绝危险导航 %s',href=>expect(navigationHref.safeParse(href).success).toBe(false));
 it.each(['/','/tutorials/','/category/ai-tools/','https://example.com/docs?q=1'])('接受安全导航 %s',href=>expect(navigationHref.parse(href)).toBe(href));
 it('导航数量、空名称、角标受限',()=>{expect(settingsInput.safeParse({...brand,headerNav:[]}).success).toBe(false);expect(settingsInput.safeParse({...brand,headerNav:[{label:'',href:'/'}]}).success).toBe(false);expect(settingsInput.safeParse({...brand,headerNav:[{label:'首页',href:'/',badge:'x'.repeat(11)}]}).success).toBe(false);});
 it('分类导航识别查询参数、尾斜杠和编码路径',()=>{for(const href of ['/category/ai-tools/','/category/ai-tools?q=1#top','/category/%61i-tools/'])expect(navigationCategorySlug(href)).toBe('ai-tools');expect(navigationCategorySlug('https://example.com/category/ai-tools/')).toBeNull();});
 it('固定链接支持多格式和自定义结构',()=>{const settings=settingsInput.parse(brand);const post={id:'post-1',slug:'hello-world',categorySlug:'ai-tools',publishedAt:'2026-01-02',createdAt:'2026-01-02'};expect(postPath(post,settings)).toBe('/hello-world/');const multi:Settings={...settings,permalinkFormats:['category','post','custom'],permalinkCustom:'/guide/%postname%/'};expect(matchPostPath('/ai-tools/hello-world/',multi)?.slug).toBe('hello-world');expect(matchPostPath('/post/hello-world/',multi)?.slug).toBe('hello-world');expect(matchPostPath('/guide/hello-world/',multi)?.slug).toBe('hello-world');});
 it.each(['//evil.test/%postname%/','/api/%postname%/','/admin/%postname%/','/guide/%unknown%/%postname%/','/guide/%postname%/%postname%/','/./%postname%/','/%postname%?x=1','/guide/../%postname%/'])('拒绝危险自定义结构 %s',value=>expect(permalinkCustomInput.safeParse(value).success).toBe(false));
 it('日期、数字、朴素和html链接使用同一生成规则',()=>{const settings=settingsInput.parse({...brand,permalinkFormats:['day','month','numeric','plain','custom'],permalinkCustom:'/guide/%postname%.html'});const post={...valid,id:'post-1',slug:'hello-world',categorySlug:'ai-tools',publishedAt:'2026-01-02T08:00:00.000Z',createdAt:'2025-02-03',updatedAt:'2026-01-02',version:1,status:'published' as const};expect(postPath(post,settings,'day')).toBe('/2026/01/02/hello-world/');expect(postPath(post,settings,'month')).toBe('/2026/01/hello-world/');expect(postPath(post,settings,'numeric')).toBe('/archives/post-1/');expect(postPath(post,settings,'plain')).toBe('/?p=post-1');expect(matchPostPath('/guide/hello-world.html',settings)?.slug).toBe('hello-world');expect(matchPostPath('/hello-world/',settings)).toBeNull();expect(matchesPublishedPath('/2026/01/03/hello-world/',post,settings,'day')).toBe(false);expect(matchPostPath('/guide/%XX.html',settings)).toBeNull();});
 it('首页区块必须完整且排序唯一，卡片数量有界',()=>{const settings=settingsInput.parse(brand);expect(settingsInput.safeParse({...settings,homeSections:settings.homeSections.map(section=>({...section,order:0}))}).success).toBe(false);expect(settingsInput.safeParse({...settings,homeSections:settings.homeSections.slice(1)}).success).toBe(false);expect(settingsInput.safeParse({...settings,homeOptions:{...settings.homeOptions,videoLimit:100}}).success).toBe(false);expect(settingsInput.safeParse({...settings,permalinkFormats:[]}).success).toBe(false);});
 const preview={title:'',excerpt:'',body:'## 尚未保存',categoryId:'',cover:'',videoId:'',tags:[],publishedAt:null};
 it('允许未保存文章缺少标题和路径',()=>expect(articlePreviewInput.parse(preview)).toEqual(preview));
 it('预览不接受状态及超长正文',()=>{expect(articlePreviewInput.safeParse({...preview,status:'published'}).success).toBe(false);expect(articlePreviewInput.safeParse({...preview,body:'x'.repeat(100001)}).success).toBe(false);});
});
describe('Markdown输出安全',()=>{
 it('保留排版、目录，移除脚本和事件',()=>{const {html,toc}=renderMarkdown('## 标题\n\n<script>alert(1)</script>\n\n<img src="/images/ok.png" onerror="alert(1)">');expect(html).not.toContain('<script');expect(html).not.toContain('onerror');expect(html).toContain('id="section-1"');expect(toc).toEqual([{id:'section-1',text:'标题',level:2}]);});
 it('拦截javascript和外部跟踪图片',()=>{const {html}=renderMarkdown('[bad](javascript:alert(1))\n\n![tracker](https://evil.example/track.png)');expect(html).not.toContain('javascript:');expect(html).not.toContain('evil.example');});
});
describe('认证和请求边界',()=>{
 it('必须提供同源Origin',()=>{expect(()=>sameOrigin(new Request('http://127.0.0.1/api',{headers:{origin:'http://evil.example'}}))).toThrow(ApiError);expect(()=>sameOrigin(new Request('http://127.0.0.1/api'))).toThrow(ApiError);expect(()=>sameOrigin(new Request('http://127.0.0.1/api',{headers:{origin:'http://127.0.0.1'}}))).not.toThrow();});
 it('发布scope由服务端判断',()=>expect(()=>requireScope({id:'key',kind:'key',scopes:['content:write']},'content:publish')).toThrow(ApiError));
 it('PBKDF2兼容本地凭证且拒绝错误密码',async()=>{const salt='fixture-salt',hash=pbkdf2Sync('right',salt,100000,32,'sha256').toString('hex');expect(await verifyPassword('right',`${salt}:${hash}`)).toBe(true);expect(await verifyPassword('wrong',`${salt}:${hash}`)).toBe(false);});
 it('比较令牌包含长度差异',()=>{expect(constantTimeEqual('abc','abc')).toBe(true);expect(constantTimeEqual('abc','ab')).toBe(false);expect(constantTimeEqual('abc','abd')).toBe(false);});
 it('超大body不依赖Content-Length',async()=>{const req=new Request('http://localhost',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(valid)});await expect(readBody(req,postInput,10)).rejects.toMatchObject({status:413});});
 it('拒绝错误Content-Type及坏JSON',async()=>{await expect(readBody(new Request('http://localhost',{method:'POST',body:'x'}),postInput)).rejects.toMatchObject({status:415});await expect(readBody(new Request('http://localhost',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'}),postInput)).rejects.toMatchObject({status:400});});
});
describe('图片签名',()=>{
 it('识别PNG、JPEG和WebP',()=>{expect(detectImage(new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0]))?.mime).toBe('image/png');expect(detectImage(new Uint8Array([255,216,255,0,0,0,0,0,0,0,0,0]))?.mime).toBe('image/jpeg');expect(detectImage(new TextEncoder().encode('RIFFxxxxWEBP'))?.mime).toBe('image/webp');});
 it('拒绝SVG和伪装文件',()=>{expect(detectImage(new TextEncoder().encode('<svg onload="alert(1)">'))).toBeNull();expect(detectImage(new Uint8Array(5))).toBeNull();});
});

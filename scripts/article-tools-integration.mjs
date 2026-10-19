import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';

const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('此测试仅允许本地服务');
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];
assert(password,'请先初始化本地管理员');
let cookie='',csrf='',post,keyId='',reader='';const results=[];
const resources={title:'本期视频提到的链接',items:[{label:'演示资源',url:'https://example.com/',code:'YACHIN'}],descriptionUrl:'https://www.youtube.com/watch?v=nd-Q0_XcCCk'};
async function call(path,{method='GET',body,admin=false,headers={},key}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';
 if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}
 if(key)h['Idempotency-Key']=key;
 const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(40000)});
 const text=await r.text();let json;try{json=JSON.parse(text);}catch{}
 return {status:r.status,data:json?.data,error:json?.error,text,headers:r.headers};
}
async function test(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name);}
const unique='article-tools-'+Date.now();
try{
 await test('采集接口需要管理员认证',async()=>assert.equal((await call('/api/admin/imports',{method:'POST',body:{url:'https://rinfinity.net/example/'},headers:{Origin:base}})).status,401));
 const login=await call('/api/auth/login',{method:'POST',body:{username:'admin',password},headers:{Origin:base}});assert.equal(login.status,200);cookie=login.headers.get('set-cookie')?.split(';')[0];csrf=login.data.csrf;
 const settings=(await call('/api/admin/settings',{admin:true})).data.value;
 const cats=(await call('/api/admin/categories',{admin:true})).data;
 const category=cats.find(c=>!c.deletedAt);assert(category);
 const input={title:'YaChin 文章工具验收',slug:unique,excerpt:'本地测试，完成后移至回收站。',body:'## 示例代码\n\n```brainfuck\n  ++ <script>\n\t[>++<-]\n```\n\n:::youtube dQw4w9WgXcQ t=28\n',categoryId:category.id,cover:'/images/yachin-mark.svg',videoId:'nd-Q0_XcCCk',featured:false,tags:['验收'],highlights:['多语言代码与视频资源'],resources};
 await test('采集接口拒绝错误 CSRF 与第三方地址',async()=>{
  assert.equal((await call('/api/admin/imports',{method:'POST',body:{url:'https://rinfinity.net/example/'},headers:{Cookie:cookie,Origin:base}})).status,403);
  const r=await call('/api/admin/imports',{method:'POST',admin:true,body:{url:'https://example.com/article/'}});assert.equal(r.status,400);assert.equal(r.error.code,'IMPORT_URL');
 });
 await test('自动化密钥不能访问管理员采集接口',async()=>{
  const key=await call('/api/admin/keys',{method:'POST',admin:true,body:{name:unique,scopes:['content:read'],days:1}});assert.equal(key.status,201);keyId=key.data.id;reader=key.data.token;
  const r=await call('/api/v1/imports',{method:'POST',headers:{Authorization:'Bearer '+key.data.token},body:{url:'https://rinfinity.net/example/'}});assert.equal(r.status,404);
 });
 await test('文章创建、读取包含资源卡片',async()=>{
  const r=await call('/api/admin/posts',{method:'POST',admin:true,body:input,key:randomUUID()});assert.equal(r.status,201);post=r.data;assert.deepEqual(post.resources,resources);
  assert.deepEqual((await call('/api/admin/posts/'+post.id,{admin:true})).data.resources,resources);
 });
 await test('旧客户端省略资源时保留，显式空列表可清除',async()=>{
  const {resources:ignored,...legacy}=input;
  let r=await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,body:{...legacy,version:post.version},key:randomUUID()});assert.equal(r.status,200);post=r.data;assert.deepEqual(post.resources,resources);
  r=await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,body:{...input,resources:{...resources,items:[],descriptionUrl:''},version:post.version},key:randomUUID()});assert.equal(r.status,200);post=r.data;assert.equal(post.resources.items.length,0);
  r=await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,body:{...input,version:post.version},key:randomUUID()});assert.equal(r.status,200);post=r.data;
 });
 await test('未保存预览呈现资源、任意语言及安全视频参数',async()=>{
  const {title,excerpt,body,categoryId,cover,videoId,tags,highlights}=input;
  const r=await call('/admin/preview',{method:'POST',admin:true,body:{title,excerpt,body,categoryId,cover,videoId,tags,highlights,resources}});assert.equal(r.status,200);
  for(const value of ['article-video-links','YACHIN','language-brainfuck','&lt;script&gt;','start=28','www.youtube.com/embed/','strict-origin-when-cross-origin'])assert(r.text.includes(value),value);
  assert(!r.text.includes('<script>\n  ++'));assert(!r.text.includes('t.me/rinfinity'));
 });
 await test('发布后公共 API、前台和左右侧栏装修预览保持资源',async()=>{
  const r=await call('/api/admin/posts/'+post.id+'/publish',{method:'POST',admin:true,body:{version:post.version},key:randomUUID()});assert.equal(r.status,200);post=r.data;
  const block={id:'main-content',type:'content',enabled:true};
  for(const sidebar of ['none','left','right','both']){
   const value={...settings,pageLayouts:{...settings.pageLayouts,article:{sidebar,width:'standard',main:[block],left:[],right:[]}}};
   const preview=await call('/admin/page-preview',{method:'POST',admin:true,body:{page:'article',postId:post.id,settings:value,builder:false}});assert.equal(preview.status,200,preview.text.slice(0,200));
   assert.equal((preview.text.match(/aria-label="本期视频提到的链接"/g)||[]).length,1,sidebar+' card count');
   if(['right','both'].includes(sidebar))assert(/layout-region-right[\s\S]*article-video-links/.test(preview.text),sidebar);
  }
  const publicPost=await call('/api/v1/posts/'+post.id,{headers:{Authorization:'Bearer '+reader}});assert.equal(publicPost.status,200);assert.deepEqual(publicPost.data.resources,resources);
 });
 mkdirSync('test-results',{recursive:true});
 writeFileSync('test-results/article-tools-fixture.json',JSON.stringify({id:post.id,slug:post.slug,version:post.version,settings:settings.permalinkFormats},null,2));
 if(process.argv.includes('--keep')){console.log('本地验收文章暂留供浏览器验证：'+post.id);post=undefined;}
}finally{
 if(post){const current=await call('/api/admin/posts/'+post.id,{admin:true});const r=await call('/api/admin/posts/'+post.id+'/trash',{method:'POST',admin:true,body:{version:current.data.version},key:randomUUID()});assert.equal(r.status,200);}
 if(keyId)assert.equal((await call('/api/admin/keys/'+keyId+'/revoke',{method:'POST',admin:true})).status,200);
 if(cookie)await call('/api/auth/logout',{method:'POST',admin:true});
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/article-tools-integration.json',JSON.stringify({at:new Date().toISOString(),results},null,2));
}

import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const base='http://127.0.0.1:4321';
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];
assert(password,'缺少本地凭证');
const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({username:'admin',password}),signal:AbortSignal.timeout(20000)});
assert.equal(login.status,200);
const cookie=login.headers.get('set-cookie').split(';')[0],{data:{csrf}}=await login.json();
async function call(path,{method='GET',body,auth=true,headers={}}={}) {
 const response=await fetch(base+path,{method,headers:{...(auth?{Cookie:cookie,Origin:base,'X-CSRF-Token':csrf}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
 const text=await response.text();let data;try{data=JSON.parse(text).data;}catch{}
 return {status:response.status,text,data,headers:response.headers};
}
const results=[];
async function test(name,run){await run();results.push(name);console.log('PASS '+name);}
const snapshot=(await call('/api/admin/settings')).data;
const posts=(await call('/api/admin/posts?limit=100')).data.items;
const sample=posts.find(p=>p.status==='published');assert(sample,'需要已发布样例文章');
const settings={...snapshot.value,articleDesign:{...snapshot.value.articleDesign,showToc:false,showAuthor:false,showTags:false,showResources:false,fontSize:18},aboutDesign:{...snapshot.value.aboutDesign,title:'装修接口验收',body:'## 关于测试\n\n正文预览\n<script>injected()</script>',showBackButton:true,buttonLabel:'浏览教程',buttonHref:'/tutorials/'}};
const body={page:'about',settings};
try {
 await test('装修预览仅接受POST，未登录、CSRF和跨站被拒绝',async()=>{
  assert.equal((await call('/admin/page-preview')).status,405);
  assert.equal((await call('/admin/page-preview',{method:'POST',body,auth:false})).status,401);
  assert.equal((await call('/admin/page-preview',{method:'POST',body,headers:{'X-CSRF-Token':'invalid'}})).status,403);
  assert.equal((await call('/admin/page-preview',{method:'POST',body,headers:{Origin:'https://invalid.example'}})).status,403);
 });
 await test('装修预览拒绝未知字段、脚本链接和不存在文章',async()=>{
  assert.equal((await call('/admin/page-preview',{method:'POST',body:{...body,url:'https://invalid.example'}})).status,400);
  assert.equal((await call('/admin/page-preview',{method:'POST',body:{...body,settings:{...settings,aboutDesign:{...settings.aboutDesign,buttonHref:'javascript:alert(1)'}}}})).status,400);
  assert.equal((await call('/admin/page-preview',{method:'POST',body:{page:'article',settings,postId:'missing-page-design-sample'}})).status,404);
 });
 await test('关于页真实模板预览清洗正文，使用未保存设置且不缓存',async()=>{
  const response=await call('/admin/page-preview',{method:'POST',body});assert.equal(response.status,200);
  assert(response.text.includes('装修接口验收'));assert(response.text.includes('关于测试'));assert(response.text.includes('浏览教程'));
  assert(!response.text.includes('<script>injected()'));assert(response.text.includes('about-with-banner'));
  assert.equal(response.headers.get('Cache-Control'),'no-store');assert(response.headers.get('X-Robots-Tag').includes('noindex'));
 });
 await test('内容页预览响应开关与字号，保留真实文章正文',async()=>{
  const response=await call('/admin/page-preview',{method:'POST',body:{page:'article',settings,postId:sample.id}});assert.equal(response.status,200);
  assert(response.text.includes(sample.title));assert(response.text.includes('--article-font-size:18px'));
  for(const name of ['article-toc','article-tags','author-box','article-resources'])assert(!response.text.includes(`class="${name}"`),name);
  assert(response.text.includes('article-grid-no-toc'));assert(response.text.includes('article-grid-no-resources'));
 });
 await test('中文正文上限可在关于页与首页同时预览',async()=>{
  const large={...settings,aboutDesign:{...settings.aboutDesign,body:'中'.repeat(20000)}};
  assert.equal((await call('/admin/page-preview',{method:'POST',body:{page:'about',settings:large}})).status,200);
  assert.equal((await call('/admin/home-preview',{method:'POST',body:large})).status,200);
 });
 await test('所有预览均不改变设置或文章',async()=>{
  assert.deepEqual((await call('/api/admin/settings')).data,snapshot);
  assert.deepEqual((await call('/api/admin/posts?limit=100')).data.items,posts);
  assert(!(await call('/about/',{auth:false})).text.includes('装修接口验收'));
 });
 await test('搜索存在、空结果、特殊字符、非法游标都有明确页面',async()=>{
  const found=await call('/?s='+encodeURIComponent(sample.title));assert.equal(found.status,200);assert(found.text.includes('search-results-grid'));assert(found.text.includes('search-card'));assert(found.text.includes(sample.title));
  const empty=await call('/?s=__unmatched_7a41e170__');assert.equal(empty.status,200);assert(empty.text.includes('没有找到相关内容'));
  const hostile=await call('/?s='+encodeURIComponent('<script>searchInjected()</script>'));assert.equal(hostile.status,200);assert(!hostile.text.includes('<script>searchInjected()'));
  const invalid=await call('/?s=eSIM&cursor=invalid');assert.equal(invalid.status,400);assert(invalid.text.includes('重新搜索'));
 });
 if(process.argv.includes('--save-roundtrip')) {
  mkdirSync('.local-backups',{recursive:true});writeFileSync(`.local-backups/page-design-${Date.now()}.json`,JSON.stringify(snapshot,null,2));
  let expected;
  try {
   await test('保存装修后前台生效，旧版本保存返回409',async()=>{
    const saved=await call('/api/admin/settings',{method:'PUT',body:{...settings,version:snapshot.version}});assert.equal(saved.status,200);expected=saved.data;
    assert.equal((await call('/api/admin/settings',{method:'PUT',body:{...settings,version:snapshot.version}})).status,409);
    assert((await call('/about/',{auth:false})).text.includes('装修接口验收'));
    const search=await call('/?s='+encodeURIComponent(sample.title));
    const href=search.text.match(/href="([^"]+)" class="card-image"/)?.[1];assert(href,'未找到文章前台链接');
    const article=await call(href.replaceAll('&amp;','&'),{auth:false});assert.equal(article.status,200);
    assert(article.text.includes('--article-font-size:18px'));assert(!article.text.includes('class="author-box"'));
   });
   await test('旧客户端保存不会覆盖内容页与关于页装修',async()=>{
    const {articleDesign,aboutDesign,...old}=expected.value;
    const saved=await call('/api/admin/settings',{method:'PUT',body:{...old,version:expected.version}});assert.equal(saved.status,200);expected=saved.data;
    assert.deepEqual(expected.value.articleDesign,articleDesign);assert.deepEqual(expected.value.aboutDesign,aboutDesign);
   });
  } finally {
   if(expected){
    const current=(await call('/api/admin/settings')).data;
    assert.deepEqual(current,expected,'发现并发修改，停止自动恢复，备份已保留');
    const restored=await call('/api/admin/settings',{method:'PUT',body:{...snapshot.value,version:current.version}});assert.equal(restored.status,200);assert.deepEqual(restored.data.value,snapshot.value);
    results.push('测试装修设置已恢复，用户品牌、导航和文章不变');
   }
  }
 }
 mkdirSync('test-results',{recursive:true});
 writeFileSync('test-results/page-design-integration.json',JSON.stringify({date:new Date().toISOString(),environment:'local',passed:results.length,tests:results},null,2));
 console.log(`页面装修与搜索接口验证：${results.length} 项通过`);
} finally {await call('/api/auth/logout',{method:'POST'});}

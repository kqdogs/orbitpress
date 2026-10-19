import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('仅允许本地验收');
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];assert(password);
let cookie='',csrf='',snapshot;const results=[];
async function call(path,{method='GET',body,admin=false,headers={}}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';
 if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}
 const response=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(30000)});
 const text=await response.text();let json;try{json=JSON.parse(text);}catch{}
 return {status:response.status,text,data:json?.data,error:json?.error,headers:response.headers};
}
async function test(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name);}
async function save(value){const current=await call('/api/admin/settings',{admin:true});const saved=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...value,version:current.data.version}});assert.equal(saved.status,200,saved.text);return saved.data;}
const block=(type,id,fields={})=>({id,type,title:'',text:'',href:'/tutorials/',image:'',alt:'',limit:3,level:2,links:[],enabled:true,...fields});
const home={sidebar:'both',width:'wide',main:[block('home-hero','hero'),block('home-promo','promo',{title:'首页组件化横幅',text:'正文区域自定义副标题'}),block('home-categories','categories',{title:'组件分类'}),block('home-videos','videos',{title:'组件视频'}),block('home-tutorials','tutorials',{title:'组件教程'}),block('home-notice','notice',{title:'组件站点公告'})],left:[block('search','search',{title:'首页左侧搜索'})],right:[block('author','author',{title:'首页右侧作者'})]};
try{
 const login=await call('/api/auth/login',{method:'POST',headers:{Origin:base},body:{username:'admin',password}});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;
 snapshot=(await call('/api/admin/settings',{admin:true})).data;mkdirSync('test-results',{recursive:true});writeFileSync('test-results/home-components-settings-before.json',JSON.stringify(snapshot,null,2));
 await test('旧首页顺序、隐藏和文案无写入适配，原预览入口保持兼容',async()=>{
  const settings=structuredClone(snapshot.value);delete settings.pageLayouts.home;
  settings.homeSections=[...settings.homeSections].reverse().map((s,i)=>({...s,order:i,title:s.id==='notice'?'旧首页公告':s.title,enabled:s.id!=='promo'}));settings.notice='原公告';
  const preview=await call('/admin/home-preview',{method:'POST',admin:true,body:settings});assert.equal(preview.status,200,preview.text);
  assert.deepEqual([...preview.text.matchAll(/data-home-section="([^"]+)"/g)].map(match=>match[1]),['notice','tutorials','videos','categories','promo','hero']);assert(preview.text.includes('旧首页公告'));assert(!preview.text.includes('class="promo-banner"'));assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,snapshot);
 });
 await test('统一预览支持首页六组件与左右通用组件，要求会话和CSRF',async()=>{
  const payload={page:'home',settings:{...snapshot.value,pageLayouts:{...snapshot.value.pageLayouts,home}},builder:true};
  assert.equal((await call('/admin/page-preview',{method:'POST',body:payload})).status,401);
  assert.equal((await call('/admin/page-preview',{method:'POST',body:payload,headers:{Cookie:cookie,Origin:base}})).status,403);
  const preview=await call('/admin/page-preview',{method:'POST',admin:true,body:payload});assert.equal(preview.status,200,preview.text);
  for(const text of ['首页组件化横幅','首页左侧搜索','首页右侧作者','组件分类','组件视频','组件教程','组件站点公告'])assert(preview.text.includes(text),text);
  assert(preview.text.includes('data-layout-region="left"'));assert(preview.text.includes('data-layout-handle="hero"'));assert.equal(preview.headers.get('cache-control'),'no-store');assert.equal(preview.headers.get('x-robots-tag'),'noindex, nofollow');assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,snapshot);
 });
 await test('首页保存再读与真实前台一致，其他模板保持不变',async()=>{
  await save({...snapshot.value,pageLayouts:{...snapshot.value.pageLayouts,home}});
  const current=(await call('/api/admin/settings',{admin:true})).data;assert.deepEqual(current.value.pageLayouts.home,home);
  for(const [key,value] of Object.entries(snapshot.value.pageLayouts))if(key!=='home')assert.deepEqual(current.value.pageLayouts[key],value);
  const front=await call('/');assert.equal(front.status,200);for(const title of ['首页组件化横幅','首页左侧搜索','首页右侧作者'])assert(front.text.includes(title));assert(!front.text.includes('data-layout-handle='));
 });
 await test('首页可隐藏左右栏、删除组件、保留隐藏配置及保存空白画布',async()=>{
  const value=structuredClone(snapshot.value);value.pageLayouts.home={...home,sidebar:'none',main:home.main.filter(b=>b.type!=='home-promo').map(b=>b.type==='home-videos'?{...b,enabled:false}:b)};await save(value);
  let front=await call('/');assert(!front.text.includes('首页组件化横幅'));assert(!front.text.includes('首页左侧搜索'));assert(!front.text.includes('组件视频'));assert.equal((await call('/api/admin/settings',{admin:true})).data.value.pageLayouts.home.left.length,1);
  await save({...value,pageLayouts:{...value.pageLayouts,home:{sidebar:'none',width:'standard',main:[],left:[],right:[]}}});front=await call('/');assert.equal(front.status,200);assert(!front.text.includes('class="featured-card"'));assert(front.text.includes('site-header'));assert(front.text.includes('site-footer'));
 });
 await test('首页拒绝正文组件、重复ID及危险输入，正文模板仍必须保留正文',async()=>{
  const before=(await call('/api/admin/settings',{admin:true})).data;
  const invalid=[{home:{...home,main:[block('content','core')]}},{home:{...home,left:[home.main[0]]}},{home:{...home,right:[block('button','bad',{href:'javascript:alert(1)'})]}},{article:{...home,main:[]}}];
  for(const patch of invalid)assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,pageLayouts:patch,version:before.version}})).status,400);
  assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,version:before.version-1}})).status,409);assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,before);
 });
 await test('首页组件在其他模板可复用，正文保留',async()=>{
  const article={sidebar:'right',width:'standard',main:[block('content','core'),block('home-videos','extra-video',{title:'文章里的首页视频组件'})],left:[],right:[]};
  const payload={page:'article',builder:true,settings:{...snapshot.value,pageLayouts:{...snapshot.value.pageLayouts,article}}};
  const preview=await call('/admin/page-preview',{method:'POST',admin:true,body:payload});assert.equal(preview.status,200,preview.text);assert(preview.text.includes('文章里的首页视频组件'));assert(preview.text.includes('data-layout-handle="core"'));
 });
 await test('旧客户端保存保留首页布局，移除覆盖后恢复旧首页',async()=>{
  const saved=await save({...snapshot.value,pageLayouts:{...snapshot.value.pageLayouts,home}});const {pageLayouts,...legacy}=saved.value;await save(legacy);assert.deepEqual((await call('/api/admin/settings',{admin:true})).data.value.pageLayouts.home,home);
  const reset=structuredClone(snapshot.value);delete reset.pageLayouts.home;await save(reset);const front=await call('/');assert.equal(front.status,200);assert(!front.text.includes('首页组件化横幅'));assert(front.text.includes('class="featured-card"'));
 });
}catch(error){console.error(error.message);process.exitCode=1;}
finally{
 try{if(snapshot){await save(snapshot.value);assert.deepEqual((await call('/api/admin/settings',{admin:true})).data.value,snapshot.value);}}catch(error){console.error('恢复设置失败：'+error.message);process.exitCode=1;}
 if(cookie)await call('/api/auth/logout',{method:'POST',admin:true}).catch(()=>{});
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/home-components-integration.json',JSON.stringify({base,results},null,2));console.log(`首页组件集成 ${results.filter(r=>r.passed).length}/7 通过`);
}

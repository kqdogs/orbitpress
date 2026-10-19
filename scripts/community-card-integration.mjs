import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const base='http://127.0.0.1:4321';
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];assert(password);
let cookie='',csrf='',snapshot;const results=[];
async function call(path,{method='GET',body,admin=false,withCsrf=true}={}){
 const headers={Origin:base};if(body!==undefined)headers['Content-Type']='application/json';
 if(admin){headers.Cookie=cookie;headers.Origin=base;if(withCsrf)headers['X-CSRF-Token']=csrf;}
 const response=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
 const text=await response.text();let json;try{json=JSON.parse(text);}catch{}
 return {status:response.status,text,data:json?.data,headers:response.headers};
}
async function current(){const r=await call('/api/admin/settings',{admin:true});assert.equal(r.status,200);return r.data;}
async function save(value){const latest=await current();const r=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...value,version:latest.version}});assert.equal(r.status,200,r.text);return r.data;}
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(error){results.push({name,passed:false,message:error.message});throw error;}}
const card={enabled:true,title:'本地交流群验收 <script>bad</script>',description:'图文说明与视频步骤',icon:'ep:ChatDotRound',buttonLabel:'立即加入',href:'https://t.me/local_example'};
const banner=html=>html.match(/<a class="community-banner"[\s\S]*?<\/a>/)?.[0]||'';
try{
 const login=await call('/api/auth/login',{method:'POST',body:{username:'admin',password}});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;snapshot=await current();
 await test('旧配置仍显示原卡片，私有设置接口不缓存',async()=>{const front=await call('/');assert.equal(front.status,200);assert(banner(front.text));assert.equal((await call('/api/admin/settings',{admin:true})).headers.get('cache-control'),'no-store');});
 await test('卡片所有字段保存再读，前台转义文字并显示库图标',async()=>{
  await save({...snapshot.value,communityCard:card});assert.deepEqual((await current()).value.communityCard,card);
  const front=await call('/');const html=banner(front.text);assert(html);assert(html.includes('&lt;script&gt;bad&lt;/script&gt;'));assert(!html.includes('<script>bad'));for(const text of [card.description,card.buttonLabel,card.href,'viewBox="0 0 1024 1024"'])assert(html.includes(text),text);
 });
 await test('旧客户端省略新字段保留卡片；预览未保存改动但不落库',async()=>{
  const {communityCard,...legacy}=(await current()).value;await save(legacy);assert.deepEqual((await current()).value.communityCard,card);
  const before=await current();const r=await call('/admin/page-preview',{method:'POST',admin:true,body:{page:'home',settings:{...before.value,communityCard:{...card,title:'仅预览的交流群'}},builder:true}});assert.equal(r.status,200,r.text);assert(banner(r.text).includes('仅预览的交流群'));assert.equal(r.headers.get('cache-control'),'no-store');assert.deepEqual(await current(),before);
 });
 await test('关闭隐藏、空说明保留、null恢复旧默认',async()=>{
  await save({...snapshot.value,communityCard:{...card,enabled:false}});assert.equal(banner((await call('/')).text),'');
  await save({...snapshot.value,communityCard:{...card,description:'',icon:'telegram'}});const empty=banner((await call('/')).text);assert(!empty.includes('<span>'));assert(empty.includes('viewBox="0 0 24 24"'));
  await save({...snapshot.value,communityCard:null});assert(banner((await call('/')).text).includes(snapshot.value.title+'交流群'));
 });
 await test('危险链接、未知图标、超长标题及无CSRF写入拒绝且不改变设置',async()=>{
  const before=await current();for(const patch of [{href:'javascript:alert(1)'},{icon:'arbitrary'},{title:'字'.repeat(121)}])assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,communityCard:{...card,...patch},version:before.version}})).status,400);
  assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,withCsrf:false,body:{...before.value,communityCard:card,version:before.version}})).status,403);assert.deepEqual(await current(),before);
 });
 await test('未登录写入与旧version覆盖被拒绝',async()=>{
  const before=await current();assert.equal((await call('/api/admin/settings',{method:'PUT',body:{...before.value,communityCard:card,version:before.version}})).status,401);
  assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,communityCard:card,version:before.version-1}})).status,409);assert.deepEqual(await current(),before);
 });
}finally{
 try{if(snapshot){await save(snapshot.value);assert.deepEqual((await current()).value,snapshot.value);}if(cookie)await call('/api/auth/logout',{method:'POST',admin:true});}
 finally{mkdirSync('test-results',{recursive:true});writeFileSync('test-results/community-card-integration.json',JSON.stringify({results},null,2));}
}
console.log('交流群卡片本地集成 '+results.filter(row=>row.passed).length+'/'+results.length+' 通过');

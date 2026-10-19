import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const base='http://127.0.0.1:4321';
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];
assert(password,'缺少本地凭证');
const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({username:'admin',password})});
assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];const {data:{csrf}}=await login.json();
async function call(path,{method='GET',body,auth=true,headers={}}={}) {
 const response=await fetch(base+path,{method,headers:{...(auth?{Cookie:cookie,Origin:base,'X-CSRF-Token':csrf}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
 const text=await response.text();let data;try{data=JSON.parse(text).data;}catch{}return {status:response.status,text,data,headers:response.headers};
}
let passed=0;
async function test(name,run){await run();passed++;console.log('PASS '+name);}
const snapshot=(await call('/api/admin/settings')).data;
const body={...snapshot.value,homeHero:{...snapshot.value.homeHero,title:'未保存首页预览验证'},homeSections:[...snapshot.value.homeSections].reverse().map((section,order)=>({...section,order,enabled:section.id!=='promo'}))};
await test('首页预览 GET 不公开草稿',async()=>assert.equal((await call('/admin/home-preview')).status,405));
await test('首页预览要求登录',async()=>assert.equal((await call('/admin/home-preview',{method:'POST',body,auth:false})).status,401));
await test('首页预览校验 CSRF',async()=>assert.equal((await call('/admin/home-preview',{method:'POST',body,headers:{'X-CSRF-Token':'invalid'}})).status,403));
await test('首页预览拒绝跨站来源',async()=>assert.equal((await call('/admin/home-preview',{method:'POST',body,headers:{Origin:'https://invalid.example'}})).status,403));
await test('首页预览严格字段及排序校验',async()=>{assert.equal((await call('/admin/home-preview',{method:'POST',body:{...body,unknown:true}})).status,400);assert.equal((await call('/admin/home-preview',{method:'POST',body:{...body,homeSections:body.homeSections.map(s=>({...s,order:0}))}})).status,400);});
await test('真实首页模板渲染区块、隐藏状态和未保存文案',async()=>{
 const response=await call('/admin/home-preview',{method:'POST',body});assert.equal(response.status,200);assert(response.text.includes('未保存首页预览验证'));
 assert.deepEqual([...response.text.matchAll(/data-home-section="([^"]+)"/g)].map(x=>x[1]),['notice','tutorials','videos','categories','promo','hero']);
 assert.equal((response.text.match(/data-home-handle=/g)||[]).length,6);assert(response.text.includes('此组件已隐藏'));assert(!response.text.includes('class="promo-banner"'));
 assert.equal(response.headers.get('Cache-Control'),'no-store');assert(response.headers.get('X-Robots-Tag').includes('noindex'));
});
await test('首页预览转义内容并拒绝脚本地址',async()=>{
 const response=await call('/admin/home-preview',{method:'POST',body:{...body,homeHero:{...body.homeHero,title:'<script>injected()</script>'}}});assert.equal(response.status,200);assert(!response.text.includes('<script>injected()'));assert(response.text.includes('&lt;script&gt;'));
 assert.equal((await call('/admin/home-preview',{method:'POST',body:{...body,homeOptions:{...body.homeOptions,promoHref:'javascript:alert(1)'}}})).status,400);
});
await test('文章预览渲染未保存正文，清洗脚本',async()=>{
 const response=await call('/admin/preview',{method:'POST',body:{title:'切换预览测试',excerpt:'未保存',body:'## 切换后正文\n<script>injected()</script>',categoryId:'ai-tools',cover:'',videoId:'',tags:[],publishedAt:null}});
 assert.equal(response.status,200);assert(response.text.includes('切换后正文'));assert(!response.text.includes('<script>injected()'));
});
await test('所有预览不改变设置版本或文章数量',async()=>{assert.deepEqual((await call('/api/admin/settings')).data,snapshot);const home=await call('/');assert(!home.text.includes('未保存首页预览验证'));assert(!home.text.includes('data-home-section='));});
if(process.argv.includes('--apply-logo')) {
 mkdirSync('.local-backups',{recursive:true});writeFileSync(`.local-backups/branding-${Date.now()}.json`,JSON.stringify(snapshot,null,2));
 const saved=await call('/api/admin/settings',{method:'PUT',body:{...snapshot.value,logo:'/images/yachin-mark.svg',version:snapshot.version}});assert.equal(saved.status,200);assert.deepEqual(saved.data.value,{...snapshot.value,logo:'/images/yachin-mark.svg'});
 await test('品牌图标已统一用于首页头尾',async()=>{const home=await call('/');assert.equal((home.text.match(/src="\/images\/yachin-mark.svg"/g)||[]).length,2);assert.equal((await call('/images/yachin-mark.svg',{auth:false})).status,200);});
}
await call('/api/auth/logout',{method:'POST'});
console.log(`本地装修验证：${passed} 项通过`);

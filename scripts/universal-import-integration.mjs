import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
assert(['localhost','127.0.0.1'].includes(new URL(base).hostname),'仅允许本地验收');
const password=(await readFile('local-admin.txt','utf8')).match(/密码：(.+)/)?.[1];
let cookie='',csrf='';const results=[];
async function call(path,{method='GET',body,admin=false,headers={}}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}
 const response=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(40000)});
 const text=await response.text();let json;try{json=JSON.parse(text);}catch{}return {status:response.status,headers:response.headers,text,data:json?.data,error:json?.error};
}
async function state(){const values={};for(const path of ['settings','posts?limit=100','pages','categories?includeTrash=1']){const r=await call('/api/admin/'+path,{admin:true});assert.equal(r.status,200);values[path]=r.data;}return values;}
const login=await call('/api/auth/login',{method:'POST',headers:{Origin:base},body:{username:'admin',password}});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;
const before=await state();
console.log('原有本地文章 '+before['posts?limit=100'].items.length+' 篇；测试不创建文章');
try{
 for(const [name,site] of [['WordPress','https://rinfinity.net/'],['Ghost','https://blog.cloudflare.com/'],['Astro','https://astro.build/blog/']]){
  const r=await call('/api/admin/imports/discover',{method:'POST',admin:true,body:{url:site}});assert.equal(r.status,200,name+' '+JSON.stringify(r.error));assert(r.data.items.length>0);assert(r.data.items.every(item=>item.url&&item.title));
  console.log(`${name}: ${r.data.items.length} 篇；首篇 ${r.data.items[0].title}`);results.push({name,site,items:r.data.items.length,first:r.data.items[0]});
  if(name!=='WordPress'){
   const imported=await call('/api/admin/imports',{method:'POST',admin:true,body:{url:r.data.items[0].url}});assert.equal(imported.status,200,name+' 单篇 '+JSON.stringify(imported.error));assert(imported.data.article.title);assert(imported.data.article.body.length>50);assert(!/!\[[^\]]*\]\(https?:/.test(imported.data.article.body));
   results.push({name:name+'正文',title:imported.data.article.title,tags:imported.data.article.tags,cover:imported.data.article.cover,bodyLength:imported.data.article.body.length,warnings:imported.data.warnings});console.log(`${name} 单篇：${imported.data.article.title}，${imported.data.article.body.length} 字符，${imported.data.warnings.length} 项图片提示`);
  }
 }
 assert.equal((await call('/api/admin/imports/discover',{method:'POST',body:{url:'https://astro.build/blog/'}})).status,401);
 assert.equal((await call('/api/admin/imports/discover',{method:'POST',headers:{Cookie:cookie,Origin:base},body:{url:'https://astro.build/blog/'}})).status,403);
 assert.equal((await call('/api/admin/imports',{method:'POST',admin:true,body:{url:'http://127.0.0.1/'}})).status,400);
 assert.deepEqual(await state(),before,'不创建文章，不改原有设置和分类');results.push({name:'鉴权、CSRF、私网拦截、原数据保持',passed:true});
}finally{
 await call('/api/auth/logout',{method:'POST',admin:true});await mkdir('test-results',{recursive:true});await writeFile('test-results/universal-import-integration.json',JSON.stringify({at:new Date().toISOString(),results},null,2));
}

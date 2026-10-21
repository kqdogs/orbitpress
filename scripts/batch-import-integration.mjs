import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('只允许本地验收');
const password=(await readFile('local-admin.txt','utf8')).match(/密码：(.+)/)?.[1];
let cookie='',csrf='',createdCategory='';const posts=new Map(),results=[];
async function call(path,{method='GET',body,admin=false,headers={},key}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}if(key)h['Idempotency-Key']=key;
 const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(40000)});
 const bytes=new Uint8Array(await r.arrayBuffer()),text=new TextDecoder().decode(bytes);let json;try{json=JSON.parse(text);}catch{}
 return {status:r.status,headers:r.headers,text,bytes,data:json?.data,error:json?.error};
}
const fields=['title','slug','excerpt','body','categoryId','cover','videoId','featured','tags','highlights','resources','version'];
const input=post=>Object.fromEntries(fields.map(key=>[key,post[key]]));
async function test(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name);}
async function state(){const s={};for(const path of ['settings','posts?limit=100','pages','categories?includeTrash=1']){const r=await call('/api/admin/'+path,{admin:true});assert.equal(r.status,200);s[path]=r.data;}return s;}
let before;
try{
 const login=await call('/api/auth/login',{method:'POST',body:{username:'admin',password},headers:{Origin:base}});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;before=await state();
 await test('目录需管理员/CSRF，拒绝私网首页',async()=>{
  assert.equal((await call('/api/admin/imports/discover',{method:'POST',body:{url:'https://rinfinity.net/'}})).status,401);
  assert.equal((await call('/api/admin/imports/discover',{method:'POST',headers:{Cookie:cookie,Origin:base},body:{url:'https://rinfinity.net/'}})).status,403);
  assert.equal((await call('/api/admin/imports/discover',{method:'POST',admin:true,body:{url:'https://127.0.0.1/'}})).status,400);
 });
 await test('仅首页输入即发现真实文章并可翻页',async()=>{
  const first=await call('/api/admin/imports/discover',{method:'POST',admin:true,body:{url:'https://rinfinity.net/'}});assert.equal(first.status,200,JSON.stringify(first.error));assert(first.data.items.length>0);assert.equal(first.data.nextPage,2);
  const second=await call('/api/admin/imports/discover',{method:'POST',admin:true,body:{url:'https://rinfinity.net/',page:first.data.nextPage}});assert.equal(second.status,200);assert(second.data.items.length>0);assert(!second.data.items.some(x=>first.data.items.some(y=>x.url===y.url)));
 });
 let cat=before['categories?includeTrash=1'].find(c=>!c.deletedAt);
 if(!cat){const r=await call('/api/admin/categories',{method:'POST',admin:true,body:{name:'批量采集验收',slug:'batch-check-'+Date.now(),description:'',icon:'globe'}});assert.equal(r.status,201);createdCategory=r.data.id;cat={id:createdCategory};}
 const sources=['https://rinfinity.net/philippines-dito-esim-application-guide/', 'https://rinfinity.net/maya-account-registration-guide/'];
 // The second source is obtained from the public directory, avoiding a guessed article URL.
 const directory=await call('/api/admin/imports/discover',{method:'POST',admin:true,body:{url:'https://rinfinity.net/'}});assert.equal(directory.status,200);
 sources[1]=directory.data.items.find(x=>x.url!==sources[0]).url;
 for(let i=0;i<2;i++)await test(`第 ${i+1} 篇真实采集→本站图片→${i?'指定':'空'}分类草稿→幂等重放`,async()=>{
  const imported=await call('/api/admin/imports',{method:'POST',admin:true,body:{url:sources[i]}});assert.equal(imported.status,200,JSON.stringify(imported.error));const article=imported.data.article;
  assert(article.title);assert(article.body.length>30);assert(article.tags.length>0);assert.match(article.cover,/^\/media\//);assert(!/!\[[^\]]*\]\(https:\/\/rinfinity.net/.test(article.body));
  assert.equal((await call(article.cover)).status,200);
  const body={...article,categoryId:i?cat.id:''},key=randomUUID();
  const saved=await call('/api/admin/posts',{method:'POST',admin:true,body,key});assert.equal(saved.status,201,JSON.stringify(saved.error));let post=saved.data;posts.set(post.id,post);assert.equal(post.categoryId,body.categoryId);assert.equal(post.status,'draft');
  const replay=await call('/api/admin/posts',{method:'POST',admin:true,body,key});assert.equal(replay.status,201);assert.equal(replay.data.id,post.id);
  const list=await call('/api/admin/posts?limit=100',{admin:true});assert.equal(list.data.items.filter(x=>x.id===post.id).length,1);
  const preview=await call('/admin/preview',{method:'POST',admin:true,body:{title:post.title,body:post.body,excerpt:post.excerpt,categoryId:post.categoryId,cover:post.cover,videoId:post.videoId,tags:post.tags,highlights:post.highlights,resources:post.resources}});assert.equal(preview.status,200,preview.text.slice(0,300));assert(!preview.text.includes('/category//'));
  if(!i){
   let r=await call('/api/admin/posts/'+post.id+'/publish',{method:'POST',admin:true,body:{version:post.version},key:randomUUID()});assert.equal(r.status,200);post=r.data;posts.set(post.id,post);
   const page=await call('/'+post.id+'.html');assert.equal(page.status,200);assert(!page.text.includes('/category//'));assert(page.text.includes(post.title));
   const sitemap=await call('/sitemap.xml');assert.equal(sitemap.status,200);assert(sitemap.text.includes('/'+post.id+'.html'),'未分类文章进入站点地图');
   for(const categoryId of [cat.id,'']){r=await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,body:{...input(post),categoryId},key:randomUUID()});assert.equal(r.status,200);post=r.data;posts.set(post.id,post);assert.equal(post.categoryId,categoryId);assert.equal(post.body,article.body);}
   assert.equal((await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,body:{...input(post),categoryId:'missing-category'},key:randomUUID()})).status,400);
  }
 });
}finally{
 for(const post of posts.values()){
  const trash=await call('/api/admin/posts/'+post.id+'/trash',{method:'POST',admin:true,body:{version:post.version},key:randomUUID()});assert.equal(trash.status,200);
  assert.equal((await call('/api/admin/posts/'+post.id,{method:'DELETE',admin:true,body:{version:trash.data.version},key:randomUUID()})).status,200);
 }
 if(createdCategory){const r=await call('/api/admin/categories/'+createdCategory,{method:'DELETE',admin:true,body:{version:1}});assert.equal(r.status,200);assert.equal((await call('/api/admin/categories/'+createdCategory+'/purge',{method:'POST',admin:true,body:{version:2},key:randomUUID()})).status,200);}
 if(before){assert.deepEqual(await state(),before,'测试后原文章/页面/分类/设置保持');results.push({name:'清理测试文章后原内容保持',passed:true});}
 if(cookie)await call('/api/auth/logout',{method:'POST',admin:true});
 await mkdir('test-results',{recursive:true});await writeFile('test-results/batch-import-integration.json',JSON.stringify({at:new Date().toISOString(),results},null,2));
}

import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';

const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('只允许本地验收');
const password=(await readFile('local-admin.txt','utf8')).match(/密码：(.+)/)?.[1];
const source='https://rinfinity.net/philippines-dito-esim-application-guide/';
const keep=process.argv.includes('--keep');
let cookie='',csrf='',snapshot,post,createdCategory='';const results=[];
async function call(path,{method='GET',body,admin=false,headers={},key}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}if(key)h['Idempotency-Key']=key;
 const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(40000)});
 const bytes=new Uint8Array(await r.arrayBuffer()),text=new TextDecoder().decode(bytes);let json;try{json=JSON.parse(text);}catch{}
 return {status:r.status,headers:r.headers,bytes,text,data:json?.data,error:json?.error};
}
async function test(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name);}
try{
 const login=await call('/api/auth/login',{method:'POST',body:{username:'admin',password},headers:{Origin:base}});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;
 snapshot=(await call('/api/admin/settings',{admin:true})).data;
 await test('无自定义导航仍保留独立首页，不需要分类',async()=>{
  const saved=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...snapshot.value,headerNav:[],permalinkFormats:['custom'],permalinkCustom:'/%post_id%.html',version:snapshot.version}});assert.equal(saved.status,200);
  const home=await call('/');assert.equal(home.status,200);assert(/aria-label="主导航"[^>]*>[\s\S]*?href="\/">\s*首页\s*<\/a>/.test(home.text));
 });
 let article;
 await test('真实来源采集标题、5个标签、封面和9张正文图',async()=>{
  const r=await call('/api/admin/imports',{method:'POST',admin:true,body:{url:source}});assert.equal(r.status,200,JSON.stringify(r.error));article=r.data.article;
  assert(article.title.startsWith('菲律宾 DITO eSIM申请教程'));assert.deepEqual(article.tags,['DITO','eSIM','海外手机号','菲律宾手机号','长期保号']);
  assert(article.slug.startsWith('import-'));assert.notEqual(article.slug,'philippines-dito-esim-application-guide');assert.equal(r.data.warnings.length,0,JSON.stringify(r.data.warnings));
  // This source repeats its cover inside the article, followed by nine step images.
  assert.match(article.cover,/^\/media\/import-[a-f0-9]{64}\.png$/);assert.equal([...article.body.matchAll(/!\[.*?\]\((\/media\/[^)]+)\)/g)].length,10);
  await mkdir('test-results',{recursive:true});await writeFile('test-results/import-media-article.json',JSON.stringify(article,null,2));
 });
 await test('每张采集图片HTTP200、正确类型和实体字节，ETag返回304',async()=>{
  const paths=[...new Set([article.cover,...[...article.body.matchAll(/!\[.*?\]\((\/media\/[^)]+)\)/g)].map(m=>m[1])])];assert.equal(paths.length,10);
  for(const path of paths){const r=await call(path);assert.equal(r.status,200,path);assert.equal(r.headers.get('content-type'),'image/png');assert(r.bytes.length>1000);assert.equal((await call(path,{headers:{'If-None-Match':r.headers.get('etag')}})).status,304);}
 });
 let category=(await call('/api/admin/categories',{admin:true})).data[0];
 if(!category){const r=await call('/api/admin/categories',{method:'POST',admin:true,body:{name:'本地采集验收',slug:'import-check-'+Date.now(),description:'',icon:'globe'}});assert.equal(r.status,201);createdCategory=r.data.id;category={id:createdCategory};}
 await test('采集草稿保存发布后使用本站ID.html，标签图片保持',async()=>{
  let r=await call('/api/admin/posts',{method:'POST',admin:true,body:{...article,categoryId:category.id},key:randomUUID()});assert.equal(r.status,201,JSON.stringify(r.error));post=r.data;
  r=await call('/api/admin/posts/'+post.id+'/publish',{method:'POST',admin:true,body:{version:post.version},key:randomUUID()});assert.equal(r.status,200);post=r.data;
  const page=await call('/'+post.id+'.html');assert.equal(page.status,200);assert(page.text.includes(article.cover));assert(page.text.includes('菲律宾手机号'));assert(page.text.includes('video-stage'));assert(page.text.includes('播放 YouTube 视频'));
  await writeFile('test-results/import-media-fixture.json',JSON.stringify({id:post.id,path:'/'+post.id+'.html'},null,2));
 });
}finally{
 if(cookie&&snapshot&&!keep){const current=(await call('/api/admin/settings',{admin:true})).data;assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...snapshot.value,version:current.version}})).status,200);}
 if(post&&!keep){const r=await call('/api/admin/posts/'+post.id+'/trash',{method:'POST',admin:true,body:{version:post.version},key:randomUUID()});assert.equal(r.status,200);}
 if(createdCategory&&!keep){const r=await call('/api/admin/categories/'+createdCategory,{method:'DELETE',admin:true,body:{version:1}});if(!post)assert.equal(r.status,200);}
 if(cookie)await call('/api/auth/logout',{method:'POST',admin:true});
 await mkdir('test-results',{recursive:true});await writeFile('test-results/import-media-integration.json',JSON.stringify({at:new Date().toISOString(),results},null,2));
}

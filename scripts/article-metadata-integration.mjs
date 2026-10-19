import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw Error('仅允许本地测试');
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];assert(password);
const suffix=Date.now(),term='meta-'+suffix,created=[],results=[];
let cookie='',csrf='',snapshot,post,sibling,keyId,token='';
const input={title:'文章元数据验收 '+suffix,slug:'article-meta-'+suffix,excerpt:'摘要兼容一 · 摘要兼容二',body:'## 正文\n\n文章标签与亮点验收。',categoryId:'',cover:'',videoId:'',featured:false,tags:[term,'Maya'],highlights:['支持多个黄色亮点','亮点 <b>需转义</b>']};
async function call(path,{method='GET',body,admin=false,idem=false,headers={},key}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}if(idem)h['Idempotency-Key']=typeof idem==='string'?idem:randomUUID();if(key)h.Authorization='Bearer '+key;
 const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(30000)});
 const text=await r.text();let json;try{json=JSON.parse(text);}catch{}
 return {status:r.status,data:json?.data,error:json?.error,text,headers:r.headers};
}
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(error){results.push({name,passed:false,message:error.message});throw error;}}
function fields(value){return Object.fromEntries(['title','slug','excerpt','body','categoryId','cover','videoId','featured','tags','highlights'].map(key=>[key,value[key]]));}
async function fresh(id){const r=await call('/api/admin/posts/'+id,{admin:true});assert.equal(r.status,200,r.text);return r.data;}
async function save(value,patch){const r=await call('/api/admin/posts/'+value.id,{method:'PUT',admin:true,idem:true,body:{...fields(value),...patch,version:value.version}});assert.equal(r.status,200,r.text);return r.data;}
async function publish(value){const r=await call('/api/admin/posts/'+value.id+'/publish',{method:'POST',admin:true,idem:true,body:{version:value.version}});assert.equal(r.status,200,r.text);return fresh(value.id);}
function path(value){const formats={postname:'/%postname%/',day:'/%year%/%monthnum%/%day%/%postname%/',month:'/%year%/%monthnum%/%postname%/',numeric:'/archives/%post_id%/',plain:'/?p=%post_id%',post:'/post/%postname%/',category:'/%category%/%postname%/',custom:snapshot.value.permalinkCustom};const date=(value.publishedAt||value.createdAt).slice(0,10).split('-');const data={postname:value.slug,post_id:value.id,category:value.categorySlug,year:date[0],monthnum:date[1],day:date[2]};return formats[snapshot.value.permalinkFormats[0]].replace(/%([^%]+)%/g,(_,key)=>encodeURIComponent(data[key]));}
function heading(html){return html.match(/<header class="article-banner article-heading"[\s\S]*?<\/header>/)?.[0]||'';}
try{
 await test('标签接口未登录拒绝，旧数据亮点兼容读取',async()=>{
  assert.equal((await call('/api/admin/tags')).status,401);
  const login=await call('/api/auth/login',{method:'POST',headers:{Origin:base},body:{username:'admin',password}});assert.equal(login.status,200,login.text);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;
  snapshot=(await call('/api/admin/settings',{admin:true})).data;
  const categories=(await call('/api/admin/categories',{admin:true})).data;input.categoryId=categories.find(cat=>!cat.deletedAt).id;
  const old=(await call('/api/admin/posts?status=published',{admin:true})).data.items;assert(old.length);for(const row of old)assert(Array.isArray(row.highlights));
 });
 await test('新文章亮点和标签保存再读，幂等重放不重复创建',async()=>{
  const idem=randomUUID();const r=await call('/api/admin/posts',{method:'POST',body:input,admin:true,idem});assert.equal(r.status,201,r.text);created.push(r.data.id);post=await fresh(r.data.id);assert.deepEqual(post.highlights,input.highlights);assert.deepEqual(post.tags,input.tags);
  const replay=await call('/api/admin/posts',{method:'POST',body:input,admin:true,idem});assert.equal(replay.data.id,post.id);assert.deepEqual(replay.data.highlights,input.highlights);
 });
 await test('旧PUT省略亮点保留，修改亮点正常回显',async()=>{
  const {highlights,...legacy}=fields(post);const saved=await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,idem:true,body:{...legacy,title:post.title+' 更新',version:post.version}});assert.equal(saved.status,200,saved.text);post=await fresh(post.id);assert.deepEqual(post.highlights,highlights);
  post=await save(post,{highlights:['支持手工编辑',...input.highlights]});assert.equal(post.highlights[0],'支持手工编辑');
 });
 await test('非法亮点、未登录、缺CSRF与旧版本均拒绝且不修改文章',async()=>{
  const before=await fresh(post.id);
  for(const highlights of [null,'bad',[''],Array(7).fill('x'),['x'.repeat(41)]])assert.equal((await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,idem:true,body:{...fields(before),highlights,version:before.version}})).status,400);
  assert.equal((await call('/api/admin/posts/'+post.id,{method:'PUT',idem:true,body:{...fields(before),version:before.version}})).status,401);
  assert.equal((await call('/api/admin/posts/'+post.id,{method:'PUT',idem:true,headers:{Cookie:cookie,Origin:base},body:{...fields(before),version:before.version}})).status,403);
  assert.equal((await call('/api/admin/posts/'+post.id,{method:'PUT',admin:true,idem:true,body:{...fields(before),version:before.version-1}})).status,409);
  assert.deepEqual(await fresh(post.id),before);
 });
 await test('常用标签可读草稿，公开标签归档不泄露草稿',async()=>{
  const list=await call('/api/admin/tags',{admin:true});assert.equal(list.status,200,list.text);assert(list.data.some(tag=>tag.name===term&&tag.count===1));assert.equal(list.headers.get('cache-control'),'no-store');
  const archive=await call('/?tag='+term);assert.equal(archive.status,200);assert(!archive.text.includes(post.title));
  assert.equal((await call('/api/admin/tags?unexpected=1',{admin:true})).status,400);
 });
 await test('已发布文章按截图顺序显示标题亮点作者和标签，并转义用户内容',async()=>{
  post=await publish(post);const front=await call(path(post));assert.equal(front.status,200,front.text.slice(0,150));const header=heading(front.text);assert(header);
  const positions=['<h1','article-highlights','article-meta','article-header-tags'].map(name=>header.indexOf(name));assert(positions.every((value,index)=>value>=0&&(!index||value>positions[index-1])));
  assert(header.includes('亮点 &lt;b&gt;需转义&lt;/b&gt;'));assert(!header.includes('<b>需转义</b>'));assert(header.includes('href="/?tag='+term+'"'));assert(header.includes('rel="tag"'));assert(!header.includes('article-label'));
 });
 await test('标签归档精确匹配，排除相似标签并支持大小写及异常空态',async()=>{
  const r=await call('/api/admin/posts',{method:'POST',admin:true,idem:true,body:{...input,title:'相似标签对照 '+suffix,slug:'article-meta-sibling-'+suffix,tags:[term+'-extra'],highlights:[]}});assert.equal(r.status,201,r.text);created.push(r.data.id);sibling=await publish(r.data);
  const archive=await call('/?tag='+term.toUpperCase());assert.equal(archive.status,200,archive.text);assert(archive.text.includes(post.title));assert(!archive.text.includes(sibling.title));
  assert.equal((await call('/?tag=')).status,400);assert.equal((await call('/?tag='+('x'.repeat(31)))).status,400);
  assert.equal((await call('/?tag='+encodeURIComponent("' OR 1=1 --"))).status,200);
  const list=(await call('/api/admin/posts?tag='+term,{admin:true})).data;assert.equal(list.items.length,1);assert.equal(list.items[0].id,post.id);
 });
 await test('编辑器与装修预览复用文章页头，预览不落库，隐藏标签有效',async()=>{
  const before=await fresh(post.id);const {featured,slug,...payload}=fields(post);
  const preview=await call('/admin/preview',{method:'POST',admin:true,body:{...payload,publishedAt:post.publishedAt}});assert.equal(preview.status,200,preview.text);assert.equal(heading(preview.text),heading((await call(path(post))).text));assert.equal(preview.headers.get('cache-control'),'no-store');
  const layoutPreview=await call('/admin/page-preview',{method:'POST',admin:true,body:{page:'article',postId:post.id,settings:{...snapshot.value,articleDesign:{...snapshot.value.articleDesign,showTags:false}}}});assert.equal(layoutPreview.status,200,layoutPreview.text);assert(!heading(layoutPreview.text).includes('article-header-tags'));assert(heading(layoutPreview.text).includes('article-highlights'));
  assert.deepEqual(await fresh(post.id),before);assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,snapshot);
 });
 await test('显式清空亮点和标签后不会从摘要重新生成，旧创建缺省为空',async()=>{
  post=await save(post,{tags:[],highlights:[]});assert.deepEqual((await fresh(post.id)).highlights,[]);const header=heading((await call(path(post))).text);assert(!header.includes('article-highlights'));assert(!header.includes('article-header-tags'));
  const {highlights,...legacy}=input;const r=await call('/api/admin/posts',{method:'POST',admin:true,idem:true,body:{...legacy,title:'旧端创建 '+suffix,slug:'article-meta-legacy-'+suffix}});assert.equal(r.status,201,r.text);created.push(r.data.id);assert.deepEqual(r.data.highlights,[]);
 });
 await test('公开内容API消费新字段、tag过滤和OpenAPI保持同步',async()=>{
  const key=await call('/api/admin/keys',{method:'POST',admin:true,body:{name:'文章元数据验收-'+suffix,scopes:['content:read'],days:1}});assert.equal(key.status,201,key.text);keyId=key.data.id;token=key.data.token;assert(token);
  const value=await call('/api/v1/posts/'+post.id,{key:token});assert.equal(value.status,200,value.text);assert.deepEqual(value.data.highlights,[]);
  const list=await call('/api/v1/posts?tag='+term+'-extra',{key:token});assert.equal(list.status,200,list.text);assert.deepEqual(list.data.items.map(row=>row.id),[sibling.id]);
  const spec=JSON.parse((await call('/api/openapi.json')).text);assert(spec.components.schemas.Post.properties.highlights);assert(spec.paths['/api/v1/posts'].get.parameters.some(param=>param.name==='tag'));
 });
}catch(error){console.error(error.message);process.exitCode=1;}
finally{
 try{
  for(const id of created){const value=await fresh(id);if(value.status!=='trash')assert.equal((await call('/api/admin/posts/'+id+'/trash',{method:'POST',admin:true,idem:true,body:{version:value.version}})).status,200);}
  if(keyId)assert.equal((await call('/api/admin/keys/'+keyId+'/revoke',{method:'POST',admin:true})).status,200);
  if(snapshot)assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,snapshot);
  if(cookie){const tags=(await call('/api/admin/tags',{admin:true})).data;assert(!tags.some(tag=>tag.name.startsWith(term)));await call('/api/auth/logout',{method:'POST',admin:true});}
 }catch(error){console.error('清理失败：'+error.message);process.exitCode=1;}
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/article-metadata-integration.json',JSON.stringify({base,results},null,2));console.log('文章元数据接口 '+results.filter(row=>row.passed).length+'/10 通过');
}

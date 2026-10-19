import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('仅允许本地验收');
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];
let cookie='',csrf='',snapshot,category,keyId,bearer;const fixtures=[],results=[];
async function call(path,{method='GET',body,admin=false,key,headers={}}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';
 if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}if(key)h['Idempotency-Key']=key;
 const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(30000)});
 const text=await r.text();let value;try{value=JSON.parse(text);}catch{}return {status:r.status,data:value?.data,error:value?.error,headers:r.headers,text};
}
async function test(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name);}
const unique='trash-check-'+Date.now();
try{
 await test('永久删除拒绝未登录',async()=>assert.equal((await call('/api/admin/posts/nonexistent',{method:'DELETE',body:{version:1},headers:{Origin:base},key:randomUUID()})).status,401));
 const login=await call('/api/auth/login',{method:'POST',body:{username:'admin',password},headers:{Origin:base}});assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;
 snapshot=(await call('/api/admin/settings',{admin:true})).data;
 await test('空导航和无分类首页配置可保存固定链接',async()=>{
  const r=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...snapshot.value,headerNav:[],footerNav:[],homeOptions:{...snapshot.value.homeOptions,steps:[],categoryIds:[],promoHref:'/tutorials/'},permalinkFormats:['custom'],permalinkCustom:'/%post_id%.html',version:snapshot.version}});
  assert.equal(r.status,200,JSON.stringify(r.error));assert.deepEqual(r.data.value.headerNav,[]);
 });
 const cat=await call('/api/admin/categories',{method:'POST',admin:true,body:{name:'本地回收站验收',slug:unique,description:'',icon:'globe'}});assert.equal(cat.status,201);category=cat.data.id;
 const key=await call('/api/admin/keys',{method:'POST',admin:true,body:{name:unique,scopes:['content:read','content:write'],days:1}});assert.equal(key.status,201);keyId=key.data.id;bearer=key.data.token;
 for(const kind of ['posts','pages']){
  const input={title:'本地删除验收',slug:unique+'-'+kind,excerpt:'',body:'## 本地验收\n\n正文测试内容。',...(kind==='posts'?{categoryId:category,cover:'',videoId:'',featured:false,tags:[],resources:{title:'本期视频提到的链接',items:[{label:'本地资源',url:'https://example.com/',code:'LOCAL'}],descriptionUrl:'https://www.youtube.com/watch?v=nd-Q0_XcCCk'}}:{menuLabel:''})};
  const created=await call(`/api/admin/${kind}`,{method:'POST',admin:true,body:input,key:randomUUID()});assert.equal(created.status,201);let item=created.data;fixtures.push({kind,id:item.id});
  await test(`${kind} 删除权限、状态和版本校验`,async()=>{
   assert.equal((await call(`/api/admin/${kind}/${item.id}`,{method:'DELETE',body:{version:item.version},headers:{Cookie:cookie,Origin:base},key:randomUUID()})).status,403);
   assert.equal((await call(`/api/v1/${kind}/${item.id}`,{method:'DELETE',body:{version:item.version},headers:{Authorization:'Bearer '+bearer},key:randomUUID()})).status,403);
   const invalid=await call(`/api/admin/${kind}/${item.id}`,{method:'DELETE',admin:true,body:{version:item.version},key:randomUUID()});assert.equal(invalid.status,409);assert.equal(invalid.error.code,'INVALID_STATE');
  });
  if(kind==='posts')await test('资源卡片在关闭通用资源栏后仍可预览及访问',async()=>{
   const settings=(await call('/api/admin/settings',{admin:true})).data;
   const save=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...settings.value,pageLayouts:{...settings.value.pageLayouts,article:undefined},articleDesign:{...settings.value.articleDesign,showResources:false},version:settings.version}});assert.equal(save.status,200);
   const r=await call(`/api/admin/posts/${item.id}/publish`,{method:'POST',admin:true,body:{version:item.version},key:randomUUID()});assert.equal(r.status,200);item=r.data;
   const page=await call('/'+item.id+'.html');assert.equal(page.status,200);assert.equal((page.text.match(/aria-label="本期视频提到的链接"/g)||[]).length,1);assert(page.text.includes('data-copy-value="LOCAL"'));
   const preview=await call('/admin/preview',{method:'POST',admin:true,body:{title:input.title,body:input.body,categoryId:category,excerpt:'',cover:'',videoId:'',tags:[],resources:input.resources}});assert.equal(preview.status,200);assert(preview.text.includes('data-copy-value="LOCAL"'));
  });
  if(kind==='pages'){
   const settings=(await call('/api/admin/settings',{admin:true})).data;
   const r=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...settings.value,pageLayouts:{...settings.value.pageLayouts,['page:'+item.id]:{sidebar:'right',width:'standard',main:[{id:'body',type:'content',enabled:true}],left:[],right:[]}},version:settings.version}});assert.equal(r.status,200);
  }
  let trashed=await call(`/api/admin/${kind}/${item.id}/trash`,{method:'POST',admin:true,body:{version:item.version},key:randomUUID()});assert.equal(trashed.status,200);item=trashed.data;
  await test(`${kind} 并发恢复与永久删除仅一个成功`,async()=>{
   const r=await Promise.all([call(`/api/admin/${kind}/${item.id}/restore`,{method:'POST',admin:true,body:{version:item.version},key:randomUUID()}),call(`/api/admin/${kind}/${item.id}`,{method:'DELETE',admin:true,body:{version:item.version},key:randomUUID()})]);
   assert.equal(r.filter(x=>x.status===200).length,1);assert(r.every(x=>[200,404,409].includes(x.status)));
   const current=await call(`/api/admin/${kind}/${item.id}`,{admin:true});
   if(current.status===404){const recreated=await call(`/api/admin/${kind}`,{method:'POST',admin:true,body:input,key:randomUUID()});assert.equal(recreated.status,201);item=recreated.data;fixtures.push({kind,id:item.id});}
   else {assert.equal(current.status,200);item=current.data;}
   const t=await call(`/api/admin/${kind}/${item.id}/trash`,{method:'POST',admin:true,body:{version:item.version},key:randomUUID()});assert.equal(t.status,200);item=t.data;
  });
  await test(`${kind} 真实删除、幂等重放、旧版本冲突、详情404、审计与布局清理`,async()=>{
   const stale=await call(`/api/admin/${kind}/${item.id}`,{method:'DELETE',admin:true,body:{version:item.version-1},key:randomUUID()});assert.equal(stale.status,409);assert.equal(stale.error.code,'VERSION_CONFLICT');
   const key=randomUUID(),options={method:'DELETE',admin:true,body:{version:item.version},key};
   let r;
   if(kind==='pages'){
    const settings=(await call('/api/admin/settings',{admin:true})).data;
    const changes={...settings.value,pageLayouts:{...settings.value.pageLayouts,['page:'+item.id]:{sidebar:'right',width:'standard',main:[{id:'body',type:'content',enabled:true}],left:[],right:[]}},version:settings.version};
    const responses=await Promise.all([call(`/api/admin/${kind}/${item.id}`,options),call('/api/admin/settings',{method:'PUT',admin:true,body:changes})]);
    r=responses[0];assert([200,409].includes(responses[1].status),'并发保存布局结果');
   }else r=await call(`/api/admin/${kind}/${item.id}`,options);
   assert.equal(r.status,200,JSON.stringify(r.error));assert.deepEqual(r.data,{id:item.id,ok:true});
   assert.deepEqual((await call(`/api/admin/${kind}/${item.id}`,options)).data,r.data);
   assert.equal((await call(`/api/admin/${kind}/${item.id}`,{admin:true})).status,404);
   assert.equal((await call(`/api/admin/${kind}/${item.id}`,{...options,body:{version:item.version+1}})).status,409);
   assert.equal((await call(`/api/admin/${kind}/${item.id}`,{...options,key:randomUUID()})).status,404);
   const audit=await call('/api/admin/audit',{admin:true});assert(audit.data.some(x=>x.resourceId===item.id&&x.action==='purge.'+kind));
   const settings=(await call('/api/admin/settings',{admin:true})).data;assert(!settings.value.pageLayouts['page:'+item.id]);
   const reuse=await call(`/api/admin/${kind}`,{method:'POST',admin:true,body:input,key:randomUUID()});assert.equal(reuse.status,201);fixtures.push({kind,id:reuse.data.id});
  });
 }
 await test('无效自定义分类引用仍被拒绝',async()=>{
  const settings=(await call('/api/admin/settings',{admin:true})).data;
  const r=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...settings.value,headerNav:[{label:'不存在分类',href:'/category/'+unique+'/missing/'}],homeOptions:{...settings.value.homeOptions,categoryIds:['missing-'+unique]},version:settings.version}});assert.equal(r.status,409);assert.equal(r.error.code,'CATEGORY_LINKED');
 });
}finally{
 if(cookie&&snapshot){const current=(await call('/api/admin/settings',{admin:true})).data;assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...snapshot.value,version:current.version}})).status,200);}
 for(const {kind,id} of fixtures){let r=await call(`/api/admin/${kind}/${id}`,{admin:true});if(r.status===404)continue;assert.equal(r.status,200);if(r.data.status!=='trash')r=await call(`/api/admin/${kind}/${id}/trash`,{method:'POST',admin:true,body:{version:r.data.version},key:randomUUID()});assert.equal((await call(`/api/admin/${kind}/${id}`,{method:'DELETE',admin:true,body:{version:r.data.version},key:randomUUID()})).status,200);}
 if(category){const cats=(await call('/api/admin/categories',{admin:true})).data;const c=cats.find(x=>x.id===category);assert.equal((await call('/api/admin/categories/'+category,{method:'DELETE',admin:true,body:{version:c.version}})).status,200);}
 if(keyId)await call('/api/admin/keys/'+keyId+'/revoke',{method:'POST',admin:true});
 if(cookie)await call('/api/auth/logout',{method:'POST',admin:true});
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/empty-site-trash-integration.json',JSON.stringify({at:new Date().toISOString(),results},null,2));
}

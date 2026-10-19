import assert from 'node:assert/strict';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('仅允许本地测试');
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];assert(password);
let cookie='',csrf='',snapshot;
const pages=[],results=[];
async function call(path,{method='GET',body,admin=false,headers={},idem=false}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';
 if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}if(idem)h['Idempotency-Key']=randomUUID();
 const response=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(30000)});
 const text=await response.text();let json;try{json=JSON.parse(text);}catch{}
 return {status:response.status,text,data:json?.data,error:json?.error,headers:response.headers};
}
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(error){results.push({name,passed:false,message:error.message});throw error;}}
async function save(value){const current=await call('/api/admin/settings',{admin:true});const result=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...value,version:current.data.version}});assert.equal(result.status,200,result.text);return result.data;}
const block=(type,id,fields={})=>({id,type,title:'',text:'',href:'/tutorials/',image:'',alt:'',limit:3,level:2,links:[],enabled:true,...fields});
const layout=(overrides={})=>({sidebar:'both',width:'standard',main:[block('content','core')],left:[block('toc','toc',{title:'页面目录'}),block('notice','notice',{title:'布局左侧公告',text:'这是布局组件，正文保持不变。'})],right:[block('author','author',{title:'作者介绍'}),block('latest','latest',{title:'最近发布'}),block('search','search',{title:'文章搜索'})],...overrides});
const suffix=Date.now();
try{
 const login=await call('/api/auth/login',{method:'POST',headers:{Origin:base},body:{username:'admin',password}});assert.equal(login.status,200);
 cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;
 snapshot=(await call('/api/admin/settings',{admin:true})).data;
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/layout-settings-before.json',JSON.stringify(snapshot,null,2));
 await test('创建两个独立页面并发布，正文路径不受装修影响',async()=>{
  for(const n of [1,2]){
   const created=await call('/api/admin/pages',{method:'POST',admin:true,idem:true,body:{title:`布局验收 ${n}`,slug:`layout-check-${suffix}-${n}`,excerpt:'页面布局验收',body:'## 原有正文标题\n\n保留正文内容。\n\n## 第二节\n\n更多正文内容。',menuLabel:'测试页面'}});
   assert.equal(created.status,201,created.text);pages.push(created.data);
   const published=await call(`/api/admin/pages/${created.data.id}/publish`,{method:'POST',admin:true,idem:true,body:{version:created.data.version}});assert.equal(published.status,200);pages[n-1]=published.data;
  }
 });
 await test('默认模板保存再读，页面正文与双侧栏同步到真实前台',async()=>{
  const value={...snapshot.value,pageLayouts:{...snapshot.value.pageLayouts,default:layout()}};
  await save(value);assert.deepEqual((await call('/api/admin/settings',{admin:true})).data.value.pageLayouts.default,layout());
  for(const page of pages){const front=await call(`/${page.slug}/`);assert.equal(front.status,200);assert(front.text.includes('content-layout-both'));assert(front.text.includes('布局左侧公告'));assert(front.text.includes('保留正文内容。'));assert(front.text.includes('href="#section-1"'));assert(front.text.includes('layout-widget-search'));}
 });
 await test('单页覆盖只影响指定页面，切换无侧栏仍保留配置',async()=>{
  const current=(await call('/api/admin/settings',{admin:true})).data.value;
  await save({...current,pageLayouts:{...current.pageLayouts,[`page:${pages[0].id}`]:layout({sidebar:'none',main:[block('heading','extra',{title:'单页专属标题'}),block('content','core')]})}});
  const first=await call(`/${pages[0].slug}/`),second=await call(`/${pages[1].slug}/`);
  assert(first.text.includes('单页专属标题'));assert(first.text.includes('content-layout-none'));assert(!first.text.includes('布局左侧公告'));
  assert(!second.text.includes('单页专属标题'));assert(second.text.includes('content-layout-both'));
  assert.equal((await call(`/api/admin/pages/${pages[0].id}`,{admin:true})).data.body,pages[0].body);
 });
 await test('未保存装修实时预览与正文编辑预览都使用指定页面布局',async()=>{
  const current=(await call('/api/admin/settings',{admin:true})).data.value;
  const settings={...current,pageLayouts:{...current.pageLayouts,[`page:${pages[0].id}`]:layout({sidebar:'left',left:[block('notice','preview-notice',{title:'只在未保存预览中出现',text:'不会落库'})]})}};
  const payload={page:'page',pageId:pages[0].id,settings,builder:true};
  assert.equal((await call('/admin/page-preview',{method:'POST',body:payload})).status,401);
  assert.equal((await call('/admin/page-preview',{method:'POST',body:payload,headers:{Cookie:cookie,Origin:base}})).status,403);
  const preview=await call('/admin/page-preview',{method:'POST',body:payload,admin:true});assert.equal(preview.status,200,preview.text);assert(preview.text.includes('只在未保存预览中出现'));assert(preview.text.includes('data-layout-handle'));assert.equal(preview.headers.get('cache-control'),'no-store');
  assert(!(await call(`/${pages[0].slug}/`)).text.includes('只在未保存预览中出现'));
  const editor=await call('/admin/content-preview',{method:'POST',admin:true,body:{pageId:pages[0].id,title:'正在编辑',excerpt:'',body:'## 新草稿标题\n\n没有保存的正文'}});
  assert.equal(editor.status,200);assert(editor.text.includes('单页专属标题'));assert(editor.text.includes('没有保存的正文'));assert.equal((await call(`/api/admin/pages/${pages[0].id}`,{admin:true})).data.body,pages[0].body);
 });
 await test('区块 Markdown 清洗活动内容，目录锚点与正文不冲突',async()=>{
  const settings={...snapshot.value,pageLayouts:{default:layout({main:[block('markdown','note',{text:'## 组件标题\n\n<script>alert(1)</script>\n<a href="javascript:alert(1)" onclick="alert(1)">坏链接</a>'}),block('content','core')]})}};
  const preview=await call('/admin/page-preview',{method:'POST',admin:true,body:{page:'page',pageId:pages[0].id,settings}});
  assert.equal(preview.status,200);assert(!preview.text.includes('<script>alert(1)</script>'));assert(!preview.text.includes('onclick="alert'));assert(!preview.text.includes('href="javascript:'));assert(preview.text.includes('id="widget-note-section-1"'));assert(preview.text.includes('id="section-1"'));
 });
 await test('不存在的页面、非法区块、删除正文及过期版本均拒绝且不改设置',async()=>{
  const before=(await call('/api/admin/settings',{admin:true})).data;
  for(const invalid of [layout({main:[]}),layout({right:[block('script','bad')]}),layout({right:[block('button','bad',{href:'javascript:alert(1)'})]})]){
   assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,pageLayouts:{default:invalid},version:before.version}})).status,400);
  }
  assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,pageLayouts:{'page:missing':layout()},version:before.version}})).status,409);
  assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,version:before.version-1}})).status,409);
  assert.equal((await call('/admin/page-preview',{method:'POST',admin:true,body:{page:'page',pageId:'missing',settings:before.value}})).status,404);
  assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,before);
 });
 await test('文章与关于模板预览可用，旧客户端设置保存保留全部布局',async()=>{
  const current=(await call('/api/admin/settings',{admin:true})).data.value;
  const settings={...current,pageLayouts:{...current.pageLayouts,article:layout(),about:layout()}};
  await save(settings);
  for(const page of ['article','about']){const preview=await call('/admin/page-preview',{method:'POST',admin:true,body:{page,settings,builder:true}});assert.equal(preview.status,200,preview.text);assert(preview.text.includes('content-layout-both'));assert(preview.text.includes('布局左侧公告'));}
  const {pageLayouts,...legacy}=settings;await save(legacy);assert.deepEqual((await call('/api/admin/settings',{admin:true})).data.value.pageLayouts,pageLayouts);
 });
 await test('去除单页覆盖后恢复默认模板',async()=>{
  const current=(await call('/api/admin/settings',{admin:true})).data.value;delete current.pageLayouts[`page:${pages[0].id}`];await save(current);
  const front=await call(`/${pages[0].slug}/`);assert(!front.text.includes('单页专属标题'));assert(front.text.includes('布局左侧公告'));
 });
}catch(error){console.error(error.message);process.exitCode=1;}
finally{
 try{if(snapshot)await save(snapshot.value);}catch(error){console.error('恢复设置失败：'+error.message);process.exitCode=1;}
 for(const page of pages){try{const current=await call(`/api/admin/pages/${page.id}`,{admin:true});if(current.data?.status!=='trash')assert.equal((await call(`/api/admin/pages/${page.id}/trash`,{method:'POST',admin:true,idem:true,body:{version:current.data.version}})).status,200);}catch(error){console.error('测试页面回收失败：'+error.message);process.exitCode=1;}}
 if(cookie)await call('/api/auth/logout',{method:'POST',admin:true}).catch(()=>{});
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/layout-integration.json',JSON.stringify({base,results},null,2));console.log(`页面装修本地集成：${results.filter(r=>r.passed).length}/${results.length} 通过`);
}

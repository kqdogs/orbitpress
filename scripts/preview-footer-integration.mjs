import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('仅允许本地测试');
const password=readFileSync('local-admin.txt','utf8').match(/密码：(.+)/)?.[1];assert(password);
let cookie='',csrf='',snapshot,category,page;const results=[],suffix=Date.now();
async function call(path,{method='GET',body,admin=false,idem=false,headers={}}={}){
 const h={...headers};if(body!==undefined)h['Content-Type']='application/json';if(admin){h.Cookie=cookie;h.Origin=base;h['X-CSRF-Token']=csrf;}if(idem)h['Idempotency-Key']=randomUUID();
 const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(30000)});
 const text=await r.text();let json;try{json=JSON.parse(text);}catch{}
 return {status:r.status,text,data:json?.data,error:json?.error,headers:r.headers};
}
async function save(value){const current=(await call('/api/admin/settings',{admin:true})).data;const r=await call('/api/admin/settings',{method:'PUT',admin:true,body:{...value,version:current.version}});assert.equal(r.status,200,r.text);return r.data;}
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(error){results.push({name,passed:false,message:error.message});throw error;}}
const block=(type,id,title)=>({id,type,title,text:'预览区域',href:'/',image:'',alt:'',limit:3,level:2,links:[],enabled:true});
try{
 const login=await call('/api/auth/login',{method:'POST',headers:{Origin:base},body:{username:'admin',password}});assert.equal(login.status,200,login.text);cookie=login.headers.get('set-cookie').split(';')[0];csrf=login.data.csrf;
 snapshot=(await call('/api/admin/settings',{admin:true})).data;mkdirSync('test-results',{recursive:true});writeFileSync('test-results/preview-footer-settings-before.json',JSON.stringify(snapshot,null,2));
 const posts=(await call('/api/admin/posts?status=published',{admin:true})).data.items;const post=posts[0];assert(post,'需要至少一篇已发布测试文章');
 await test('创建独立页面作为固定地址验收样本',async()=>{
  const r=await call('/api/admin/pages',{method:'POST',admin:true,idem:true,body:{title:'固定页面路径验收',slug:`stable-page-${suffix}`,excerpt:'独立页面不跟随文章地址规则',body:'## 独立页面原有正文',menuLabel:''}});assert.equal(r.status,201,r.text);page=r.data;
  const published=await call(`/api/admin/pages/${page.id}/publish`,{method:'POST',admin:true,idem:true,body:{version:page.version}});assert.equal(published.status,200);page=published.data;
 });
 await test('页脚版权和导航保存再读，前台安全显示且不修改页头',async()=>{
  const value={...snapshot.value,footerCopyright:'© 2020–{year} {title} · 页脚验收 <script>bad</script>',footerNav:[{label:'页脚教程验收',href:'/tutorials/'},{label:'独立页面入口',href:`/${page.slug}/`}]};await save(value);
  const saved=(await call('/api/admin/settings',{admin:true})).data.value;assert.equal(saved.footerCopyright,value.footerCopyright);assert.deepEqual(saved.footerNav,value.footerNav);assert.deepEqual(saved.headerNav,snapshot.value.headerNav);
  const front=await call('/');assert.equal(front.status,200);const footer=front.text.match(/<footer[\s\S]*?<\/footer>/)?.[0];assert(footer);assert(footer.includes(`© 2020–${new Date().getFullYear()}`));assert(footer.includes('页脚教程验收'));assert(footer.includes('&lt;script&gt;bad&lt;/script&gt;'));assert(!footer.includes('<script>bad'));assert(footer.includes('brand-backdrop-footer'));
 });
 await test('旧客户端省略新字段保留设置；空导航隐藏，null恢复默认',async()=>{
  let current=(await call('/api/admin/settings',{admin:true})).data.value;const {footerCopyright,footerNav,...legacy}=current;await save(legacy);
  let saved=(await call('/api/admin/settings',{admin:true})).data.value;assert.equal(saved.footerCopyright,footerCopyright);assert.deepEqual(saved.footerNav,footerNav);
  await save({...saved,footerNav:[]});let front=await call('/');assert(/aria-label="页脚导航"[^>]*><\/nav>/.test(front.text));
  await save({...saved,footerNav:null,footerCopyright:''});front=await call('/');const footer=front.text.match(/<footer[\s\S]*?<\/footer>/)?.[0]||'';assert(footer.includes('站点地图'));assert(footer.includes(`© ${new Date().getFullYear()}`));
 });
 await test('分类库图标创建编辑与前台SVG渲染，页脚引用保护',async()=>{
  const r=await call('/api/admin/categories',{method:'POST',admin:true,body:{name:'图标库验收',slug:`icon-check-${suffix}`,description:'本地图标库',icon:'ep:VideoCamera'}});assert.equal(r.status,201,r.text);category={id:r.data.id,slug:`icon-check-${suffix}`};
  let cats=(await call('/api/admin/categories',{admin:true})).data;let cat=cats.find(c=>c.id===category.id);assert.equal(cat.icon,'ep:VideoCamera');
  const update=await call(`/api/admin/categories/${category.id}`,{method:'PUT',admin:true,body:{name:cat.name,slug:cat.slug,description:cat.description,icon:'ep:StarFilled',version:cat.version}});assert.equal(update.status,200,update.text);
  cats=(await call('/api/admin/categories',{admin:true})).data;cat=cats.find(c=>c.id===category.id);assert.equal(cat.icon,'ep:StarFilled');
  const current=(await call('/api/admin/settings',{admin:true})).data.value;await save({...current,footerNav:[{label:'引用图标分类',href:`/category/${category.slug}/`}]});
  assert.equal((await call(`/api/admin/categories/${category.id}`,{method:'DELETE',admin:true,body:{version:cat.version}})).status,409);
  assert.equal((await call(`/api/admin/categories/${category.id}`,{method:'PUT',admin:true,body:{name:cat.name,slug:`${cat.slug}-new`,description:cat.description,icon:cat.icon,version:cat.version}})).status,409);
  const layout={sidebar:'none',width:'standard',main:[block('home-categories','cats','图标库分类')],left:[],right:[]};
  const preview=await call('/admin/page-preview',{method:'POST',admin:true,body:{page:'home',builder:true,settings:{...current,homeOptions:{...current.homeOptions,categoryIds:[category.id]},pageLayouts:{...current.pageLayouts,home:layout}}}});assert.equal(preview.status,200,preview.text);assert(preview.text.includes('图标库验收'));assert(preview.text.includes('viewBox="0 0 1024 1024"'));assert(!preview.text.includes('ep:StarFilled'));
 });
 await test('八种文章主链接保存后实际访问、兼容地址跳转、canonical及页面地址保持',async()=>{
  const [year,month,day]=post.publishedAt.slice(0,10).split('-');
  const cat=(await call('/api/admin/categories',{admin:true})).data.find(c=>c.id===post.categoryId);assert(cat);
  const paths={postname:`/${post.slug}/`,post:`/post/${post.slug}/`,category:`/${cat.slug}/${post.slug}/`,day:`/${year}/${month}/${day}/${post.slug}/`,month:`/${year}/${month}/${post.slug}/`,numeric:`/archives/${post.id}/`,plain:`/?p=${post.id}`,custom:`/${post.id}.html`};
  for(const format of Object.keys(paths)){
   await save({...snapshot.value,permalinkFormats:[format,...Object.keys(paths).filter(key=>key!==format)],permalinkCustom:'/%post_id%.html'});
   const canonical=paths[format];const front=await call(canonical);assert.equal(front.status,200,canonical);assert(front.text.includes(post.title));assert(front.text.includes(`${base}${canonical}`),'canonical');
   const alias=format==='postname'?paths.custom:paths.postname;const redirected=await call(alias);assert.equal(redirected.status,301,alias);assert.equal(redirected.headers.get('location'),canonical);
   const tracked=await call(`${alias}${alias.includes('?')?'&':'?'}utm_source=test`);assert.equal(tracked.headers.get('location'),`${canonical}${canonical.includes('?')?'&':'?'}utm_source=test`);
   assert((await call('/sitemap.xml')).text.includes(canonical));
   const independent=await call(`/${page.slug}/`);assert.equal(independent.status,200,format);assert(!independent.headers.has('location'));assert(independent.text.includes('独立页面原有正文'));
  }
 });
 await test('关闭的文章格式不再匹配，草稿不公开，独立页面不受影响',async()=>{
  await save({...snapshot.value,permalinkFormats:['custom'],permalinkCustom:'/%post_id%.html'});
  assert.equal((await call(`/post/${post.slug}/`)).status,404);assert.equal((await call(`/?p=${post.id}`)).status,404);assert.equal((await call(`/${page.slug}/`)).status,200);
  const drafts=(await call('/api/admin/posts?status=draft',{admin:true})).data.items;
  if(drafts[0])assert.equal((await call(`/${drafts[0].id}.html`)).status,404);
 });
 await test('首页文章页独立页面预览全部输出双侧栏且不落库',async()=>{
  const before=(await call('/api/admin/settings',{admin:true})).data;
  const template={sidebar:'both',width:'wide',main:[block('content','core','正文')],left:[block('notice','left-note','预览左栏')],right:[block('author','right-author','预览右栏')]};
  const home={...template,main:[block('home-hero','hero','首页主视觉')]};
  const value={...before.value,pageLayouts:{...before.value.pageLayouts,home,article:template,[`page:${page.id}`]:template}};
  for(const target of ['home','article','page']){
   const payload={page:target,settings:value,builder:true,...(target==='article'?{postId:post.id}:target==='page'?{pageId:page.id}:{})};
   const r=await call('/admin/page-preview',{method:'POST',admin:true,body:payload});assert.equal(r.status,200,r.text);for(const title of ['content-layout-both','预览左栏','预览右栏'])assert(r.text.includes(title));assert.equal(r.headers.get('cache-control'),'no-store');
  }
  assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,before);
 });
 await test('新字段与图标异常、权限及版本冲突均拒绝且不改数据',async()=>{
  const before=(await call('/api/admin/settings',{admin:true})).data;
  for(const patch of [{footerNav:[{label:'危险',href:'javascript:alert(1)'}]},{footerCopyright:'x'.repeat(301)},{footerNav:[{label:'危险',href:'//evil.test/'}]}])assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,...patch,version:before.version}})).status,400);
  assert.equal((await call('/api/admin/settings',{method:'PUT',body:{...before.value,version:before.version}})).status,401);
  assert.equal((await call('/api/admin/settings',{method:'PUT',headers:{Cookie:cookie,Origin:base},body:{...before.value,version:before.version}})).status,403);
  assert.equal((await call('/api/admin/settings',{method:'PUT',admin:true,body:{...before.value,version:before.version-1}})).status,409);
  assert.equal((await call('/api/admin/categories',{method:'POST',admin:true,body:{name:'非法',slug:`bad-icon-${suffix}`,description:'',icon:'ep:UnknownIcon'}})).status,400);
  assert.deepEqual((await call('/api/admin/settings',{admin:true})).data,before);
 });
}catch(error){console.error(error.message);process.exitCode=1;}
finally{
 try{
  if(snapshot){await save(snapshot.value);assert.deepEqual((await call('/api/admin/settings',{admin:true})).data.value,snapshot.value);}
  if(category){const cat=(await call('/api/admin/categories?includeTrash=1',{admin:true})).data.find(c=>c.id===category.id);if(cat&&!cat.deletedAt)assert.equal((await call(`/api/admin/categories/${cat.id}`,{method:'DELETE',admin:true,body:{version:cat.version}})).status,200);}
  if(page){const current=(await call(`/api/admin/pages/${page.id}`,{admin:true})).data;if(current&&current.status!=='trash')assert.equal((await call(`/api/admin/pages/${page.id}/trash`,{method:'POST',admin:true,idem:true,body:{version:current.version}})).status,200);}
 }catch(error){console.error('恢复失败：'+error.message);process.exitCode=1;}
 if(cookie)await call('/api/auth/logout',{method:'POST',admin:true}).catch(()=>{});
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/preview-footer-integration.json',JSON.stringify({base,results},null,2));console.log(`预览页脚链接集成 ${results.filter(r=>r.passed).length}/8 通过`);
}

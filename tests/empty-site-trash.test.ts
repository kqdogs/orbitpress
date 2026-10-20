import {describe,it,expect,afterEach} from 'vitest';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {createPageLayout} from '../src/lib/page-layouts';
import {purgeContent} from '../src/lib/purge-service';
import {siteSettings} from '../src/lib/repository';
import {configuredCategorySlugs,settingsInput} from '../src/lib/schema';
import {request} from '../src/components/admin/api';
import {loadHomeComponentData} from '../src/lib/home-components';
import {vi} from 'vitest';

const databases:DatabaseSync[]=[];
afterEach(()=>{databases.splice(0).forEach(db=>db.close());vi.unstubAllGlobals();});
function fixture(until=9){
 const sql=new DatabaseSync(':memory:');databases.push(sql);
 for(const name of readdirSync('migrations').sort())if(Number(name.slice(0,4))<=until)sql.exec(readFileSync('migrations/'+name,'utf8'));
 function statement(query:string,values:Array<string|number|null>=[]){
  const execute=()=>{const results=sql.prepare(query).all(...values);return {results,success:true,meta:{changes:Number(sql.prepare('SELECT changes() n').get()!.n)}};};
  return {bind:(...params:Array<string|number|null>)=>statement(query,params),first:async()=>execute().results[0]||null,all:async()=>execute(),run:async()=>execute(),execute};
 }
 const db={prepare:statement,batch:async(statements:ReturnType<typeof statement>[])=>{sql.exec('BEGIN');try{const results=statements.map(s=>s.execute());sql.exec('COMMIT');return results;}catch(error){sql.exec('ROLLBACK');throw error;}}} as unknown as D1Database;
 return {sql,db};
}
const actor={id:'admin',kind:'admin' as const,scopes:['content:write']};
function deletion(kind:string,id:string,key='purge-test-key') {return new Request(`http://localhost/api/admin/${kind}/${id}`,{method:'DELETE',headers:{'Idempotency-Key':key}});}
function seed(sql:DatabaseSync,kind:'posts'|'pages',status='trash'){
 if(kind==='posts')sql.exec("INSERT INTO categories(id,name,slug) VALUES('cat','测试','test');");
 sql.exec(kind==='posts'?`INSERT INTO posts(id,title,slug,category_id,status,created_at,updated_at,updated_by,last_operation) VALUES('item','测试','reusable','cat','${status}','today','today','admin','seed')`:`INSERT INTO pages(id,title,slug,status,created_at,updated_at,updated_by,last_operation) VALUES('item','测试','reusable','${status}','today','today','admin','seed')`);
}
describe('空站设置与旧默认分类迁移',()=>{
 it('全新迁移没有内容/分类/导航和悬空分类引用，可生成固定链接设置',async()=>{
  const {sql,db}=fixture();const settings=await siteSettings(db);
  for(const table of ['posts','pages','categories'])expect(sql.prepare(`SELECT count(*) n FROM ${table}`).get()!.n).toBe(0);
  expect(settings.value.headerNav).toEqual([]);expect(settings.value.footerNav).toEqual([]);
  expect(settings.value.homeOptions.steps).toEqual([]);expect(configuredCategorySlugs(settings.value)).toEqual([]);
  expect(settingsInput.parse({...settings.value,permalinkFormats:['custom'],permalinkCustom:'/%post_id%.html'}).headerNav).toEqual([]);
 });
 it('空站分类区域为空，后来新建的自定义分类可以直接展示',async()=>{
  const {sql,db}=fixture();const {value}=await siteSettings(db);
  expect((await loadHomeComponentData(db,value,new Set(['home-categories']))).categories).toEqual([]);
  sql.exec("INSERT INTO categories(id,name,slug) VALUES('custom','自己的分类','custom')");
  expect((await loadHomeComponentData(db,value,new Set(['home-categories']))).categories.map(c=>c.slug)).toEqual(['custom']);
 });
 it('旧默认仅移除失效链接；保留有效分类和自定义导航且重跑不变化',async()=>{
  const {sql,db}=fixture(8);sql.exec("INSERT INTO categories(id,name,slug) VALUES('banking','银行','banking')");
  const settings=await siteSettings(db);
  const value={...settings.value,headerNav:[{label:'自定义',href:'/about/'},{label:'有效',href:'/category/banking/'},{label:'旧演示',href:'/category/virtual-cards/'},{label:'待修复自定义',href:'/category/custom-missing/'}],homeOptions:{...settings.value.homeOptions,promoHref:'/category/virtual-cards/',steps:[{title:'旧演示',description:'',href:'/category/esim-adapters/'},{title:'有效',description:'',href:'/category/banking/'}]}};
  sql.prepare('UPDATE settings SET value=? WHERE id=1').run(JSON.stringify(value));
  const migration=readFileSync('migrations/0009_empty_site_defaults.sql','utf8');sql.exec(migration);
  const saved=await siteSettings(db);expect(saved.value.headerNav.map(x=>x.label)).toEqual(['自定义','有效','待修复自定义']);
  expect(saved.value.homeOptions.steps.map(x=>x.title)).toEqual(['有效']);expect(saved.value.homeOptions.promoHref).toBe('/tutorials/');
  sql.exec(migration);expect(await siteSettings(db)).toEqual(saved);
 });
});
describe.each(['posts','pages'] as const)('%s 回收站永久删除真实 SQLite 事务',kind=>{
 it('仅可删除回收站当前版本；认证类型、状态、版本、幂等键均校验',async()=>{
  const {sql,db}=fixture();seed(sql,kind,'draft');
  await expect(purgeContent(db,deletion(kind,'item'),{...actor,kind:'key'},kind,'item',{version:1})).rejects.toMatchObject({status:403});
  await expect(purgeContent(db,deletion(kind,'item','bad'),actor,kind,'item',{version:1})).rejects.toMatchObject({code:'IDEMPOTENCY_REQUIRED'});
  await expect(purgeContent(db,deletion(kind,'item'),actor,kind,'item',{version:1})).rejects.toMatchObject({code:'INVALID_STATE'});
  sql.exec(`UPDATE ${kind} SET status='trash',version=2`);
  await expect(purgeContent(db,deletion(kind,'item'),actor,kind,'item',{version:1})).rejects.toMatchObject({code:'VERSION_CONFLICT'});
  expect(sql.prepare(`SELECT count(*) n FROM ${kind}`).get()!.n).toBe(1);
 });
 it('删除实体及旧响应、释放路径、清理布局或精选指针、保留媒体分类和审计，支持安全重放',async()=>{
  const {sql,db}=fixture();seed(sql,kind);
  const value=(await siteSettings(db)).value;
  if(kind==='pages')value.pageLayouts['page:item']=createPageLayout('none');
  else value.homeOptions.featuredPostId='item';
  sql.prepare('UPDATE settings SET value=? WHERE id=1').run(JSON.stringify(value));
  sql.exec("INSERT INTO media VALUES('shared','共享图片','image/png',2,'today'); INSERT INTO audit VALUES('old','admin','create','item','today'); INSERT INTO idempotency VALUES('old','old','{\"id\":\"item\",\"body\":\"old\"}',201,9999999999)");
  const result=await purgeContent(db,deletion(kind,'item'),actor,kind,'item',{version:1});expect(result).toEqual({ok:true,id:'item'});
  expect(sql.prepare(`SELECT * FROM ${kind} WHERE id='item'`).get()).toBeUndefined();
  expect(sql.prepare("SELECT * FROM idempotency WHERE scope='old'").get()).toBeUndefined();
  expect(sql.prepare('SELECT count(*) n FROM media').get()!.n).toBe(1);expect(sql.prepare('SELECT count(*) n FROM audit').get()!.n).toBe(2);
  expect((await siteSettings(db)).value.pageLayouts['page:item']).toBeUndefined();expect((await siteSettings(db)).value.homeOptions.featuredPostId).toBe('');
  expect(await purgeContent(db,deletion(kind,'item'),actor,kind,'item',{version:1})).toEqual(result);
  await expect(purgeContent(db,deletion(kind,'item'),actor,kind,'item',{version:2})).rejects.toMatchObject({code:'IDEMPOTENCY_CONFLICT'});
  await expect(purgeContent(db,deletion(kind,'item','new-purge-key'),actor,kind,'item',{version:1})).rejects.toMatchObject({status:404});
  seed(sql,kind==='posts'?'pages':'posts','draft');expect(sql.prepare(`SELECT slug FROM ${kind==='posts'?'pages':'posts'}`).get()!.slug).toBe('reusable');
 });
 it('事务中途失败回滚删除、设置、幂等和审计',async()=>{
  const {sql,db}=fixture();seed(sql,kind);sql.exec(`CREATE TRIGGER prevent_delete BEFORE DELETE ON ${kind} BEGIN SELECT RAISE(ABORT,'injected_failure'); END`);
  await expect(purgeContent(db,deletion(kind,'item'),actor,kind,'item',{version:1})).rejects.toThrow('injected_failure');
  expect(sql.prepare(`SELECT count(*) n FROM ${kind}`).get()!.n).toBe(1);expect(sql.prepare('SELECT count(*) n FROM audit').get()!.n).toBe(0);expect(sql.prepare('SELECT count(*) n FROM idempotency').get()!.n).toBe(0);
 });
});
it('后台 DELETE 响应正确解析，不再套用文章或页面字段',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({data:{ok:true,id:'item'}}))));
 for(const kind of ['posts','pages'])expect(await request(`/api/admin/${kind}/item`,{method:'DELETE',body:{version:1},idempotent:true})).toEqual({ok:true,id:'item'});
});
describe('分类回收站永久删除',()=>{
 it('删除回收站分类、释放别名、保留审计并支持相同键重放',async()=>{
  const {sql,db}=fixture();sql.exec("INSERT INTO categories(id,name,slug,deleted_at) VALUES('item','分类','reusable','today')");
  const req=new Request('http://localhost/api/admin/categories/item/purge',{method:'POST',headers:{'Idempotency-Key':'category-purge-key'}});
  expect(await purgeContent(db,req,actor,'categories','item',{version:1})).toEqual({ok:true,id:'item'});
  expect(sql.prepare("SELECT id FROM categories WHERE id='item'").get()).toBeUndefined();
  expect(sql.prepare("SELECT action FROM audit WHERE resource_id='item'").get()!.action).toBe('purge.categories');
  expect(await purgeContent(db,req,actor,'categories','item',{version:1})).toEqual({ok:true,id:'item'});
  sql.exec("INSERT INTO categories(id,name,slug) VALUES('new','新分类','reusable')");
 });
 it('有效分类不能直接永久删除，旧版本及关联文章受到保护',async()=>{
  const {sql,db}=fixture();sql.exec("INSERT INTO categories(id,name,slug) VALUES('item','分类','test')");
  await expect(purgeContent(db,deletion('categories','item'),actor,'categories','item',{version:1})).rejects.toMatchObject({code:'INVALID_STATE'});
  sql.exec("INSERT INTO posts(id,title,slug,category_id,created_at,updated_at,updated_by,last_operation) VALUES('post','文章','test-post','item','today','today','admin','seed'); UPDATE categories SET deleted_at='today',version=2 WHERE id='item'");
  await expect(purgeContent(db,deletion('categories','item'),actor,'categories','item',{version:1})).rejects.toMatchObject({code:'VERSION_CONFLICT'});
  await expect(purgeContent(db,deletion('categories','item'),actor,'categories','item',{version:2})).rejects.toMatchObject({code:'CATEGORY_IN_USE'});
  expect(sql.prepare('SELECT count(*) n FROM posts').get()!.n).toBe(1);
 });
 it('已删除分类仍有旧导航引用时阻止永久删除',async()=>{
  const {sql,db}=fixture();sql.exec("INSERT INTO categories(id,name,slug,deleted_at) VALUES('item','分类','test','today')");
  const settings=(await siteSettings(db)).value;settings.headerNav=[{label:'分类',href:'/category/test/'}];sql.prepare('UPDATE settings SET value=?').run(JSON.stringify(settings));
  await expect(purgeContent(db,deletion('categories','item'),actor,'categories','item',{version:1})).rejects.toMatchObject({code:'CATEGORY_LINKED'});
  expect(sql.prepare('SELECT count(*) n FROM categories').get()!.n).toBe(1);
 });
});

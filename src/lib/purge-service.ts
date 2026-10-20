import { ApiError, epoch, now } from './http';
import { sha256, type Actor } from './security';
import {siteSettings} from './repository';
import {configuredCategorySlugs} from './schema';

/** Permanently remove trashed content. Shared media and historical audit records survive. */
export async function purgeContent(db:D1Database, request:Request, actor:Actor, kind:'posts'|'pages'|'categories', id:string, input:{version:number}) {
 if(actor.kind!=='admin')throw new ApiError(403,'FORBIDDEN','仅管理员可彻底删除内容');
 const key=request.headers.get('idempotency-key');
 if(!key||! /^[\x21-\x7e]{8,100}$/.test(key))throw new ApiError(400,'IDEMPOTENCY_REQUIRED','彻底删除需要 Idempotency-Key');
 const scope=await sha256(`${actor.id}:${request.method}:${new URL(request.url).pathname}:${key}`);
 const fingerprint=await sha256(JSON.stringify(input));
 const replay=async()=>{
  const row=await db.prepare('SELECT fingerprint,response FROM idempotency WHERE scope=? AND expires_at>?').bind(scope,epoch()).first<{fingerprint:string;response:string}>();
  if(!row)return null;
  if(row.fingerprint!==fingerprint)throw new ApiError(409,'IDEMPOTENCY_CONFLICT','同一幂等键不能用于不同内容');
  return JSON.parse(row.response) as {ok:true;id:string};
 };
 const repeated=await replay();if(repeated)return repeated;
 // kind is a closed server-side union, never a request-supplied SQL identifier.
 const previous=await db.prepare(`SELECT ${kind==='categories'?"CASE WHEN deleted_at IS NOT NULL THEN 'trash' ELSE 'active' END status,slug":'status'},version FROM ${kind} WHERE id=?`).bind(id).first<{status:string;version:number;slug?:string}>();
 if(!previous)throw new ApiError(404,'NOT_FOUND','内容不存在');
 if(previous.version!==input.version)throw new ApiError(409,'VERSION_CONFLICT','内容已变化，请刷新后重试');
 if(previous.status!=='trash')throw new ApiError(409,'INVALID_STATE','请先将内容移到回收站');
 const data={ok:true as const,id};
 let condition="id=? AND version=? AND status='trash'";
 const values:Array<string|number>=[id,input.version];
 if(kind==='categories'){
  if(await db.prepare('SELECT id FROM posts WHERE category_id=? LIMIT 1').bind(id).first())throw new ApiError(409,'CATEGORY_IN_USE','该分类仍有关联文章（包括回收站），请先移动或彻底删除文章');
  const settings=await siteSettings(db);
  if(configuredCategorySlugs(settings.value).includes(previous.slug!)||settings.value.homeOptions.categoryIds.includes(id))throw new ApiError(409,'CATEGORY_LINKED','请先移除导航和装修中的分类引用');
  condition='id=? AND version=? AND deleted_at IS NOT NULL AND NOT EXISTS(SELECT 1 FROM posts WHERE category_id=categories.id) AND EXISTS(SELECT 1 FROM settings WHERE id=1 AND version=?)';
  values.push(settings.version);
 }
 const guard=`EXISTS(SELECT 1 FROM ${kind} WHERE ${condition})`;
 const settingsPath=kind==='pages'?'$.pageLayouts.'+JSON.stringify(`page:${id}`):'$.homeOptions.featuredPostId';
 const settingGuard=kind==='pages'?'json_type(value,?) IS NOT NULL':'json_extract(value,?)=?';
 const settingValues=kind==='pages'?[settingsPath]:[settingsPath,id];
 try{
  const results=await db.batch([
   db.prepare('DELETE FROM idempotency WHERE scope=? AND expires_at<=?').bind(scope,epoch()),
   db.prepare(`INSERT INTO idempotency(scope,fingerprint,response,code,expires_at) SELECT ?,?,?,200,? WHERE ${guard}`).bind(scope,fingerprint,JSON.stringify(data),epoch()+86400,...values),
   ...(kind==='categories'?[]:[db.prepare(`UPDATE settings SET value=json_remove(value,?),version=version+1 WHERE id=1 AND ${settingGuard} AND ${guard}`).bind(settingsPath,...settingValues,...values)]),
   db.prepare(`DELETE FROM idempotency WHERE scope<>? AND json_extract(response,'$.id')=? AND ${guard}`).bind(scope,id,...values),
   db.prepare(`INSERT INTO audit(id,actor,action,resource_id,created_at) SELECT ?,?,?,?,? WHERE ${guard}`).bind(crypto.randomUUID(),actor.id,`purge.${kind}`,id,now(),...values),
   db.prepare(`DELETE FROM ${kind} WHERE ${condition} RETURNING id`).bind(...values),
  ]);
  if(!results[results.length-1].results.length)throw new ApiError(409,'VERSION_CONFLICT','内容已变化，请刷新后重试');
 }catch(error){const repeated=await replay();if(repeated)return repeated;throw error;}
 return data;
}

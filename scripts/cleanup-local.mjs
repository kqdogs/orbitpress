import { cpSync,existsSync,mkdirSync,statSync,writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { samplePosts } from './sample-posts.mjs';

// Explicit, local-only maintenance. Stop the local server before --apply.
const apply=process.argv.includes('--apply');
if(process.argv.slice(2).some(arg=>arg!=='--apply'))throw Error('Only --apply is supported; remote execution is forbidden.');
const root=resolve(import.meta.dirname,'..');
if(resolve(process.cwd())!==root)throw Error('Run this command in the project root.');
const wrangler=resolve(root,'node_modules/wrangler/bin/wrangler.js');
function cli(args){return execFileSync(process.execPath,[wrangler,...args],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024,windowsHide:true});}
function query(sql){const result=JSON.parse(cli(['d1','execute','blog-db','--local','--command',sql,'--json']));if(result.some(item=>!item.success))throw Error('Local query failed');return result[0].results;}
const quote=value=>`'${String(value).replaceAll("'","''")}'`;
const keep=samplePosts.map(row=>`demo-${row[0]}`);
const posts=query('SELECT id,slug,title,status,cover,body FROM posts');
if(!keep.every(id=>posts.some(post=>post.id===id)))throw Error('Expected sample posts are missing; cleanup cancelled.');
const removed=posts.filter(post=>!keep.includes(post.id));
if(removed.some(post=>!post.id.startsWith('demo-')&&!/^(integration-|local-browser-|arco-)/.test(post.slug)))throw Error('Unrecognized content exists; cleanup cancelled to preserve it.');
const categoryRows=query("SELECT id FROM categories WHERE deleted_at IS NOT NULL AND (slug LIKE 'integration-%' OR name='Arco本地验收分类') AND NOT EXISTS(SELECT 1 FROM posts WHERE category_id=categories.id)");
const keyRows=query("SELECT id FROM api_keys WHERE name LIKE 'integration-%' AND revoked_at IS NOT NULL");
const settings=query('SELECT value FROM settings WHERE id=1')[0].value;
const keptText=posts.filter(post=>keep.includes(post.id)).map(post=>post.cover+' '+post.body).join(' ')+settings;
const mediaRows=query("SELECT id FROM media WHERE name='integration-logo.png'").filter(item=>!keptText.includes(`/media/${item.id}`));
const replayRows=query("SELECT scope FROM idempotency WHERE json_extract(response,'$.slug') LIKE 'integration-%'").filter(item=>!!item.scope);
const summary={before:posts.length,retained:keep.length,removedPosts:removed.length,removedCategories:categoryRows.length,removedKeys:keyRows.length,removedMedia:mediaRows.length,removedTestReplays:replayRows.length};
if(!apply){console.log(JSON.stringify({dryRun:true,...summary},null,2));process.exit(0);}
let running=false;try{await fetch('http://127.0.0.1:4321/',{signal:AbortSignal.timeout(1000)});running=true;}catch{}
if(running)throw Error('Stop the local preview/dev server before cleanup.');
const backup=resolve(root,'.local-backups',`before-customization-${new Date().toISOString().replace(/[:.]/g,'-')}`);
mkdirSync(backup,{recursive:true});
cli(['d1','export','blog-db','--local','--output',resolve(backup,'database.sql')]);
if(statSync(resolve(backup,'database.sql')).size<100)throw Error('Backup export is empty; cleanup cancelled.');
for(const directory of ['d1','r2']){const source=resolve(root,'.wrangler/state/v3',directory);if(existsSync(source))cpSync(source,resolve(backup,'state',directory),{recursive:true});}
writeFileSync(resolve(backup,'summary.json'),JSON.stringify({...summary,keep},null,2));
const deletes=[];
if(replayRows.length)deletes.push(`DELETE FROM idempotency WHERE scope IN (${replayRows.map(item=>quote(item.scope)).join(',')});`);
for(const [table,ids] of [['posts',removed.map(item=>item.id)],['categories',categoryRows.map(item=>item.id)],['api_keys',keyRows.map(item=>item.id)],['media',mediaRows.map(item=>item.id)]]){
 if(ids.length){const values=ids.map(quote).join(',');deletes.push(`DELETE FROM ${table} WHERE id IN (${values});`,`DELETE FROM audit WHERE resource_id IN (${values});`);}
}
// Remove only known, unreferenced integration images. User uploads remain intact.
for(const item of mediaRows)cli(['r2','object','delete',`rinfinity-media/${item.id}`,'--local']);
const file=resolve(backup,'cleanup.sql');writeFileSync(file,deletes.join('\n'));
if(deletes.length)cli(['d1','execute','blog-db','--local','--file',file]);
const after=query('SELECT id,status FROM posts');
if(after.length!==keep.length||after.some(post=>!keep.includes(post.id)))throw Error('Cleanup verification failed; use the backup to restore.');
if(query('PRAGMA foreign_key_check').length)throw Error('Foreign key verification failed.');
writeFileSync(resolve(backup,'result.json'),JSON.stringify({...summary,after:after.length,verified:true},null,2));
console.log(JSON.stringify({backup,...summary,after:after.length,verified:true},null,2));

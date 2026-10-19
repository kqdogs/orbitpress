import { emptyArticleResources, settingsInput, type Category, type Page, type Post, type Settings } from './schema';
import { matchPostPath, matchesPublishedPath } from './permalinks';
import { ApiError } from './http';
import { legacyHighlights } from './article-metadata';
type Row=Record<string,unknown>;
export function toPost(row:Row):Post{return {id:String(row.id),title:String(row.title),slug:String(row.slug),excerpt:String(row.excerpt),body:String(row.body),categoryId:String(row.category_id),cover:String(row.cover),videoId:String(row.video_id),featured:Boolean(row.featured),tags:JSON.parse(String(row.tags)),resources:row.resources==null?{...emptyArticleResources,items:[]}:JSON.parse(String(row.resources)),highlights:row.highlights==null?legacyHighlights(String(row.excerpt)):JSON.parse(String(row.highlights)),status:row.status as Post['status'],publishedAt:row.published_at as string|null,createdAt:String(row.created_at),updatedAt:String(row.updated_at),version:Number(row.version),categoryName:row.category_name as string,categorySlug:row.category_slug as string};}
export function toPage(row:Row):Page{return {id:String(row.id),title:String(row.title),slug:String(row.slug),excerpt:String(row.excerpt),body:String(row.body),menuLabel:String(row.menu_label||''),status:row.status as Page['status'],publishedAt:row.published_at as string|null,createdAt:String(row.created_at),updatedAt:String(row.updated_at),version:Number(row.version)};}
const select='SELECT p.*,c.name category_name,c.slug category_slug FROM posts p JOIN categories c ON c.id=p.category_id';
export async function getPost(db:D1Database,id:string,bySlug=false,publicOnly=false){const row=await db.prepare(`${select} WHERE p.${bySlug?'slug':'id'}=? ${publicOnly?"AND p.status='published'":''}`).bind(id).first<Row>();return row?toPost(row):null;}
export async function getPage(db:D1Database,id:string,bySlug=false,publicOnly=false){try{const row=await db.prepare(`SELECT * FROM pages WHERE ${bySlug?'slug':'id'}=? ${publicOnly?"AND status='published'":''}`).bind(id).first<Row>();return row?toPage(row):null;}catch(error){if(String(error).toLowerCase().includes('no such table')&&String(error).toLowerCase().includes('pages'))return null;throw error;}}
export async function listPages(db:D1Database,options:{admin?:boolean;status?:string;q?:string;limit?:number}={}){
 const clauses:string[]=[];const values:(string|number)[]=[];if(!options.admin)clauses.push("status='published'");else if(options.status){clauses.push('status=?');values.push(options.status)}
 if(options.q){clauses.push("(title LIKE ? ESCAPE '\\' OR excerpt LIKE ? ESCAPE '\\')");const term=`%${options.q.replace(/[\\%_]/g,'\\$&')}%`;values.push(term,term)}
 try{const rows=await db.prepare(`SELECT * FROM pages ${clauses.length?'WHERE '+clauses.join(' AND '):''} ORDER BY COALESCE(published_at,updated_at) DESC,id DESC LIMIT ?`).bind(...values,options.limit||100).all<Row>();return rows.results.map(toPage);}catch(error){if(String(error).toLowerCase().includes('no such table')&&String(error).toLowerCase().includes('pages'))return [];throw error;}
}
export async function resolvePagePath(db:D1Database,path:string){const value=path.replace(/^\//,'').replace(/\/$/,'');if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))return null;return getPage(db,value,true,true);}
export async function resolvePostPath(db:D1Database,path:string,settings:Settings){
 for(const format of settings.permalinkFormats){
  const match=matchPostPath(path,{...settings,permalinkFormats:[format]});
  if(!match)continue;
  const post=await getPost(db,match.id||match.slug||'',!match.id,true);
  if(post&&matchesPublishedPath(path,post,settings,format))return post;
 }
 return null;
}
export async function featuredPost(db:D1Database){const row=await db.prepare(`${select} WHERE p.status='published' AND p.featured=1 ORDER BY p.updated_at DESC,p.id DESC LIMIT 1`).first<Row>();return row?toPost(row):null;}
export async function videoCount(db:D1Database){return (await db.prepare("SELECT COUNT(*) total FROM posts WHERE status='published' AND video_id<>''").first<{total:number}>())?.total||0;}
export async function articleTags(db:D1Database){
 const rows=await db.prepare("SELECT MIN(t.value) name,COUNT(DISTINCT p.id) count FROM posts p,json_each(p.tags) t WHERE p.status<>'trash' AND t.type='text' AND length(trim(t.value)) BETWEEN 1 AND 30 GROUP BY lower(t.value) ORDER BY count DESC,name COLLATE NOCASE LIMIT 100").all<{name:string;count:number}>();
 return rows.results;
}
export type ListOptions={status?:string;category?:string;categories?:string[];kind?:string;q?:string;tag?:string;cursor?:string;limit?:number;admin?:boolean};
export async function listPosts(db:D1Database,options:ListOptions={}){
 const limit=options.limit||12;const clauses:string[]=[];const values:(string|number)[]=[];
 if(options.admin){if(options.status){clauses.push('p.status=?');values.push(options.status);}}else{clauses.push("p.status='published'");}
 if(options.category){clauses.push('(c.slug=? OR c.id=?)');values.push(options.category,options.category);}
 if(options.categories?.length){const selected=[...new Set(options.categories)].slice(0,12);clauses.push(`c.slug IN (${selected.map(()=>'?').join(',')})`);values.push(...selected);}
 if(options.kind==='video')clauses.push("p.video_id<>''");
 if(options.kind==='article')clauses.push("p.body<>''");
 if(options.kind==='text')clauses.push("p.video_id='' AND p.body<>''");
 if(options.tag){clauses.push('EXISTS(SELECT 1 FROM json_each(p.tags) tag WHERE lower(tag.value)=lower(?))');values.push(options.tag);}
 if(options.q){clauses.push("(p.title LIKE ? ESCAPE '\\' OR p.excerpt LIKE ? ESCAPE '\\')");const term=`%${options.q.replace(/[\\%_]/g,'\\$&')}%`;values.push(term,term);}
 if(options.cursor){let c:unknown;try{c=JSON.parse(atob(options.cursor));}catch{throw new ApiError(400,'CURSOR','分页游标无效');}if(!Array.isArray(c)||c.length!==2||c.some(v=>typeof v!=='string'||v.length>100))throw new ApiError(400,'CURSOR','分页游标无效');clauses.push("(COALESCE(p.published_at,p.created_at),p.id)<(?,?)");values.push(c[0],c[1]);}
 const rows=await db.prepare(`${select} ${clauses.length?'WHERE '+clauses.join(' AND '):''} ORDER BY COALESCE(p.published_at,p.created_at) DESC,p.id DESC LIMIT ?`).bind(...values,limit+1).all<Row>();
 const items=rows.results.slice(0,limit).map(toPost);const last=items.at(-1);return {items,nextCursor:rows.results.length>limit&&last?btoa(JSON.stringify([last.publishedAt||last.createdAt,last.id])):null};
}
export async function categories(db:D1Database,includeTrash=false):Promise<Category[]>{const rows=await db.prepare(`SELECT c.id,c.name,c.slug,c.description,c.icon,c.version,c.deleted_at deletedAt,COUNT(p.id) count FROM categories c LEFT JOIN posts p ON c.id=p.category_id AND p.status='published' ${includeTrash?'':'WHERE c.deleted_at IS NULL'} GROUP BY c.id ORDER BY c.rowid`).all<Category>();return rows.results;}
const defaultSettings={adminPath:'/admin',title:'YaChin科技生活',tagline:'连接世界的科技频道',description:'分享海外账户、虚拟卡、eSIM 和 AI 工具的实用教程。',logo:'/images/yachin-mark.svg',socialFollowText:'关注YaChin科技生活 ↗',headerNav:[],youtube:'',telegram:'',bilibili:'',twitter:'',notice:'',articleDesign:{},aboutDesign:{}};
export async function siteSettings(db:D1Database){
 const row=await db.prepare('SELECT value,version FROM settings WHERE id=1').first<{value:string;version:number}>();
 if(!row)throw new Error('Missing settings');
 const stored=JSON.parse(row.value);
 const legacy={...defaultSettings,...stored};
 // Existing sites inherit their own branding until they save an about-page design.
 const value=settingsInput.parse({...legacy,aboutDesign:stored.aboutDesign??{eyebrow:'ABOUT',title:'关于',lead:legacy.tagline,body:legacy.description}});
 return {value,version:row.version};
}

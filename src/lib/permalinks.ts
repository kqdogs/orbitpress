import type { Post, Settings } from './schema';
type Format=Settings['permalinkFormats'][number];
export const permalinkPresets: {value:Format;label:string;template:string}[]=[
 {value:'postname',label:'文章名',template:'/%postname%/'},
 {value:'day',label:'日期与文章名',template:'/%year%/%monthnum%/%day%/%postname%/'},
 {value:'month',label:'月份与文章名',template:'/%year%/%monthnum%/%postname%/'},
 {value:'numeric',label:'数字 / ID',template:'/archives/%post_id%/'},
 {value:'plain',label:'朴素',template:'/?p=%post_id%'},
 {value:'post',label:'文章前缀',template:'/post/%postname%/'},
 {value:'category',label:'分类与文章名',template:'/%category%/%postname%/'},
 {value:'custom',label:'自定义结构',template:''},
];
export function permalinkTemplate(settings:Settings,format:Format=settings.permalinkFormats[0]) {
 return format==='custom'?settings.permalinkCustom:permalinkPresets.find(item=>item.value===format)!.template;
}
export function acceptsPlainPermalink(settings:Settings) {
 return settings.permalinkFormats.some(format=>permalinkTemplate(settings,format)==='/?p=%post_id%');
}
export function postPath(post:Pick<Post,'id'|'slug'|'categorySlug'|'publishedAt'|'createdAt'>,settings:Settings,format:Format=settings.permalinkFormats[0]) {
 const date=(post.publishedAt||post.createdAt).slice(0,10).split('-');
 const tokens:Record<string,string>={'%postname%':post.slug,'%post_id%':post.id,'%category%':post.categorySlug||'uncategorized','%year%':date[0]||'1970','%monthnum%':date[1]||'01','%day%':date[2]||'01'};
 return permalinkTemplate(settings,format).replace(/%[^%]+%/g,token=>encodeURIComponent(tokens[token]));
}
function escape(value:string){return value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
export function matchPostPath(path:string,settings:Settings): {format:Format;slug?:string;id?:string}|null {
 for(const format of settings.permalinkFormats){
  if(permalinkTemplate(settings,format).includes('?'))continue;
  const fields:string[]=[];
  const template=permalinkTemplate(settings,format).replace(/^\//,'').replace(/\/$/,'');
  const pattern=template.split(/(%[^%]+%)/).map(part=>{
   if(part.startsWith('%')){fields.push(part);return '([^/]+)';}return escape(part);
  }).join('');
  const match=path.replace(/^\//,'').replace(/\/$/,'').match(new RegExp(`^${pattern}$`));
  if(!match)continue;
  try {
   const values=Object.fromEntries(fields.map((field,index)=>[field,decodeURIComponent(match[index+1])]));
   const slug=values['%postname%'],id=values['%post_id%'];
   if((slug&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))||(id&&!/^[a-zA-Z0-9-]{1,80}$/.test(id)))continue;
   return {format,slug,id};
  } catch {return null;}
 }
 return null;
}
export function matchesPublishedPath(path:string,post:Post,settings:Settings,format:Format){
 return path.replace(/\/$/,'')===postPath(post,settings,format).replace(/\/$/,'');
}
/** Redirect accepted article aliases to the current primary URL. Pages never call this. */
export function canonicalPostLocation(url:URL,post:Parameters<typeof postPath>[0],settings:Settings):string|null {
 const target=new URL(postPath(post,settings),url.origin);
 for(const [key,value] of url.searchParams)if(key!=='p')target.searchParams.append(key,value);
 if(url.pathname===target.pathname&&url.searchParams.get('p')===target.searchParams.get('p'))return null;
 return target.pathname+target.search;
}

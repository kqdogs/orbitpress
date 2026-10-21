import {parseDocument,DomUtils} from 'htmlparser2';
import {ApiError} from './http';
import {createImportReader,publicImportUrl,type RemoteKind} from './import-network';
import {discoverResponse} from './import-contract';

const text=(value:string)=>DomUtils.textContent(parseDocument(value)).replace(/\s+/g,' ').trim().slice(0,300);
const sameSite=(a:URL,b:URL)=>a.hostname.replace(/^www\./,'')===b.hostname.replace(/^www\./,'');
const excluded=/\/(?:wp-admin|wp-json|wp-login\.php|admin|api|category|categories|tag|tags|author|authors|search|feed|page)(?:\/|$)|\.(?:png|jpe?g|webp|gif|svg|ico|pdf|zip|xml|json|css|js|txt)$/i;

export function sourceHome(input:string){
 const url=publicImportUrl(input);if(url.search)throw new ApiError(400,'IMPORT_URL','请输入站点首页或博客首页地址');
 if(!url.pathname.endsWith('/'))url.pathname+='/';return url;
}

/** Standards first, bounded HTML heuristics last; no source-specific domain list. */
export async function discoverArticles(input:string,page=1){
 const home=sourceHome(input);if(!Number.isInteger(page)||page<1||page>100)throw new ApiError(400,'IMPORT_URL','目录页码无效');
 const signal=AbortSignal.timeout(24000),read=createImportReader(signal);
 try{
  // WordPress can expose a directory even when its theme has no feed/sitemap links.
  try{
   const endpoint=new URL('wp-json/wp/v2/posts',home);endpoint.search=`?per_page=20&page=${page}&_fields=link,title`;
   const response=await read(endpoint.href,'json');const rows:unknown=JSON.parse(new TextDecoder().decode(response.bytes));
   if(Array.isArray(rows)&&rows.length<=20&&rows.every(row=>row&&typeof row.link==='string'&&typeof row.title?.rendered==='string')){
    const seen=new Set<string>(),items:{url:string;title:string}[]=[];
    for(const row of rows){try{const url=publicImportUrl(row.link);if(!sameSite(url,home)||excluded.test(url.pathname)||seen.has(url.href))continue;seen.add(url.href);items.push({url:url.href,title:text(row.title.rendered)||'未命名文章'});}catch{/* Skip invalid entries, never fetch them. */}}
    return discoverResponse.parse({items,nextPage:page<Math.min(100,response.pages)?page+1:null});
   }
  }catch(error){if(signal.aborted||error instanceof ApiError&&['IMPORT_URL','IMPORT_DNS','IMPORT_NETWORK'].includes(error.code))throw error;}
  const response=await read(home.href);const base=publicImportUrl(response.url),html=new TextDecoder().decode(response.bytes);
  const doc=parseDocument(html);const items=new Map<string,{url:string;title:string}>();
  const queue:{url:string;kind:RemoteKind}[]=[],visited=new Set<string>();let documents=1;
  function add(href:string,title=''){
   if(items.size>=100)return;
   try{
    const url=publicImportUrl(new URL(href,base).href);
    if(!sameSite(url,base)||url.pathname==='/'&&!url.searchParams.has('p')||url.pathname===base.pathname&&!url.searchParams.has('p')||excluded.test(url.pathname))return;
    for(const key of [...url.searchParams.keys()])if(key.startsWith('utm_')||['fbclid','gclid'].includes(key))url.searchParams.delete(key);
    const fallback=decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1)||'文章').replace(/\.html?$/,'').replace(/[-_]/g,' ');
    const entry={url:url.href,title:text(title)||fallback.slice(0,300)||'未命名文章'};
    if(!items.has(url.href)||title.trim())items.set(url.href,entry);
   }catch{/* Invalid or off-site links are data, never network requests. */}
  }
  function enqueue(href:string,kind:RemoteKind){
   try{const url=publicImportUrl(new URL(href,base).href);if(!sameSite(url,base)||visited.has(url.href)||queue.some(item=>item.url===url.href)||queue.length>=16)return;queue.push({url:url.href,kind});}catch{/* Ignore invalid discovery hints. */}
  }
  function links(source:string,address:string){
   const document=parseDocument(source);
   const anchors=DomUtils.findAll(node=>node.name==='a'&&!!node.attribs.href,document.children);
   for(const node of anchors){
    let semantic=false,skip=false;
    for(let parent=node.parent;parent;parent=parent.parent){if('attribs' in parent){if(['nav','footer','aside'].includes(parent.name)||parent.name==='header'&&/(?:site-header|masthead)/.test(parent.attribs.class||'')){skip=true;break;}if(parent.name==='article'||/^h[1-6]$/.test(parent.name)||/(?:post|entry|article)[-_ ](?:title|header|item|card)|(?:^|\s)(?:post|h-entry)(?:\s|$)/.test(parent.attribs.class||''))semantic=true;}}
    try{
     if(!skip&&(semantic||(node.attribs.rel||'').split(/\s+/).includes('bookmark')))add(new URL(node.attribs.href,address).href,DomUtils.textContent(node));
     if((node.attribs.rel||'').split(/\s+/).includes('next')||/(?:^|\s)(?:next|next-page)(?:\s|$)/.test(node.attribs.class||''))enqueue(new URL(node.attribs.href,address).href,'html');
    }catch{/* A malformed HTML link cannot abort the listing. */}
   }
  }
  // Feeds retain real titles and work for WordPress, Ghost, Hexo, Hugo, Jekyll, Astro, etc.
  for(const node of DomUtils.findAll(node=>node.name==='link'&&!!node.attribs.href,doc.children)){
   if(/(?:rss|atom)\+xml/.test(node.attribs.type||''))enqueue(node.attribs.href,'xml');
   if((node.attribs.rel||'').includes('sitemap'))enqueue(node.attribs.href,'xml');
  }
  enqueue('feed/','xml');enqueue('rss.xml','xml');enqueue('atom.xml','xml');enqueue('sitemap.xml','xml');enqueue('sitemap_index.xml','xml');
  // Homepage links are appended after feed/sitemap titles.
  const listings:{html:string;url:string}[]=[{html,url:base.href}];
  while(queue.length&&documents<12&&items.size<100){
   const target=queue.shift()!;if(visited.has(target.url))continue;visited.add(target.url);documents++;
   try{
    const result=await read(target.url,target.kind);const source=new TextDecoder().decode(result.bytes);
    if(target.kind==='html'){listings.push({html:source,url:result.url});links(source,result.url);continue;}
    const xml=parseDocument(source,{xmlMode:true,decodeEntities:true});
    const entries=DomUtils.findAll(node=>['item','entry'].includes(node.name),xml.children);
    for(const entry of entries){
     const title=DomUtils.findOne(node=>node.name==='title',entry.children);
     const link=DomUtils.findOne(node=>node.name==='link'&&(!node.attribs.rel||node.attribs.rel==='alternate'),entry.children);
     const href=link&&(link.attribs.href||DomUtils.textContent(link));if(href)add(new URL(href,result.url).href,title?DomUtils.textContent(title):'');
    }
    for(const node of DomUtils.findAll(node=>node.name==='url',xml.children)){const loc=DomUtils.findOne(node=>node.name==='loc',node.children);if(loc)add(DomUtils.textContent(loc));}
    for(const node of DomUtils.findAll(node=>node.name==='sitemap',xml.children)){const loc=DomUtils.findOne(node=>node.name==='loc',node.children);if(loc)enqueue(DomUtils.textContent(loc),'xml');}
   }catch(error){if(signal.aborted)throw error;/* Optional discovery methods may be absent. */}
  }
  for(const listing of listings)links(listing.html,listing.url);
  // Follow visible pagination only within the remaining document budget.
  while(queue.length&&documents<12&&items.size<100){const target=queue.shift()!;if(target.kind!=='html'||visited.has(target.url))continue;visited.add(target.url);documents++;try{const result=await read(target.url);links(new TextDecoder().decode(result.bytes),result.url);}catch(error){if(signal.aborted)throw error;}}
  if(!items.size)throw new ApiError(422,'IMPORT_DIRECTORY','没有找到公开文章目录，可改用单篇文章采集；需要登录或仅脚本渲染的站点无法直接读取');
  const rows=[...items.values()],offset=(page-1)*20;
  return discoverResponse.parse({items:rows.slice(offset,offset+20),nextPage:offset+20<rows.length?page+1:null});
 }catch(error){if(error instanceof ApiError)throw error;throw new ApiError(signal.aborted?504:502,signal.aborted?'IMPORT_TIMEOUT':'IMPORT_SOURCE','文章目录读取失败，请检查站点地址或稍后重试');}
}

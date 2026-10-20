import {parseDocument,DomUtils} from 'htmlparser2';
import {ApiError} from './http';
import {videoDirective} from '../components/studio/video';
import {importResponse,discoverResponse} from './import-contract';
import {MAX_HIGHLIGHTS,uniqueTerms} from './article-metadata';
export {importRequest} from './import-contract';

type HtmlNode=ReturnType<typeof parseDocument>['children'][number];
type HtmlElement=Extract<HtmlNode,{attribs:Record<string,string>}>;
const element=(node:HtmlNode):node is HtmlElement=>'attribs' in node;
const hasClass=(node:HtmlElement,value:string)=>(node.attribs.class||'').split(/\s+/).includes(value);

/** Egress is restricted to one known public origin; redirects are checked again. */
export function sourceUrl(input:string,asset=false) {
 let url:URL;try{url=new URL(input);}catch{throw new ApiError(400,'IMPORT_URL','文章地址无效');}
 if(url.origin!=='https://rinfinity.net'||url.username||url.password||url.port||url.search||url.hash||/[\\\u0000-\u0020\u007f]/.test(input))throw new ApiError(400,'IMPORT_URL','仅支持 rinfinity.net 的 HTTPS 文章地址');
 let path:string;try{path=decodeURIComponent(url.pathname);}catch{throw new ApiError(400,'IMPORT_URL','地址编码无效');}
 const allowed=asset?/^\/wp-content\/uploads\/(?:[\w.-]+\/)*[\w.-]+\.(?:png|jpe?g|webp)$/i.test(path):/^\/[^/.?#]+\/?$/.test(path)&&!/^\/(?:wp-|(?:api|admin|category|tag|author|feed|about|search|videos|tutorials)(?:[/-]|$))/i.test(path);
 if(!allowed)throw new ApiError(400,'IMPORT_URL',asset?'图片必须来自原站 uploads 目录':'请填写单篇文章地址');
 return url;
}

function directoryUrl(input:string){
 const url=new URL(input);
 if(url.origin!=='https://rinfinity.net'||url.username||url.password||url.hash||url.pathname!=='/wp-json/wp/v2/posts'||!/^\?per_page=20&page=[1-9]\d{0,2}&_fields=link,title$/.test(url.search))throw new ApiError(400,'IMPORT_URL','文章目录地址无效');
 return url;
}
export function sourceHome(input:string){
 let url:URL;try{url=new URL(input);}catch{throw new ApiError(400,'IMPORT_URL','站点地址无效');}
 if(url.origin!=='https://rinfinity.net'||url.username||url.password||url.port||url.pathname!=='/'||url.search||url.hash||/[\\\u0000-\u0020\u007f]/.test(input))throw new ApiError(400,'IMPORT_URL','请填写当前支持来源站的 HTTPS 首页地址');
 return url;
}
async function readRemote(input:string,signal:AbortSignal,asset=false,directory=false):Promise<{bytes:Uint8Array<ArrayBuffer>;type:string;pages:number}> {
 const validate=(value:string)=>directory?directoryUrl(value):sourceUrl(value,asset);
 let url=validate(input);
 for(let hop=0;hop<4;hop++){
  const response=await fetch(url,{redirect:'manual',signal,headers:{Accept:directory?'application/json':asset?'image/png,image/jpeg,image/webp':'text/html','User-Agent':'OrbitPress-Article-Import/1.0'}});
  if(response.status>=300&&response.status<400){
   await response.body?.cancel();
   const location=response.headers.get('location');if(!location)break;
   url=validate(new URL(location,url).href);continue;
  }
  if(!response.ok){await response.body?.cancel();throw new ApiError(502,'IMPORT_SOURCE','来源站暂时无法读取，请稍后重试');}
  const type=(response.headers.get('content-type')||'').split(';')[0];
  if(directory?type!=='application/json':asset?!['image/png','image/jpeg','image/webp'].includes(type):type!=='text/html'){await response.body?.cancel();throw new ApiError(422,'IMPORT_TYPE','来源返回的格式不受支持');}
  const limit=asset?5*1024*1024:2*1024*1024;
  if(Number(response.headers.get('content-length'))>limit){await response.body?.cancel();throw new ApiError(413,'IMPORT_SIZE','来源文件过大');}
  const reader=response.body?.getReader();if(!reader)throw new ApiError(422,'IMPORT_EMPTY','来源没有返回内容');
  const parts:Uint8Array[]=[];let size=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new ApiError(413,'IMPORT_SIZE','来源文件过大');}parts.push(value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  return {bytes,type,pages:Number(response.headers.get('x-wp-totalpages'))||1};
 }
 throw new ApiError(502,'IMPORT_REDIRECT','来源重定向过多');
}

/** Only a generated public WordPress listing on the existing allowed origin is fetched. */
export async function discoverArticles(input:string,page=1){
 const home=sourceHome(input);if(!Number.isInteger(page)||page<1||page>100)throw new ApiError(400,'IMPORT_URL','目录页码无效');
 const signal=AbortSignal.timeout(24000);
 try{
  const response=await readRemote(`${home.origin}/wp-json/wp/v2/posts?per_page=20&page=${page}&_fields=link,title`,signal,false,true);
  let rows:unknown;try{rows=JSON.parse(new TextDecoder().decode(response.bytes));}catch{throw new ApiError(422,'IMPORT_DIRECTORY','来源文章目录格式无效');}
  if(!Array.isArray(rows)||rows.length>20)throw new ApiError(422,'IMPORT_DIRECTORY','来源文章目录格式无效');
  const seen=new Set<string>();const items:{url:string;title:string}[]=[];
  for(const row of rows){
   if(!row||typeof row.link!=='string'||typeof row.title?.rendered!=='string')throw new ApiError(422,'IMPORT_DIRECTORY','来源文章条目格式无效');
   let url:string;try{url=sourceUrl(row.link).href;}catch{continue;}
   if(seen.has(url))continue;seen.add(url);
   const title=DomUtils.textContent(parseDocument(row.title.rendered)).replace(/\s+/g,' ').trim().slice(0,300)||'未命名文章';
   items.push({url,title});
  }
  return discoverResponse.parse({items,nextPage:page<Math.min(100,response.pages)?page+1:null});
 }catch(error){if(error instanceof ApiError)throw error;throw new ApiError(signal.aborted?504:502,signal.aborted?'IMPORT_TIMEOUT':'IMPORT_SOURCE','文章目录读取失败，请稍后重试');}
}

const escapeMarkdown=(value:string)=>value.replace(/([\\`*_[\]<>])/g,'\\$1');
function linkUrl(value:string,base:string){try{const url=new URL(value,base);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:'';}catch{return '';}}

/** Parse data only. No source scripts, styles, menus, author branding or forms execute. */
export function parseArticle(html:string,url:string) {
 sourceUrl(url);
 const document=parseDocument(html,{decodeEntities:true});
 const nodes=document.children;
 const root=DomUtils.findOne(node=>['entry-content','article-content','post-content','article-body'].some(c=>hasClass(node,c))||node.attribs.itemprop==='articleBody',nodes)||DomUtils.findOne(node=>node.name==='article',nodes);
 if(!root)throw new ApiError(422,'IMPORT_ARTICLE','没有找到文章正文，请确认是文章页面');
 let article=root;
 for(let parent=root.parent;parent;parent=parent.parent){if('attribs' in parent&&(parent.name==='article'||hasClass(parent,'post-single'))){article=parent;break;}}
 const heading=DomUtils.findOne(node=>node.name==='h1',article.children)
  ||DomUtils.findOne(node=>node.name==='h1'&&!hasClass(node,'site--title')&&!hasClass(node,'site-title'),nodes);
 const headingText=(heading?DomUtils.textContent(heading):'').replace(/\s+/g,' ').trim();
 const titleParts=headingText.split(/｜|\s+\|\s+/).map(value=>value.trim()).filter(Boolean);
 const title=titleParts[0]||'';
 const highlights=uniqueTerms(titleParts.slice(1),MAX_HIGHLIGHTS,40);
 if(!title||title.length>180)throw new ApiError(422,'IMPORT_TITLE','无法识别有效的文章标题');
 const meta=(key:string)=>DomUtils.findOne(node=>node.name==='meta'&&(node.attribs.property===key||node.attribs.name===key),nodes)?.attribs.content||'';
 const pictures=new Map<string,{token:string;alt:string}>();
 const literals:string[]=[];
 const warnings:string[]=[];
 if(highlights.length<titleParts.length-1)warnings.push('部分文章亮点超过本站数量或长度限制，请在编辑器中检查补充。');
 function imageSource(node:HtmlElement):string {
  const a=node.attribs;
  const srcset=(value:string)=>value.split(',').map(item=>item.trim().split(/\s+/)).filter(item=>item[0]).sort((a,b)=>parseFloat(b[1]||'1')-parseFloat(a[1]||'1')).map(item=>item[0]);
  const pictureSources=node.parent&&element(node.parent)&&node.parent.name==='picture'
   ?node.parent.children.filter(element).filter(n=>n.name==='source').flatMap(n=>srcset(n.attribs['data-srcset']||n.attribs.srcset||'')):[];
  return [a['data-src'],a['data-lazy-src'],a['data-original'],...srcset(a['data-srcset']||a.srcset||''),...pictureSources,a.src].map(value=>value?linkUrl(value,url):'').find(Boolean)||'';
 }
 const thumbnail=DomUtils.findOne(node=>node.name==='img'&&hasClass(node,'wp-post-image'),article.children);
 const coverCandidate=meta('og:image')||meta('twitter:image')||(thumbnail?imageSource(thumbnail):'');
 const cover=coverCandidate?linkUrl(coverCandidate,url):'';
 const tagValues=[
  ...DomUtils.findAll(node=>node.name==='meta'&&(node.attribs.property==='article:tag'||node.attribs.name==='article:tag'),nodes).map(node=>node.attribs.content||''),
  ...DomUtils.findAll(node=>node.name==='a'&&(node.attribs.rel||'').split(/\s+/).includes('tag')&&!(node.attribs.rel||'').split(/\s+/).includes('category'),article.children).map(node=>DomUtils.textContent(node)),
  ...DomUtils.findAll(node=>['tags','post-tags','entry-tags'].some(c=>hasClass(node,c)),article.children).flatMap(node=>DomUtils.findAll(child=>child.name==='a',node.children)).map(node=>DomUtils.textContent(node)),
  ...meta('keywords').split(/[,，]/)
 ].map(value=>value.replace(/\s+/g,' ').trim()).filter(Boolean);
 const tags:string[]=[];
 for(const tag of tagValues){
  if(tags.some(value=>value.toLocaleLowerCase()===tag.toLocaleLowerCase()))continue;
  if(tag.length>30||tags.length>=8){if(!warnings.includes('部分标签超过本站数量或长度限制，请在编辑器中检查补充。'))warnings.push('部分标签超过本站数量或长度限制，请在编辑器中检查补充。');continue;}
  tags.push(tag);
 }
 let videoId='';
 function literal(value:string){const index=literals.push(value)-1;return `\n\n@@ORBITPRESS_LITERAL_${index}@@\n\n`;}
 function picture(src:string,alt:string){
  const address=linkUrl(src,url);if(!address)return '';
  if(!pictures.has(address))pictures.set(address,{token:`ORBITPRESS_IMAGE_${pictures.size}`,alt:alt.slice(0,160)});
  const image=pictures.get(address)!;return `![${escapeMarkdown(image.alt)}](${image.token})`;
 }
 // The cover is fetched first, so long articles cannot exhaust the image budget before it.
 if(cover)picture(cover,'文章封面');
 function render(node:HtmlNode,depth=0):string {
  if(depth>80)return '';
  if(node.type==='text')return escapeMarkdown(node.data.replace(/\s+/g,' '));
  if(!element(node))return '';
  const tag=node.name,a=node.attribs;
  if(['script','style','noscript','nav','footer','aside','form','button','svg','template','h1'].includes(tag)||['author-box','post-bottom','related-posts','wp-block-post-author','rinfinity-video-player','rinfinity-video-watch-link'].some(c=>hasClass(node,c)))return '';
  if(tag==='pre'){
   const code=DomUtils.findOne(n=>n.name==='code',node.children)||node;
   const text=DomUtils.textContent(code).replace(/\r\n/g,'\n');
   const language=(code.attribs.class||a.class||'').match(/(?:language|lang)-([^\s]+)/)?.[1]||a['data-language']||'text';
   const fence='`'.repeat(Math.max(3,...(text.match(/`+/g)||[]).map(x=>x.length+1)));
   return literal(`${fence}${language.replace(/[\s`]/g,'').slice(0,80)}\n${text}\n${fence}`);
  }
  const ownVideo=a['data-youtube-id']||a['data-video-id'];
  if(ownVideo&&/^[A-Za-z0-9_-]{11}$/.test(ownVideo)){
   const directive=videoId?`\n\n:::youtube ${ownVideo}\n\n`:'';if(!videoId)videoId=ownVideo;
   return directive+node.children.map(child=>render(child,depth+1)).join('');
  }
  if(tag==='iframe'){
   const address=linkUrl(a.src||'',url);if(!address)return '';
   try{const provider=new URL(address).hostname.endsWith('bilibili.com')?'bilibili':'youtube';const directive=videoDirective(provider,address);if(provider==='youtube'&&!videoId){videoId=directive.split(' ')[1];return '';}return '\n\n'+directive+'\n\n';}catch{return '';}
  }
  if(tag==='img'){
   const src=imageSource(node);
   return cover&&linkUrl(src,url)===cover?'':picture(src,a.alt||'文章图片');
  }
  if(tag==='br')return '\n';
  if(tag==='hr')return '\n\n---\n\n';
  if(tag==='code'){const text=DomUtils.textContent(node);const fence='`'.repeat(Math.max(1,...(text.match(/`+/g)||[]).map(x=>x.length+1)));return `${fence} ${text} ${fence}`;}
  const children=()=>node.children.map(child=>render(child,depth+1)).join('');
  if(tag==='a'){const text=children().trim(),href=linkUrl(a.href||'',url);return href?`[${text||escapeMarkdown(href)}](<${href}>)`:text;}
  if(/^h[2-6]$/.test(tag))return `\n\n${'#'.repeat(Number(tag[1]))} ${children().trim()}\n\n`;
  if(tag==='strong'||tag==='b')return `**${children().trim()}**`;
  if(tag==='em'||tag==='i')return `*${children().trim()}*`;
  if(tag==='del'||tag==='s')return `~~${children().trim()}~~`;
  if(tag==='blockquote')return '\n\n'+children().trim().split('\n').map(line=>'> '+line).join('\n')+'\n\n';
  if(tag==='ul'||tag==='ol')return '\n\n'+node.children.filter(element).filter(child=>child.name==='li').map((item,index)=>{
   const value=item.children.map(c=>render(c,depth+1)).join('').trim().split('\n');return (tag==='ol'?`${index+1}. `:'- ')+value[0]+value.slice(1).map(line=>'\n    '+line).join('');
  }).join('\n')+'\n\n';
  if(tag==='table'){
   const rows=DomUtils.findAll(n=>n.name==='tr',node.children).map(row=>row.children.filter(element).filter(c=>['th','td'].includes(c.name)).map(cell=>cell.children.map(c=>render(c,depth+1)).join('').trim().replace(/\|/g,'\\|').replace(/\n/g,' ')));
   if(!rows.length)return '';const width=Math.max(...rows.map(row=>row.length));const line=(row:string[])=>'| '+Array.from({length:width},(_,i)=>row[i]||'').join(' | ')+' |';
   return '\n\n'+[line(rows[0]),line(Array(width).fill('---')),...rows.slice(1).map(line)].join('\n')+'\n\n';
  }
  const content=children();return ['p','div','section','figure','figcaption','article'].includes(tag)?`\n\n${content.trim()}\n\n`:content;
 }
 let body=render(root).replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
 body=body.replace(/@@ORBITPRESS_LITERAL_(\d+)@@/g,(_,index)=>literals[Number(index)]);
 if(body.length<30&&!videoId)throw new ApiError(422,'IMPORT_ARTICLE','正文内容太少，未填充草稿');
 body+=`\n\n---\n\n来源：[${escapeMarkdown(title)}](<${url}>)\n`;
 if(body.length>100000)throw new ApiError(413,'IMPORT_SIZE','文章超过 100000 字符，无法完整导入');
 // Internal slug only. Public URLs are always generated by the site's permalink settings.
 return {article:{title,slug:'import-'+crypto.randomUUID(),excerpt:meta('description').slice(0,500),body,cover:'',videoId,featured:false,tags,highlights},pictures,cover,warnings};
}

export async function importArticle(input:string,env:Pick<Env,'MEDIA'|'DB'>) {
 const url=sourceUrl(input).href;
 const signal=AbortSignal.timeout(24000);
 try {
  const response=await readRemote(url,signal);
  const parsed=parseArticle(new TextDecoder().decode(response.bytes),url);
  let total=0,index=0;
  // Bounded to 16 images / 24MB. Failed images never become remote hotlinks.
  for(const [src,image] of parsed.pictures){
   let local='';
   try {
    if(index++>=16||total>=24*1024*1024)throw new Error('limit');
    const remote=await readRemote(src,signal,true);total+=remote.bytes.length;
    if(total>24*1024*1024)throw new Error('limit');
    const b=remote.bytes;
    const ext=[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v)?'png':b[0]===255&&b[1]===216&&b[2]===255?'jpg':new TextDecoder().decode(b.slice(0,4))==='RIFF'&&new TextDecoder().decode(b.slice(8,12))==='WEBP'?'webp':'';
    const mime=ext==='jpg'?'image/jpeg':`image/${ext}`;
    if(!ext||mime!==remote.type)throw new Error('type');
    const digest=await crypto.subtle.digest('SHA-256',b);
    const id='import-'+Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('')+'.'+ext;
    await env.MEDIA.put(id,b,{httpMetadata:{contentType:mime}});
    await env.DB.prepare('INSERT OR IGNORE INTO media(id,name,mime,size,created_at) VALUES(?,?,?,?,?)').bind(id,'采集图片-'+id.slice(7,19)+'.'+ext,mime,b.length,new Date().toISOString()).run();
    local='/media/'+id;
   } catch(error) {
    if(signal.aborted)throw error;
    if(parsed.warnings.length<30)parsed.warnings.push(`“${image.alt}”未下载到本站（来源限制、大小或格式），请重试或手动上传。`);
   }
   parsed.article.body=parsed.article.body.replaceAll(`![${escapeMarkdown(image.alt)}](${image.token})`,local?`![${escapeMarkdown(image.alt)}](${local})`:`（图片未下载：${escapeMarkdown(image.alt)}，请手动上传）`);
   if(src===new URL(parsed.cover||'/',url).href)parsed.article.cover=local;
  }
  return importResponse.parse({article:parsed.article,sourceUrl:url,warnings:parsed.warnings});
 } catch(error) {
  if(error instanceof ApiError)throw error;
  if(signal.aborted)throw new ApiError(504,'IMPORT_TIMEOUT','采集超时，请稍后重试；已有草稿不会被覆盖');
  throw new ApiError(502,'IMPORT_SOURCE','采集失败，来源站或图片存储暂时不可用');
 }
}

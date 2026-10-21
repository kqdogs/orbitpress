import {parseDocument,DomUtils} from 'htmlparser2';
type Nodes=ReturnType<typeof parseDocument>['children'];

export function articleMetadata(nodes:Nodes){
 const meta=(key:string)=>DomUtils.findOne(node=>node.name==='meta'&&[node.attribs.property,node.attribs.name].includes(key),nodes)?.attribs.content||'';
 const records:Record<string,unknown>[]=[];
 function visit(value:unknown,depth=0){
  if(depth>8||!value||typeof value!=='object')return;
  if(Array.isArray(value)){for(const item of value.slice(0,100))visit(item,depth+1);return;}
  const row=value as Record<string,unknown>;
  if([row['@type']].flat().some(type=>typeof type==='string'&&/^(?:BlogPosting|Article|NewsArticle|TechArticle|ScholarlyArticle)$/.test(type)))records.push(row);
  if(row['@graph'])visit(row['@graph'],depth+1);if(row.mainEntity)visit(row.mainEntity,depth+1);
 }
 for(const node of DomUtils.findAll(node=>node.name==='script'&&node.attribs.type==='application/ld+json',nodes).slice(0,20)){
  try{visit(JSON.parse(DomUtils.textContent(node)));}catch{/* Invalid structured metadata cannot block HTML extraction. */}
 }
 const record=records[0]||{};
 const string=(key:string)=>typeof record[key]==='string'?record[key] as string:'';
 const image=[record.image].flat()[0];
 const imageUrl=typeof image==='string'?image:image&&typeof image==='object'&&'url' in image&&typeof image.url==='string'?image.url:'';
 const keywordValue=record.keywords;const keywords=Array.isArray(keywordValue)?keywordValue.filter((v):v is string=>typeof v==='string'):typeof keywordValue==='string'?keywordValue.split(/[,，]/):[];
 return {meta,title:string('headline')||string('name')||meta('og:title')||meta('twitter:title'),description:string('description')||meta('description')||meta('og:description'),image:imageUrl,keywords,body:string('articleBody')};
}

export function articleRoot(nodes:Nodes){
 const classes=['entry-content','article-content','article-body','article-entry','post-content','post-body','post__content','gh-content','markdown-body','blog-post-content','blog-content','theme-default-content','prose'];
 const candidates=DomUtils.findAll(node=>['article','main'].includes(node.name)||node.attribs.itemprop==='articleBody'||classes.some(value=>(node.attribs.class||'').split(/\s+/).includes(value)),nodes).slice(0,200);
 let best:typeof candidates[number]|undefined,bestScore=-1;
 for(const node of candidates){
  let excluded=false;
  for(let parent=node.parent;parent;parent=parent.parent){if('name' in parent&&['nav','footer','aside'].includes(parent.name)){excluded=true;break;}}
  if(excluded)continue;
  const length=DomUtils.textContent(node).trim().length;
  const links=DomUtils.findAll(child=>child.name==='a',node.children).reduce((sum,child)=>sum+DomUtils.textContent(child).length,0);
  const semantic=node.attribs.itemprop==='articleBody'||classes.some(value=>(node.attribs.class||'').split(/\s+/).includes(value));
  const score=(semantic?100000:node.name==='article'?10000:0)+Math.min(10000,Math.max(0,length-links*2));
  if(score>bestScore){best=node;bestScore=score;}
 }
 return best;
}

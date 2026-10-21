import {isIP} from 'node:net';
import {ApiError} from './http';

/** Parse before any network I/O, including each redirect and CDN image. */
export function publicImportUrl(input:string):URL {
 let url:URL;
 try{url=new URL(input);}catch{throw new ApiError(400,'IMPORT_URL','请输入有效的公开网页地址');}
 let path:string;try{path=decodeURIComponent(url.pathname);}catch{throw new ApiError(400,'IMPORT_URL','地址编码无效');}
 const host=url.hostname.toLowerCase();
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.port||input.length>2000||/[\\\u0000-\u0020\u007f]/.test(input)||/[\u0000-\u001f\u007f]/.test(path)
  ||isIP(host.replace(/^\[|\]$/g,''))||!host.includes('.')||host.endsWith('.')
  ||/(?:^|\.)(?:localhost|local|internal|intranet|lan|home|test|invalid|example|onion)$/.test(host)){
  throw new ApiError(400,'IMPORT_URL','仅允许不含账号、特殊端口的公网 HTTP(S) 域名地址');
 }
 url.hash='';return url;
}

/** Fail closed on special-use answers. IP literals are never accepted as source URLs. */
export function isPublicImportAddress(address:string):boolean {
 if(isIP(address)===4){
  const [a,b,c]=address.split('.').map(Number);
  return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31
   ||a===192&&(b===168||b===0||b===2||b===88&&c===99)||a===100&&b>=64&&b<=127
   ||a===198&&(b===18||b===19||b===51&&c===100)||a===203&&b===0&&c===113);
 }
 if(isIP(address)===6){
  // Global unicast only. Exclude transition/translation and IANA special-use ranges.
  const parts=address.toLowerCase().split(':');const first=parseInt(parts[0],16),second=parseInt(parts[1]||'0',16);
  return first>=0x2000&&first<=0x3fff&&first!==0x2002
   &&!(first===0x2001&&(second<=0x1ff||second===0xdb8))
   &&!(first===0x3fff&&second<=0xfff);
 }
 return false;
}

export type RemoteKind='html'|'json'|'xml'|'image';
export async function limitedBytes(response:Response,limit:number){
 if(Number(response.headers.get('content-length'))>limit){await response.body?.cancel();throw new ApiError(413,'IMPORT_SIZE','来源文件过大');}
 const reader=response.body?.getReader();if(!reader)throw new ApiError(422,'IMPORT_EMPTY','来源没有返回内容');
 const parts:Uint8Array[]=[];let size=0;
 try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new ApiError(413,'IMPORT_SIZE','来源文件过大');}parts.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}return bytes;
}

/**
 * Request-local DNS preflight plus per-hop checks. Preflight is not address pinning.
 * This transport runs on Workers' public-network fetch service, whose peer policy
 * blocks private destinations at connect time (including rebinding). Never replace
 * global fetch with a private-network service binding or an unrestricted proxy.
 */
export function createImportReader(signal:AbortSignal){
 const checked=new Set<string>();let requests=0;
 function budget(){if(++requests>32)throw new ApiError(422,'IMPORT_NETWORK','来源请求次数过多，请分批采集');}
 async function checkHost(host:string){
  if(checked.has(host))return;
  if(checked.size>=12)throw new ApiError(422,'IMPORT_NETWORK','来源涉及的图片域名过多');
  let addresses:string[]|undefined;
  // Independent public resolvers accommodate networks that block one DoH endpoint.
  // Invalid/private answers never trigger a less restrictive fallback.
  for(const provider of ['https://cloudflare-dns.com/dns-query','https://dns.alidns.com/resolve']){
   const dnsSignal=AbortSignal.any([signal,AbortSignal.timeout(3000)]);
   const answers=await Promise.allSettled(['A','AAAA'].map(async type=>{
    const dns=new URL(provider);dns.searchParams.set('name',host);dns.searchParams.set('type',type);
    budget();
    const response=await fetch(dns,{signal:dnsSignal,redirect:'manual',headers:{Accept:'application/dns-json'}});
    if(!response.ok){await response.body?.cancel();throw new ApiError(502,'IMPORT_DNS','来源域名解析失败');}
    const value:unknown=JSON.parse(new TextDecoder().decode(await limitedBytes(response,65536)));
    if(!value||typeof value!=='object'||!('Status' in value)||value.Status!==0)throw new ApiError(422,'IMPORT_DNS','来源域名没有可访问的公网地址');
    const rows='Answer' in value?value.Answer:[];
    if(!Array.isArray(rows)||rows.length>64)throw new ApiError(422,'IMPORT_DNS','来源域名解析异常');
    return rows.filter((row):row is {type:number;data:string}=>!!row&&typeof row==='object'&&[1,28].includes(row.type)&&typeof row.data==='string').map(row=>row.data);
   }));
   // A provider's negative answer or private answer is authoritative for this request.
   for(const answer of answers){
    if(answer.status==='fulfilled'&&answer.value.some(address=>!isPublicImportAddress(address)))throw new ApiError(400,'IMPORT_URL','不能采集私有网络或保留地址');
    if(answer.status==='rejected'&&answer.reason instanceof ApiError&&answer.reason.status===422)throw answer.reason;
   }
   if(answers.every(answer=>answer.status==='fulfilled')){addresses=answers.flatMap(answer=>answer.status==='fulfilled'?answer.value:[]);break;}
   if(signal.aborted)throw signal.reason;
  }
  if(!addresses)throw new ApiError(502,'IMPORT_DNS','无法连接公共 DNS 服务，请检查服务器出站网络');
  if(!addresses.length||addresses.some(address=>!isPublicImportAddress(address)))throw new ApiError(400,'IMPORT_URL','不能采集私有网络或保留地址');
  checked.add(host);
 }
 return async(input:string,kind:RemoteKind='html')=>{
  let url=publicImportUrl(input);
  for(let hop=0;hop<4;hop++){
   await checkHost(url.hostname);
   budget();
   const response=await fetch(url,{redirect:'manual',signal:AbortSignal.any([signal,AbortSignal.timeout(8000)]),headers:{
    Accept:kind==='json'?'application/json':kind==='xml'?'application/xml,text/xml,application/rss+xml,application/atom+xml':kind==='image'?'image/png,image/jpeg,image/webp':'text/html,application/xhtml+xml',
    'User-Agent':'OrbitPress-Article-Import/2.0'
   }});
   if(response.status>=300&&response.status<400){await response.body?.cancel();const location=response.headers.get('location');if(!location)break;url=publicImportUrl(new URL(location,url).href);continue;}
   if(!response.ok){await response.body?.cancel();throw new ApiError(502,'IMPORT_SOURCE','来源站暂时无法读取，请检查地址或稍后重试');}
   const type=(response.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
   const allowed=kind==='json'?type==='application/json'||type.endsWith('+json'):kind==='image'?['image/png','image/jpeg','image/webp'].includes(type):kind==='xml'?['application/xml','text/xml','application/rss+xml','application/atom+xml','text/plain'].includes(type):['text/html','application/xhtml+xml'].includes(type);
   if(!allowed){await response.body?.cancel();throw new ApiError(422,'IMPORT_TYPE','来源返回的格式不受支持');}
   return {bytes:await limitedBytes(response,kind==='image'?5*1024*1024:2*1024*1024),type,pages:Number(response.headers.get('x-wp-totalpages'))||1,url:url.href};
  }
  throw new ApiError(502,'IMPORT_REDIRECT','来源重定向过多');
 };
}

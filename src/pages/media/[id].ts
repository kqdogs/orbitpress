import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
export const GET:APIRoute=async({params,request})=>{
 const id=params.id||'';if(!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(id))return new Response('Not found',{status:404});
 const object=await env.MEDIA.get(id);if(!object)return new Response('Not found',{status:404});
 const headers=new Headers({'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=86400','ETag':object.httpEtag});object.writeHttpMetadata(headers);
 if(request.headers.get('if-none-match')===object.httpEtag)return new Response(null,{status:304,headers});
 return new Response(object.body,{headers});
};

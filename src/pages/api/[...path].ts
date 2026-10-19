import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { handleApi } from '../../lib/api-controller';
import { ApiError } from '../../lib/http';
export const ALL:APIRoute=async({request,params})=>{
 const requestId=crypto.randomUUID();
 try{
   // Consume the incoming stream before early auth/Origin rejection. This also
   // bounds multipart uploads and keeps local workerd proxy connections usable.
   if(request.body){
     const max=params.path==='admin/media'?5*1024*1024+10000:300000;
     const chunks:Uint8Array[]=[];let size=0;const reader=request.body.getReader();
     try{while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>max){await reader.cancel();throw new ApiError(413,'BODY_TOO_LARGE','请求体过大');}chunks.push(part.value);}}finally{reader.releaseLock();}
     const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
     request=new Request(request,{body:bytes});
   }
   const response=await handleApi(request,env,params.path||'');response.headers.set('X-Request-Id',requestId);return response;
 }
 catch(error){const known=error instanceof ApiError;if(!known)console.error(JSON.stringify({event:'api.error',requestId,path:new URL(request.url).pathname,name:error instanceof Error?error.name:'Unknown'}));const status=known?error.status:500;return new Response(JSON.stringify({error:{code:known?error.code:'INTERNAL',message:known?error.message:'服务暂时不可用',requestId}}),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Request-Id':requestId,...(status===429?{'Retry-After':'60'}:{})}});}
};

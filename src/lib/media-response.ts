/** Uploaded UUIDs and content-addressed imports share the same public media route. */
const mediaKey=/^(?:[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}|import-[a-f0-9]{64})\.(?:png|jpg|webp)$/;

export async function mediaResponse(bucket:R2Bucket,id:string,request:Request):Promise<Response> {
 if(!mediaKey.test(id))return new Response('Not found',{status:404});
 const object=await bucket.get(id);if(!object)return new Response('Not found',{status:404});
 const headers=new Headers({'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=86400','ETag':object.httpEtag});
 object.writeHttpMetadata(headers);
 if(request.headers.get('if-none-match')===object.httpEtag)return new Response(null,{status:304,headers});
 return new Response(object.body,{headers});
}

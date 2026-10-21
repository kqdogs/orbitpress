import type { ZodType } from 'zod';
import {localeFromCookie} from './i18n';
import {validationMessage} from './i18n/validation';
export class ApiError extends Error { constructor(public status:number,public code:string,message:string) {super(message);} }
export function json(data:unknown,status=200,headers:HeadersInit={}) {return new Response(JSON.stringify({data}),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});}
export async function readBody<T>(request:Request,schema:ZodType<T>,max=300000):Promise<T> {
 if(!request.headers.get('content-type')?.startsWith('application/json')) throw new ApiError(415,'CONTENT_TYPE','请使用 application/json');
 const reader=request.body?.getReader(); let size=0; const chunks:Uint8Array[]=[];
 if(reader) {try {while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max) {await reader.cancel();throw new ApiError(413,'BODY_TOO_LARGE','请求体过大');}chunks.push(value);}} finally {reader.releaseLock();}}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 let value:unknown;try {value=JSON.parse(new TextDecoder().decode(bytes));} catch {throw new ApiError(400,'INVALID_JSON','JSON 格式错误');}
 const parsed=schema.safeParse(value);
 if(!parsed.success){
   throw new ApiError(400,'VALIDATION',validationMessage(parsed.error.issues,localeFromCookie(request.headers.get('cookie')||'')));
 }
 return parsed.data;
}
export const now = () => new Date().toISOString();
export const epoch = () => Math.floor(Date.now()/1000);

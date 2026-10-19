import type { ZodType } from 'zod';
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
   const labels:Record<string,string>={title:'标题',slug:'路径',excerpt:'摘要',body:'正文',categoryId:'内容分类',cover:'封面',videoId:'视频ID',featured:'推荐设置',tags:'标签',highlights:'文章亮点',name:'名称',version:'版本号',days:'有效期',scopes:'权限',username:'用户名',password:'密码',currentPassword:'当前密码',newPassword:'新密码',confirmPassword:'确认新密码',youtube:'YouTube链接',telegram:'Telegram链接',bilibili:'哔哩哔哩链接',twitter:'X链接'};
   const messages=[...new Set(parsed.error.issues.map(issue=>{
     const field=labels[String(issue.path[0])]||String(issue.path[0]||'请求');
     if(issue.code==='unrecognized_keys')return '包含不允许提交的字段';
     if(issue.code==='too_small')return `${field}不能为空或低于最小长度`;
     if(issue.code==='too_big')return `${field}超过允许长度或范围`;
     if(issue.code==='invalid_type')return `${field}的数据类型不正确`;
     if(issue.code==='custom')return `${field}：${issue.message}`;
     return `${field}格式不正确`;
   }))];
   throw new ApiError(400,'VALIDATION',messages.join('；').slice(0,500));
 }
 return parsed.data;
}
export const now = () => new Date().toISOString();
export const epoch = () => Math.floor(Date.now()/1000);

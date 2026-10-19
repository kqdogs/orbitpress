import { ApiError,epoch } from './http';
export async function sha256(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
export function randomToken(){const b=new Uint8Array(32);crypto.getRandomValues(b);return Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');}
export function constantTimeEqual(a:string,b:string){let diff=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return diff===0;}
export async function verifyPassword(password:string,encoded:string){const [salt,expected]=encoded.split(':');if(!salt||!expected)return false;const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256);const actual=Array.from(new Uint8Array(bits),v=>v.toString(16).padStart(2,'0')).join('');return constantTimeEqual(actual,expected);}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');if(origin!==new URL(request.url).origin)throw new ApiError(403,'ORIGIN','拒绝跨站请求');}
export type Actor={id:string;kind:'admin'|'key';csrf?:string;scopes:string[]};
export async function session(request:Request,db:D1Database):Promise<Actor>{
 const token=request.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith('session='))?.slice(8);
 if(!token)throw new ApiError(401,'UNAUTHENTICATED','请先登录');
 const row=await db.prepare('SELECT csrf FROM sessions WHERE hash=? AND expires_at>? AND credential_version=COALESCE((SELECT version FROM admin_credentials WHERE id=1),0)').bind(await sha256(token),epoch()).first<{csrf:string}>();
 if(!row)throw new ApiError(401,'UNAUTHENTICATED','登录已过期');return {id:'admin',kind:'admin',csrf:row.csrf,scopes:['content:read','content:write','content:publish']};
}
export async function authenticate(request:Request,db:D1Database,mode:'admin'|'key'):Promise<Actor>{
 if(mode==='admin'){const actor=await session(request,db);if(!['GET','HEAD'].includes(request.method)){sameOrigin(request);if(!constantTimeEqual(request.headers.get('x-csrf-token')||'',actor.csrf!))throw new ApiError(403,'CSRF','安全令牌无效，请刷新页面');}return actor;}
 const bearer=request.headers.get('authorization')?.match(/^Bearer (rf_[a-f0-9]{64})$/)?.[1];if(!bearer)throw new ApiError(401,'UNAUTHENTICATED','缺少 API 密钥');
 const key=await db.prepare('SELECT id,scopes FROM api_keys WHERE hash=? AND revoked_at IS NULL AND expires_at>?').bind(await sha256(bearer),epoch()).first<{id:string;scopes:string}>();
 if(!key)throw new ApiError(401,'UNAUTHENTICATED','密钥无效、过期或已撤销');await rateLimit(db,`key:${key.id}`,120,60);return {id:`key:${key.id}`,kind:'key',scopes:JSON.parse(key.scopes)};
}
export function requireScope(actor:Actor,scope:string){if(!actor.scopes.includes(scope))throw new ApiError(403,'SCOPE','此密钥没有所需权限');}
export async function rateLimit(db:D1Database,id:string,max:number,window:number){
 const t=epoch();const row=await db.prepare('INSERT INTO rate_limits(id,count,reset_at) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN reset_at<=? THEN 1 ELSE count+1 END,reset_at=CASE WHEN reset_at<=? THEN ? ELSE reset_at END RETURNING count').bind(id,t+window,t,t,t+window).first<{count:number}>();
 if(row&&row.count>max)throw new ApiError(429,'RATE_LIMIT','请求过于频繁，请稍后重试');
}
export function sessionCookie(token:string,url:string,maxAge=28800){return `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(url).protocol==='https:'?'; Secure':''}`;}

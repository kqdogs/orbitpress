import { defineMiddleware } from 'astro:middleware';
export const onRequest=defineMiddleware(async(context,next)=>{
 const response=await next();
 response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');response.headers.set('X-Frame-Options','DENY');response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 response.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.bilibili.com; connect-src 'self' ws://127.0.0.1:*; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
 if(context.url.pathname.startsWith('/admin')||context.url.pathname.startsWith('/api/'))response.headers.set('Cache-Control','no-store');
 return response;
});

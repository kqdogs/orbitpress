import { defineMiddleware } from 'astro:middleware';
import {localeFromCookie} from './lib/i18n';
import {contentSecurityPolicy} from './lib/content-security-policy';
import {env} from 'cloudflare:workers';
import {siteSettings} from './lib/repository';
import {adsAllowed} from './lib/advertising';
export const onRequest=defineMiddleware(async(context,next)=>{
 context.locals.locale=localeFromCookie(context.request.headers.get('cookie')||'');
 const response=await next();
 response.headers.set('Content-Language',context.locals.locale);
 response.headers.append('Vary','Cookie');
 response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');response.headers.set('X-Frame-Options','DENY');response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 // Astro streams layouts after next() can return: never depend on a layout mutating response headers.
 let advertising=false;
 if(context.request.method==='GET'&&response.status>=200&&response.status<300&&response.headers.get('Content-Type')?.includes('text/html')&&!/^\/(?:admin|api|privacy)(?:\/|$)/.test(context.url.pathname)){
  const {value}=await siteSettings(env.DB);
  advertising=context.url.pathname.replace(/\/$/,'')!==value.adminPath&&adsAllowed(value.advertising,context.request,response.status);
 }
 response.headers.set('Content-Security-Policy',contentSecurityPolicy(advertising));
 if(context.url.pathname.startsWith('/admin')||context.url.pathname.startsWith('/api/'))response.headers.set('Cache-Control','no-store');
 return response;
});

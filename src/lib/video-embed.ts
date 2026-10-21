import {translator,type Locale} from './i18n';
export const youtubeId = /^[A-Za-z0-9_-]{11}$/;
export const escapeHtml = (value:string) => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));

export function youtubeUrl(id:string, start=0, origin?:string, autoplay=false, privacy=false) {
 if(!youtubeId.test(id)||!Number.isInteger(start)||start<0||start>86400)throw new Error('视频参数无效');
 const url=new URL(`https://www.youtube${privacy?'-nocookie':''}.com/embed/${id}`);
 url.searchParams.set('playsinline','1');url.searchParams.set('rel','0');
 if(start)url.searchParams.set('start',String(start));
 if(autoplay)url.searchParams.set('autoplay','1');
 if(origin){const site=new URL(origin);if(['https:','http:'].includes(site.protocol))url.searchParams.set('origin',site.origin);}
 return url.href;
}

export function youtubeMarkup(id:string,start=0,locale:Locale='zh-CN') {
 const t=translator(locale);
 const watch=`https://www.youtube.com/watch?v=${id}${start?`&t=${start}s`:''}`;
 return `<div class="video-embed video-embed-youtube" data-video-id="${id}" data-video-start="${start}"><iframe src="${escapeHtml(youtubeUrl(id,start))}" title="${t('YouTube 视频')}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p class="video-fallback"><a href="${escapeHtml(watch)}" target="_blank" rel="noopener noreferrer">${t('在 YouTube 打开视频 ↗')}</a> · ${t('如提示登录，请在 YouTube 完成验证。')}</p>\n`;
}

import type { Settings } from './schema';
import {translate,type Locale} from './i18n';
export function footerNavigation(settings:Pick<Settings,'footerNav'|'headerNav'>,locale:Locale='zh-CN'){
 return settings.footerNav??[
  ...settings.headerNav.filter(item=>['/','/videos/','/tutorials/'].includes(item.href)).map(({label,href})=>({label,href})),
  {label:translate(locale,'关于'),href:'/about/'},{label:translate(locale,'站点地图'),href:'/sitemap.xml'},
 ];
}
export function footerCopyright(settings:Pick<Settings,'footerCopyright'|'title'>,year=new Date().getFullYear()){
 return (settings.footerCopyright||'© {year} {title}').replaceAll('{year}',String(year)).replaceAll('{title}',settings.title);
}

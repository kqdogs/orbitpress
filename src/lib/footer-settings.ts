import type { Settings } from './schema';
export function footerNavigation(settings:Pick<Settings,'footerNav'|'headerNav'>){
 return settings.footerNav??[
  ...settings.headerNav.filter(item=>['/','/videos/','/tutorials/'].includes(item.href)).map(({label,href})=>({label,href})),
  {label:'关于',href:'/about/'},{label:'站点地图',href:'/sitemap.xml'},
 ];
}
export function footerCopyright(settings:Pick<Settings,'footerCopyright'|'title'>,year=new Date().getFullYear()){
 return (settings.footerCopyright||'© {year} {title}').replaceAll('{year}',String(year)).replaceAll('{title}',settings.title);
}

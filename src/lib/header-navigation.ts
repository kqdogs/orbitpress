import type {Settings} from './schema';

/** Home is a system navigation item; categories are optional user content. */
export function headerNavigation(settings:Pick<Settings,'headerNav'>):Settings['headerNav'] {
 return settings.headerNav.some(item=>item.href==='/')
  ? settings.headerNav
  : [{label:'首页',href:'/'},...settings.headerNav];
}

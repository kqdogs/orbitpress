import type {Settings} from './schema';
import {translate,type Locale} from './i18n';

/** Home is a system navigation item; categories are optional user content. */
export function headerNavigation(settings:Pick<Settings,'headerNav'>,locale:Locale='zh-CN'):Settings['headerNav'] {
 return settings.headerNav.some(item=>item.href==='/')
  ? settings.headerNav
  : [{label:translate(locale,'首页'),href:'/'},...settings.headerNav];
}

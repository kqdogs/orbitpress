import type { UserComponent } from '../ele-app/types';

/**
 * 图标
 */
export type CopyableIcon = UserComponent;

/**
 * 国际化
 */
export interface CopyableLocale {
  copy: string;
  copied: string;
}

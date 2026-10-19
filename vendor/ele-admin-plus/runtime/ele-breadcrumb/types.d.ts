import type { StyleValue, UserComponent } from '../ele-app/types';
import type {
  ElIconProps,
  ElBreadcrumbProps,
  ElBreadcrumbItemProps
} from '../ele-app/el';

/**
 * 面包屑导航分隔符
 */
export type BreadcrumbSeparator =
  | ElBreadcrumbProps['separator']
  | ElBreadcrumbProps['separatorIcon'];

/**
 * 面包屑导航数据
 */
export interface BreadcrumbItem extends ElBreadcrumbItemProps {
  /** 循环的 key */
  key?: PropertyKey;
  /** 标题 */
  title?: string;
  /** 图标 */
  icon?: UserComponent;
  /** 图标属性 */
  iconProps?: ElIconProps;
  /** 图标样式 */
  iconStyle?: StyleValue;
  /** 插槽名称 */
  slot?: Exclude<string, 'default'>;
}

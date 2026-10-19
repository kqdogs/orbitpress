import type { StyleValue } from '../ele-app/types';
import type { ElIconProps, ElDropdownItemProps } from '../ele-app/el';

/**
 * 下拉菜单数据
 */
export interface DropdownItem extends ElDropdownItemProps {
  /** 循环的 key */
  key?: PropertyKey;
  /** 标题 */
  title?: string;
  /** 图标属性 */
  iconProps?: ElIconProps;
  /** 图标样式 */
  iconStyle?: StyleValue;
  /** 插槽名称 */
  slot?: Exclude<string, 'default'>;
  /** 是否为危险样式 */
  danger?: boolean;
  /** 点击事件 */
  onClick?: (e: MouseEvent) => void;
  /** 子菜单 */
  children?: DropdownItem[];
}

import type { StyleValue, UserComponent } from '../ele-app/types';
import type { ElIconProps } from '../ele-app/el';

/**
 * 尺寸
 */
export type SegmentedSize = 'large' | 'default' | 'small';

/**
 * 数据
 */
export interface SegmentedItem extends Record<keyof any, any> {
  /** 标题 */
  label?: string;
  /** 值 */
  value: string | number;
  /** 图标 */
  icon?: UserComponent;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式 */
  style?: StyleValue;
  /** 自定义图标属性 */
  iconProps?: ElIconProps;
  /** 自定义图标样式 */
  iconStyle?: StyleValue;
}

import type { PropType, ExtractPropTypes } from 'vue';
import { iconProps as elIconProps } from 'element-plus';
import type { UserComponent } from '../ele-app/types';
import type { IconType } from './types';

/**
 * 属性
 */
export const iconProps = {
  ...elIconProps,
  /** 图标名称 */
  name: [String, Object, Function] as PropType<UserComponent>,
  /** 图标类型 */
  iconType: String as PropType<IconType>
};

export type IconProps = ExtractPropTypes<typeof iconProps>;

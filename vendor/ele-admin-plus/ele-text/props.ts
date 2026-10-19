import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElIconProps } from '../ele-app/el';
import type { TextType, TextSize, TextIcon } from './types';

/**
 * 属性
 */
export const textProps = {
  /** 渲染标签 */
  tag: String,
  /** 类型 */
  type: String as PropType<TextType>,
  /** 文字大小 */
  size: String as PropType<TextSize>,
  /** 文字删除线 */
  deleted: Boolean,
  /** 文字下划线 */
  underline: Boolean,
  /** 是否加粗 */
  strong: Boolean,
  /** 是否斜体 */
  italic: Boolean,
  /** 图标 */
  icon: [String, Object, Function] as PropType<TextIcon>,
  /** 图标属性 */
  iconProps: Object as PropType<ElIconProps>,
  /** 图标样式 */
  iconStyle: Object as PropType<StyleValue>
};

export type TextProps = ExtractPropTypes<typeof textProps>;

export type TextPropKeys = Array<keyof typeof textProps>;

/**
 * 属性名
 */
export const textPropKeys: TextPropKeys = Object.keys(textProps) as any;

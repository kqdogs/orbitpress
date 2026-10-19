import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElIconProps } from '../ele-app/el';
import type { EleTooltipProps } from '../ele-app/plus';
import type { CopyableIcon, CopyableLocale } from './types';

/**
 * 属性
 */
export const copyableProps = {
  /** 重新定义拷贝到剪切板里的文本 */
  text: String,
  /** 自定义内容样式 */
  innerStyle: Object as PropType<StyleValue>,
  /** 自定义拷贝按钮样式 */
  customStyle: Object as PropType<StyleValue>,
  /** 自定义拷贝图标 */
  icon: [String, Object, Function] as PropType<CopyableIcon>,
  /** 自定义拷贝图标属性 */
  iconProps: Object as PropType<ElIconProps>,
  /** 自定义拷贝图标样式 */
  iconStyle: Object as PropType<StyleValue>,
  /** 自定义拷贝后图标 */
  copiedIcon: [String, Object, Function] as PropType<CopyableIcon>,
  /** 自定义拷贝后图标属性 */
  copiedIconProps: Object as PropType<ElIconProps>,
  /** 自定义拷贝后图标样式 */
  copiedIconStyle: Object as PropType<StyleValue>,
  /** 文字提示属性 */
  tooltip: {
    type: [Boolean, Object] as PropType<boolean | EleTooltipProps>,
    default: true
  },
  /** 拷贝成功状态重置时间 */
  resetAfter: {
    type: Number,
    default: 1000
  },
  /** 国际化 */
  locale: Object as PropType<Partial<CopyableLocale>>
};

export type CopyableProps = ExtractPropTypes<typeof copyableProps>;

/**
 * 事件
 */
export const copyableEmits = {
  copy: (_error?: any) => true
};

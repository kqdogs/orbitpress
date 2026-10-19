import type { PropType, ExtractPropTypes } from 'vue';
import {
  popoverProps as elPopoverProps,
  popoverEmits as elPopoverEmits
} from 'element-plus';
import type { StyleValue } from '../ele-app/types';
import { omit } from '../utils/common';
import { tooltipProps } from '../ele-tooltip/props';
type Excludes =
  | 'onUpdate:visible'
  // 类型去掉重复的属性简化以避免实例化过深且可能无限
  | 'trigger'
  | 'triggerKeys'
  | 'placement'
  | 'disabled'
  | 'visible'
  | 'transition'
  | 'popperOptions'
  //| 'tabindex'
  | 'content'
  | 'popperStyle'
  | 'popperClass'
  | 'enterable'
  | 'effect'
  | 'teleported'
  | 'appendTo'
  | 'width'
  | 'offset'
  | 'showAfter'
  | 'hideAfter'
  | 'autoClose'
  | 'showArrow'
  //| 'virtualTriggering'
  //| 'virtualRef'
  //| 'tooltip'
  | 'persistent';
const normalizeProps = omit(elPopoverProps, ['onUpdate:visible'] as Excludes[]);
const normalizeTooltipProps = omit(tooltipProps, ['rawContent', 'isPopover']);

/**
 * 属性
 */
export const popoverProps = {
  ...normalizeTooltipProps,
  ...normalizeProps,
  transition: {
    type: String,
    default: 'el-fade-in-linear'
  },
  /** 自定义主体类名 */
  bodyClass: String,
  /** 自定义标题样式 */
  titleStyle: Object as PropType<StyleValue>,
  /** 自定义内容样式 */
  contentStyle: Object as PropType<StyleValue>
};

export type PopoverProps = ExtractPropTypes<typeof popoverProps>;

/**
 * 事件
 */
export const popoverEmits = elPopoverEmits;

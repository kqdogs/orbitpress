import type { PropType, ExtractPropTypes, EmitsToProps } from 'vue';
import { useTooltipProps, tooltipEmits as elTooltipEmits } from 'element-plus';
import type { StyleValue } from '../ele-app/types';
import { omit } from '../utils/common';
type TooltipExclude =
  | 'onUpdate:visible'
  | 'onMouseenter'
  | 'onMouseleave'
  | 'onClick'
  | 'onKeydown'
  | 'onFocus'
  | 'onBlur'
  | 'onContextmenu'
  | 'style'
  // 简化几个类型
  | 'className'
  | 'popperClass'
  | 'popperStyle'
  // 类型去掉文档未列出的属性简化以避免实例化过深且可能无限
  | 'id'
  | 'open'
  | 'loop'
  | 'pure'
  | 'focusOnShow'
  | 'trapping'
  | 'referenceEl'
  | 'triggerTargetEl'
  | 'stopPopperMouseEvent'
  //| 'zIndex'
  | 'boundariesPadding'
  //| 'fallbackPlacements'
  //| 'gpuAcceleration'
  | 'strategy'
  | 'role';
const normalizeProps = omit(useTooltipProps, [
  'onUpdate:visible',
  'onMouseenter',
  'onMouseleave',
  'onClick',
  'onKeydown',
  'onFocus',
  'onBlur',
  'onContextmenu',
  'style'
] as TooltipExclude[]);

/**
 * 属性
 */
export const tooltipProps = {
  className: String,
  popperClass: String,
  popperStyle: Object as PropType<StyleValue>,
  ...normalizeProps,
  /** 自定义内容样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 自定义背景色 */
  bg: String,
  /** 自定义箭头颜色 */
  arrowBg: String,
  /** 宽度 */
  width: [String, Number],
  /** 是否是气泡卡片 */
  isPopover: Boolean
};

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>;

/**
 * 事件
 */
export type TooltipEmits = {
  'update:visible': (visible: boolean) => boolean;
  'before-show': (e: Event) => boolean;
  'before-hide': (e: Event) => boolean;
  show: (e: Event) => boolean;
  hide: (e: Event) => boolean;
  open: (e: any) => boolean;
  close: (e: any) => boolean;
};

export const tooltipEmits = elTooltipEmits as unknown as TooltipEmits;

export type TooltipEmitsProps = EmitsToProps<typeof tooltipEmits>;

export type TooltipPropsAndEmits = TooltipProps & TooltipEmitsProps;

/**
 * 属性名
 */
export type TooltipPropKeys = Array<keyof typeof tooltipProps>;

export const tooltipPropKeys = Object.keys(tooltipProps) as TooltipPropKeys;

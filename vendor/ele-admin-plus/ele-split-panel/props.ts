import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';

/**
 * 属性
 */
export const splitPanelProps = {
  /** 边栏默认尺寸 */
  size: [String, Number],
  /** 最小拉伸尺寸 */
  minSize: Number,
  /** 最大拉伸尺寸 */
  maxSize: Number,
  /** 间距 */
  space: [String, Number],
  /** 自定义边栏样式 */
  customStyle: Object as PropType<StyleValue>,
  /** 自定义边栏容器样式 */
  customWrapStyle: Object as PropType<StyleValue>,
  /** 自定义内容样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 是否可折叠边栏 */
  allowCollapse: [Boolean, String] as PropType<boolean | 'both'>,
  /** 折叠按钮样式 */
  collapseStyle: Object as PropType<StyleValue>,
  /** 折叠按钮折叠时到边缘的距离 */
  collapseBtnOffset: [String, Number],
  /** 是否折叠状态 */
  collapse: [Boolean, String] as PropType<boolean | 'body'>,
  /** 是否垂直方向 */
  vertical: Boolean,
  /** 是否反向布局 */
  reverse: Boolean,
  /** 是否可拉伸宽度 */
  resizable: Boolean,
  /** 拉伸宽度是否使用百分比 */
  percentage: Boolean,
  /** 自定义边栏顶部样式 */
  sideHeaderStyle: Object as PropType<StyleValue>,
  /** 自定义内容顶栏样式 */
  bodyHeaderStyle: Object as PropType<StyleValue>,
  /** 内部表格弹性布局 */
  flexTable: [Boolean, String] as PropType<boolean | 'auto'>,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  }
};

export type SplitPanelProps = ExtractPropTypes<typeof splitPanelProps>;

/**
 * 事件
 */
export const splitPanelEmits = {
  /** 更新边栏折叠状态 */
  'update:collapse': (_collapse: boolean | 'body') => true,
  resizeStart: (_size: number) => true,
  resize: (_size: number | undefined, _strSize: string | null) => true,
  resizeEnd: (_size: number | undefined, _strSize: string | null) => true
};

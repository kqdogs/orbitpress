import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { MarkerItem } from './types';

/**
 * 属性
 */
export const viewerProps = {
  /** 图片地址 */
  src: String,
  /** 标记数据 */
  markers: Array as PropType<MarkerItem[]>,
  /** 自定义内容样式 */
  contentStyle: Object as PropType<StyleValue>,
  /** 自定义内容图片样式 */
  imageStyle: Object as PropType<StyleValue>,
  /** 缩放速率 */
  zoomStep: {
    type: Number,
    default: 10
  },
  /** 缩放最小百分比 */
  zoomMin: {
    type: Number,
    default: 20
  },
  /** 缩放最大百分比 */
  zoomMax: {
    type: Number,
    default: 400
  },
  /** 每次旋转角度 */
  rotateStep: {
    type: Number,
    default: 90
  }
};

export type ViewerProps = ExtractPropTypes<typeof viewerProps>;

/**
 * 事件
 */
export const viewerEmits = {
  contentClick: (_e: MouseEvent) => true,
  contentContextmenu: (_e: MouseEvent) => true
};

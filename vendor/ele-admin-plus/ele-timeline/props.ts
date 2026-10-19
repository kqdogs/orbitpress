import type { PropType, ExtractPropTypes } from 'vue';
import type { TimelineItem } from './types';

/**
 * 属性
 */
export const timelineProps = {
  /** 数据 */
  data: Array as PropType<TimelineItem[]>,
  /** 每项最小宽度 */
  itemWidth: {
    type: Number,
    default: 168
  }
};

export type TimelineProps = ExtractPropTypes<typeof timelineProps>;

/**
 * 事件
 */
export const timelineEmits = {
  itemClick: (_item: TimelineItem, _e?: MouseEvent) => true
};

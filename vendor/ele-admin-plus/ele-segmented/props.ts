import type { PropType, ExtractPropTypes } from 'vue';
import type { SegmentedSize, SegmentedItem } from './types';

/**
 * 属性
 */
export const segmentedProps = {
  /** 选中的值 */
  modelValue: [String, Number],
  /** 将宽度调整为父元素宽度 */
  block: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 数据 */
  items: {
    type: Array as PropType<SegmentedItem[]>,
    required: true
  },
  /** 尺寸 */
  size: String as PropType<SegmentedSize>,
  /** 是否触发表单验证 */
  validateEvent: {
    type: Boolean,
    default: true
  }
};

export type SegmentedProps = ExtractPropTypes<typeof segmentedProps>;

/**
 * 事件
 */
export const segmentedEmits = {
  /** 更新绑定值 */
  'update:modelValue': (_value: string | number) => true,
  /** 选中改变的事件 */
  change: (_active: string | number) => true
};

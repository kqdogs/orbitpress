import type { PropType, ExtractPropTypes } from 'vue';
import type { TourStep, TourLocale } from './types';

/**
 * 属性
 */
export const tourProps = {
  /** 当前处于第几步 */
  modelValue: Number,
  /** 步骤 */
  steps: {
    type: Array as PropType<TourStep[]>,
    required: true
  },
  /** 是否开启遮罩层 */
  mask: {
    type: Boolean,
    default: true
  },
  /** 高亮区内间距 */
  padding: {
    type: Number,
    default: 6
  },
  /** 层级 */
  zIndex: Number,
  /** 国际化 */
  locale: Object as PropType<Partial<TourLocale>>
};

export type TourProps = ExtractPropTypes<typeof tourProps>;

/**
 * 事件
 */
export const tourEmits = {
  'update:modelValue': (_value?: number | null) => true
};

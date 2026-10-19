import type { PropType, ExtractPropTypes } from 'vue';
import type { CronPanelLocale } from './types';

/**
 * 属性
 */
export const cronPanelProps = {
  /** 绑定值 */
  modelValue: String,
  /** 国际化 */
  locale: Object as PropType<Partial<CronPanelLocale>>
};

export type CronPanelProps = ExtractPropTypes<typeof cronPanelProps>;

/**
 * 事件
 */
export const cronPanelEmits = {
  /** 更新绑定值 */
  'update:modelValue': (_value?: string) => true
};

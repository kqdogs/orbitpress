import type { PropType, ExtractPropTypes } from 'vue';
import type { EleModalProps } from '../ele-app/plus';
import type { CronBuilderLocale } from './types';

/**
 * 属性
 */
export const cronBuilderProps = {
  /** 弹窗是否显示 */
  modelValue: Boolean,
  /** 绑定值 */
  cron: String,
  /** 标题 */
  title: String,
  /** 弹窗属性 */
  modalProps: Object as PropType<EleModalProps>,
  /** 国际化 */
  locale: Object as PropType<Partial<CronBuilderLocale>>
};

export type CronBuilderProps = ExtractPropTypes<typeof cronBuilderProps>;

/**
 * 事件
 */
export const cronBuilderEmits = {
  /** 更新弹窗显示状态 */
  'update:modelValue': (_value?: boolean) => true,
  /** 更新绑定值 */
  'update:cron': (_cron?: string) => true,
  /** 确定按钮点击事件 */
  done: (_cron?: string) => true
};

import type { PropType, ExtractPropTypes } from 'vue';
import { selectProps as elSelectProps } from 'element-plus';
import type { SelectOption, SelectOptionFunction } from './types';

/**
 * 属性
 */
export const selectProps = {
  ...elSelectProps,
  /** 选项数据 */
  options: [Array, Function] as PropType<SelectOption[] | SelectOptionFunction>
};

export type SelectProps = ExtractPropTypes<typeof selectProps>;

/**
 * 事件
 */
export const selectEmits = {
  'update:modelValue': (_value: any) => true,
  change: (_value: any) => true,
  'remove-tag': (_value: any) => true,
  clear: () => true,
  'visible-change': (_visible: boolean) => true,
  focus: (_e: FocusEvent) => true,
  blur: (_e: FocusEvent) => true
};

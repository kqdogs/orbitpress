import type { PropType, ExtractPropTypes } from 'vue';
import { radioGroupProps as elRadioGroupProps } from 'element-plus';
import type { RadioType, RadioOption, RadioOptionFunction } from './types';
export { radioGroupEmits } from 'element-plus';

/**
 * 属性
 */
export const radioGroupProps = {
  ...elRadioGroupProps,
  /** 风格类型 */
  type: String as PropType<RadioType>,
  /** 选项数据 */
  options: [Array, Function] as PropType<RadioOption[] | RadioOptionFunction>
};

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;

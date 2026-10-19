import type { PropType, ExtractPropTypes } from 'vue';
import { checkboxGroupProps as elCheckboxGroupProps } from 'element-plus';
import type {
  CheckboxType,
  CheckboxOption,
  CheckboxOptionFunction
} from './types';
export { checkboxGroupEmits } from 'element-plus';

/**
 * 属性
 */
export const checkboxGroupProps = {
  ...elCheckboxGroupProps,
  /** 风格类型 */
  type: String as PropType<CheckboxType>,
  /** 选项数据 */
  options: [Array, Function] as PropType<
    CheckboxOption[] | CheckboxOptionFunction
  >
};

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;

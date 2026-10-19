import { checkboxGroupProps as checkboxGroupProps$1 } from "element-plus";
import { checkboxGroupEmits } from "element-plus";
const checkboxGroupProps = {
  ...checkboxGroupProps$1,
  /** 风格类型 */
  type: String,
  /** 选项数据 */
  options: [Array, Function]
};
export {
  checkboxGroupEmits,
  checkboxGroupProps
};

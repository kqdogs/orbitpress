import { selectProps as selectProps$1 } from "element-plus";
const selectProps = {
  ...selectProps$1,
  /** 选项数据 */
  options: [Array, Function]
};
const selectEmits = {
  "update:modelValue": (_value) => true,
  change: (_value) => true,
  "remove-tag": (_value) => true,
  clear: () => true,
  "visible-change": (_visible) => true,
  focus: (_e) => true,
  blur: (_e) => true
};
export {
  selectEmits,
  selectProps
};

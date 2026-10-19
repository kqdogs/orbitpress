import { treeProps, selectProps } from "element-plus";
const selectTreeProps = {
  ...selectProps,
  ...treeProps,
  /** 数据 */
  data: [Array, Function]
};
const selectTreeEmits = {
  "update:modelValue": (_value) => true
};
export {
  selectTreeEmits,
  selectTreeProps
};

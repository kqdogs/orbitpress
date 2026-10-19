const cronPanelProps = {
  /** 绑定值 */
  modelValue: String,
  /** 国际化 */
  locale: Object
};
const cronPanelEmits = {
  /** 更新绑定值 */
  "update:modelValue": (_value) => true
};
export {
  cronPanelEmits,
  cronPanelProps
};

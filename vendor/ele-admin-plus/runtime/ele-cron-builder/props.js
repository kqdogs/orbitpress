const cronBuilderProps = {
  /** 弹窗是否显示 */
  modelValue: Boolean,
  /** 绑定值 */
  cron: String,
  /** 标题 */
  title: String,
  /** 弹窗属性 */
  modalProps: Object,
  /** 国际化 */
  locale: Object
};
const cronBuilderEmits = {
  /** 更新弹窗显示状态 */
  "update:modelValue": (_value) => true,
  /** 更新绑定值 */
  "update:cron": (_cron) => true,
  /** 确定按钮点击事件 */
  done: (_cron) => true
};
export {
  cronBuilderEmits,
  cronBuilderProps
};

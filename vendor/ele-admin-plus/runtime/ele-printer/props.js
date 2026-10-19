const printerProps = {
  /** 是否打印 */
  modelValue: Boolean,
  /** 页眉样式 */
  headerStyle: Object,
  /** 内容样式 */
  bodyStyle: Object,
  /** 页脚样式 */
  footerStyle: Object,
  /** 标题 */
  title: String,
  /** 页间距 */
  margin: [String, Number],
  /** 纸张方向 */
  direction: String,
  /** 纸张旋转 */
  orientation: String,
  /** 打印位置 */
  target: String,
  /** 是否显示在文档流中 */
  static: Boolean,
  /** 打印方法参数 */
  options: Object
};
const printerEmits = {
  /** 更新打印状态 */
  "update:modelValue": (_value) => true,
  /** 打印完成的事件 */
  done: () => true
};
export {
  printerEmits,
  printerProps
};

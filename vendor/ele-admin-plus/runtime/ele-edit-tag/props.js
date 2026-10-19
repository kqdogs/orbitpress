const editTagProps = {
  /** 标签数据 */
  modelValue: Array,
  /** 类型 */
  type: String,
  /** 是否有边框描边 */
  hit: Boolean,
  /** 颜色 */
  color: String,
  /** 尺寸 */
  size: String,
  /** 主题 */
  effect: String,
  /** 是否为圆形 */
  round: Boolean,
  /** 提示文本 */
  placeholder: String,
  /** 输入框样式 */
  inputStyle: Object,
  /** 输入框外层标签样式 */
  inputTagStyle: Object,
  /** 添加按钮样式 */
  buttonStyle: Object,
  /** 标签样式 */
  itemStyle: Object,
  /** 添加校验方法 */
  validator: Function,
  /** 移除校验方法 */
  beforeRemove: Function,
  /** 提示属性 */
  tooltipProps: Object,
  /** 是否只读 */
  readonly: Boolean,
  /** 是否禁用 */
  disabled: Boolean
};
const editTagEmits = {
  /** 更新数据 */
  "update:modelValue": (_value) => true,
  /** 数据改变事件 */
  change: (_value) => true,
  /** 标签点击事件 */
  itemClick: (_index, _value) => true
};
export {
  editTagEmits,
  editTagProps
};

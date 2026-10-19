const segmentedProps = {
  /** 选中的值 */
  modelValue: [String, Number],
  /** 将宽度调整为父元素宽度 */
  block: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 数据 */
  items: {
    type: Array,
    required: true
  },
  /** 尺寸 */
  size: String,
  /** 是否触发表单验证 */
  validateEvent: {
    type: Boolean,
    default: true
  }
};
const segmentedEmits = {
  /** 更新绑定值 */
  "update:modelValue": (_value) => true,
  /** 选中改变的事件 */
  change: (_active) => true
};
export {
  segmentedEmits,
  segmentedProps
};

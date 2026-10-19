const tourProps = {
  /** 当前处于第几步 */
  modelValue: Number,
  /** 步骤 */
  steps: {
    type: Array,
    required: true
  },
  /** 是否开启遮罩层 */
  mask: {
    type: Boolean,
    default: true
  },
  /** 高亮区内间距 */
  padding: {
    type: Number,
    default: 6
  },
  /** 层级 */
  zIndex: Number,
  /** 国际化 */
  locale: Object
};
const tourEmits = {
  "update:modelValue": (_value) => true
};
export {
  tourEmits,
  tourProps
};

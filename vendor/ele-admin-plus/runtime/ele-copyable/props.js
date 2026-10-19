const copyableProps = {
  /** 重新定义拷贝到剪切板里的文本 */
  text: String,
  /** 自定义内容样式 */
  innerStyle: Object,
  /** 自定义拷贝按钮样式 */
  customStyle: Object,
  /** 自定义拷贝图标 */
  icon: [String, Object, Function],
  /** 自定义拷贝图标属性 */
  iconProps: Object,
  /** 自定义拷贝图标样式 */
  iconStyle: Object,
  /** 自定义拷贝后图标 */
  copiedIcon: [String, Object, Function],
  /** 自定义拷贝后图标属性 */
  copiedIconProps: Object,
  /** 自定义拷贝后图标样式 */
  copiedIconStyle: Object,
  /** 文字提示属性 */
  tooltip: {
    type: [Boolean, Object],
    default: true
  },
  /** 拷贝成功状态重置时间 */
  resetAfter: {
    type: Number,
    default: 1e3
  },
  /** 国际化 */
  locale: Object
};
const copyableEmits = {
  copy: (_error) => true
};
export {
  copyableEmits,
  copyableProps
};

const textProps = {
  /** 渲染标签 */
  tag: String,
  /** 类型 */
  type: String,
  /** 文字大小 */
  size: String,
  /** 文字删除线 */
  deleted: Boolean,
  /** 文字下划线 */
  underline: Boolean,
  /** 是否加粗 */
  strong: Boolean,
  /** 是否斜体 */
  italic: Boolean,
  /** 图标 */
  icon: [String, Object, Function],
  /** 图标属性 */
  iconProps: Object,
  /** 图标样式 */
  iconStyle: Object
};
const textPropKeys = Object.keys(textProps);
export {
  textPropKeys,
  textProps
};

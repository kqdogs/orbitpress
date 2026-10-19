const toolProps = {
  /** 提示文字 */
  title: String,
  /** 提示方向 */
  placement: {
    type: String,
    default: "top"
  },
  /** 是否禁用提示 */
  disabled: Boolean,
  /** 是否点击时关闭提示 */
  clickHideTooltip: Boolean
};
const toolEmits = {
  /** 点击事件 */
  click: (_e) => true
};
export {
  toolEmits,
  toolProps
};

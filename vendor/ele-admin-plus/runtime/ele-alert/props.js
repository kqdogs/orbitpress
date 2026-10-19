const alertProps = {
  /** 标题 */
  title: String,
  /** 类型 */
  type: String,
  /** 描述 */
  description: {
    type: [String, Boolean],
    default: ""
  },
  /** 是否可关闭 */
  closable: {
    type: Boolean,
    default: true
  },
  /** 是否居中 */
  center: Boolean,
  /** 自定义关闭按钮文字 */
  closeText: String,
  /** 是否显示图标 */
  showIcon: Boolean,
  /** 主题 */
  effect: String,
  /** 图标样式 */
  iconStyle: Object,
  /** 图标组件属性 */
  iconProps: Object,
  /** 关闭图标样式 */
  closeIconStyle: Object,
  /** 关闭图标组件属性 */
  closeIconProps: Object,
  /** 内容区样式 */
  bodyStyle: Object,
  /** 标题样式 */
  titleStyle: Object,
  /** 描述样式 */
  descriptionStyle: Object,
  /** 过渡动画名称 */
  transitionName: {
    type: String,
    default: "ele-alert-fade"
  }
};
const alertEmits = {
  /** 关闭的事件 */
  close: (_e) => true
};
export {
  alertEmits,
  alertProps
};

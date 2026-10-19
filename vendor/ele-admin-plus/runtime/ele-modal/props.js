import { dialogProps, dialogEmits } from "element-plus";
const modalProps = {
  ...dialogProps,
  appendToBody: {
    type: Boolean,
    default: true
  },
  draggable: {
    type: Boolean,
    default: true
  },
  /** 弹窗高度 */
  height: [String, Number],
  /** 弹窗最大高度 */
  maxHeight: [String, Number],
  /** 是否可以拖出边界 */
  moveOut: [Boolean, Array],
  /** 是否可以拉伸 */
  resizable: [Boolean, String],
  /** 初始位置 */
  position: [String, Object],
  /** 是否在弹窗关闭后重置位置和大小 */
  resetOnClose: {
    type: Boolean,
    default: true
  },
  /** 是否显示最大化切换按钮 */
  maxable: Boolean,
  /** 是否支持打开多个 */
  multiple: Boolean,
  /** 是否限制在主体内部 */
  inner: Boolean,
  /** 最小拉伸宽度 */
  minWidth: {
    type: Number,
    default: 260
  },
  /** 最小拉伸高度 */
  minHeight: {
    type: Number,
    default: 160
  },
  /** 标题栏样式 */
  headerStyle: Object,
  /** 标题样式 */
  titleStyle: Object,
  /** 主体样式 */
  bodyStyle: Object,
  /** 底栏样式 */
  footerStyle: Object,
  /** 自定义关闭按钮样式 */
  closeBtnStyle: Object,
  /** 自定义全屏按钮样式 */
  fullscreenBtnStyle: Object,
  /** 拉伸图标样式 */
  resizeIconStyle: Object,
  /** 主体类名 */
  modalBodyClass: String,
  /** 是否是失活状态 */
  isDeactivated: Boolean,
  /** 异步内容组件时加载状态 */
  compLoading: Boolean,
  /** 加载状态 */
  loading: Boolean,
  /** 加载组件属性 */
  loadingProps: Object,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  },
  /** 内部表格弹性布局 */
  flexTable: [Boolean, String],
  /** 是否是在内容区添加自定义底栏 */
  customFooter: Boolean,
  /** 是否是表单弹窗 */
  form: Boolean
};
const modalEmits = {
  ...dialogEmits,
  /** 更新全屏状态 */
  "update:fullscreen": (_fullscreen) => true,
  /** 尺寸改变事件 */
  resized: (_size) => true
};
const dialogPropKeys = Object.keys(dialogProps).filter(
  (k) => !["top", "closeIcon"].includes(k)
);
export {
  dialogPropKeys,
  modalEmits,
  modalProps
};

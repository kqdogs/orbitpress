import { drawerProps as drawerProps$1, drawerEmits as drawerEmits$1 } from "element-plus";
const drawerProps = {
  ...drawerProps$1,
  appendToBody: {
    type: Boolean,
    default: true
  },
  /** 是否限制在主体内部 */
  inner: Boolean,
  /** 自定义标题样式 */
  headerStyle: Object,
  /** 标题样式 */
  titleStyle: Object,
  /** 自定义主体样式 */
  bodyStyle: Object,
  /** 自定义底部样式 */
  footerStyle: Object,
  /** 自定义关闭按钮样式 */
  closeBtnStyle: Object,
  /** 主体类名 */
  drawerBodyClass: String,
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
  /** 是否是表单抽屉 */
  form: Boolean
};
const drawerEmits = {
  ...drawerEmits$1
};
const elDrawerPropKeys = Object.keys(
  drawerProps$1
);
export {
  drawerEmits,
  drawerProps,
  elDrawerPropKeys
};

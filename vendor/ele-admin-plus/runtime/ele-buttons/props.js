const buttonsProps = {
  /** 按钮数据 */
  items: Array,
  /** 是否显示分割线 */
  divider: [Boolean, Object],
  /** 组件类型 */
  type: [String, Object, Function],
  /** 间距 */
  gap: {
    type: [Boolean, Number],
    default: null
  },
  /** 是否自动换行 */
  wrap: {
    type: Boolean,
    default: null
  },
  /** 是否是弹窗底栏 */
  modalFooter: Boolean,
  /** 国际化 */
  locale: Object,
  /** 权限过滤方式 */
  permissionFilter: String
};
const buttonsEmits = {
  itemClick: (_command, _e) => true
};
export {
  buttonsEmits,
  buttonsProps
};

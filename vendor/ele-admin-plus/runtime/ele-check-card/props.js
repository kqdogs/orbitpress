const checkCardProps = {
  /** 选中值 */
  modelValue: {
    type: [Array, String, Number, Boolean],
    default: () => {
      return null;
    }
  },
  /** 数据 */
  items: [Array, Function],
  /** 是否多选 */
  multiple: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 是否显示边框 */
  bordered: {
    type: Boolean,
    default: true
  },
  /** 是否需要选中箭头 */
  arrow: {
    type: Boolean,
    default: true
  },
  /** 选中箭头样式 */
  arrowStyle: Object,
  /** 自定义卡片类名 */
  itemClass: String,
  /** 自定义卡片样式 */
  itemStyle: Object,
  /** 是否使用栅格布局 */
  row: [Boolean, Object],
  /** 单选时允许取消选中 */
  allowUncheck: Boolean
};
const checkCardEmits = {
  /** 更新选中值 */
  "update:modelValue": (_value) => true,
  /** 选中改变事件 */
  change: (_value) => true
};
export {
  checkCardEmits,
  checkCardProps
};

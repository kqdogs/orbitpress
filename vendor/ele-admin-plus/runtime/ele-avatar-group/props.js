const avatarGroupProps = {
  /** 数据 */
  data: {
    type: Array,
    required: true
  },
  /** 最大显示个数 */
  maxCount: Number,
  /** 形状 */
  shape: String,
  /** 大小 */
  size: [Number, String],
  /** 自定义样式 */
  itemStyle: Object,
  /** 自定义头像样式 */
  avatarStyle: Object,
  /** 自定义溢出样式 */
  moreStyle: Object,
  /** 是否显示提示 */
  tooltip: {
    type: Boolean,
    default: true
  },
  /** 提示属性 */
  tooltipProps: Object,
  /** 是否显示溢出气泡 */
  overflowPopover: {
    type: Boolean,
    default: true
  },
  /** 溢出气泡属性 */
  overflowPopoverProps: Object,
  /** 是否鼠标移入展开 */
  hoverOpen: Boolean
};
const avatarGroupEmits = {
  /** item 点击事件 */
  itemClick: (_item) => true,
  /** 更多点击事件 */
  moreClick: () => true,
  /** 图片加载失败事件 */
  error: (_option) => true
};
export {
  avatarGroupEmits,
  avatarGroupProps
};

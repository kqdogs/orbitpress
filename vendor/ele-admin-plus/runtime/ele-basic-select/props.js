const basicSelectProps = {
  /** 选中值 */
  value: {
    type: [String, Number, Boolean, Array],
    default: () => {
      return null;
    }
  },
  /** 单选选中展示文本 */
  selectedLabel: String,
  /** 多选选中数据 */
  selected: Array,
  /** 下拉组件是否显示 */
  visible: Boolean,
  /** 是否多选 */
  multiple: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 尺寸 */
  size: String,
  /** 是否支持清除 */
  clearable: Boolean,
  /** 无选中时提示文本 */
  placeholder: String,
  /** 多选标签最大显示数量 */
  maxTagCount: Number,
  /** 多选标签最大显示文本长度 */
  maxTagTextLength: Number,
  /** 多选标签类型 */
  tagType: {
    type: String,
    default: "info"
  },
  /** 是否在输入框获得焦点后自动弹出选项菜单 */
  automaticDropdown: Boolean,
  /** 是否可以筛选 */
  filterable: Boolean,
  /** 自定义类名 */
  selectClass: String,
  /** 自定义样式 */
  selectStyle: [Object, String],
  /** 自定义输入框样式 */
  inputStyle: Object,
  /** 自定义多选标签容器样式 */
  selectTagsStyle: Object,
  /** 下拉组件类名 */
  popperClass: String,
  /** 下拉组件宽度 */
  popperWidth: [Number, String],
  /** 下拉组件高度 */
  popperHeight: [Number, String],
  /** 下拉组件类型 */
  popperType: String,
  /** 下拉组件属性 */
  popperProps: Object,
  /** 下拉组件插槽对应名称 */
  popperSlots: Object,
  /** 下拉组件标题 */
  popperTitle: String,
  /** 是否将下拉组件插入 body */
  teleported: {
    type: Boolean,
    default: true
  },
  /** 始终渲染下拉组件 */
  persistent: {
    type: Boolean,
    default: true
  },
  /** 下拉框位置 */
  placement: {
    type: String,
    default: "bottom-start"
  },
  /** 下拉框渐变动画 */
  transition: {
    type: String,
    default: "el-fade-in-linear"
  },
  /** popper.js 参数 */
  popperOptions: Object,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  }
};
const basicSelectEmits = {
  /** 更新下拉框显示状态 */
  "update:visible": (_visible) => true,
  /** 多选标签移除事件 */
  removeTag: (_item) => true,
  /** 清空事件 */
  clear: () => true,
  /** 获取焦点事件 */
  focus: (_e) => true,
  /** 失去焦点事件 */
  blur: (_e) => true,
  /** 筛选输入框值改变事件 */
  filterChange: (_value) => true
};
export {
  basicSelectEmits,
  basicSelectProps
};

import { omit } from "../utils/common";
import { basicSelectProps, basicSelectEmits } from "../ele-basic-select/props";
const tableSelectProps = {
  ...omit(basicSelectProps, ["value", "selectedLabel", "selected"]),
  transition: {
    type: String,
    default: "el-zoom-in-top"
  },
  /** 选中值 */
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: () => {
      return null;
    }
  },
  /** 是否触发表单验证 */
  validateEvent: {
    type: Boolean,
    default: true
  },
  /** 确认事件钩子 */
  beforeConfirm: Function,
  /** 数据值的键名 */
  valueKey: {
    type: String,
    default: "value"
  },
  /** 显示文本的键名 */
  labelKey: {
    type: String,
    default: "label"
  },
  /** 缓存的数据 */
  cacheData: Array,
  /** 表格配置 */
  tableProps: Object,
  /** 表格组件插槽对应名称 */
  tableSlots: Object,
  /** 内容容器组件 */
  wrapperComponent: [String, Object, Function],
  /** 内容容器组件属性 */
  wrapperComponentProps: Object,
  /** 初始选中值(已废弃) */
  initValue: [Object, Array]
};
const tableSelectEmits = {
  ...basicSelectEmits,
  /** 多选标签移除事件 */
  removeTag: (_value) => true,
  /** 更新选中值 */
  "update:modelValue": (_value) => true,
  /** 选中值改变事件 */
  change: (_value) => true,
  /** 下拉框展开状态改变事件 */
  visibleChange: (_visible) => true,
  /** 表格行选中事件 */
  select: (_item) => true
};
export {
  tableSelectEmits,
  tableSelectProps
};

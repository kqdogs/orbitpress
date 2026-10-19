import { omit } from "../utils/common";
import { basicSelectProps, basicSelectEmits } from "../ele-basic-select/props";
const treeSelectProps = {
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
  /** 缓存的数据 */
  cacheData: Array,
  /** 树配置 */
  treeProps: Object,
  /** 多选标签显示策略 */
  showCheckedStrategy: String,
  /** 多选值绑定策略 */
  checkedValueStrategy: Boolean,
  /** 内容容器组件 */
  wrapperComponent: [String, Object, Function],
  /** 内容容器组件属性 */
  wrapperComponentProps: Object
};
const treeSelectEmits = {
  ...basicSelectEmits,
  /** 多选标签移除事件 */
  removeTag: (_value) => true,
  /** 更新选中值 */
  "update:modelValue": (_value) => true,
  /** 选中值改变事件 */
  change: (_value) => true,
  /** 下拉框展开状态改变事件 */
  visibleChange: (_visible) => true,
  /** 选择完成事件 */
  select: (_item) => true
};
export {
  treeSelectEmits,
  treeSelectProps
};

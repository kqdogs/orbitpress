import { formProps, formEmits } from "element-plus";
import { pick } from "../utils/common";
const proFormProps = {
  ...formProps,
  /** 标签宽度 */
  labelWidth: {
    type: [String, Number],
    default: "80px"
  },
  /** 表单项 */
  items: Array,
  /** 是否栅格布局 */
  grid: [Boolean, Object],
  /** 栅格布局时更多 ElRow 属性 */
  rowProps: Object,
  /** 是否需要底栏 */
  footer: Boolean,
  /** 底栏 ElFormItem 属性 */
  footerProps: Object,
  /** 底栏 ElFormItem 插槽 */
  footerSlots: Object,
  /** 栅格布局时底栏 ElCol 属性 */
  footerColProps: Object,
  /** 自动计算底栏栅格份数 */
  autoFooterCol: Boolean,
  /** 底栏样式 */
  footerStyle: Object,
  /** 提交按钮文本 */
  submitText: String,
  /** 重置按钮文本 */
  resetText: String,
  /** 提交按钮属性 */
  submitButtonProps: Object,
  /** 重置按钮属性 */
  resetButtonProps: Object,
  /** 是否在底栏显示表单展开收起按钮 */
  showSearchExpand: Boolean,
  /** 展开和收起按钮属性 */
  searchExpandButtonProps: Object,
  /** 展开按钮的文字 */
  searchExpandText: String,
  /** 收起按钮的文字 */
  searchShrinkText: String,
  /** 搜索表单展开状态 */
  searchExpand: Boolean,
  /** 阻止表单原生的表单提交事件 */
  preventFormSubmit: {
    type: Boolean,
    default: true
  },
  /** 编辑模式 */
  editable: Boolean,
  /** 屏幕尺寸 */
  screenSize: String,
  /** 编辑模式选中的表单项 */
  activeItemKey: [String, Number],
  /** 组件类型数据 */
  itemTypeData: Array,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function],
  /** 国际化 */
  locale: Object
};
const proFormEmits = {
  ...formEmits,
  "update:searchExpand": (_expand) => true,
  updateValue: (_prop, _value) => true,
  "update:items": (_items) => true,
  "update:activeItemKey": (_activeKey) => true,
  submit: (_model) => true,
  reset: () => true
};
const childrenRenderProps = {
  ...pick(proFormProps, [
    "model",
    "items",
    "rules",
    "grid",
    "rowProps",
    "editable",
    "screenSize",
    "activeItemKey",
    "itemTypeData",
    "httpRequest"
  ]),
  /** 额外的 ElCol 属性 */
  contentExtraColProps: Object,
  /** 自动计算额外的 ElCol 份数 */
  autoContentExtraCol: {
    type: Boolean,
    required: false
  },
  /** 父级表单项 */
  parentItem: Object,
  /** 全部的表单项 */
  formItems: Array,
  /** 搜索表单展开状态 */
  searchExpand: Boolean,
  /** 编辑模式禁用子级排序 */
  sortDisabled: Boolean,
  /** 编辑模式父级拖拽容器是否可点击选中 */
  containerSelectable: Boolean,
  /** 直接传递插槽数据 */
  slots: Object,
  /** 获取表单组件的组件引用数据方法 */
  getProFormRefs: Function,
  /** 获取并缓存代码解析结果方法 */
  getAndCacheCode: Function,
  /** 更新表单数据属性值方法 */
  updateItemValue: Function,
  /** 编辑模式更新表单项数据方法 */
  updateItemsData: Function,
  /** 更新编辑模式选中项方法 */
  updateActiveItemKey: Function,
  /** 默认的必填提示文本 */
  requiredLang: String,
  /** 兼容旧版 */
  item: Object
};
export {
  childrenRenderProps,
  proFormEmits,
  proFormProps
};

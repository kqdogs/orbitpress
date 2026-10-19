const crudBuilderProps = {
  /** 增删改查配置 */
  modelValue: Object,
  /** 顶栏右侧操作按钮顺序 */
  headerTools: {
    type: [Boolean, Array],
    default: () => void 0
  },
  /** 模板库数据 */
  templateData: Array,
  /** 页面设置的表单项配置 */
  pageConfigFormItems: Array,
  /** 字段编辑的表单项配置 */
  fieldEditFormItems: Array,
  /** 自定义分割面板组件属性 */
  splitPanelProps: Object,
  /** 增删改查组件 */
  crudComponent: [String, Object, Function],
  /** 高级表单组件 */
  proFormComponent: [String, Object, Function],
  /** 表单构建组件 */
  proFormBuilderComponent: [
    String,
    Object,
    Function
  ],
  /** 表单构建组件属性 */
  proFormBuilderProps: Object,
  /** 代码编辑器组件 */
  codeEditerComponent: [String, Object, Function],
  /** JSON 编辑器组件 */
  jsonEditerComponent: [String, Object, Function],
  /** 代码查看器组件 */
  codeViewerComponent: [String, Object, Function],
  /** 高级表单组件类型数据 */
  itemTypeData: Array,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function]
};
const crudBuilderEmits = {
  "update:modelValue": (_config) => true
};
export {
  crudBuilderEmits,
  crudBuilderProps
};

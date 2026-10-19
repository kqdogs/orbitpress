const proFormBuilderProps = {
  /** 配置数据 */
  modelValue: Object,
  /** 顶栏右侧操作按钮顺序 */
  headerTools: {
    type: [Boolean, Array],
    default: () => void 0
  },
  /** 组件库数据 */
  componentData: Array,
  /** 模板库数据 */
  templateData: Array,
  /** 表单属性设置的表单项配置 */
  configFormItems: Array,
  /** 表单属性设置的组件预设属性值 */
  configFormPresetProps: Object,
  /** 初始添加时的表单属性 */
  proFormInitialProps: Object,
  /** 自定义分割面板组件属性 */
  splitPanelProps: Object,
  /** 自定义右侧分割面板组件属性 */
  rightSplitPanelProps: Object,
  /** 高级表单组件 */
  proFormComponent: [String, Object, Function],
  /** 代码编辑器组件 */
  codeEditerComponent: [String, Object, Function],
  /** JSON 编辑器组件 */
  jsonEditerComponent: [String, Object, Function],
  /** 富文本编辑器组件 */
  htmlEditerComponent: [String, Object, Function],
  /** 代码查看器组件 */
  codeViewerComponent: [String, Object, Function],
  /** 高级表单组件类型数据 */
  itemTypeData: Array,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function]
};
const proFormBuilderEmits = {
  "update:modelValue": (_config) => true,
  previewFormSubmit: (_data) => true
};
export {
  proFormBuilderEmits,
  proFormBuilderProps
};

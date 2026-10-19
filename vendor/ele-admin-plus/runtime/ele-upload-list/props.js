const uploadListProps = {
  /** 已上传列表 */
  modelValue: Array,
  /** 是否只读 */
  readonly: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 是否支持点击预览打开图片预览组件 */
  preview: {
    type: Boolean,
    default: true
  },
  /** 最大上传数量 */
  limit: Number,
  /** 是否支持多选文件 */
  multiple: Boolean,
  /** 是否启用拖拽上传 */
  drag: Boolean,
  /** 接受上传的文件类型 */
  accept: {
    type: String,
    default: "image/png,image/jpeg"
  },
  /** 自定义条目样式 */
  itemStyle: [Object, Boolean],
  /** 自定义上传按钮样式 */
  buttonStyle: {
    type: [Object, Boolean],
    default: null
  },
  /** 是否开启拖拽排序 */
  sortable: {
    type: [Boolean, Object],
    default: true
  },
  /** 自定义图片属性 */
  imageProps: Object,
  /** 自定义进度条属性 */
  progressProps: Object,
  /** 自定义图片预览属性 */
  previewProps: Object,
  /** 是否开启底部预览和修改的操作按钮 */
  tools: Boolean,
  /** 列表显示样式 */
  listType: String,
  /** 上传按钮点击前的钩子 */
  beforeUploadClick: Function,
  /** 修改按钮点击前的钩子 */
  beforeItemEdit: Function,
  /** 预览按钮点击前的钩子 */
  beforePreview: Function,
  /** 国际化 */
  locale: Object
};
const uploadListEmits = {
  /** 更新绑定值 */
  "update:modelValue": (_value) => true,
  /** item 点击事件 */
  itemClick: (_item) => true,
  /** 上传事件 */
  upload: (_item) => true,
  /** item 移除事件 */
  remove: (_item) => true,
  /** item 上传失败重试事件 */
  retry: (_item) => true,
  /** item 修改上传事件 */
  editUpload: (_result) => true,
  /** item 预览事件 */
  preview: (_item) => true
};
export {
  uploadListEmits,
  uploadListProps
};

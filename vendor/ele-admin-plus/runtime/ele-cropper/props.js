const cropperProps = {
  /** 图片高度 */
  height: String,
  /** 图片地址 */
  src: String,
  /** 图片地址对应的图片类型, 如 'image/jpeg' */
  imageType: {
    type: String,
    default: "image/png"
  },
  /** 允许上传的图片类型 */
  accept: {
    type: String,
    default: "image/*"
  },
  /** 操作按钮布局 */
  tools: {
    type: String,
    default: "zoomIn,zoomOut | moveLeft,moveRight,moveUp,moveDown | rotateLeft,rotateRight | flipX,flipY | reset,upload | ok"
  },
  /** 是否需要预览组件 */
  preview: {
    type: Boolean,
    default: true
  },
  /** 预览组件宽度 */
  previewWidth: {
    type: Number,
    default: 98
  },
  /** 是否返回 blob 数据 */
  toBlob: Boolean,
  /** cropperjs 参数 */
  options: Object,
  /** cropperjs 裁剪方法参数 */
  croppedOptions: Object,
  /** 裁剪比例 */
  aspectRatio: Number,
  /** 是否需要 tooltip */
  tooltip: {
    type: Boolean,
    default: true
  },
  /** tooltip 属性 */
  tooltipProps: Object,
  /** 上传按钮点击前的钩子 */
  beforeUploadClick: Function,
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: null
  },
  /** 国际化 */
  locale: Object
};
const cropperEmits = {
  /** 初始化完成事件 */
  init: (_cropperInstance) => true,
  /** 裁剪完成事件 */
  done: (_result) => true
};
export {
  cropperEmits,
  cropperProps
};

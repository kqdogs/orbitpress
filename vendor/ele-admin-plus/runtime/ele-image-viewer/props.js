import { imageViewerProps as imageViewerProps$1 } from "element-plus";
const imageViewerProps = {
  ...imageViewerProps$1,
  teleported: {
    type: Boolean,
    default: true
  },
  /** 是否打开 */
  modelValue: Boolean,
  /** 自定义类名 */
  customClass: String,
  /** 自定义样式 */
  customStyle: Object,
  /** 过渡动画名称 */
  transitionName: {
    type: String,
    default: "ele-image-viewer-fade"
  },
  /** 是否失活后仍然显示 */
  keepAlive: Boolean
};
const imageViewerEmits = {
  /** 更新打开状态 */
  "update:modelValue": (_value) => true,
  /** 关闭事件 */
  close: () => true,
  /** 切换图像事件 */
  switch: (_index) => true,
  /** 旋转图像事件 */
  rotate: (_deg) => true
};
export {
  imageViewerEmits,
  imageViewerProps
};

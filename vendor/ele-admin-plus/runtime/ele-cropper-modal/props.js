import { cropperProps, cropperEmits } from "../ele-cropper/props";
const cropperModalProps = {
  ...cropperProps,
  /** 弹窗是否显示 */
  modelValue: Boolean,
  /** 弹窗参数 */
  modalProps: Object
};
const cropperModalEmits = {
  ...cropperEmits,
  /** 更新弹窗显示状态 */
  "update:modelValue": (_value) => true
};
export {
  cropperModalEmits,
  cropperModalProps
};

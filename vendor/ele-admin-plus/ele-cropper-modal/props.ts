import type { PropType, ExtractPropTypes } from 'vue';
import type { EleModalProps } from '../ele-app/plus';
import { cropperProps, cropperEmits } from '../ele-cropper/props';

/**
 * 属性
 */
export const cropperModalProps = {
  ...cropperProps,
  /** 弹窗是否显示 */
  modelValue: Boolean,
  /** 弹窗参数 */
  modalProps: Object as PropType<Partial<Omit<EleModalProps, 'modelValue'>>>
};

export type CropperModalProps = ExtractPropTypes<typeof cropperModalProps>;

/**
 * 事件
 */
export const cropperModalEmits = {
  ...cropperEmits,
  /** 更新弹窗显示状态 */
  'update:modelValue': (_value: boolean) => true
};

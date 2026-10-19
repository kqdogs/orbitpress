import type { ExtractPropTypes, EmitsToProps } from 'vue';
import { imageViewerProps as elImageViewerProps } from 'element-plus';

/**
 * 属性
 */
export const imageViewerProps = {
  ...elImageViewerProps,
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
    default: 'ele-image-viewer-fade'
  },
  /** 是否失活后仍然显示 */
  keepAlive: Boolean
};

export type ImageViewerProps = ExtractPropTypes<typeof imageViewerProps>;

/**
 * 事件
 */
export const imageViewerEmits = {
  /** 更新打开状态 */
  'update:modelValue': (_value?: boolean) => true,
  /** 关闭事件 */
  close: () => true,
  /** 切换图像事件 */
  switch: (_index: number) => true,
  /** 旋转图像事件 */
  rotate: (_deg: number) => true
};

export type ImageViewerEmitsProps = EmitsToProps<typeof imageViewerEmits>;

export type ImageViewerPropsAndEmits = ImageViewerProps & ImageViewerEmitsProps;

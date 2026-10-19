import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { Level, ImageSettings, QrCodeTag } from './types';

/**
 * 属性
 */
export const qrCodeProps = {
  /** 绑定值 */
  value: String,
  /** 尺寸 */
  size: {
    type: Number,
    default: 128
  },
  /** 容错等级 */
  level: {
    type: String as PropType<Level>,
    default: 'L'
  },
  /** 背景色 */
  bgColor: {
    type: String,
    default: '#FFFFFF'
  },
  /** 颜色 */
  fgColor: {
    type: String,
    default: '#000000'
  },
  /** 外间距 */
  margin: {
    type: Number,
    default: 0
  },
  /** 自定义图片 */
  imageSettings: Object as PropType<ImageSettings>,
  /** 自定义样式 */
  customStyle: Object as PropType<StyleValue>,
  /** 渲染标签 */
  tag: String as PropType<QrCodeTag>
};

export type QrCodeProps = ExtractPropTypes<typeof qrCodeProps>;

/**
 * 事件
 */
export const qrCodeEmits = {
  /** 渲染完成事件 */
  done: () => true
};

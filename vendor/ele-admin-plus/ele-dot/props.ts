import type { PropType, ExtractPropTypes } from 'vue';
import type { DotType } from './types';

/**
 * 属性
 */
export const dotProps = {
  /** 类型 */
  type: String as PropType<DotType>,
  /** 自定义颜色 */
  color: String,
  /** 是否显示水波动画 */
  ripple: {
    type: Boolean,
    default: true
  },
  /** 文本 */
  text: String,
  /** 尺寸 */
  size: {
    type: String,
    default: '6px'
  }
};

export type DotProps = ExtractPropTypes<typeof dotProps>;

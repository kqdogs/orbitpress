import type { PropType, ExtractPropTypes } from 'vue';
import { textProps } from '../ele-text/props';
import type { EllipsisTooltip } from './types';

/**
 * 属性
 */
export const ellipsisProps = {
  ...textProps,
  /** 最大行数 */
  maxLine: Number,
  /** 行高 */
  lineHeight: [Number, String],
  /** 文字提示属性 */
  tooltip: {
    type: [Boolean, Object] as PropType<boolean | EllipsisTooltip>,
    default: () => {
      return { original: true };
    }
  }
};

export type EllipsisProps = ExtractPropTypes<typeof ellipsisProps>;

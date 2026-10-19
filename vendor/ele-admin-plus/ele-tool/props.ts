import type { PropType, ExtractPropTypes } from 'vue';
import type { EleTooltipProps } from '../ele-app/plus';

/**
 * 属性
 */
export const toolProps = {
  /** 提示文字 */
  title: String,
  /** 提示方向 */
  placement: {
    type: String as PropType<EleTooltipProps['placement']>,
    default: 'top'
  },
  /** 是否禁用提示 */
  disabled: Boolean,
  /** 是否点击时关闭提示 */
  clickHideTooltip: Boolean
};

export type ToolProps = ExtractPropTypes<typeof toolProps>;

/**
 * 事件
 */
export const toolEmits = {
  /** 点击事件 */
  click: (_e: MouseEvent) => true
};

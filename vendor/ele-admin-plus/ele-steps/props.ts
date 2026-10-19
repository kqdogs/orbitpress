import type { PropType, ExtractPropTypes } from 'vue';
import { stepsProps as elStepsProps } from 'element-plus';
import type { StepType, StepItem, StepItemsFunction } from './types';

/**
 * 属性
 */
export const stepsProps = {
  ...elStepsProps,
  /** 步骤条数据 */
  items: Array as PropType<StepItem[] | StepItemsFunction>,
  /** 类型 */
  type: String as PropType<StepType>
};

export type StepsProps = ExtractPropTypes<typeof stepsProps>;

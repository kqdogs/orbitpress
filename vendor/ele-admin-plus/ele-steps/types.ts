import type { ElStepProps } from '../ele-app/el';

/**
 * 步骤条数据
 */
export interface StepItem extends ElStepProps {
  /** 循环的 key */
  key?: PropertyKey;
}

/**
 * 步骤条类型
 */
export type StepType = 'inline' | null;

/**
 * 步骤条数据请求方法
 */
export type StepItemsFunction = () => Promise<StepItem[]>;

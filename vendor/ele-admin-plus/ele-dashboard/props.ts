import type { PropType, ExtractPropTypes } from 'vue';
import type { DashboardType } from './types';

/**
 * 属性
 */
export const dashboardProps = {
  /** 类型 */
  type: String as PropType<DashboardType>,
  /** 自定义颜色 */
  color: String,
  /** 尺寸 */
  size: [Number, String],
  /** 间距 */
  space: [Number, String]
};

export type DashboardProps = ExtractPropTypes<typeof dashboardProps>;

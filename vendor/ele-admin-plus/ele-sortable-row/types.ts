import type { ElColProps } from '../ele-app/el';

/**
 * 数据
 */
export interface SortableColItem extends Record<string, any> {
  /** key */
  key?: string;
  /** ElCol 属性 */
  colProps?: ElColProps;
}

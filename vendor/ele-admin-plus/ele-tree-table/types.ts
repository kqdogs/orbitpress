import type { StyleValue } from '../ele-app/types';

/**
 * 树表格数据
 */
export interface TreeTableDataItem extends Record<string, any> {
  /** key */
  key?: any;
  /** 子级 */
  children?: TreeTableDataItem[];
}

/**
 * 树表格列配置
 */
export interface TreeTableColumn extends Record<string, any> {
  /** key */
  key?: string;
  /** 标题 */
  label?: string;
  /** 属性名 */
  prop?: string;
  /** 样式 */
  style?: StyleValue;
  /** 类名 */
  class?: string;
}

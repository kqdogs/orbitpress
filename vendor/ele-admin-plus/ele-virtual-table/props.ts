import type { ExtractPropTypes } from 'vue';
import { dataTableProps, dataTableEmits } from '../ele-data-table/props';
import type { ScrollPos } from './types';

/**
 * 属性
 */
export const virtualTableProps = {
  ...dataTableProps,
  /** 行高 */
  rowHeight: Number
};

export type VirtualTableProps = ExtractPropTypes<typeof virtualTableProps>;

/**
 * 事件
 */
export const virtualTableEmits = {
  ...dataTableEmits,
  endEeached: (_params: any) => true,
  scroll: (_params: ScrollPos) => true,
  rowsRendered: (_params: any) => true
};

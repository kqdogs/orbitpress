import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { TreeTableDataItem, TreeTableColumn } from './types';

/**
 * 属性
 */
export const treeTableProps = {
  /** 数据 */
  data: Array as PropType<TreeTableDataItem[]>,
  /** 列配置 */
  columns: Array as PropType<TreeTableColumn[]>,
  /** 表格高度 */
  height: String,
  /** 表格样式 */
  tableStyle: [Object, Array, String] as PropType<StyleValue>,
  /** 表头样式 */
  headerStyle: [Object, Array, String] as PropType<StyleValue>,
  /** 序号列宽度 */
  indexColWidth: {
    type: Number,
    default: 24
  }
};

export type TreeTableProps = ExtractPropTypes<typeof treeTableProps>;

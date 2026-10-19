import type { PropType, ExtractPropTypes } from 'vue';
import { elTableProps } from '../utils/lib-export';
import { omit } from '../utils/common';
import type {
  DataKey,
  DataItem,
  Column,
  Columns,
  Sorter,
  Filter,
  TableEmptyProps,
  RowClickChecked,
  RowKey
} from './types';
const normalizeProps = omit(elTableProps, ['style']);

/**
 * 属性
 */
export const dataTableProps = {
  ...normalizeProps,
  stripe: {
    type: Boolean,
    default: null
  },
  border: {
    type: Boolean,
    default: null
  },
  rowKey: {
    type: [String, Function] as PropType<RowKey>,
    required: true
  },
  /** 列配置 */
  columns: {
    type: Array as PropType<Columns>,
    required: true
  },
  /** 起始编号 */
  pageIndex: Number,
  /** 空数据时显示的错误文本 */
  errorText: String,
  /** 表头内容超出省略 */
  headerEllipsis: {
    type: Boolean,
    default: true
  },
  /** 插槽不渲染非正常的调用 */
  slotNormalize: {
    type: Boolean,
    default: true
  },
  /** 设置粘性头部 */
  sticky: Boolean,
  /** 是否显示下边框线 */
  bottomLine: {
    type: Boolean,
    default: true
  },
  /** 空组件属性 */
  emptyProps: {
    type: [Boolean, Object] as PropType<TableEmptyProps>,
    default: () => {
      return null;
    }
  },
  /** 多选时行点击选中 */
  rowClickChecked: [Boolean, String] as PropType<RowClickChecked>,
  /** 单选选中是否保留不存在的数据 */
  reserveCurrent: Boolean,
  /** 多选选中行的值 */
  selectedRowKeys: Array as PropType<DataKey[]>,
  /** 缓存数据 */
  cacheData: Array as PropType<DataItem[]>
};

export type DataTableProps = ExtractPropTypes<typeof dataTableProps>;

/**
 * ElTable 的事件
 */
export const elDataTableEmits = {
  select: (_selection: DataItem[], _row: DataItem) => true,
  selectAll: (_selection: DataItem[]) => true,
  selectionChange: (_selection: DataItem[]) => true,
  cellMouseEnter: (
    _row: DataItem,
    _column: Column,
    _cell: HTMLTableCellElement,
    _e: MouseEvent
  ) => true,
  cellMouseLeave: (
    _row: DataItem,
    _column: Column,
    _cell: HTMLTableCellElement,
    _e: MouseEvent
  ) => true,
  cellClick: (
    _row: DataItem,
    _column: Column,
    _cell: HTMLTableCellElement,
    _e: MouseEvent
  ) => true,
  cellDblclick: (
    _row: DataItem,
    _column: Column,
    _cell: HTMLTableCellElement,
    _e: MouseEvent
  ) => true,
  cellContextmenu: (
    _row: DataItem,
    _column: Column,
    _cell: HTMLTableCellElement,
    _e: MouseEvent
  ) => true,
  rowClick: (
    _row: DataItem,
    _column: Column,
    _e: MouseEvent,
    _disabled?: boolean,
    _selection?: DataItem[]
  ) => true,
  rowContextmenu: (_row: DataItem, _column: Column, _e: MouseEvent) => true,
  rowDblclick: (_row: DataItem, _column: Column, _e: MouseEvent) => true,
  headerClick: (_column: Column, _e: MouseEvent) => true,
  headerContextmenu: (_column: Column, _e: MouseEvent) => true,
  sortChange: (_sorter: Sorter) => true,
  filterChange: (_filter: Filter) => true,
  currentChange: (_current?: DataItem | null, _old?: DataItem | null) => true,
  headerDragend: (
    _width: number,
    _old: number,
    _column: Column,
    _e: MouseEvent
  ) => true,
  expandChange: (_row: DataItem, _expanded: boolean) => true,
  scroll: (_option: { scrollLeft: number; scrollTop: number }) => true
};

/**
 * 事件
 */
export const dataTableEmits = {
  ...elDataTableEmits,
  /** 更新单选选中行的值 */
  'update:currentRowKey': (_currentRowKey?: DataKey) => true,
  /** 更新多选选中行的值 */
  'update:selectedRowKeys': (_selectedRowKeys?: DataKey[]) => true
};

export type DataTableEmitsType = typeof dataTableEmits;

/**
 * 表格组件属性名
 */
export type TablePropKeys = Array<keyof typeof normalizeProps>;

export type DataTablePropKeys = Array<keyof typeof dataTableProps>;

export const tablePropKeys: TablePropKeys = Object.keys(normalizeProps) as any;

export const dataTablePropKeys: DataTableProps = Object.keys(
  dataTableProps
) as any;

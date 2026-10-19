import type { VNode } from 'vue';
import type {
  Column as TableV2Column,
  ExtractRowPropGetter,
  RowExpandHandler,
  SortBy,
  HeaderClassNameGetter,
  ExtractHeaderPropGetter
} from 'element-plus/es/components/table-v2';
import type { ScrollPos } from 'element-plus/es/components/table-v2/src/composables/use-scrollbar';
import type { Alignment as ScrollStrategy } from 'element-plus/es/components/virtual-list';
import type { ElTableV2Props } from '../ele-app/el';
import type {
  DataKey,
  DataItem,
  Column,
  Columns,
  FilterValue,
  Sorter
} from '../ele-data-table/types';
export { RowExpandHandler, ScrollStrategy, SortBy, ScrollPos };

/**
 * 表格属性
 */
export type TableV2Props = Required<Exclude<ElTableV2Props, 'class' | 'style'>>;

/**
 * 获取行类名方法
 */
export type RowClassFunction = ExtractRowPropGetter<DataItem>;

/**
 * 获取行属性方法
 */
export type RowPropsFunction = ExtractRowPropGetter<DataItem>;

/**
 * 获取表头行类名方法
 */
export type HeaderRowClassFunction = HeaderClassNameGetter<DataItem>;

/**
 * 获取表头行属性方法
 */
export type HeaderRowPropsFunction = ExtractHeaderPropGetter<DataItem>;

/**
 * 列配置
 */
export type VirtualColumn = Partial<TableV2Column<DataItem>>;

/**
 * 表格列配置
 */
export type VirtualColumns = VirtualColumn[];

/**
 * 嵌套数据配置项
 */
export interface TreeTableProps {
  /** 子级字段名 */
  childrenName: string;
  /** 懒加载标识是否有子级字段名 */
  hasChildrenName: string;
}

/**
 * 主体列配置
 */
export interface BodyColumn {
  /** 唯一值 */
  key: string;
  /** 数据值字段名 */
  dataKey?: string;
  /** 指定的宽度 */
  width?: number;
  /** 最小宽度 */
  minWidth: number;
  /** 是否是最后一个左侧固定列 */
  isFixedLeftLast?: boolean;
  /** 是否是第一个右侧固定列 */
  isFixedRightFirst?: boolean;
  /** 原始列配置 */
  originalCol: Column;
}

/**
 * 主体行的列配置
 */
export type BodyColumns = BodyColumn[];

/**
 * 表头列配置
 */
export interface HeaderColumn {
  /** 唯一值 */
  key?: string;
  /** 所占列数 */
  colspan?: number;
  /** 所占行数 */
  rowspan?: number;
  /** 是否是最后一个左侧固定列 */
  isFixedLeftLast?: boolean;
  /** 是否是第一个右侧固定列 */
  isFixedRightFirst?: boolean;
  /** 原始的列配置 */
  originalCol?: Column;
}

/**
 * 表头行的列配置
 */
export type HeaderColumns = HeaderColumn[];

/**
 * 表头行的数据
 */
export type HeaderRows = HeaderColumns[];

/**
 * 数据
 */
export interface VirtualRow {
  /** 行唯一值 */
  rowId: DataKey;
  /** 行索引 */
  rowIndex: number;
  /** 行原始数据 */
  rowData: DataItem;
  /** 行是否禁用 */
  isDisabled?: boolean;
  /** 是否是展开行 */
  isExpandRow?: boolean;
  /** 子级数据 */
  children?: VirtualRow[];
  /** 懒加载时标识是否有子级数据 */
  hasChildren?: boolean;
}

/**
 * 合并单元格
 */
export interface CellSpan {
  /** 所占列数 */
  colspan?: number;
  /** 所占行数 */
  rowspan?: number;
}

/**
 * 列尺寸
 */
export interface ColSize {
  /** 列宽 */
  width: number;
  /** 左侧固定列位置 */
  fixedLeft?: string;
  /** 右侧固定列位置 */
  fixedRight?: string;
}

/**
 * 合计行列
 */
export interface SumCol extends ColSize {
  /** 唯一值 */
  key: string;
  /** 显示文本 */
  text?: string | VNode;
  /** 对齐方式 */
  align?: string;
  /** 固定列 */
  fixed?: string | boolean;
  /** 是否是最后一个左侧固定列 */
  isFixedLeftLast?: boolean;
  /** 是否是第一个右侧固定列 */
  isFixedRightFirst?: boolean;
}

/**
 * 表头列筛选改变事件参数
 */
export interface CellFilterChangeParams {
  /** 列配置 */
  column: Column;
  /** 筛选值 */
  value: FilterValue;
}

/**
 * 表格状态数据
 */
export interface TableState {
  /** 单选选中数据 */
  row?: DataItem;
  /** 单选上次选中数据 */
  oldRow?: DataItem;
  /** 多选选中数据 */
  checked: Map<DataKey, DataItem>;
  /** 多选选中是否保留不存在的数据 */
  reserveChecked: boolean;
  /** 表格垂直滚动位置 */
  scrollTop: number;
  /** 表格排序状态 */
  sorter?: Sorter;
}

/**
 * 单元格获取自定义配置的参数
 */
export interface CellParams {
  /** 列配置 */
  column?: Column;
  /** 列索引 */
  columnIndex: number;
  /** 行数据 */
  row: DataItem;
  /** 行索引 */
  rowIndex: number;
  /** 数据 */
  data?: DataItem[];
  /** 列配置 */
  columns?: Columns;
}

/**
 * 自定义渲染组件属性
 */
export interface CustomRenderProps {
  /** 自定义渲染方法 */
  render?: (
    ...params: any
  ) =>
    | string
    | VNode
    | VNode[]
    | number
    | boolean
    | Record<string, any>
    | Array<any>
    | undefined;
  /** 自定义渲染参数 */
  params?: Array<any>;
}

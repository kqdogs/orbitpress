import type { VNode } from 'vue';
import type { Sort } from 'element-plus/es/components/table';
import type {
  ElTableProps,
  ElColumnProps,
  ElTableInstance,
  ElEmptyProps
} from '../ele-app/el';
import type { EleTooltipProps } from '../ele-app/plus';
import type { UserComponent } from '../ele-app/types';

/**
 * 数据唯一键
 */
export type DataKey = string | number;

/**
 * 数据
 */
export interface DataItem extends Record<keyof any, any> {
  /** 是否为模拟数据, 用于保留不存在的选中数据 */
  _isMock?: boolean;
}

/**
 * 原始列属性
 */
export type TableColumn = Partial<ElColumnProps>;

/**
 * 列属性
 */
export interface ColumnBase extends Omit<
  TableColumn,
  | 'id'
  | 'realWidth'
  | 'level'
  | 'isColumnGroup'
  | 'isSubColumn'
  | 'columns'
  | 'no'
  | 'filterOpened'
  | 'renderHeader'
  | 'showOverflowTooltip'
  | 'tooltipFormatter'
  | 'formatter'
  | 'filterMethod'
  | 'filterPlacement'
  | 'filterable'
  | 'children'
> {
  renderHeader?: (data: {
    column: ColumnBase;
    $index: number;
    store: any;
    _self: any;
  }) => VNode;
  showOverflowTooltip?: boolean | Record<string, any>;
  tooltipFormatter?: (data: {
    row: DataItem;
    column: ColumnBase;
    cellValue: any;
  }) => VNode | string;
  formatter?: (
    row: DataItem,
    column: ColumnBase,
    cellValue: any,
    index: number
  ) => VNode | string;
  filterMethod?: (value: string, row: DataItem, column: ColumnBase) => void;
  filterPlacement?: EleTooltipProps['placement'];
  /** 唯一标识 */
  uid?: string;
  /** 插槽名称 */
  slot?: string;
  /** 表头插槽名称 */
  headerSlot?: string;
  /** 自定义筛选图标 */
  filterIcon?: UserComponent;
  /** 是否隐藏 */
  hideInTable?: boolean;
  /** 是否不显示在列配置中 */
  hideInSetting?: boolean;
  /** 是否不显示在导出列中 */
  hideInExport?: boolean;
  /** 是否不显示在打印列中 */
  hideInPrint?: boolean;
  /** 打印插槽名称 */
  printSlot?: string;
  /** 打印表头插槽名称 */
  printHeaderSlot?: string;
}

/**
 * 列属性
 */
export interface Column extends ColumnBase {
  /** 子级 */
  children?: ColumnBase[];
}

/**
 * 列属性
 */
export type Columns = Column[];

/**
 * 排序方式
 */
export interface Sorter extends Partial<Sort> {
  /** 列配置 */
  column?: Column;
}

/**
 * 筛选条件
 */
export type Filter = Record<string, FilterValue>;

/**
 * 筛选值
 */
export type FilterValue = string[] | undefined;

/**
 * 排序方式值
 */
export type OrderValue = Exclude<Sorter['order'], undefined>;

/**
 * 表格状态
 */
export interface TableState {
  /** 当前排序参数 */
  sorter?: Sorter;
  /** 当前筛选参数 */
  filter?: Filter;
  /** 单选选中值 */
  key: DataKey | null;
  /** 单选选中数据 */
  row?: DataItem;
  /** 单选上次选中数据 */
  oldRow?: DataItem;
  /** 多选选中值 */
  checkedKeys: DataKey[];
  /** 多选选中数据 */
  checked: DataItem[];
  /** 多选选中是否保留不存在的数据 */
  reserveChecked: boolean;
}

/**
 * 多选时行点击选中
 */
export type RowClickChecked = boolean | 'smart';

/**
 * 表格空组件属性
 */
export type TableEmptyProps = boolean | ElEmptyProps;

/**
 * 获取表格实例
 */
export type GetInstance = () => ElTableInstance | undefined | null;

/**
 * 表格实例方法
 */
export interface TableMethods {
  clearSelection: () => void;
  getSelectionRows: () => DataItem[] | undefined;
  toggleRowSelection: (
    row: DataItem,
    selected?: boolean,
    ignoreSelectable?: boolean
  ) => void;
  toggleAllSelection: () => void;
  toggleRowExpansion: (row: DataItem, expanded?: boolean) => void;
  setCurrentRow: (row?: DataItem | null) => void;
  clearSort: () => void;
  clearFilter: (columnKeys?: string[]) => void;
  doLayout: () => void;
  sort: (prop: string, order: string) => void;
  scrollTo: (options: number | ScrollToOptions, yCoord?: number) => void;
  setScrollTop: (top?: number) => void;
  setScrollLeft: (left?: number) => void;
  /** 设置单选选中值 */
  setCurrentRowKey: (key?: DataKey | null) => void;
  /** 获取单选选中数据 */
  getCurrentRow: () => DataItem | undefined;
  /** 设置多选选中数据 */
  setSelectedRows: (rows?: DataItem[]) => void;
  /** 设置多选选中值 */
  setSelectedRowKeys: (keys?: DataKey[], rows?: DataItem[]) => void;
  /** 切换所有行展开状态 */
  toggleRowExpansionAll: (expanded?: boolean) => void;
  /** 更新单选和多选选中 */
  updateSelectedAndChecked: () => void;
}

/**
 * 表格尺寸
 */
export type TableSize = ElTableProps<DataItem>['size'];

/**
 * 树表格懒加载方法
 */
export type TableLoad = ElTableProps<DataItem>['load'];

/**
 * 树表格懒加载回调
 */
export type ResolveFunction = (data: DataItem[]) => void;

/**
 * 嵌套数据配置项
 */
export interface TreeProps {
  hasChildren?: string;
  children?: string;
}

/**
 * 溢出提示组件属性
 */
export type ShowOverflowTooltip = Column['showOverflowTooltip'];

/**
 * 溢出提示组件主题
 */
export type TooltipEffect = ElTableProps<DataItem>['tooltipEffect'];

/**
 * 溢出提示组件全局配置
 */
export type TooltipOptions = ElTableProps<DataItem>['tooltipOptions'];

/**
 * 单元格类名自定义
 */
export type CellClass = ElTableProps<DataItem>['cellClassName'];

/**
 * 单元格样式自定义
 */
export type CellStyle = ElTableProps<DataItem>['cellStyle'];

/**
 * 行类名自定义
 */
export type RowClass = ElTableProps<DataItem>['rowClassName'];

/**
 * 行样式自定义
 */
export type RowStyle = ElTableProps<DataItem>['rowStyle'];

/**
 * 表头单元格类名自定义
 */
export type HeaderCellClass = ElTableProps<DataItem>['headerCellClassName'];

/**
 * 表头单元格样式自定义
 */
export type HeaderCellStyle = ElTableProps<DataItem>['headerCellStyle'];

/**
 * 表头行类名自定义
 */
export type HeaderRowClass = ElTableProps<DataItem>['headerRowClassName'];

/**
 * 表头行样式自定义
 */
export type HeaderRowStyle = ElTableProps<DataItem>['headerRowStyle'];

/**
 * 单元格合并方法
 */
export type SpanMethod = ElTableProps<DataItem>['spanMethod'];

/**
 * 行数据唯一值的字段名
 */
export type RowKey = ElTableProps<DataItem>['rowKey'];

/**
 * 表尾合计计算方法
 */
export type SummaryMethod = ElTableProps<DataItem>['summaryMethod'];

/**
 * 控制行是否可选中的方法
 */
export type RowSelectable = Column['selectable'];

/**
 * 序号列起始索引
 */
export type ColumnIndex = Column['index'];

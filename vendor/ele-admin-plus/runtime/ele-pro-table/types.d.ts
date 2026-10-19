import type {
  EleDataTableInstance,
  EleVirtualTableInstance,
  ElePaginationProps,
  EleModalProps,
  ElePrinterProps,
  EleTableProps
} from '../ele-app/plus';
import type { PaginationTotal } from '../ele-pagination/types';
import type {
  DataItem,
  Column,
  Columns,
  Sorter,
  Filter,
  TableColumn,
  TableSize,
  ResolveFunction,
  SpanMethod,
  SummaryMethod
} from '../ele-data-table/types';
import type { BodyColumns } from '../ele-virtual-table/types';
export type {
  DataItem,
  Column,
  Columns,
  Sorter,
  Filter,
  TableColumn,
  TableSize,
  ResolveFunction
};

/**
 * 分页参数
 */
export type Pages = Record<string, number>;

/**
 * 搜索参数
 */
export type Where = Record<keyof any, any>;

/**
 * 排序参数
 */
export type Orders = Record<string, OrderValue>;

/**
 * 筛选参数
 */
export type Filters = Record<string, any>;

/**
 * 数据源方法参数
 */
export interface DatasourceParams {
  /** 页码 */
  page?: number;
  /** 每页显示数量 */
  limit?: number;
  /** 分页参数 */
  pages: Pages;
  /** 搜索参数 */
  where: Where;
  /** 排序参数 */
  orders: Orders;
  /** 筛选参数 */
  filters: Filters;
  /** 排序方式 */
  sorter: Sorter;
  /** 筛选条件 */
  filter: Filter;
  /** 树表懒加载父级数据 */
  parent?: DataItem;
  /** 表格的列配置 */
  columns: Columns;
  /** 表格的列配置(含未勾选的列) */
  tableColumns?: Columns;
}

/**
 * 数据源方法返回结果
 */
export type DatasourceResult = DataItem[] | Record<string, any> | undefined;

/**
 * 数据源方法
 * @param params 参数
 */
export type DatasourceFunction = (
  params: DatasourceParams
) => Promise<DatasourceResult>;

/**
 * 数据源
 */
export type Datasource = DataItem[] | DatasourceFunction;

/**
 * 刷新方法参数
 */
export interface ReloadParams {
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 搜索参数 */
  where?: Where;
  /** 排序方式 */
  sorter?: Sorter;
  /** 筛选条件 */
  filter?: Filter;
}

/**
 * 刷新方法
 * @param option 刷新参数
 * @param parent 树表格父级数据
 * @param resolve 树表格懒加载方法
 * @param backTop 是否让滚动条回到顶部
 */
export type ReloadFunction = (
  option?: ReloadParams,
  parent?: DataItem,
  resolve?: ResolveFunction,
  backTop?: boolean
) => void;

/**
 * 排序的值
 */
export type OrderValue = string | number | boolean | null | undefined;

/**
 * 请求参数设置
 */
export interface RequestOption {
  /** 页码参数名称 */
  pageName?: string;
  /** 每页数量参数名称 */
  limitName?: string;
  /** 排序字段参数名称 */
  sortName?: string;
  /** 排序方式参数名称 */
  orderName?: string;
  /** 升序的排序值 */
  ascValue?: OrderValue;
  /** 降序的排序值 */
  descValue?: OrderValue;
}

/**
 * 响应参数设置
 */
export interface ResponseOption {
  /** 数据列表字段名称 */
  dataName?: string;
  /** 数据总数字段名称 */
  countName?: string;
}

/**
 * 响应数据解析方法
 */
export type ParseData = (data: unknown) => DatasourceResult;

/**
 * 排序方式封装
 */
export interface OrderItem {
  /** 排序字段名 */
  field: string;
  /** 是否是降序 */
  descend: boolean;
  /** 自定义排序方法 */
  sortMethod?: (a: DataItem, b: DataItem) => number;
}

/**
 * 渲染完成事件参数
 */
export interface DoneParams<T> {
  /** 当前页数据 */
  data: T[];
  /** 总数量 */
  total?: PaginationTotal;
  /** 当前页码 */
  page?: number;
  /** 数据源原始数据 */
  response?: any;
}

/**
 * 渲染完成事件
 */
export type DoneFunction<T> = (
  /** 返回结果 */
  result: DoneParams<T>,
  /** 树形表格时父级数据 */
  parent?: T,
  /** 是否让滚动条回到顶部 */
  backTop?: boolean
) => void;

/**
 * 分页组件属性
 */
export interface TablePagination extends ElePaginationProps {
  /** 是否自动修正页码 */
  autoAmend?: boolean;
}

/**
 * 内置工具按钮
 */
export type TableTool =
  | 'reload'
  | 'size'
  | 'columns'
  | 'maximized'
  | 'export'
  | 'print'
  | string;

/**
 * 列配置
 */
export interface ColItem {
  /** 列配置标识 */
  uid: string;
  /** 标题 */
  label?: string;
  /** 是否选中 */
  checked?: boolean;
  /** 是否固定 */
  fixed?: boolean | string;
  /** 子级数据 */
  children?: ColItem[];
  /** 列类型 */
  type?: string;
  /** 列宽 */
  width?: number | string;
}

/**
 * 请求回调参数
 */
export type FetchCallback = (options: DatasourceParams) => void;

/**
 * 请求方法
 */
export type FetchFunction = (callback: FetchCallback) => void;

/**
 * 前端分页排序方法返回结果
 */
export interface ReloadDataResult {
  /** 当前数据 */
  data: DataItem[];
  /** 当前页码 */
  page: number;
  /** 总数量 */
  total: number;
}

/**
 * 请求结果
 */
export interface ResponseResult {
  /** 当前数据 */
  data?: DataItem[];
  /** 总数量 */
  total?: number;
  /** 原始请求结果 */
  result: DatasourceResult;
}

/**
 * 获取数据源返回结果方法
 */
export type GetDatasourceResultFunction = (
  response: DatasourceResult
) => ResponseResult;

/**
 * 复合属性类型
 */
export type ProProps<T extends Record<keyof any, any>> = boolean | T;

/**
 * 表格状态
 */
export interface TableState {
  /** 当前排序参数 */
  sorter: Sorter;
  /** 当前筛选参数 */
  filter: Filter;
  /** 当前搜索参数 */
  where: Where;
  /** 当前查询任务标识 */
  reloadId: string | null;
}

/**
 * 表格组件实例
 */
export type TableViewInstance =
  | EleDataTableInstance
  | EleVirtualTableInstance
  | null;

/**
 * 导出的数据来源类型
 */
export type ExportDataType = 'selections' | 'pageData' | 'data';

/**
 * 导出主体数据节点
 */
export interface ExportBodyNode {
  /** 数据 */
  row: DataItem;
  /** 索引 */
  index: number;
  /** 所处深度 */
  level: number;
  /** 子级数量 */
  childSize: number;
}

/**
 * 导出的数据每一项
 */
export interface ExportDataItem {
  /** 唯一值 */
  key?: string;
  /** 行数据 */
  row?: DataItem;
  /** 行索引 */
  index: number;
  /** 列配置 */
  column?: Column;
  /** 文本 */
  text?: string | number | boolean | Record<string, any> | Array<any>;
  /** 所占列数 */
  colspan?: number;
  /** 所占行数 */
  rowspan?: number;
  /** 是否是展开行的单元格 */
  isExpandCell?: boolean;
  /** 是否显示树展开图标的单元格 */
  isTreeCell?: boolean;
  /** 是否是树叶子节点 */
  isTreeLeaf?: boolean;
  /** 树层级缩进 */
  indent?: number;
  /** 是否是层级序号 */
  isTreeIndex?: boolean;
  /** 层级序号是否隐藏左边框 */
  hideLeftBorder?: boolean;
  /** 层级序号是否隐藏右边框 */
  hideRightBorder?: boolean;
}

/**
 * 导出数据封装返回结果
 */
export interface ExportDataResult {
  /** 表头数据 */
  headerData: ExportDataItem[][];
  /** 主体数据 */
  bodyData: ExportDataItem[][];
  /** 表尾数据 */
  footerData: ExportDataItem[][];
  /** 主体列配置 */
  bodyCols: BodyColumns;
}

/**
 * 导出数据前的钩子函数的参数
 */
export interface BeforeExportParams {
  /** 导出的数据 */
  data: DataItem[];
  /** 导出的数据来源类型 */
  dataType: ExportDataType;
  /** 导出的列配置 */
  columns: Columns;
  /** 导出的表头数据封装 */
  headerData: ExportDataItem[][];
  /** 导出的主体数据封装 */
  bodyData: ExportDataItem[][];
  /** 导出的页脚数据封装 */
  footerData: ExportDataItem[][];
  /** 主体列配置 */
  bodyCols: BodyColumns;
  /** 文件名 */
  fileName?: string;
  /** 关闭确定按钮的加载状态 */
  hideLoading: () => void;
  /** 关闭弹窗 */
  closeModal: () => void;
  /** 导出的列配置(含未勾选的列) */
  tableColumns: Columns;
  /** 是否导出表头 */
  showHeader?: boolean;
  /** 是否导出表尾 */
  showFooter?: boolean;
  /** 是否展示层级序号 */
  showTreeIndex?: boolean;
}

/**
 * 导出数据前的钩子函数
 */
export type BeforeExport = (params: BeforeExportParams) => boolean | void;

/**
 * 导出插件
 */
export type ExportPlugin = (params: BeforeExportParams) => Promise<void>;

/**
 * 导出配置
 */
export interface ExportConfig {
  /** 弹窗参数 */
  modalProps?: EleModalProps;
  /** 表格全部数据 */
  datasource?: Datasource;
  /** 导出前的钩子函数 */
  beforeExport?: BeforeExport;
  /** 默认数据类型 */
  dataType?: ExportDataType;
  /** 默认文件名 */
  fileName?: string;
  /** 重设导出的列 */
  columns?: Columns;
  /** 默认是否导出表头 */
  showHeader?: boolean;
  /** 默认是否导出表尾 */
  showFooter?: boolean;
  /** 默认是否展示层级序号 */
  showTreeIndex?: boolean;
  /** 导出插件 */
  exportPlugin?: ExportPlugin;
  /** 单元格合并行列方法 */
  spanMethod?: SpanMethod;
  /** 合计行自定义方法 */
  summaryMethod?: SummaryMethod;
}

/**
 * 打印配置
 */
export interface PrintConfig {
  /** 弹窗参数 */
  modalProps?: EleModalProps;
  /** 打印组件参数 */
  printerProps?: ElePrinterProps;
  /** 打印表格参数 */
  tableProps?: EleTableProps;
  /** 表格全部数据 */
  datasource?: Datasource;
  /** 打印前的钩子函数 */
  beforePrint?: BeforeExport;
  /** 默认数据类型 */
  dataType?: ExportDataType;
  /** 重设打印的列 */
  columns?: Columns;
  /** 默认是否打印表头 */
  showHeader?: boolean;
  /** 默认是否打印表尾 */
  showFooter?: boolean;
  /** 默认是否展示层级序号 */
  showTreeIndex?: boolean;
  /** 打印插件 */
  printPlugin?: ExportPlugin;
  /** 单元格合并行列方法 */
  spanMethod?: SpanMethod;
  /** 合计行自定义方法 */
  summaryMethod?: SummaryMethod;
}

/**
 * 打印参数
 */
export interface TablePrintOptions extends ExportDataResult {
  /** 是否开始打印 */
  printing: boolean;
  /** 是否有表头 */
  hasHeader: boolean;
  /** 是否有表尾 */
  hasFooter: boolean;
  /** 打印的数据 */
  data: DataItem[];
}

/**
 * 导出方法参数
 */
export interface TableExportParams {
  /** 打印的数据 */
  data?: DataItem[];
  /** 打印的列 */
  columns?: Columns;
  /** 打印的列配置(含未勾选的列) */
  tableColumns?: Columns;
  /** 是否打印表头 */
  showHeader?: boolean;
  /** 是否打印表尾 */
  showFooter?: boolean;
  /** 是否展示层级序号 */
  showTreeIndex?: boolean;
  /** 数据的来源类型 */
  dataType?: ExportDataType;
  /** 导出的文件名 */
  fileName?: string;
}

/**
 * 缓存的名称
 */
export type CacheKey = string | undefined;

/**
 * 国际化
 */
export interface TableLocale {
  refresh: string;
  sizes: string;
  columns: string;
  maximized: string;
  export: string;
  print: string;
  sizeLarge: string;
  sizeDefault: string;
  sizeSmall: string;
  columnTitle: string;
  columnReset: string;
  columnUntitled: string;
  columnIndex: string;
  columnSelection: string;
  columnExpand: string;
  columnFixedLeft: string;
  columnFixedRight: string;
  columnWidth: string;
  exportOk: string;
  exportCancel: string;
  exportFileName: string;
  exportFileNamePlaceholder: string;
  exportSelectData: string;
  exportSelectColumn: string;
  exportDataTypePage: string;
  exportDataTypeSelected: string;
  exportDataTypeAll: string;
  exportOther: string;
  exportOtherHeader: string;
  exportOtherFooter: string;
  exportOtherTreeIndex: string;
}

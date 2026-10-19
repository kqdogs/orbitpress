import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { EleLoadingProps, EleToolbarProps } from '../ele-app/plus';
import { omit } from '../utils/common';
import { dataTableProps } from '../ele-data-table/props';
import { virtualTableEmits } from '../ele-virtual-table/props';
import type {
  DataItem,
  Columns,
  TableSize,
  RowKey
} from '../ele-data-table/types';
import type TableTools from './components/table-tools.vue';
import type ToolExport from './components/tool-export.vue';
import type ToolPrint from './components/tool-print.vue';
import type {
  Where,
  Datasource,
  RequestOption,
  ResponseOption,
  ParseData,
  DoneParams,
  TablePagination,
  TableTool,
  TableLocale,
  ExportConfig,
  PrintConfig
} from './types';

/**
 * 属性
 */
export const proTableProps = {
  ...omit(dataTableProps, ['data', 'pageIndex', 'errorText', 'cacheData']),
  rowKey: {
    type: [String, Function] as PropType<RowKey>,
    required: false
  },
  /** 数据请求状态 */
  loading: Boolean,
  /** 数据源 */
  datasource: {
    type: [Array, Function] as PropType<Datasource>,
    required: true
  },
  /** 默认请求参数 */
  where: Object as PropType<Where>,
  /** 自定义请求参数名称 */
  request: Object as PropType<RequestOption>,
  /** 自定义响应参数名称 */
  response: Object as PropType<ResponseOption>,
  /** 自定义响应数据解析 */
  parseData: Function as PropType<ParseData>,
  /** 初始是否请求数据 */
  loadOnCreated: {
    type: Boolean,
    default: true
  },
  /** 是否在排序和筛选改变后自动刷新 */
  loadOnChanged: {
    type: Boolean,
    default: true
  },
  /** 多选选中的数据 */
  selections: Array as PropType<DataItem[]>,
  /** 单选选中的数据 */
  current: Object as PropType<DataItem | null>,
  /** 是否开启顶部工具栏 */
  toolbar: {
    type: [Boolean, Object] as PropType<boolean | EleToolbarProps>,
    default: () => {
      return null;
    }
  },
  /** 表头工具按钮布局 */
  tools: {
    type: [Boolean, Array] as PropType<TableTool[] | boolean>,
    default: () => {
      return null;
    }
  },
  /** 列配置是否可拖拽排序 */
  columnSortable: {
    type: Boolean,
    default: true
  },
  /** 列配置是否可固定列 */
  columnFixed: {
    type: Boolean,
    default: true
  },
  /** 表格全屏时的层级 */
  maximizedIndex: Number,
  /** 表格全屏状态的高度 */
  maximizedHeight: [String, Number],
  /** 自定义表格样式 */
  tableStyle: Object as PropType<StyleValue>,
  /** 自定义底部样式 */
  footerStyle: Object as PropType<StyleValue>,
  /** 分页组件 */
  pagination: {
    type: [Boolean, Object] as PropType<boolean | TablePagination>,
    default: () => {
      return null;
    }
  },
  /** 自定义加载组件属性 */
  loadingProps: Object as PropType<EleLoadingProps>,
  /** 列配置缓存名称 */
  cacheKey: String,
  /** 是否虚拟滚动 */
  virtual: Boolean,
  /** 虚拟滚动表格行高 */
  rowHeight: Number,
  /** 国际化 */
  locale: Object as PropType<Partial<TableLocale>>,
  /** 导出配置 */
  exportConfig: Object as PropType<ExportConfig>,
  /** 打印配置 */
  printConfig: Object as PropType<PrintConfig>,
  /** 表格是否最大化状态 */
  maximized: Boolean
};

export type ProTableProps = ExtractPropTypes<typeof proTableProps>;

/**
 * 事件
 */
export const proTableEmits = {
  ...virtualTableEmits,
  /** 表格数据请求完成事件 */
  done: (_result: DoneParams<DataItem>, _parent?: DataItem) => true,
  /** 更新多选选中数据 */
  'update:selections': (_selections: DataItem[]) => true,
  /** 更新单选选中数据 */
  'update:current': (_current?: DataItem | null) => true,
  /** 列配置改变事件 */
  columnsChange: (
    _columns: Columns,
    _tableColumns: Columns,
    _isReset: boolean
  ) => true,
  /** 表格尺寸改变事件 */
  sizeChange: (_size: TableSize) => true,
  /** 表格最大化切换事件 */
  maximizedChange: (_maximized: boolean) => true,
  /** 表格最大化状态更新 */
  'update:maximized': (_maximized: boolean) => true,
  /** 数组数据源时刷新按钮点击事件 */
  refresh: () => true
};

/**
 * 默认工具按钮实例
 */
export type TableToolsInstance = InstanceType<typeof TableTools> | null;

/**
 * 导出组件实例
 */
export type ToolExportInstance = InstanceType<typeof ToolExport> | null;

/**
 * 打印组件实例
 */
export type ToolPrintInstance = InstanceType<typeof ToolPrint> | null;

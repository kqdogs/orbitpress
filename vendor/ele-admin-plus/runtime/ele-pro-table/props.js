import { omit } from "../utils/common";
import { dataTableProps } from "../ele-data-table/props";
import { virtualTableEmits } from "../ele-virtual-table/props";
const proTableProps = {
  ...omit(dataTableProps, ["data", "pageIndex", "errorText", "cacheData"]),
  rowKey: {
    type: [String, Function],
    required: false
  },
  /** 数据请求状态 */
  loading: Boolean,
  /** 数据源 */
  datasource: {
    type: [Array, Function],
    required: true
  },
  /** 默认请求参数 */
  where: Object,
  /** 自定义请求参数名称 */
  request: Object,
  /** 自定义响应参数名称 */
  response: Object,
  /** 自定义响应数据解析 */
  parseData: Function,
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
  selections: Array,
  /** 单选选中的数据 */
  current: Object,
  /** 是否开启顶部工具栏 */
  toolbar: {
    type: [Boolean, Object],
    default: () => {
      return null;
    }
  },
  /** 表头工具按钮布局 */
  tools: {
    type: [Boolean, Array],
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
  tableStyle: Object,
  /** 自定义底部样式 */
  footerStyle: Object,
  /** 分页组件 */
  pagination: {
    type: [Boolean, Object],
    default: () => {
      return null;
    }
  },
  /** 自定义加载组件属性 */
  loadingProps: Object,
  /** 列配置缓存名称 */
  cacheKey: String,
  /** 是否虚拟滚动 */
  virtual: Boolean,
  /** 虚拟滚动表格行高 */
  rowHeight: Number,
  /** 国际化 */
  locale: Object,
  /** 导出配置 */
  exportConfig: Object,
  /** 打印配置 */
  printConfig: Object,
  /** 表格是否最大化状态 */
  maximized: Boolean
};
const proTableEmits = {
  ...virtualTableEmits,
  /** 表格数据请求完成事件 */
  done: (_result, _parent) => true,
  /** 更新多选选中数据 */
  "update:selections": (_selections) => true,
  /** 更新单选选中数据 */
  "update:current": (_current) => true,
  /** 列配置改变事件 */
  columnsChange: (_columns, _tableColumns, _isReset) => true,
  /** 表格尺寸改变事件 */
  sizeChange: (_size) => true,
  /** 表格最大化切换事件 */
  maximizedChange: (_maximized) => true,
  /** 表格最大化状态更新 */
  "update:maximized": (_maximized) => true,
  /** 数组数据源时刷新按钮点击事件 */
  refresh: () => true
};
export {
  proTableEmits,
  proTableProps
};

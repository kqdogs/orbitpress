import { elTableProps } from "../utils/lib-export";
import { omit } from "../utils/common";
const normalizeProps = omit(elTableProps, ["style"]);
const dataTableProps = {
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
    type: [String, Function],
    required: true
  },
  /** 列配置 */
  columns: {
    type: Array,
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
    type: [Boolean, Object],
    default: () => {
      return null;
    }
  },
  /** 多选时行点击选中 */
  rowClickChecked: [Boolean, String],
  /** 单选选中是否保留不存在的数据 */
  reserveCurrent: Boolean,
  /** 多选选中行的值 */
  selectedRowKeys: Array,
  /** 缓存数据 */
  cacheData: Array
};
const elDataTableEmits = {
  select: (_selection, _row) => true,
  selectAll: (_selection) => true,
  selectionChange: (_selection) => true,
  cellMouseEnter: (_row, _column, _cell, _e) => true,
  cellMouseLeave: (_row, _column, _cell, _e) => true,
  cellClick: (_row, _column, _cell, _e) => true,
  cellDblclick: (_row, _column, _cell, _e) => true,
  cellContextmenu: (_row, _column, _cell, _e) => true,
  rowClick: (_row, _column, _e, _disabled, _selection) => true,
  rowContextmenu: (_row, _column, _e) => true,
  rowDblclick: (_row, _column, _e) => true,
  headerClick: (_column, _e) => true,
  headerContextmenu: (_column, _e) => true,
  sortChange: (_sorter) => true,
  filterChange: (_filter) => true,
  currentChange: (_current, _old) => true,
  headerDragend: (_width, _old, _column, _e) => true,
  expandChange: (_row, _expanded) => true,
  scroll: (_option) => true
};
const dataTableEmits = {
  ...elDataTableEmits,
  /** 更新单选选中行的值 */
  "update:currentRowKey": (_currentRowKey) => true,
  /** 更新多选选中行的值 */
  "update:selectedRowKeys": (_selectedRowKeys) => true
};
const tablePropKeys = Object.keys(normalizeProps);
const dataTablePropKeys = Object.keys(
  dataTableProps
);
export {
  dataTableEmits,
  dataTablePropKeys,
  dataTableProps,
  elDataTableEmits,
  tablePropKeys
};

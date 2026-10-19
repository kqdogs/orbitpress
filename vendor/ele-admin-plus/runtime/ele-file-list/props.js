import { svgIcons } from "./icons";
const fileListProps = {
  /** 数据 */
  data: {
    type: Array,
    required: true
  },
  /** 选择框类型 */
  selectionType: String,
  /** 多选选中数据 */
  selections: Array,
  /** 单选选中数据 */
  current: Object,
  /** 是否网格展示 */
  grid: {
    type: Boolean,
    default: true
  },
  /** 表格模式默认的列是否可以排序 */
  sortable: Boolean,
  /** 排序字段 */
  sort: String,
  /** 排序方式 */
  order: String,
  /** 网格模式后缀对应图标 */
  icons: {
    type: Array,
    default: () => {
      return svgIcons;
    }
  },
  /** 表格模式后缀对应图标 */
  smallIcons: Array,
  /** 表格模式自定义列配置 */
  columns: Array,
  /** 多选时是否支持鼠标框选 */
  boxChoose: Boolean,
  /** 右键菜单 */
  contextMenus: [Array, Function],
  /** 右键菜单属性 */
  contextMenuProps: Object,
  /** 国际化 */
  locale: Object
};
const fileListEmits = {
  /** item 点击事件 */
  itemClick: (_item) => true,
  /** 排序方式改变事件 */
  sortChange: (_sorter) => true,
  /** 更新多选选中数据 */
  "update:selections": (_selection) => true,
  /** 更新单选选中数据 */
  "update:current": (_current) => true,
  /** item 右键菜单项点击事件 */
  itemContextMenu: (_option) => true,
  /** item 右键菜单打开事件 */
  itemContextOpen: (_dropdownRef, _item) => true
};
export {
  fileListEmits,
  fileListProps
};

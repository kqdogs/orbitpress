import type { PropType, ExtractPropTypes } from 'vue';
import type { EleDropdownProps, EleDropdownInstance } from '../ele-app/plus';
import type FileGridItem from './components/file-grid-item.vue';
import type FileTableItem from './components/file-table-item.vue';
import type {
  IconItem,
  FileItem,
  SortValue,
  ItemContextMenuOption,
  ColumnItem,
  SelectionType,
  ContextMenus,
  FileListLocale
} from './types';
import { svgIcons } from './icons';

/**
 * 属性
 */
export const fileListProps = {
  /** 数据 */
  data: {
    type: Array as PropType<FileItem[]>,
    required: true
  },
  /** 选择框类型 */
  selectionType: String as PropType<SelectionType>,
  /** 多选选中数据 */
  selections: Array as PropType<FileItem[]>,
  /** 单选选中数据 */
  current: Object as PropType<FileItem>,
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
    type: Array as PropType<IconItem[]>,
    default: () => {
      return svgIcons;
    }
  },
  /** 表格模式后缀对应图标 */
  smallIcons: Array as PropType<IconItem[]>,
  /** 表格模式自定义列配置 */
  columns: Array as PropType<ColumnItem[]>,
  /** 多选时是否支持鼠标框选 */
  boxChoose: Boolean,
  /** 右键菜单 */
  contextMenus: [Array, Function] as PropType<ContextMenus>,
  /** 右键菜单属性 */
  contextMenuProps: Object as PropType<EleDropdownProps>,
  /** 国际化 */
  locale: Object as PropType<Partial<FileListLocale>>
};

export type FileListProps = ExtractPropTypes<typeof fileListProps>;

/**
 * 事件
 */
export const fileListEmits = {
  /** item 点击事件 */
  itemClick: (_item: FileItem) => true,
  /** 排序方式改变事件 */
  sortChange: (_sorter: SortValue) => true,
  /** 更新多选选中数据 */
  'update:selections': (_selection?: FileItem[]) => true,
  /** 更新单选选中数据 */
  'update:current': (_current?: FileItem | null) => true,
  /** item 右键菜单项点击事件 */
  itemContextMenu: (_option: ItemContextMenuOption) => true,
  /** item 右键菜单打开事件 */
  itemContextOpen: (_dropdownRef: EleDropdownInstance, _item: FileItem) => true
};

/**
 * 网格 item 实例
 */
export type GridItemInstance = InstanceType<typeof FileGridItem> | null;

/**
 * 表格 item 实例
 */
export type TableItemInstance = InstanceType<typeof FileTableItem> | null;

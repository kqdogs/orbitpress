import type { StyleValue, UserComponent } from '../ele-app/types';
import type { DropdownItem } from '../ele-dropdown/types';

/**
 * 图标类型
 */
export type IconItemType = 'file' | 'dir';

/**
 * 图标数据
 */
export interface IconItem {
  /** 图标地址 */
  icon: UserComponent;
  /** 类型 */
  type?: IconItemType;
  /** 对应文件后缀 */
  suffixes?: string[];
  /** svg 图标名称, 内部属性 */
  iconName?: string;
}

/**
 * 文件数据格式
 */
export interface FileItem extends Record<PropertyKey, unknown> {
  /** 唯一标识 */
  key: string | number;
  /** 文件名称 */
  name: string;
  /** 文件访问地址 */
  url?: string;
  /** 缩略图访问地址 */
  thumbnail?: string | null;
  /** 是否是文件夹 */
  isDirectory?: boolean;
  /** 文件大小 */
  length?: string | null;
  /** 文件修改日期 */
  updateTime?: string | null;
}

/**
 * 排序结果
 */
export interface SortValue {
  /** 排序字段 */
  sort: string;
  /** 排序方式 */
  order?: 'asc' | 'desc' | null;
}

/**
 * 表格自定义列
 */
export interface ColumnItem {
  /** 标题 */
  title?: string;
  /** 字段名 */
  prop: string;
  /** 插槽 */
  slot?: string;
  /** 表头插槽 */
  headerSlot?: string;
  /** 自定义样式 */
  style?: StyleValue;
  /** 自定义表头样式 */
  headerStyle?: StyleValue;
  /** 是否可以排序 */
  sortable?: boolean;
}

/**
 * 右键菜单事件参数
 */
export interface ItemContextMenuOption {
  /** 指令 */
  key: string;
  /** 数据 */
  item: FileItem;
}

/**
 * 选择框类型
 */
export type SelectionType = 'checkbox' | 'radio';

/**
 * 获取右键菜单方法
 */
export type ContextMenusFunc = (item: FileItem) => DropdownItem[];

/**
 * 右键菜单属性
 */
export type ContextMenus = DropdownItem[] | ContextMenusFunc;

/**
 * 右键菜单打开参数
 */
export interface ContextOpenOption {
  /** 数据 */
  item: FileItem;
  /** 触发节点 */
  triggerEl: HTMLElement;
  /** 事件对象 */
  e: MouseEvent;
}

/**
 * 国际化
 */
export interface FileListLocale {
  selectAll: string;
  selectTips: string;
  fileName: string;
  fileSize: string;
  fileTimestamp: string;
}

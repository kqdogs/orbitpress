import type { ElTabPaneProps } from '../ele-app/el';
import type { DropdownItem } from '../ele-dropdown/types';

/**
 * 页签数据
 */
export interface TabPaneItem extends ElTabPaneProps {
  /** 插槽名称 */
  slot?: string;
  /** 元数据 */
  meta?: any;
  /** 唯一标识 */
  key?: PropertyKey;
}

/**
 * 尺寸
 */
export type TabSize = 'large' | 'default' | 'small';

/**
 * 风格类型
 */
export type TabType =
  | 'default'
  | 'card'
  | 'border-card'
  | 'plain'
  | 'simple'
  | 'indicator'
  | 'button'
  | 'tag';

/**
 * 页签事件参数
 */
export interface TabEventOption {
  /** 页签标识 */
  name?: string | number | null;
  /** 页签数据 */
  item?: TabPaneItem | null;
  /** 当前选中的页签标识 */
  active?: string | number;
  /** 事件标识 */
  command?: string;
}

/**
 * 获取右键菜单方法
 */
export type ContextMenusFunc = (
  item?: TabPaneItem,
  tabName?: string | number
) => DropdownItem[] | undefined;

/**
 * 右键菜单属性
 */
export type ContextMenus = DropdownItem[] | ContextMenusFunc;

/**
 * 页签实例方法
 */
export interface TabMethods {
  /** 触发页签项点击事件 */
  triggerTabItemClick?: (
    item: TabPaneItem | undefined,
    tabName: string | number | undefined,
    e: MouseEvent
  ) => void;
  /** 触发页签项右键菜单事件 */
  triggerItemContextMenu?: (
    item: TabPaneItem | undefined,
    tabName: string | number | undefined,
    e: MouseEvent
  ) => void;
}

/**
 * 标签页容器属性
 */
export interface TabWrapProvide extends TabMethods {
  /** 尺寸 */
  size?: TabSize;
  /** 风格类型 */
  type?: TabType;
  /** 设置页签实例方法 */
  setTabMethods?: (methods: TabMethods) => void;
}

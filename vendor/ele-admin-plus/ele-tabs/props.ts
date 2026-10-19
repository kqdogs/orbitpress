import type { PropType, ExtractPropTypes, InjectionKey } from 'vue';
import {
  tabsProps as elTabsProps,
  tabsEmits as elTabsEmits
} from 'element-plus';
import type { EleDropdownProps, EleDropdownInstance } from '../ele-app/plus';
import type {
  TabPaneItem,
  TabSize,
  TabType,
  ContextMenus,
  TabEventOption,
  TabWrapProvide
} from './types';

/**
 * 属性
 */
export const tabsProps = {
  ...elTabsProps,
  /** 标签页数据 */
  items: {
    type: Array as PropType<TabPaneItem[]>,
    required: true
  },
  /** 尺寸 */
  size: String as PropType<TabSize>,
  /** 风格类型 */
  type: String as PropType<TabType>,
  /** 标签是否居中显示 */
  center: Boolean,
  /** 是否支持右键菜单 */
  contextMenu: [Boolean, Object] as PropType<boolean | EleDropdownProps>,
  /** 右键菜单 */
  contextMenus: [Array, Function] as PropType<ContextMenus>,
  /** 是否支持拖动排序 */
  sortable: Boolean,
  /** 是否支持鼠标滚轮滑动 */
  mousewheel: Boolean,
  /** 是否自己处理页签点击事件 */
  handleClick: Boolean,
  /** 内部表格是否弹性布局 */
  flexTable: [Boolean, String] as PropType<boolean | 'auto'>
};

export type TabsProps = ExtractPropTypes<typeof tabsProps>;

/**
 * 事件
 */
export const tabsEmits = {
  ...elTabsEmits,
  /** 页签点击事件 */
  tabItemClick: (_opt: TabEventOption) => true,
  /** 页签右键菜单项点击事件 */
  tabContextMenu: (_opt: TabEventOption) => true,
  /** 页签右键菜单打开事件 */
  tabContextOpen: (
    _ref: EleDropdownInstance,
    _item?: TabPaneItem | null,
    _name?: string | number | null
  ) => true,
  /** 拖动排序改变事件 */
  tabSortChange: (_data: TabPaneItem[]) => true
};

/**
 * 标签页组件属性名
 */
export type TabPropKeys = Array<keyof typeof elTabsProps>;

export const tabPropKeys: TabPropKeys = Object.keys(elTabsProps) as any;

/**
 * 标签页容器依赖注入key
 */
export const TAB_WRAP_KEY = Symbol('tabWrap') as InjectionKey<TabWrapProvide>;

import type { PropType, ExtractPropTypes, InjectionKey } from 'vue';
import type { StyleValue, StyleValues, ClassValues } from '../ele-app/types';
import type {
  EleMenusProps,
  EleBreadcrumbProps,
  EleBacktopProps,
  EleDropdownProps
} from '../ele-app/plus';
import type { MenuItem, MenuItemClickType } from '../ele-menus/types';
import type { BreadcrumbItem } from '../ele-breadcrumb/types';
import type {
  TabPaneItem,
  TabEventOption,
  ContextMenus
} from '../ele-tabs/types';
import type {
  Layout,
  SidebarLayout,
  HeaderStyle,
  SidebarStyle,
  TabStyle,
  TabBar,
  Maximized,
  LayoutProvide
} from './types';

/**
 * 属性
 */
export const adminLayoutProps = {
  /** 高度 */
  height: {
    type: [String, Number],
    default: '100%'
  },
  /** 顶栏菜单数据 */
  headerMenus: Array as PropType<MenuItem[]>,
  /** 顶栏菜单选中 */
  headerActive: String,
  /** 侧栏菜单数据 */
  sidebarMenus: Array as PropType<MenuItem[]>,
  /** 侧栏菜单选中 */
  sidebarActive: String,
  /** 双侧栏一级菜单数据 */
  sideboxMenus: Array as PropType<MenuItem[]>,
  /** 双侧栏一级菜单选中 */
  sideboxActive: String,
  /** 页签数据 */
  tabs: Array as PropType<TabPaneItem[]>,
  /** 页签选中 */
  tabActive: String,
  /** 面包屑导航数据 */
  levels: Array as PropType<BreadcrumbItem[]>,
  /** 是否折叠侧栏 */
  collapse: Boolean,
  /** 双侧栏一级是否紧凑风格 */
  compact: Boolean,
  /** 内容区是否最大化 */
  maximized: [Boolean, String] as PropType<Maximized>,
  /** 是否需要页签栏 */
  tabBar: {
    type: [Boolean, String] as PropType<TabBar>,
    default: true
  },
  /** 是否需要面包屑导航 */
  breadcrumb: {
    type: [Boolean, Object] as PropType<boolean | EleBreadcrumbProps>,
    default: true
  },
  /** 面包屑导航样式 */
  breadcrumbStyle: [String, Object, Array] as PropType<StyleValues>,
  /** 是否需要返回顶部 */
  backTop: {
    type: [Boolean, Object] as PropType<boolean | EleBacktopProps>,
    default: true
  },
  /** 顶栏菜单属性 */
  headerMenuProps: Object as PropType<EleMenusProps>,
  /** 侧栏菜单属性 */
  sidebarMenuProps: Object as PropType<EleMenusProps>,
  /** 双侧栏一级菜单属性 */
  sideboxMenuProps: Object as PropType<EleMenusProps>,
  /** 布局类型 */
  layout: String as PropType<Layout>,
  /** 侧栏布局类型 */
  sidebarLayout: String as PropType<SidebarLayout>,
  /** 顶栏风格 */
  headerStyle: String as PropType<HeaderStyle>,
  /** 侧栏风格 */
  sidebarStyle: {
    type: String as PropType<SidebarStyle>,
    default: 'dark'
  },
  /** 双侧栏时二级侧栏风格 */
  mixSidebarStyle: String as PropType<SidebarStyle>,
  /** 页签风格 */
  tabStyle: {
    type: String as PropType<TabStyle>,
    default: 'simple'
  },
  /** 是否固定顶栏 */
  fixedHeader: {
    type: Boolean,
    default: true
  },
  /** 是否固定侧栏 */
  fixedSidebar: {
    type: Boolean,
    default: true
  },
  /** 是否固定内容区 */
  fixedBody: {
    type: Boolean,
    default: true
  },
  /** logo是否置于顶栏 */
  logoInHeader: Boolean,
  /** 是否需要固定的主页页签 */
  fixedHome: {
    type: Boolean,
    default: true
  },
  /** 主页路由地址 */
  homePath: String,
  /** 是否选中固定的主页页签 */
  isHome: Boolean,
  /** 是否支持页签右键菜单 */
  tabContextMenu: [Boolean, Object] as PropType<boolean | EleDropdownProps>,
  /** 页签右键菜单数据 */
  tabContextMenus: [Array, Function] as PropType<ContextMenus>,
  /** 是否支持页签拖动排序 */
  tabSortable: Boolean,
  /** 顶栏菜单标题插槽名称 */
  headerTitleSlot: {
    type: String,
    default: 'title'
  },
  /** 顶栏菜单图标插槽名称 */
  headerIconSlot: {
    type: String,
    default: 'icon'
  },
  /** 侧栏菜单标题插槽名称 */
  sidebarTitleSlot: {
    type: String,
    default: 'title'
  },
  /** 侧栏菜单图标插槽名称 */
  sidebarIconSlot: {
    type: String,
    default: 'icon'
  },
  /** 双侧栏一级菜单标题插槽名称 */
  sideboxTitleSlot: {
    type: String,
    default: 'title'
  },
  /** 双侧栏一级菜单图标插槽名称 */
  sideboxIconSlot: {
    type: String,
    default: 'icon'
  },
  /** 顶栏样式 */
  headerCustomStyle: Object as PropType<StyleValue | null>,
  /** 侧栏样式 */
  sidebarCustomStyle: Object as PropType<StyleValue | null>,
  /** 双侧栏一级样式 */
  sideboxCustomStyle: Object as PropType<StyleValue | null>,
  /** 侧栏容器样式 */
  sideCustomStyle: Object as PropType<StyleValue | null>,
  /** 页签栏样式 */
  tabsCustomStyle: Object as PropType<StyleValue | null>,
  /** 内容区样式 */
  contentCustomStyle: Object as PropType<StyleValue | null>,
  /** 内容区类名 */
  contentCustomClass: [String, Object, Array] as PropType<ClassValues>,
  /** logo样式 */
  logoStyle: Object as PropType<StyleValue | null>,
  /** logo文字样式 */
  logoTitleStyle: Object as PropType<StyleValue | null>,
  /** 顶栏菜单样式 */
  headerMenusStyle: Object as PropType<StyleValue | null>,
  /** 侧栏菜单样式 */
  sidebarMenusStyle: Object as PropType<StyleValue | null>,
  /** 双侧栏一级菜单样式 */
  sideboxMenusStyle: Object as PropType<StyleValue | null>,
  /** logo图片地址 */
  logoSrc: String,
  /** logo文字 */
  logoTitle: String,
  /** 菜单是否自动滚动到选中位置 */
  menuScrollToActive: {
    type: Boolean,
    default: true
  },
  /** 是否是移动端风格 */
  mobile: Boolean
};

export type AdminLayoutProps = ExtractPropTypes<typeof adminLayoutProps>;

/**
 * 事件
 */
export const adminLayoutEmits = {
  'update:collapse': (_collapse: boolean) => true,
  logoClick: (_e: MouseEvent) => true,
  headMenuOpen: (_index: string, _indexPath: string[]) => true,
  headMenuClose: (_index: string, _indexPath: string[]) => true,
  headMenuItemClick: (
    _item: MenuItem,
    _e: MouseEvent,
    _type?: MenuItemClickType
  ) => true,
  headMenuItemMouseenter: (_item: MenuItem, _e: MouseEvent) => true,
  headMenuItemMouseleave: (_item: MenuItem, _e: MouseEvent) => true,
  headMouseenter: (_e: MouseEvent) => true,
  headMouseleave: (_e: MouseEvent) => true,
  boxMenuItemClick: (
    _item: MenuItem,
    _e: MouseEvent,
    _type?: MenuItemClickType
  ) => true,
  boxMenuItemMouseenter: (_item: MenuItem, _e: MouseEvent) => true,
  boxMenuItemMouseleave: (_item: MenuItem, _e: MouseEvent) => true,
  boxMouseenter: (_e: MouseEvent) => true,
  boxMouseleave: (_e: MouseEvent) => true,
  sideMenuOpen: (_index: string, _indexPath: string[]) => true,
  sideMenuClose: (_index: string, _indexPath: string[]) => true,
  sideMenuItemClick: (
    _item: MenuItem,
    _e: MouseEvent,
    _type?: MenuItemClickType
  ) => true,
  sideMouseenter: (_e: MouseEvent) => true,
  sideMouseleave: (_e: MouseEvent) => true,
  tabClick: (_option: TabEventOption) => true,
  tabRemove: (_name: string) => true,
  tabContextMenu: (_option: TabEventOption) => true,
  tabSortChange: (_data: TabPaneItem[]) => true,
  contentMounted: (_contentEl: HTMLElement, _modalsEl: HTMLElement) => true
};

/**
 * 共享数据key
 */
export const LAYOUT_KEY = Symbol('layout') as InjectionKey<LayoutProvide>;

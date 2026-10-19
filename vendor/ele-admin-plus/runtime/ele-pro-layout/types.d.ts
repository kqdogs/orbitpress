import type { EleMenuItemProps } from '../ele-app/plus';
export type {
  Layout,
  SidebarLayout,
  HeaderStyle,
  SidebarStyle,
  TabStyle,
  TabBar
} from '../ele-admin-layout/types';

/**
 * 菜单元数据
 */
export interface MenuMeta extends Record<string, any> {
  /** 菜单标题 */
  title?: string;
  /** 菜单图标 */
  icon?: any;
  /** 菜单是否隐藏 */
  hide?: boolean;
  /** 选中其它菜单 */
  active?: string;
  /** 是否隐藏页脚 */
  hideFooter?: boolean;
  /** 是否隐藏顶栏 */
  hideHeader?: boolean;
  /** 是否隐藏侧栏 */
  hideSidebar?: boolean;
  /** 是否隐藏双侧栏一级 */
  hideSidebox?: boolean;
  /** 是否隐藏页签栏 */
  hideTabs?: boolean;
  /** 页签是否可关闭 */
  closable?: boolean;
  /** 页签不同参数是否合并 */
  tabUnique?: boolean;
  /** 页签是否缓存 */
  keepAlive?: boolean;
  /** 是否在面包屑中显示 */
  breadcrumb?: boolean;
  /** 菜单组件其它属性 */
  props?: Record<string, any>;
  /** 是否需要外层布局 */
  layout?: boolean;
  /** 页签滚动位置 */
  tabScrollTop?: number;
  /** 路由地址 */
  routePath?: string;
  /** 打开位置, _slef 当前窗口打开, _blank 新窗口打开 */
  openTarget?: '_slef' | '_blank';
  /** 打开方式, iframe 内嵌, external 外链 */
  openType?: 'iframe' | 'external';
  /** 内嵌地址, 内部属性 */
  iframe?: string;
}

/**
 * 菜单数据
 */
export interface MenuItem {
  /** 路由名称 */
  name?: string;
  /** 菜单地址 */
  path: string;
  /** 路由组件 */
  component?: string;
  /** 路由重定向 */
  redirect?: string;
  /** 路由参数是否映射到组件属性 */
  props?: any;
  /** 路由元数据 */
  meta?: MenuMeta;
  /** 子路由 */
  children?: Array<MenuItem>;
  /** 临时子路由数据, 内部属性 */
  tempChildren?: Array<MenuItem>;
}

/**
 * 页签数据
 */
export interface TabItem {
  /** 页签标题 */
  title?: string;
  /** 页签标识 */
  key?: string;
  /** 路由地址 */
  path?: string;
  /** 路由完整地址 */
  fullPath?: string;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否是主页 */
  home?: boolean;
  /** 组件名称 */
  components?: string[];
  /** 是否为刷新状态 */
  refresh?: boolean;
  /** 路由元数据 */
  meta?: MenuMeta;
}

/**
 * 面包屑导航数据
 */
export interface LevelItem {
  /** 标题 */
  title: string;
  /** 地址 */
  path: string;
}

/**
 * 菜单标题国际化方法参数
 */
export interface MenuI18nOption {
  /** 当前语言 */
  locale?: string;
  /** 菜单地址 */
  path: string;
  /** 菜单数据 */
  menu?: MenuItem;
  /** 页签数据 */
  tab?: TabItem;
  /** 面包屑数据 */
  level?: LevelItem;
}

/**
 * 菜单标题国际化方法
 */
export type MenuI18n = (
  option: MenuI18nOption
) => string | undefined | null | void;

/**
 * 页签事件参数
 */
export interface TabItemEventOption {
  /** 页签标识 */
  key?: string;
  /** 页签数据 */
  item?: TabItem;
  /** 当前选中页签的标识 */
  active?: string;
  /** 事件标识 */
  command?: string;
}

/**
 * 获取路由对应菜单的结果
 */
export interface MatchedResult {
  /** 选中地址 */
  active: string;
  /** 菜单标题 */
  title?: string;
  /** 路由对应的菜单 */
  menu?: MenuItem;
  /** 匹配的菜单数据 */
  matched?: MenuItem[];
  /** 是否选中非本身 */
  activeOther?: boolean;
}

/**
 * 内容区尺寸改变事件参数
 */
export interface BodySizeChangeOption {
  /** 内容区宽度 */
  width?: number;
  /** 内容区高度 */
  height?: number;
  /** 是否是移动端小屏幕 */
  mobile?: boolean;
}

/**
 * 混合导航菜单切换模式
 */
export type MenuItemTrigger = 'route' | 'click' | 'hover';

/**
 * 子菜单项点击前钩子
 */
export type BeforeClick = (item: EleMenuItemProps, e: MouseEvent) => boolean;

/**
 * 内嵌数据
 */
export interface IframeItem {
  /** id */
  id: string;
  /** 地址 */
  src: string;
  /** 是否是刷新状态 */
  refresh?: boolean;
}

/**
 * 状态数据
 */
export interface LayoutState {
  navActive?: string;
  sideActive?: string;
  boxActive?: string;
  navData: MenuItem[];
  sideData: MenuItem[];
  boxData: MenuItem[];
  isHover?: boolean;
  contentWidth?: number;
  contentHeight?: number;
}

/**
 * 共享数据
 */
export interface ProLayoutProvide {
  /** 是否支持内嵌缓存 */
  keepAlive?: boolean;
  /** 是否开启响应式 */
  responsive?: boolean;
  /** 设置选中菜单 */
  activeMenu?: (path: string) => void;
}

/**
 * 带响应式开关的组件属性
 */
export interface ResponsiveProps extends Record<keyof any, any> {
  /** 是否开启响应式 */
  responsive?: boolean;
}

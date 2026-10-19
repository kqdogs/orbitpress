/**
 * 布局类型
 */
export type Layout = 'default' | 'top' | 'mix' | 'side';

/**
 * 侧栏布局类型
 */
export type SidebarLayout = 'default' | 'mix' | 'box';

/**
 * 顶栏风格
 */
export type HeaderStyle = 'light' | 'dark' | 'primary';

/**
 * 侧栏风格
 */
export type SidebarStyle = 'light' | 'dark';

/**
 * 页签风格
 */
export type TabStyle = 'simple' | 'indicator' | 'button' | 'tag';

/**
 * 页签栏显示位置
 */
export type TabBar = boolean | 'header';

/**
 * 内容区最大化
 */
export type Maximized = boolean | 'expanded';

/**
 * 共享数据
 */
export interface LayoutProvide {
  /** 布局类型 */
  layout?: Layout;
  /** 内容区是否最大化 */
  maximized?: Maximized;
  /** 是否固定顶栏 */
  fixedHeader?: boolean;
  /** 是否固定内容区 */
  fixedBody?: boolean;
  /** 模态框容器节点 */
  modalsEl?: HTMLElement | null;
  /** 获取模态框容器节点 */
  getModalsEl?: () => HTMLElement | null;
  /** 获取内容容器节点 */
  getBodyWrapperEl?: () => HTMLElement | null | undefined;
}

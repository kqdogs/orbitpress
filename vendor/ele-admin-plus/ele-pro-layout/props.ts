import type { PropType, ExtractPropTypes, InjectionKey } from 'vue';
import type { EleMenusProps } from '../ele-app/plus';
import { omit } from '../utils/common';
import type { BreadcrumbSeparator as Separator } from '../ele-breadcrumb/types';
import { adminLayoutProps } from '../ele-admin-layout/props';
import type {
  MenuItem,
  TabItem,
  MenuItemTrigger,
  MenuI18n,
  BeforeClick,
  TabItemEventOption,
  BodySizeChangeOption,
  ProLayoutProvide
} from './types';
type TextEllipsisTooltip = EleMenusProps['textEllipsisTooltip'];
type ProLayoutKey = InjectionKey<ProLayoutProvide>;

/**
 * 属性
 */
export const proLayoutProps = {
  ...omit(adminLayoutProps, [
    'height',
    'headerMenus',
    'headerActive',
    'sidebarMenus',
    'sidebarActive',
    'sideboxMenus',
    'sideboxActive',
    'tabs',
    'tabActive',
    'levels',
    'isHome',
    'mobile'
  ]),
  /** 高度 */
  height: {
    type: [String, Number],
    default: null
  },
  /** 菜单数据 */
  menus: Array as PropType<MenuItem[] | null>,
  /** 页签数据 */
  tabs: Array as PropType<TabItem[] | null>,
  /** 刷新路由地址 */
  redirectPath: {
    type: String,
    default: '/redirect'
  },
  /** 内容区是否撑满 */
  fluid: {
    type: Boolean,
    default: true
  },
  /** 返回键退出内容区最大化 */
  compressOnEsc: Boolean,
  /** 固定主体时切换路由自动滚到顶部 */
  autoScrollTop: {
    type: Boolean,
    default: true
  },
  /** 顶栏菜单触发模式 */
  navTrigger: String as PropType<MenuItemTrigger>,
  /** 双侧栏一级菜单触发模式 */
  boxTrigger: String as PropType<MenuItemTrigger>,
  /** 侧栏菜单触发模式 */
  itemTrigger: String as PropType<MenuItemTrigger>,
  /** hover模式的菜单切换超时 */
  menuHoverTimeout: {
    type: Number,
    default: 600
  },
  /** 菜单点击事件前钩子 */
  beforeClick: Function as PropType<BeforeClick>,
  /** 是否支持内嵌缓存 */
  keepAlive: Boolean,
  /** 内嵌切换动画 */
  transitionName: String,
  /** 内嵌进入动画延迟时间 */
  transitionDelay: {
    type: Number,
    default: 250
  },
  /** 是否开启响应式 */
  responsive: {
    type: Boolean,
    default: true
  },
  /** 国际化语言 */
  locale: String,
  /** 菜单标题国际化方法 */
  i18n: Function as PropType<MenuI18n>,
  /** 顶栏菜单是否省略多余的子项 */
  ellipsis: {
    type: Boolean,
    default: true
  },
  /** 顶栏菜单省略项的属性 */
  ellipsisProps: Object as PropType<EleMenusProps['ellipsisProps']>,
  /** 顶栏子菜单触发方式 */
  menuTrigger: String as PropType<EleMenusProps['menuTrigger']>,
  /** 侧栏默认展开的菜单 */
  sidebarOpeneds: Array as PropType<string[]>,
  /** 侧栏是否只保持一个子菜单展开 */
  uniqueOpened: {
    type: Boolean,
    default: true
  },
  /** 侧栏菜单是否彩色图标 */
  colorfulIcon: Boolean,
  /** 菜单 tooltip 主题 */
  tooltipEffect: String as PropType<EleMenusProps['popperEffect']>,
  /** 是否开启菜单文本溢出提示 */
  menuTextEllipsisTooltip: [Boolean, Object] as PropType<TextEllipsisTooltip>,
  /** 内容区最大时不带页签栏 */
  expanded: Boolean,
  /** 面包屑导航分隔符 */
  breadcrumbSeparator: [String, Object, Function] as PropType<Separator>,
  /** 返回顶部可见的滚动高度 */
  backTopVisibilityHeight: Number,
  /** 返回顶部的右边距 */
  backTopRight: Number,
  /** 返回顶部的下边距 */
  backTopBottom: Number,
  /** 返回顶部的目标选择器 */
  backTopTarget: String
};

export type ProLayoutProps = ExtractPropTypes<typeof proLayoutProps>;

/**
 * 事件
 */
export const proLayoutEmits = {
  'update:collapse': (_collapse: boolean) => true,
  'update:maximized': (_maximized: boolean) => true,
  tabAdd: (_data: TabItem, _active?: string) => true,
  tabClick: (_option: TabItemEventOption) => true,
  tabRemove: (_option: TabItemEventOption) => true,
  tabContextMenu: (_option: TabItemEventOption) => true,
  tabSortChange: (_data: TabItem[]) => true,
  logoClick: (_isHome: boolean, _e: MouseEvent) => true,
  headMenuOpen: (_index: string, _indexPath: string[]) => true,
  headMenuClose: (_index: string, _indexPath: string[]) => true,
  sideMenuOpen: (_index: string, _indexPath: string[]) => true,
  sideMenuClose: (_index: string, _indexPath: string[]) => true,
  bodySizeChange: (_option: BodySizeChangeOption) => true
};

/**
 * 共享数据key
 */
export const PRO_LAYOUT_KEY = Symbol('proLayout') as ProLayoutKey;

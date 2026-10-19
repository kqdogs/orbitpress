import { omit } from "../utils/common";
import { adminLayoutProps } from "../ele-admin-layout/props";
const proLayoutProps = {
  ...omit(adminLayoutProps, [
    "height",
    "headerMenus",
    "headerActive",
    "sidebarMenus",
    "sidebarActive",
    "sideboxMenus",
    "sideboxActive",
    "tabs",
    "tabActive",
    "levels",
    "isHome",
    "mobile"
  ]),
  /** 高度 */
  height: {
    type: [String, Number],
    default: null
  },
  /** 菜单数据 */
  menus: Array,
  /** 页签数据 */
  tabs: Array,
  /** 刷新路由地址 */
  redirectPath: {
    type: String,
    default: "/redirect"
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
  navTrigger: String,
  /** 双侧栏一级菜单触发模式 */
  boxTrigger: String,
  /** 侧栏菜单触发模式 */
  itemTrigger: String,
  /** hover模式的菜单切换超时 */
  menuHoverTimeout: {
    type: Number,
    default: 600
  },
  /** 菜单点击事件前钩子 */
  beforeClick: Function,
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
  i18n: Function,
  /** 顶栏菜单是否省略多余的子项 */
  ellipsis: {
    type: Boolean,
    default: true
  },
  /** 顶栏菜单省略项的属性 */
  ellipsisProps: Object,
  /** 顶栏子菜单触发方式 */
  menuTrigger: String,
  /** 侧栏默认展开的菜单 */
  sidebarOpeneds: Array,
  /** 侧栏是否只保持一个子菜单展开 */
  uniqueOpened: {
    type: Boolean,
    default: true
  },
  /** 侧栏菜单是否彩色图标 */
  colorfulIcon: Boolean,
  /** 菜单 tooltip 主题 */
  tooltipEffect: String,
  /** 是否开启菜单文本溢出提示 */
  menuTextEllipsisTooltip: [Boolean, Object],
  /** 内容区最大时不带页签栏 */
  expanded: Boolean,
  /** 面包屑导航分隔符 */
  breadcrumbSeparator: [String, Object, Function],
  /** 返回顶部可见的滚动高度 */
  backTopVisibilityHeight: Number,
  /** 返回顶部的右边距 */
  backTopRight: Number,
  /** 返回顶部的下边距 */
  backTopBottom: Number,
  /** 返回顶部的目标选择器 */
  backTopTarget: String
};
const proLayoutEmits = {
  "update:collapse": (_collapse) => true,
  "update:maximized": (_maximized) => true,
  tabAdd: (_data, _active) => true,
  tabClick: (_option) => true,
  tabRemove: (_option) => true,
  tabContextMenu: (_option) => true,
  tabSortChange: (_data) => true,
  logoClick: (_isHome, _e) => true,
  headMenuOpen: (_index, _indexPath) => true,
  headMenuClose: (_index, _indexPath) => true,
  sideMenuOpen: (_index, _indexPath) => true,
  sideMenuClose: (_index, _indexPath) => true,
  bodySizeChange: (_option) => true
};
const PRO_LAYOUT_KEY = /* @__PURE__ */ Symbol("proLayout");
export {
  PRO_LAYOUT_KEY,
  proLayoutEmits,
  proLayoutProps
};

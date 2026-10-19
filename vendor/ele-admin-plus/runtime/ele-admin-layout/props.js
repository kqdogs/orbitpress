const adminLayoutProps = {
  /** 高度 */
  height: {
    type: [String, Number],
    default: "100%"
  },
  /** 顶栏菜单数据 */
  headerMenus: Array,
  /** 顶栏菜单选中 */
  headerActive: String,
  /** 侧栏菜单数据 */
  sidebarMenus: Array,
  /** 侧栏菜单选中 */
  sidebarActive: String,
  /** 双侧栏一级菜单数据 */
  sideboxMenus: Array,
  /** 双侧栏一级菜单选中 */
  sideboxActive: String,
  /** 页签数据 */
  tabs: Array,
  /** 页签选中 */
  tabActive: String,
  /** 面包屑导航数据 */
  levels: Array,
  /** 是否折叠侧栏 */
  collapse: Boolean,
  /** 双侧栏一级是否紧凑风格 */
  compact: Boolean,
  /** 内容区是否最大化 */
  maximized: [Boolean, String],
  /** 是否需要页签栏 */
  tabBar: {
    type: [Boolean, String],
    default: true
  },
  /** 是否需要面包屑导航 */
  breadcrumb: {
    type: [Boolean, Object],
    default: true
  },
  /** 面包屑导航样式 */
  breadcrumbStyle: [String, Object, Array],
  /** 是否需要返回顶部 */
  backTop: {
    type: [Boolean, Object],
    default: true
  },
  /** 顶栏菜单属性 */
  headerMenuProps: Object,
  /** 侧栏菜单属性 */
  sidebarMenuProps: Object,
  /** 双侧栏一级菜单属性 */
  sideboxMenuProps: Object,
  /** 布局类型 */
  layout: String,
  /** 侧栏布局类型 */
  sidebarLayout: String,
  /** 顶栏风格 */
  headerStyle: String,
  /** 侧栏风格 */
  sidebarStyle: {
    type: String,
    default: "dark"
  },
  /** 双侧栏时二级侧栏风格 */
  mixSidebarStyle: String,
  /** 页签风格 */
  tabStyle: {
    type: String,
    default: "simple"
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
  tabContextMenu: [Boolean, Object],
  /** 页签右键菜单数据 */
  tabContextMenus: [Array, Function],
  /** 是否支持页签拖动排序 */
  tabSortable: Boolean,
  /** 顶栏菜单标题插槽名称 */
  headerTitleSlot: {
    type: String,
    default: "title"
  },
  /** 顶栏菜单图标插槽名称 */
  headerIconSlot: {
    type: String,
    default: "icon"
  },
  /** 侧栏菜单标题插槽名称 */
  sidebarTitleSlot: {
    type: String,
    default: "title"
  },
  /** 侧栏菜单图标插槽名称 */
  sidebarIconSlot: {
    type: String,
    default: "icon"
  },
  /** 双侧栏一级菜单标题插槽名称 */
  sideboxTitleSlot: {
    type: String,
    default: "title"
  },
  /** 双侧栏一级菜单图标插槽名称 */
  sideboxIconSlot: {
    type: String,
    default: "icon"
  },
  /** 顶栏样式 */
  headerCustomStyle: Object,
  /** 侧栏样式 */
  sidebarCustomStyle: Object,
  /** 双侧栏一级样式 */
  sideboxCustomStyle: Object,
  /** 侧栏容器样式 */
  sideCustomStyle: Object,
  /** 页签栏样式 */
  tabsCustomStyle: Object,
  /** 内容区样式 */
  contentCustomStyle: Object,
  /** 内容区类名 */
  contentCustomClass: [String, Object, Array],
  /** logo样式 */
  logoStyle: Object,
  /** logo文字样式 */
  logoTitleStyle: Object,
  /** 顶栏菜单样式 */
  headerMenusStyle: Object,
  /** 侧栏菜单样式 */
  sidebarMenusStyle: Object,
  /** 双侧栏一级菜单样式 */
  sideboxMenusStyle: Object,
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
const adminLayoutEmits = {
  "update:collapse": (_collapse) => true,
  logoClick: (_e) => true,
  headMenuOpen: (_index, _indexPath) => true,
  headMenuClose: (_index, _indexPath) => true,
  headMenuItemClick: (_item, _e, _type) => true,
  headMenuItemMouseenter: (_item, _e) => true,
  headMenuItemMouseleave: (_item, _e) => true,
  headMouseenter: (_e) => true,
  headMouseleave: (_e) => true,
  boxMenuItemClick: (_item, _e, _type) => true,
  boxMenuItemMouseenter: (_item, _e) => true,
  boxMenuItemMouseleave: (_item, _e) => true,
  boxMouseenter: (_e) => true,
  boxMouseleave: (_e) => true,
  sideMenuOpen: (_index, _indexPath) => true,
  sideMenuClose: (_index, _indexPath) => true,
  sideMenuItemClick: (_item, _e, _type) => true,
  sideMouseenter: (_e) => true,
  sideMouseleave: (_e) => true,
  tabClick: (_option) => true,
  tabRemove: (_name) => true,
  tabContextMenu: (_option) => true,
  tabSortChange: (_data) => true,
  contentMounted: (_contentEl, _modalsEl) => true
};
const LAYOUT_KEY = /* @__PURE__ */ Symbol("layout");
export {
  LAYOUT_KEY,
  adminLayoutEmits,
  adminLayoutProps
};

<!-- 高级布局 -->
<template>
  <EleAdminLayout
    ref="layoutRef"
    :height="height"
    :headerMenus="layoutHeaders"
    :headerActive="navActive"
    :sidebarMenus="layoutSidebars"
    :sidebarActive="sideActive"
    :sideboxMenus="layoutSideboxs"
    :sideboxActive="isBoxSide || (collapse && !mobile) ? sideActive : boxActive"
    :tabs="layoutTabs"
    :tabActive="tabActive"
    :levels="layoutLevels"
    :collapse="collapse"
    :compact="compact"
    :maximized="routeMaximized"
    :tabBar="routeTabBar"
    :breadcrumb="breadcrumbProps"
    :breadcrumbStyle="breadcrumbStyle"
    :backTop="backTopProps"
    :headerMenuProps="navMenuProps"
    :sidebarMenuProps="sideMenuProps"
    :sideboxMenuProps="boxMenuProps"
    :layout="routeLayout"
    :sidebarLayout="routeSideType"
    :headerStyle="headerStyle"
    :sidebarStyle="sidebarStyle"
    :mixSidebarStyle="mixSidebarStyle"
    :tabStyle="tabStyle"
    :fixedHeader="fixedHeader"
    :fixedSidebar="fixedSidebar"
    :fixedBody="fixedBody"
    :logoInHeader="logoInHeader"
    :fixedHome="fixedHome"
    :homePath="homeMenuPath"
    :isHome="isHome"
    :tabContextMenu="tabContextMenu"
    :tabContextMenus="tabContextMenus"
    :tabSortable="tabSortable"
    :headerTitleSlot="headerTitleSlot"
    :headerIconSlot="headerIconSlot"
    :sidebarTitleSlot="sidebarTitleSlot"
    :sidebarIconSlot="sidebarIconSlot"
    :sideboxTitleSlot="sideboxTitleSlot"
    :sideboxIconSlot="sideboxIconSlot"
    :headerCustomStyle="headerCustomStyle"
    :sidebarCustomStyle="sidebarCustomStyle"
    :sideboxCustomStyle="sideboxCustomStyle"
    :sideCustomStyle="sideCustomStyle"
    :tabsCustomStyle="tabsCustomStyle"
    :contentCustomStyle="contentCustomStyle"
    :contentCustomClass="['ele-pro-layout-content', contentCustomClass ?? '']"
    :logoStyle="logoStyle"
    :logoTitleStyle="logoTitleStyle"
    :headerMenusStyle="headerMenusStyle"
    :sidebarMenusStyle="sidebarMenusStyle"
    :sideboxMenusStyle="sideboxMenusStyle"
    :logoSrc="logoSrc"
    :logoTitle="logoTitle"
    :menuScrollToActive="menuScrollToActive"
    :mobile="mobile"
    class="ele-pro-layout"
    :class="{ 'ele-admin-limited': !fluid }"
    @update:collapse="updateCollapse"
    @logoClick="handleLogoClick"
    @headMenuOpen="handleHeadMenuOpen"
    @headMenuClose="handleHeadMenuClose"
    @headMenuItemClick="handleHeadMenuItemClick"
    @headMenuItemMouseenter="handleHeadMenuItemMouseenter"
    @headMouseenter="handleHeadMouseenter"
    @headMouseleave="handleHeadMouseleave"
    @boxMenuItemClick="handleBoxMenuItemClick"
    @boxMenuItemMouseenter="handleBoxMenuItemMouseenter"
    @boxMouseenter="handleBoxMouseEnter"
    @boxMouseleave="handleBoxMouseLeave"
    @sideMenuOpen="handleSideMenuOpen"
    @sideMenuClose="handleSideMenuClose"
    @sideMenuItemClick="handleSideMenuItemClick"
    @sideMouseenter="handleSideMouseEnter"
    @sideMouseleave="handleSideMouseLeave"
    @tabClick="handleTabClick"
    @tabRemove="handleTabRemove"
    @tabContextMenu="handleTabContextMenu"
    @tabSortChange="handleTabSortChange"
  >
    <slot></slot>
    <slot v-if="!hideFooter" name="footer"></slot>
    <template #body>
      <IframeGroup
        v-if="tabBar && keepAlive"
        :keepAlive="keepAlive"
        :transitionName="transitionName"
        :transitionDelay="transitionDelay"
        :tabData="tabData"
        :tabActive="tabActive"
      />
      <EleModalRender
        :modals="modals"
        @removeItem="removeModal"
        @updateItemVisible="updateModalVisible"
        @updateItemProps="updateModalProps"
      />
    </template>
    <template v-if="$slots.logo" #logo>
      <slot name="logo" :collapse="collapse" :sidebar="sidebar"></slot>
    </template>
    <template v-if="$slots.logoTitle" #logoTitle>
      <slot name="logoTitle" :collapse="collapse" :sidebar="sidebar"></slot>
    </template>
    <template v-if="$slots.breadcrumb" #breadcrumb>
      <slot
        name="breadcrumb"
        :levels="levelData"
        :isHome="isHome"
        :homePath="homeMenuPath"
        :sidebar="sidebar"
      ></slot>
    </template>
    <template v-if="$slots.left" #left>
      <slot name="left" :sidebar="sidebar"></slot>
    </template>
    <template v-if="$slots.center" #center>
      <slot name="center" :sidebar="sidebar"></slot>
    </template>
    <template v-if="$slots.right" #right>
      <slot name="right" :sidebar="sidebar"></slot>
    </template>
    <template
      v-for="name in Object.keys($slots).filter(
        (k) =>
          ![
            'default',
            'logo',
            'logoTitle',
            'breadcrumb',
            'left',
            'center',
            'right',
            'footer',
            'body'
          ].includes(k)
      )"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EleAdminLayout>
</template>

<script lang="ts" setup>
  import {
    ref,
    shallowRef,
    shallowReactive,
    unref,
    computed,
    watch,
    onMounted,
    nextTick,
    provide,
    markRaw
  } from 'vue';
  import type { RouteLocationNormalizedLoaded } from 'vue-router';
  import { useRouter } from 'vue-router';
  import { HomeOutlined } from '../icons/index';
  import type {
    EleAdminLayoutInstance,
    EleBreadcrumbProps,
    EleBacktopProps,
    EleMenusProps
  } from '../ele-app/plus';
  import {
    useTimer,
    useMediaQuery,
    useWindowListener,
    mobileMediaQuery
  } from '../utils/hook';
  import { mapTree, isExternalLink, debounce } from '../utils/common';
  import EleModalRender from '../ele-modal-render/index';
  import { useModalRenderProvider } from '../ele-modal-render/util';
  import IframeGroup from './components/iframe-group.vue';
  import {
    getRouteMatched,
    findMenuByPath,
    getMatchedLevels,
    findTabByPath,
    findTabByKey,
    getRouteTab,
    getMenuItems,
    getActiveChilds,
    getMatchedMenus
  } from './util';
  import type {
    MenuItem,
    TabItem,
    LevelItem,
    TabItemEventOption,
    LayoutState,
    ProLayoutProvide
  } from './types';
  import { proLayoutProps, proLayoutEmits, PRO_LAYOUT_KEY } from './props';
  import EleAdminLayout from '../ele-admin-layout/index.vue';
  import type {
    MenuItem as MenuItemProps,
    MenuItemClickType
  } from '../ele-menus/types';
  import type { BreadcrumbItem } from '../ele-breadcrumb/types';
  import type { TabPaneItem, TabEventOption } from '../ele-tabs/types';
  import type {
    Layout,
    SidebarLayout,
    TabBar,
    Maximized
  } from '../ele-admin-layout/types';

  defineOptions({ name: 'EleProLayout' });

  const props = defineProps(proLayoutProps);

  const emit = defineEmits(proLayoutEmits);

  const { currentRoute, push } = useRouter();
  const {
    modals,
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalVisible,
    updateModalProps
  } = useModalRenderProvider();
  const [startTimer, stopTimer] = useTimer(() => props.menuHoverTimeout);
  const state: LayoutState = { navData: [], sideData: [], boxData: [] };

  /** 布局组件 */
  const layoutRef = ref<EleAdminLayoutInstance>(null);

  /** 菜单数据 */
  const menuData = shallowRef<MenuItem[]>([]);

  /** 顶栏菜单数据 */
  const navData = shallowRef<MenuItem[]>([]);

  /** 顶栏菜单选中 */
  const navActive = ref<string>();

  /** 侧栏菜单数据 */
  const sideData = shallowRef<MenuItem[]>([]);

  /** 侧栏菜单选中 */
  const sideActive = ref<string>();

  /** 双侧栏一级菜单数据 */
  const boxData = shallowRef<MenuItem[]>([]);

  /** 双侧栏一级菜单选中 */
  const boxActive = ref<string>();

  /** 页签数据 */
  const tabData = shallowRef<TabItem[]>([]);

  /** 页签选中 */
  const tabActive = ref<string>();

  /** 面包屑导航数据 */
  const levelData = shallowRef<LevelItem[]>([]);

  /** 是否是移动端风格 */
  const mobile = ref<boolean>(false);

  /** 主页地址 */
  const homeMenuPath = ref<string>();

  /** 当前路由是否是主页 */
  const isHome = ref<boolean>(false);

  /** 当前路由是否隐藏顶栏 */
  const hideHeader = ref<boolean>(false);

  /** 当前路由是否隐藏侧栏 */
  const hideSidebar = ref<boolean>(false);

  /** 当前路由是否隐藏双侧栏一级 */
  const hideSidebox = ref<boolean>(false);

  /** 当前路由是否隐藏页签栏 */
  const hideTabs = ref<boolean>(false);

  /** 当前路由是否隐藏页脚 */
  const hideFooter = ref<boolean>(false);

  /** 计算当前路由导航模式 */
  const computedNavigation = (): Layout => {
    let nav: Layout = 'default';
    if (hideHeader.value) {
      nav = 'side';
    } else if (hideSidebar.value && hideSidebox.value) {
      nav = 'top';
    } else if (props.layout === 'top' || props.layout === 'mix') {
      nav = props.layout;
    }
    if (mobile.value && (nav === 'top' || nav === 'mix')) {
      nav = 'default';
    }
    return nav;
  };

  /** 计算当前路由侧栏导航模式 */
  const computedSideNavigation = (): SidebarLayout => {
    if (!hideSidebox.value && hideSidebar.value) {
      return 'box';
    }
    return props.sidebarLayout === 'mix' ? 'mix' : 'default';
  };

  /** 当前路由导航模式 */
  const navigation = ref<Layout>(computedNavigation());

  /** 当前路由侧栏导航模式 */
  const sideNavigation = ref<SidebarLayout>(computedSideNavigation());

  /** 布局顶栏菜单数据 */
  const layoutHeaders = computed<MenuItemProps[]>(() => {
    const navRoute =
      props.navTrigger !== 'click' && props.navTrigger !== 'hover';
    return getMenuItems(navData.value, navRoute);
  });

  /** 布局侧栏菜单数据 */
  const layoutSidebars = computed<MenuItemProps[]>(() => {
    const menuRoute =
      props.itemTrigger !== 'click' && props.itemTrigger !== 'hover';
    return getMenuItems(sideData.value, menuRoute);
  });

  /** 布局双侧栏一级菜单数据 */
  const layoutSideboxs = computed<MenuItemProps[]>(() => {
    const boxRoute =
      props.boxTrigger !== 'click' && props.boxTrigger !== 'hover';
    return getMenuItems(boxData.value, boxRoute);
  });

  /** 布局页签数据 */
  const layoutTabs = computed<TabPaneItem[]>(() => {
    const data = props.fixedHome
      ? tabData.value.filter((t) => !t.home)
      : tabData.value;
    const onlyOne = !props.fixedHome && data.length === 1;
    return data.map((d) => {
      return {
        name: d.key,
        label: d.title,
        closable: onlyOne && d.home ? false : d.closable,
        meta: {
          path: d.path,
          fullPath: d.fullPath,
          home: d.home,
          components: d.components,
          refresh: d.refresh,
          ...(d.meta || {})
        }
      };
    });
  });

  /** 布局面包屑导航数据 */
  const layoutLevels = computed<BreadcrumbItem[]>(() => {
    const data: BreadcrumbItem[] = [];
    if (!isHome.value) {
      const to = homeMenuPath.value;
      const is = { transform: 'scale(1.13)', transformOrigin: '8px -2px' };
      data.push({
        key: to,
        to,
        icon: markRaw(HomeOutlined),
        iconStyle: is
      });
    }
    levelData.value.forEach((d) => {
      data.push({ key: d.path, title: d.title });
    });
    return data;
  });

  /** 当前路由布局风格 */
  const routeLayout = computed<Layout>(() => {
    if (
      navigation.value !== 'top' &&
      navigation.value !== 'side' &&
      !layoutSidebars.value.length &&
      !layoutSideboxs.value.length
    ) {
      return 'top';
    }
    return navigation.value;
  });

  /** 当前路由侧栏布局风格 */
  const routeSideType = computed<SidebarLayout>(() => {
    if (sideNavigation.value === 'mix' && !layoutSidebars.value.length) {
      return 'box';
    }
    return sideNavigation.value;
  });

  /** 当前路由是否是仅双侧栏一级 */
  const isBoxSide = computed<boolean>(() => routeSideType.value === 'box');

  /** 当前路由是否显示页签栏 */
  const routeTabBar = computed<TabBar>(() => {
    return hideTabs.value ? false : props.tabBar;
  });

  /** 当前路由内容区是否最大化 */
  const routeMaximized = computed<Maximized | undefined>(() => {
    const max = props.maximized;
    if (hideHeader.value && hideSidebar.value && hideSidebox.value && !max) {
      return true;
    }
    return max === true && props.expanded ? 'expanded' : max;
  });

  /** 是否有侧栏 */
  const sidebar = computed<boolean>(() => {
    return (routeLayout.value !== 'top' && !isBoxSide.value) || mobile.value;
  });

  /** 面包屑导航属性 */
  const breadcrumbProps = computed<boolean | EleBreadcrumbProps>(() => {
    if (!props.breadcrumb || props.breadcrumbSeparator == null) {
      return props.breadcrumb;
    }
    if (props.breadcrumb === true) {
      return { separator: props.breadcrumbSeparator };
    }
    return { separator: props.breadcrumbSeparator, ...props.breadcrumb };
  });

  /** 返回顶部属性 */
  const backTopProps = computed<boolean | EleBacktopProps>(() => {
    const backTop = props.backTop;
    const r = props.backTopRight;
    const b = props.backTopBottom;
    const vh = props.backTopVisibilityHeight;
    const t = props.backTopTarget;
    if (!backTop || (vh == null && r == null && b == null && t == null)) {
      return backTop;
    }
    const prop: EleBacktopProps = backTop === true ? {} : { ...backTop };
    if (vh != null && prop.visibilityHeight == null) {
      prop.visibilityHeight = vh;
    }
    if (r != null && prop.right == null) {
      prop.right = r;
    }
    if (b != null && prop.bottom == null) {
      prop.bottom = b;
    }
    if (t != null && prop.target == null) {
      prop.target = t;
    }
    return prop;
  });

  /** 顶栏菜单属性 */
  const navMenuProps = computed<EleMenusProps | undefined>(() => {
    const mProps = props.headerMenuProps;
    const e = props.ellipsis;
    const ep = props.ellipsisProps;
    const mt = props.menuTrigger;
    const mtet = props.menuTextEllipsisTooltip;
    if (e == null && ep == null && mt == null && mtet == null) {
      return mProps;
    }
    const prop: EleMenusProps = mProps == null ? {} : { ...mProps };
    if (e != null && prop.ellipsis == null) {
      prop.ellipsis = e;
    }
    if (ep != null && prop.ellipsisProps == null) {
      prop.ellipsisProps = ep;
    }
    if (mt != null && prop.menuTrigger == null) {
      prop.menuTrigger = mt;
    }
    if (mtet != null && prop.textEllipsisTooltip == null) {
      prop.textEllipsisTooltip = mtet;
    }
    return prop;
  });

  /** 侧栏菜单属性 */
  const sideMenuProps = computed<EleMenusProps | undefined>(() => {
    const mProps = props.sidebarMenuProps;
    const s = props.sidebarOpeneds;
    const u = props.uniqueOpened;
    const c = props.colorfulIcon;
    const t = props.tooltipEffect;
    const mtet = props.menuTextEllipsisTooltip;
    if (s == null && u == null && c == null && t == null && mtet == null) {
      return mProps;
    }
    const prop: EleMenusProps = mProps == null ? {} : { ...mProps };
    if (s != null && prop.defaultOpeneds == null) {
      prop.defaultOpeneds = s;
    }
    if (u != null && prop.uniqueOpened == null) {
      prop.uniqueOpened = u;
    }
    if (c != null && prop.colorful == null) {
      prop.colorful = c;
    }
    if (t != null && prop.popperEffect == null) {
      prop.popperEffect = t;
    }
    if (mtet != null && prop.textEllipsisTooltip == null) {
      prop.textEllipsisTooltip = mtet;
    }
    return prop;
  });

  /** 双侧栏一级菜单属性 */
  const boxMenuProps = computed<EleMenusProps | undefined>(() => {
    const mProps = props.sideboxMenuProps;
    const ci = props.colorfulIcon;
    const te = props.tooltipEffect;
    const mtet = props.menuTextEllipsisTooltip;
    if (ci == null && te == null && mtet == null) {
      return mProps;
    }
    const prop: EleMenusProps = mProps == null ? {} : { ...mProps };
    if (ci != null && prop.popupColorful == null) {
      prop.popupColorful = ci;
    }
    if (te != null && prop.popperEffect == null) {
      prop.popperEffect = te;
    }
    if (mtet != null && prop.textEllipsisTooltip == null) {
      prop.textEllipsisTooltip = mtet;
    }
    return prop;
  });

  /** 更新当前路由导航模式 */
  const updateNavigation = (): boolean | void => {
    const value = computedNavigation();
    if (navigation.value !== value) {
      navigation.value = value;
      return true;
    }
  };

  /** 更新当前路由侧栏导航模式 */
  const updateSideNavigation = (): boolean | void => {
    const value = computedSideNavigation();
    if (sideNavigation.value !== value) {
      sideNavigation.value = value;
      return true;
    }
  };

  /** 重置菜单数据及选中 */
  const resetMenuState = () => {
    if (!state.isHover) {
      return;
    }
    startTimer(() => {
      state.isHover = false;
      const isMixSide =
        sideNavigation.value === 'mix' || sideNavigation.value === 'box';
      if (navActive.value !== state.navActive) {
        navActive.value = state.navActive;
        if (isMixSide) {
          boxData.value = state.boxData;
        } else {
          sideData.value = state.sideData;
        }
      }
      if (isMixSide && boxActive.value !== state.boxActive) {
        boxActive.value = state.boxActive;
        sideData.value = state.sideData;
      }
    });
  };

  /** 更新侧栏折叠状态 */
  const updateCollapse = (collapse: boolean) => {
    if (collapse !== props.collapse) {
      emit('update:collapse', collapse);
    }
  };

  /** 更新内容区域全屏状态 */
  const updateMaximized = (maximized: boolean) => {
    if (maximized !== props.maximized) {
      emit('update:maximized', maximized);
    }
  };

  /** 图标点击事件 */
  const handleLogoClick = (e: MouseEvent) => {
    emit('logoClick', isHome.value, e);
  };

  /** 顶栏子菜单展开事件 */
  const handleHeadMenuOpen = (index: string, indexPath: string[]) => {
    emit('headMenuOpen', index, indexPath);
  };

  /** 顶栏子菜单收起事件 */
  const handleHeadMenuClose = (index: string, indexPath: string[]) => {
    emit('headMenuClose', index, indexPath);
  };

  /** 顶栏子菜单项点击事件 */
  const handleHeadMenuItemClick = (
    item: MenuItemProps,
    e: MouseEvent,
    type?: MenuItemClickType
  ) => {
    if (type !== 'parent' && type !== 'group') {
      e.stopPropagation();
    }
    const path = item.index;
    const trigger = props.navTrigger;
    if (!path || (trigger !== 'click' && trigger !== 'hover')) {
      return;
    }
    if (isExternalLink(path)) {
      e.stopPropagation();
      if (props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      if (type === 'parent' || type === 'group') {
        return;
      }
      window.open(path);
      return;
    }
    const childMenus = getActiveChilds(navData.value, path, 'tempChildren');
    const isChild = !childMenus.some((d) => !d.meta?.hide);
    if (trigger !== 'click' && !isChild) {
      e.stopPropagation();
      return;
    }
    if (props.beforeClick && props.beforeClick(item, e) === false) {
      return;
    }
    if (type === 'parent' || type === 'group') {
      return;
    }
    if (isChild && path !== unref(currentRoute).fullPath) {
      push(path);
      return;
    }
    e.stopPropagation();
    if (navActive.value !== path) {
      navActive.value = path;
      const isMixSide =
        sideNavigation.value === 'mix' || sideNavigation.value === 'box';
      const isCollapse =
        sideNavigation.value === 'box' || (props.collapse && !mobile.value);
      if (!isMixSide) {
        sideData.value = childMenus;
        return;
      }
      boxData.value = childMenus.map((d) => {
        return {
          ...d,
          children: isCollapse ? d.children : void 0,
          tempChildren: d.children
        };
      });
    }
  };

  /** 顶栏子菜单项鼠标进入事件 */
  const handleHeadMenuItemMouseenter = (item: MenuItemProps, e: MouseEvent) => {
    if (navigation.value !== 'mix') {
      return;
    }
    stopTimer();
    const path = item.index;
    const trigger = props.navTrigger;
    if (trigger !== 'hover' || !path) {
      return;
    }
    if (
      !isExternalLink(path) &&
      props.beforeClick &&
      props.beforeClick(item, e) === false
    ) {
      return;
    }
    const temp = getActiveChilds(navData.value, path, 'tempChildren');
    if (navActive.value !== path) {
      state.isHover = true;
      navActive.value = temp.some((d) => !d.meta?.hide) ? path : void 0;
      const isMixSide =
        sideNavigation.value === 'mix' || sideNavigation.value === 'box';
      if (!isMixSide) {
        sideData.value = temp;
        return;
      }
      const isCollapse =
        sideNavigation.value === 'box' || (props.collapse && !mobile.value);
      boxData.value = temp.map((d) => {
        return {
          ...d,
          children: isCollapse ? d.children : void 0,
          tempChildren: d.children
        };
      });
    }
  };

  /** 顶栏鼠标进入事件 */
  const handleHeadMouseenter = () => {
    stopTimer();
  };

  /** 顶栏鼠标离开事件 */
  const handleHeadMouseleave = () => {
    resetMenuState();
  };

  /** 双侧栏一级子菜单项点击事件 */
  const handleBoxMenuItemClick = (
    item: MenuItemProps,
    e: MouseEvent,
    type?: MenuItemClickType
  ) => {
    if (type !== 'parent' && type !== 'group') {
      e.stopPropagation();
    }
    const path = item.index;
    const trigger = props.boxTrigger;
    if (!path || (trigger !== 'click' && trigger !== 'hover')) {
      return;
    }
    if (isExternalLink(path)) {
      e.stopPropagation();
      if (props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      if (type === 'parent' || type === 'group') {
        return;
      }
      window.open(path);
      return;
    }
    if (props.collapse) {
      if (props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      if (type === 'parent' || type === 'group') {
        return;
      }
      if (path !== unref(currentRoute).fullPath) {
        push(path);
      }
      return;
    }
    const childMenus = getActiveChilds(boxData.value, path, 'tempChildren');
    const isChild = !childMenus.some((d) => !d.meta?.hide);
    if (trigger !== 'click' && !isChild) {
      e.stopPropagation();
      return;
    }
    if (props.beforeClick && props.beforeClick(item, e) === false) {
      return;
    }
    if (type === 'parent' || type === 'group') {
      return;
    }
    if (isChild && path !== unref(currentRoute).fullPath) {
      push(path);
      return;
    }
    e.stopPropagation();
    if (boxActive.value !== path) {
      boxActive.value = path;
      sideData.value = childMenus;
    }
  };

  /** 双侧栏一级子菜单项鼠标进入事件 */
  const handleBoxMenuItemMouseenter = (item: MenuItemProps, e: MouseEvent) => {
    if (props.collapse) {
      return;
    }
    stopTimer();
    const path = item.index;
    const trigger = props.boxTrigger;
    if (trigger !== 'hover' || !path) {
      return;
    }
    if (
      !isExternalLink(path) &&
      props.beforeClick &&
      props.beforeClick(item, e) === false
    ) {
      return;
    }
    const temp = getActiveChilds(boxData.value, path, 'tempChildren');
    if (boxActive.value !== path) {
      state.isHover = true;
      boxActive.value = temp.some((d) => !d.meta?.hide) ? path : void 0;
      sideData.value = temp;
    }
  };

  /** 双侧栏一级鼠标进入事件 */
  const handleBoxMouseEnter = () => {
    stopTimer();
  };

  /** 双侧栏一级鼠标离开事件 */
  const handleBoxMouseLeave = () => {
    resetMenuState();
  };

  /** 侧栏子菜单展开事件 */
  const handleSideMenuOpen = (index: string, indexPath: string[]) => {
    emit('sideMenuOpen', index, indexPath);
  };

  /** 侧栏子菜单收起事件 */
  const handleSideMenuClose = (index: string, indexPath: string[]) => {
    emit('sideMenuClose', index, indexPath);
  };

  /** 侧栏子菜单项点击事件 */
  const handleSideMenuItemClick = (
    item: MenuItemProps,
    e: MouseEvent,
    type?: MenuItemClickType
  ) => {
    if (type !== 'parent' && type !== 'group') {
      e.stopPropagation();
    }
    const path = item.index;
    const trigger = props.itemTrigger;
    if (!path || (trigger !== 'click' && trigger !== 'hover')) {
      return;
    }
    if (props.beforeClick && props.beforeClick(item, e) === false) {
      return;
    }
    if (type === 'parent' || type === 'group') {
      return;
    }
    if (isExternalLink(path)) {
      e.stopPropagation();
      window.open(path);
      return;
    }
    sideActive.value = path;
    if (path !== unref(currentRoute).fullPath) {
      push(path);
    }
  };

  /** 侧栏鼠标进入事件 */
  const handleSideMouseEnter = () => {
    stopTimer();
  };

  /** 侧栏鼠标离开事件 */
  const handleSideMouseLeave = () => {
    resetMenuState();
  };

  /** 页签点击事件 */
  const handleTabClick = (option: TabEventOption) => {
    const key = option.name as string;
    const item = findTabByKey(key, props.tabs);
    const opt: TabItemEventOption = { key, item, active: tabActive.value };
    emit('tabClick', opt);
  };

  /** 页签移除事件 */
  const handleTabRemove = (key: string) => {
    const item = findTabByKey(key, props.tabs);
    const opt: TabItemEventOption = { key, item, active: tabActive.value };
    emit('tabRemove', opt);
  };

  /** 页签右键菜单点击事件 */
  const handleTabContextMenu = (option: TabEventOption) => {
    const opt: TabItemEventOption = {
      key: option.name as string,
      item: findTabByKey(option.name as string, props.tabs),
      active: tabActive.value,
      command: option.command
    };
    emit('tabContextMenu', opt);
  };

  /** 页签拖动顺序改变事件 */
  const handleTabSortChange = (data: TabPaneItem[]) => {
    const result: TabItem[] = data.map((d) => {
      return findTabByKey(d.name as string, props.tabs) as TabItem;
    });
    if (props.fixedHome && props.tabs != null) {
      const homeTab = props.tabs.find((t) => t.home);
      if (homeTab) {
        result.unshift(homeTab);
      }
    }
    emit('tabSortChange', result);
  };

  /** 获取内容区域节点 */
  const getContentElem = (): HTMLElement | null => {
    if (!layoutRef.value) {
      return null;
    }
    return layoutRef.value.getContentEl();
  };

  /** 获取滚动区域节点 */
  const getBodyScrollEl = (): Element | null => {
    if (props.fixedBody) {
      return getContentElem();
    }
    const bProps = backTopProps.value;
    if (bProps && typeof bProps === 'object' && bProps.target) {
      if (typeof bProps.target === 'string') {
        return document.querySelector(bProps.target);
      }
      return bProps.target;
    }
    return document.body;
  };

  /** 处理路由切换 */
  const handleRouteChange = (route: RouteLocationNormalizedLoaded) => {
    const { path, meta } = route;
    // 获取页脚隐藏状态
    hideFooter.value = !!meta.hideFooter;

    // 内容区域滚动到顶部
    if (props.autoScrollTop) {
      const bodyScrollEl = getBodyScrollEl();
      if (bodyScrollEl) {
        bodyScrollEl.scrollTop = 0;
      }
    }

    // 刷新路由不做处理
    if (props.redirectPath && path.startsWith(props.redirectPath)) {
      return;
    }

    // 获取各组件隐藏状态
    hideSidebar.value = !!meta.hideSidebar;
    hideSidebox.value =
      props.sidebarLayout === 'mix' ? !!meta.hideSidebox : true;
    hideHeader.value = !!meta.hideHeader;
    hideTabs.value = !!meta.hideTabs;

    // 更新导航模式
    const navigationIsChanged = updateNavigation();
    const sideNavigationIsChanged = updateSideNavigation();

    // 获取路由对应的菜单数据
    const { active, title, menu, matched, activeOther } = getRouteMatched(
      route,
      menuData.value
    );

    // 获取面包屑导航数据
    levelData.value = getMatchedLevels(
      matched,
      activeOther,
      route,
      menuData.value,
      tabData.value
    );

    // 添加页签
    const tab = getRouteTab(
      route,
      tabData.value,
      homeMenuPath.value,
      title,
      menu
    );
    isHome.value = tab.home as boolean;
    const lastTabActive = tabActive.value;
    tabActive.value = tab.key as string;
    emit('tabAdd', tab, lastTabActive);

    // 更新菜单选中
    if (!navigationIsChanged && !sideNavigationIsChanged) {
      updateMenuActive(active, matched);
      if (
        navigation.value === 'mix' ||
        sideNavigation.value === 'mix' ||
        sideNavigation.value === 'box'
      ) {
        splitMenuData();
      }
    }

    // 移动端风格自动收起侧栏
    if (mobile.value) {
      updateCollapse(true);
    }
  };

  /** 更新菜单选中 */
  const updateMenuActive = (active: string, matched?: MenuItem[]) => {
    const [active1, active2] = matched?.length
      ? [matched[0].path, (matched[1] ?? matched[0]).path]
      : [];
    if (navigation.value === 'top') {
      // 顶栏导航
      navActive.value = active;
      boxActive.value = void 0;
    } else if (navigation.value === 'mix') {
      // 混合导航
      navActive.value = active1;
      boxActive.value = active2;
    } else {
      // 侧栏导航
      navActive.value = void 0;
      boxActive.value = active1;
    }
    sideActive.value = active;
    //
    state.navActive = navActive.value;
    state.boxActive = boxActive.value;
    state.sideActive = sideActive.value;
  };

  /** 分割菜单数据 */
  const splitMenuData = () => {
    const isTopNav = navigation.value === 'top';
    const isMixNav = navigation.value === 'mix';
    const isMixSide =
      sideNavigation.value === 'mix' || sideNavigation.value === 'box';
    const isCollapse =
      sideNavigation.value === 'box' || (props.collapse && !mobile.value);
    if (!menuData.value?.length) {
      navData.value = [];
      boxData.value = [];
      sideData.value = [];
    } else if (isTopNav) {
      // 顶栏导航
      navData.value = menuData.value;
      boxData.value = [];
      sideData.value = [];
    } else if (isMixNav) {
      // 混合导航
      navData.value = menuData.value.map((d) => {
        return { ...d, children: void 0, tempChildren: d.children };
      });
      const childMenus = getActiveChilds(menuData.value, navActive.value);
      if (!childMenus.length) {
        boxData.value = [];
        sideData.value = [];
      } else if (isMixSide) {
        // 双侧栏
        boxData.value = childMenus.map((d) => {
          return {
            ...d,
            children: isCollapse ? d.children : void 0,
            tempChildren: d.children
          };
        });
        sideData.value = getActiveChilds(childMenus, boxActive.value);
      } else {
        // 单侧栏
        boxData.value = [];
        sideData.value = childMenus;
      }
    } else {
      // 侧栏导航
      navData.value = [];
      if (isMixSide) {
        // 双侧栏
        boxData.value = menuData.value.map((d) => {
          return {
            ...d,
            children: isCollapse ? d.children : void 0,
            tempChildren: d.children
          };
        });
        sideData.value = getActiveChilds(menuData.value, boxActive.value);
      } else {
        // 单侧栏
        boxData.value = [];
        sideData.value = menuData.value;
      }
    }
    //
    state.navData = navData.value;
    state.boxData = boxData.value;
    state.sideData = sideData.value;
  };

  /** 国际化处理菜单数据 */
  const updateMenuData = () => {
    let home: MenuItem | undefined;
    menuData.value = mapTree(props.menus, (item) => {
      if (!home && !item.children?.length) {
        home = item;
      }
      const title = routeI18n(item.path, item) || item.meta?.title;
      return { ...item, meta: { ...item.meta, title } };
    });
    splitMenuData();
    homeMenuPath.value = props.homePath || home?.path || '/';
  };

  /** 国际化处理页签数据 */
  const updateTabData = () => {
    if (!props.tabs) {
      tabData.value = [];
      return;
    }
    tabData.value = props.tabs.map((item) => {
      const m = findMenuByPath(item.path, menuData.value);
      return {
        ...item,
        title: routeI18n(item.path, m, item) || item.title
      };
    });
  };

  /** 国际化处理面包屑导航数据 */
  const updateLevelData = () => {
    levelData.value = levelData.value.map((item) => {
      const t = findTabByPath(item.path, tabData.value);
      const m = findMenuByPath(item.path, menuData.value);
      const title =
        t?.title || m?.meta?.title || routeI18n(item.path, m, t, item);
      return { ...item, title: title || item.title };
    });
  };

  /** 获取路由地址对应的国际化名称 */
  const routeI18n = (
    path?: string,
    menu?: MenuItem,
    tab?: TabItem,
    level?: LevelItem
  ) => {
    if (props.i18n && path) {
      return props.i18n({
        locale: props.locale,
        path,
        menu,
        tab,
        level
      });
    }
  };

  /** 触发内容区域尺寸改变 */
  const handleResize = () => {
    const el = getContentElem();
    if (el) {
      const clientWidth = el.clientWidth || 0;
      const limitedWidth = 1120;
      const maxWidth = clientWidth > limitedWidth ? limitedWidth : clientWidth;
      const width = props.fluid ? clientWidth : maxWidth;
      const height = el.clientHeight;
      if (width !== state.contentWidth || height !== state.contentHeight) {
        state.contentWidth = width;
        state.contentHeight = height;
        emit('bodySizeChange', { width, height, mobile: mobile.value });
      }
    }
  };

  useWindowListener(debounce(() => handleResize(), 500));
  const [startBodyResizeTimer] = useTimer(600);

  /** 共享布局状态 */
  const layoutProvide = shallowReactive<ProLayoutProvide>({
    keepAlive: props.tabBar && props.keepAlive,
    responsive: props.responsive,
    activeMenu: (path: string) => {
      updateMenuActive(path, getMatchedMenus(path, menuData.value));
      if (
        navigation.value === 'mix' ||
        sideNavigation.value === 'mix' ||
        sideNavigation.value === 'box'
      ) {
        splitMenuData();
      }
    }
  });
  provide<ProLayoutProvide>(PRO_LAYOUT_KEY, layoutProvide);

  /** 移动端小屏幕媒体查询 */
  const [media, startMedia, stopMedia] = useMediaQuery(mobileMediaQuery, () => {
    const isMobile = props.responsive ? media.matches : false;
    if (mobile.value !== isMobile) {
      mobile.value = isMobile;
      updateCollapse(mobile.value);
    }
  });

  watch(
    () => props.responsive,
    () => {
      layoutProvide.responsive = props.responsive;
      if (props.responsive) {
        startMedia();
      } else {
        stopMedia();
      }
    },
    { immediate: true }
  );

  watch([() => props.tabBar, () => props.keepAlive], () => {
    layoutProvide.keepAlive = props.tabBar && props.keepAlive;
  });

  watch([() => props.collapse, () => props.compact], () => {
    startBodyResizeTimer(() => {
      handleResize();
    });
  });

  watch(
    [
      routeLayout,
      routeSideType,
      routeTabBar,
      routeMaximized,
      () => props.fluid
    ],
    () => {
      nextTick(() => {
        handleResize();
      });
    }
  );

  watch(
    () => props.menus,
    () => {
      updateMenuData();
    },
    { deep: true }
  );

  watch(
    () => props.tabs,
    () => {
      updateTabData();
      updateLevelData();
    },
    { deep: true }
  );

  watch([() => props.layout, mobile], () => {
    updateNavigation();
  });

  watch(
    () => props.sidebarLayout,
    () => {
      updateSideNavigation();
    }
  );

  watch([navigation, sideNavigation], () => {
    const route = unref(currentRoute);
    const { active, matched } = getRouteMatched(route, menuData.value);
    updateMenuActive(active, matched);
    splitMenuData();
  });

  watch(
    () => props.collapse,
    () => {
      if (sideNavigation.value === 'mix' && !mobile.value) {
        if (props.collapse) {
          boxData.value = boxData.value.map((d) => {
            return { ...d, children: d.tempChildren };
          });
        } else {
          boxData.value = boxData.value.map((d) => {
            return { ...d, children: void 0 };
          });
        }
        state.boxData = boxData.value;
      }
    }
  );

  watch(
    () => props.locale,
    () => {
      updateMenuData();
      updateTabData();
      updateLevelData();
    },
    { immediate: true }
  );

  watch(
    currentRoute,
    (route) => {
      handleRouteChange(unref(route));
    },
    { immediate: true }
  );

  /** 返回键退出内容全屏 */
  useWindowListener('keydown', (e: KeyboardEvent) => {
    if (e.keyCode === 27 && props.compressOnEsc && props.maximized) {
      e.stopPropagation();
      updateMaximized(false);
    }
  });

  onMounted(() => {
    handleResize();
  });

  defineExpose({
    layoutRef,
    // 弹窗操作
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalProps
  });
</script>

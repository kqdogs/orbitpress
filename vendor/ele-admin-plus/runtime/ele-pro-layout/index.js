import { defineComponent, ref, shallowRef, computed, markRaw, shallowReactive, provide, watch, nextTick, unref, onMounted, openBlock, createBlock, normalizeClass, createSlots, withCtx, renderSlot, createCommentVNode, createVNode, renderList, normalizeProps, guardReactiveProps } from "vue";
import { useRouter } from "vue-router";
import { HomeOutlined } from "../icons/index";
import { useTimer, useWindowListener, useMediaQuery, mobileMediaQuery } from "../utils/hook";
import { debounce, isExternalLink, mapTree } from "../utils/common";
import EleModalRender from "../ele-modal-render/index";
import { useModalRenderProvider } from "../ele-modal-render/util";
import IframeGroup from "./components/iframe-group";
import { getMenuItems, getMatchedMenus, getRouteMatched, getActiveChilds, findTabByKey, getMatchedLevels, getRouteTab, findMenuByPath, findTabByPath } from "./util";
import { proLayoutEmits, proLayoutProps, PRO_LAYOUT_KEY } from "./props";
import EleAdminLayout from "../ele-admin-layout/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleProLayout" },
  __name: "index",
  props: proLayoutProps,
  emits: proLayoutEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
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
    const state = { navData: [], sideData: [], boxData: [] };
    const layoutRef = ref(null);
    const menuData = shallowRef([]);
    const navData = shallowRef([]);
    const navActive = ref();
    const sideData = shallowRef([]);
    const sideActive = ref();
    const boxData = shallowRef([]);
    const boxActive = ref();
    const tabData = shallowRef([]);
    const tabActive = ref();
    const levelData = shallowRef([]);
    const mobile = ref(false);
    const homeMenuPath = ref();
    const isHome = ref(false);
    const hideHeader = ref(false);
    const hideSidebar = ref(false);
    const hideSidebox = ref(false);
    const hideTabs = ref(false);
    const hideFooter = ref(false);
    const computedNavigation = () => {
      let nav = "default";
      if (hideHeader.value) {
        nav = "side";
      } else if (hideSidebar.value && hideSidebox.value) {
        nav = "top";
      } else if (props.layout === "top" || props.layout === "mix") {
        nav = props.layout;
      }
      if (mobile.value && (nav === "top" || nav === "mix")) {
        nav = "default";
      }
      return nav;
    };
    const computedSideNavigation = () => {
      if (!hideSidebox.value && hideSidebar.value) {
        return "box";
      }
      return props.sidebarLayout === "mix" ? "mix" : "default";
    };
    const navigation = ref(computedNavigation());
    const sideNavigation = ref(computedSideNavigation());
    const layoutHeaders = computed(() => {
      const navRoute = props.navTrigger !== "click" && props.navTrigger !== "hover";
      return getMenuItems(navData.value, navRoute);
    });
    const layoutSidebars = computed(() => {
      const menuRoute = props.itemTrigger !== "click" && props.itemTrigger !== "hover";
      return getMenuItems(sideData.value, menuRoute);
    });
    const layoutSideboxs = computed(() => {
      const boxRoute = props.boxTrigger !== "click" && props.boxTrigger !== "hover";
      return getMenuItems(boxData.value, boxRoute);
    });
    const layoutTabs = computed(() => {
      const data = props.fixedHome ? tabData.value.filter((t) => !t.home) : tabData.value;
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
            ...d.meta || {}
          }
        };
      });
    });
    const layoutLevels = computed(() => {
      const data = [];
      if (!isHome.value) {
        const to = homeMenuPath.value;
        const is = { transform: "scale(1.13)", transformOrigin: "8px -2px" };
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
    const routeLayout = computed(() => {
      if (navigation.value !== "top" && navigation.value !== "side" && !layoutSidebars.value.length && !layoutSideboxs.value.length) {
        return "top";
      }
      return navigation.value;
    });
    const routeSideType = computed(() => {
      if (sideNavigation.value === "mix" && !layoutSidebars.value.length) {
        return "box";
      }
      return sideNavigation.value;
    });
    const isBoxSide = computed(() => routeSideType.value === "box");
    const routeTabBar = computed(() => {
      return hideTabs.value ? false : props.tabBar;
    });
    const routeMaximized = computed(() => {
      const max = props.maximized;
      if (hideHeader.value && hideSidebar.value && hideSidebox.value && !max) {
        return true;
      }
      return max === true && props.expanded ? "expanded" : max;
    });
    const sidebar = computed(() => {
      return routeLayout.value !== "top" && !isBoxSide.value || mobile.value;
    });
    const breadcrumbProps = computed(() => {
      if (!props.breadcrumb || props.breadcrumbSeparator == null) {
        return props.breadcrumb;
      }
      if (props.breadcrumb === true) {
        return { separator: props.breadcrumbSeparator };
      }
      return { separator: props.breadcrumbSeparator, ...props.breadcrumb };
    });
    const backTopProps = computed(() => {
      const backTop = props.backTop;
      const r = props.backTopRight;
      const b = props.backTopBottom;
      const vh = props.backTopVisibilityHeight;
      const t = props.backTopTarget;
      if (!backTop || vh == null && r == null && b == null && t == null) {
        return backTop;
      }
      const prop = backTop === true ? {} : { ...backTop };
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
    const navMenuProps = computed(() => {
      const mProps = props.headerMenuProps;
      const e = props.ellipsis;
      const ep = props.ellipsisProps;
      const mt = props.menuTrigger;
      const mtet = props.menuTextEllipsisTooltip;
      if (e == null && ep == null && mt == null && mtet == null) {
        return mProps;
      }
      const prop = mProps == null ? {} : { ...mProps };
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
    const sideMenuProps = computed(() => {
      const mProps = props.sidebarMenuProps;
      const s = props.sidebarOpeneds;
      const u = props.uniqueOpened;
      const c = props.colorfulIcon;
      const t = props.tooltipEffect;
      const mtet = props.menuTextEllipsisTooltip;
      if (s == null && u == null && c == null && t == null && mtet == null) {
        return mProps;
      }
      const prop = mProps == null ? {} : { ...mProps };
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
    const boxMenuProps = computed(() => {
      const mProps = props.sideboxMenuProps;
      const ci = props.colorfulIcon;
      const te = props.tooltipEffect;
      const mtet = props.menuTextEllipsisTooltip;
      if (ci == null && te == null && mtet == null) {
        return mProps;
      }
      const prop = mProps == null ? {} : { ...mProps };
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
    const updateNavigation = () => {
      const value = computedNavigation();
      if (navigation.value !== value) {
        navigation.value = value;
        return true;
      }
    };
    const updateSideNavigation = () => {
      const value = computedSideNavigation();
      if (sideNavigation.value !== value) {
        sideNavigation.value = value;
        return true;
      }
    };
    const resetMenuState = () => {
      if (!state.isHover) {
        return;
      }
      startTimer(() => {
        state.isHover = false;
        const isMixSide = sideNavigation.value === "mix" || sideNavigation.value === "box";
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
    const updateCollapse = (collapse) => {
      if (collapse !== props.collapse) {
        emit("update:collapse", collapse);
      }
    };
    const updateMaximized = (maximized) => {
      if (maximized !== props.maximized) {
        emit("update:maximized", maximized);
      }
    };
    const handleLogoClick = (e) => {
      emit("logoClick", isHome.value, e);
    };
    const handleHeadMenuOpen = (index, indexPath) => {
      emit("headMenuOpen", index, indexPath);
    };
    const handleHeadMenuClose = (index, indexPath) => {
      emit("headMenuClose", index, indexPath);
    };
    const handleHeadMenuItemClick = (item, e, type) => {
      if (type !== "parent" && type !== "group") {
        e.stopPropagation();
      }
      const path = item.index;
      const trigger = props.navTrigger;
      if (!path || trigger !== "click" && trigger !== "hover") {
        return;
      }
      if (isExternalLink(path)) {
        e.stopPropagation();
        if (props.beforeClick && props.beforeClick(item, e) === false) {
          return;
        }
        if (type === "parent" || type === "group") {
          return;
        }
        window.open(path);
        return;
      }
      const childMenus = getActiveChilds(navData.value, path, "tempChildren");
      const isChild = !childMenus.some((d) => !d.meta?.hide);
      if (trigger !== "click" && !isChild) {
        e.stopPropagation();
        return;
      }
      if (props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      if (type === "parent" || type === "group") {
        return;
      }
      if (isChild && path !== unref(currentRoute).fullPath) {
        push(path);
        return;
      }
      e.stopPropagation();
      if (navActive.value !== path) {
        navActive.value = path;
        const isMixSide = sideNavigation.value === "mix" || sideNavigation.value === "box";
        const isCollapse = sideNavigation.value === "box" || props.collapse && !mobile.value;
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
    const handleHeadMenuItemMouseenter = (item, e) => {
      if (navigation.value !== "mix") {
        return;
      }
      stopTimer();
      const path = item.index;
      const trigger = props.navTrigger;
      if (trigger !== "hover" || !path) {
        return;
      }
      if (!isExternalLink(path) && props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      const temp = getActiveChilds(navData.value, path, "tempChildren");
      if (navActive.value !== path) {
        state.isHover = true;
        navActive.value = temp.some((d) => !d.meta?.hide) ? path : void 0;
        const isMixSide = sideNavigation.value === "mix" || sideNavigation.value === "box";
        if (!isMixSide) {
          sideData.value = temp;
          return;
        }
        const isCollapse = sideNavigation.value === "box" || props.collapse && !mobile.value;
        boxData.value = temp.map((d) => {
          return {
            ...d,
            children: isCollapse ? d.children : void 0,
            tempChildren: d.children
          };
        });
      }
    };
    const handleHeadMouseenter = () => {
      stopTimer();
    };
    const handleHeadMouseleave = () => {
      resetMenuState();
    };
    const handleBoxMenuItemClick = (item, e, type) => {
      if (type !== "parent" && type !== "group") {
        e.stopPropagation();
      }
      const path = item.index;
      const trigger = props.boxTrigger;
      if (!path || trigger !== "click" && trigger !== "hover") {
        return;
      }
      if (isExternalLink(path)) {
        e.stopPropagation();
        if (props.beforeClick && props.beforeClick(item, e) === false) {
          return;
        }
        if (type === "parent" || type === "group") {
          return;
        }
        window.open(path);
        return;
      }
      if (props.collapse) {
        if (props.beforeClick && props.beforeClick(item, e) === false) {
          return;
        }
        if (type === "parent" || type === "group") {
          return;
        }
        if (path !== unref(currentRoute).fullPath) {
          push(path);
        }
        return;
      }
      const childMenus = getActiveChilds(boxData.value, path, "tempChildren");
      const isChild = !childMenus.some((d) => !d.meta?.hide);
      if (trigger !== "click" && !isChild) {
        e.stopPropagation();
        return;
      }
      if (props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      if (type === "parent" || type === "group") {
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
    const handleBoxMenuItemMouseenter = (item, e) => {
      if (props.collapse) {
        return;
      }
      stopTimer();
      const path = item.index;
      const trigger = props.boxTrigger;
      if (trigger !== "hover" || !path) {
        return;
      }
      if (!isExternalLink(path) && props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      const temp = getActiveChilds(boxData.value, path, "tempChildren");
      if (boxActive.value !== path) {
        state.isHover = true;
        boxActive.value = temp.some((d) => !d.meta?.hide) ? path : void 0;
        sideData.value = temp;
      }
    };
    const handleBoxMouseEnter = () => {
      stopTimer();
    };
    const handleBoxMouseLeave = () => {
      resetMenuState();
    };
    const handleSideMenuOpen = (index, indexPath) => {
      emit("sideMenuOpen", index, indexPath);
    };
    const handleSideMenuClose = (index, indexPath) => {
      emit("sideMenuClose", index, indexPath);
    };
    const handleSideMenuItemClick = (item, e, type) => {
      if (type !== "parent" && type !== "group") {
        e.stopPropagation();
      }
      const path = item.index;
      const trigger = props.itemTrigger;
      if (!path || trigger !== "click" && trigger !== "hover") {
        return;
      }
      if (props.beforeClick && props.beforeClick(item, e) === false) {
        return;
      }
      if (type === "parent" || type === "group") {
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
    const handleSideMouseEnter = () => {
      stopTimer();
    };
    const handleSideMouseLeave = () => {
      resetMenuState();
    };
    const handleTabClick = (option) => {
      const key = option.name;
      const item = findTabByKey(key, props.tabs);
      const opt = { key, item, active: tabActive.value };
      emit("tabClick", opt);
    };
    const handleTabRemove = (key) => {
      const item = findTabByKey(key, props.tabs);
      const opt = { key, item, active: tabActive.value };
      emit("tabRemove", opt);
    };
    const handleTabContextMenu = (option) => {
      const opt = {
        key: option.name,
        item: findTabByKey(option.name, props.tabs),
        active: tabActive.value,
        command: option.command
      };
      emit("tabContextMenu", opt);
    };
    const handleTabSortChange = (data) => {
      const result = data.map((d) => {
        return findTabByKey(d.name, props.tabs);
      });
      if (props.fixedHome && props.tabs != null) {
        const homeTab = props.tabs.find((t) => t.home);
        if (homeTab) {
          result.unshift(homeTab);
        }
      }
      emit("tabSortChange", result);
    };
    const getContentElem = () => {
      if (!layoutRef.value) {
        return null;
      }
      return layoutRef.value.getContentEl();
    };
    const getBodyScrollEl = () => {
      if (props.fixedBody) {
        return getContentElem();
      }
      const bProps = backTopProps.value;
      if (bProps && typeof bProps === "object" && bProps.target) {
        if (typeof bProps.target === "string") {
          return document.querySelector(bProps.target);
        }
        return bProps.target;
      }
      return document.body;
    };
    const handleRouteChange = (route) => {
      const { path, meta } = route;
      hideFooter.value = !!meta.hideFooter;
      if (props.autoScrollTop) {
        const bodyScrollEl = getBodyScrollEl();
        if (bodyScrollEl) {
          bodyScrollEl.scrollTop = 0;
        }
      }
      if (props.redirectPath && path.startsWith(props.redirectPath)) {
        return;
      }
      hideSidebar.value = !!meta.hideSidebar;
      hideSidebox.value = props.sidebarLayout === "mix" ? !!meta.hideSidebox : true;
      hideHeader.value = !!meta.hideHeader;
      hideTabs.value = !!meta.hideTabs;
      const navigationIsChanged = updateNavigation();
      const sideNavigationIsChanged = updateSideNavigation();
      const { active, title, menu, matched, activeOther } = getRouteMatched(
        route,
        menuData.value
      );
      levelData.value = getMatchedLevels(
        matched,
        activeOther,
        route,
        menuData.value,
        tabData.value
      );
      const tab = getRouteTab(
        route,
        tabData.value,
        homeMenuPath.value,
        title,
        menu
      );
      isHome.value = tab.home;
      const lastTabActive = tabActive.value;
      tabActive.value = tab.key;
      emit("tabAdd", tab, lastTabActive);
      if (!navigationIsChanged && !sideNavigationIsChanged) {
        updateMenuActive(active, matched);
        if (navigation.value === "mix" || sideNavigation.value === "mix" || sideNavigation.value === "box") {
          splitMenuData();
        }
      }
      if (mobile.value) {
        updateCollapse(true);
      }
    };
    const updateMenuActive = (active, matched) => {
      const [active1, active2] = matched?.length ? [matched[0].path, (matched[1] ?? matched[0]).path] : [];
      if (navigation.value === "top") {
        navActive.value = active;
        boxActive.value = void 0;
      } else if (navigation.value === "mix") {
        navActive.value = active1;
        boxActive.value = active2;
      } else {
        navActive.value = void 0;
        boxActive.value = active1;
      }
      sideActive.value = active;
      state.navActive = navActive.value;
      state.boxActive = boxActive.value;
      state.sideActive = sideActive.value;
    };
    const splitMenuData = () => {
      const isTopNav = navigation.value === "top";
      const isMixNav = navigation.value === "mix";
      const isMixSide = sideNavigation.value === "mix" || sideNavigation.value === "box";
      const isCollapse = sideNavigation.value === "box" || props.collapse && !mobile.value;
      if (!menuData.value?.length) {
        navData.value = [];
        boxData.value = [];
        sideData.value = [];
      } else if (isTopNav) {
        navData.value = menuData.value;
        boxData.value = [];
        sideData.value = [];
      } else if (isMixNav) {
        navData.value = menuData.value.map((d) => {
          return { ...d, children: void 0, tempChildren: d.children };
        });
        const childMenus = getActiveChilds(menuData.value, navActive.value);
        if (!childMenus.length) {
          boxData.value = [];
          sideData.value = [];
        } else if (isMixSide) {
          boxData.value = childMenus.map((d) => {
            return {
              ...d,
              children: isCollapse ? d.children : void 0,
              tempChildren: d.children
            };
          });
          sideData.value = getActiveChilds(childMenus, boxActive.value);
        } else {
          boxData.value = [];
          sideData.value = childMenus;
        }
      } else {
        navData.value = [];
        if (isMixSide) {
          boxData.value = menuData.value.map((d) => {
            return {
              ...d,
              children: isCollapse ? d.children : void 0,
              tempChildren: d.children
            };
          });
          sideData.value = getActiveChilds(menuData.value, boxActive.value);
        } else {
          boxData.value = [];
          sideData.value = menuData.value;
        }
      }
      state.navData = navData.value;
      state.boxData = boxData.value;
      state.sideData = sideData.value;
    };
    const updateMenuData = () => {
      let home;
      menuData.value = mapTree(props.menus, (item) => {
        if (!home && !item.children?.length) {
          home = item;
        }
        const title = routeI18n(item.path, item) || item.meta?.title;
        return { ...item, meta: { ...item.meta, title } };
      });
      splitMenuData();
      homeMenuPath.value = props.homePath || home?.path || "/";
    };
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
    const updateLevelData = () => {
      levelData.value = levelData.value.map((item) => {
        const t = findTabByPath(item.path, tabData.value);
        const m = findMenuByPath(item.path, menuData.value);
        const title = t?.title || m?.meta?.title || routeI18n(item.path, m, t, item);
        return { ...item, title: title || item.title };
      });
    };
    const routeI18n = (path, menu, tab, level) => {
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
          emit("bodySizeChange", { width, height, mobile: mobile.value });
        }
      }
    };
    useWindowListener(debounce(() => handleResize(), 500));
    const [startBodyResizeTimer] = useTimer(600);
    const layoutProvide = shallowReactive({
      keepAlive: props.tabBar && props.keepAlive,
      responsive: props.responsive,
      activeMenu: (path) => {
        updateMenuActive(path, getMatchedMenus(path, menuData.value));
        if (navigation.value === "mix" || sideNavigation.value === "mix" || sideNavigation.value === "box") {
          splitMenuData();
        }
      }
    });
    provide(PRO_LAYOUT_KEY, layoutProvide);
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
        if (sideNavigation.value === "mix" && !mobile.value) {
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
    useWindowListener("keydown", (e) => {
      if (e.keyCode === 27 && props.compressOnEsc && props.maximized) {
        e.stopPropagation();
        updateMaximized(false);
      }
    });
    onMounted(() => {
      handleResize();
    });
    __expose({
      layoutRef,
      // 弹窗操作
      openModal,
      closeModal,
      closeAllModal,
      removeModal,
      removeAllModal,
      updateModalProps
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleAdminLayout, {
        ref_key: "layoutRef",
        ref: layoutRef,
        height: _ctx.height,
        headerMenus: layoutHeaders.value,
        headerActive: navActive.value,
        sidebarMenus: layoutSidebars.value,
        sidebarActive: sideActive.value,
        sideboxMenus: layoutSideboxs.value,
        sideboxActive: isBoxSide.value || _ctx.collapse && !mobile.value ? sideActive.value : boxActive.value,
        tabs: layoutTabs.value,
        tabActive: tabActive.value,
        levels: layoutLevels.value,
        collapse: _ctx.collapse,
        compact: _ctx.compact,
        maximized: routeMaximized.value,
        tabBar: routeTabBar.value,
        breadcrumb: breadcrumbProps.value,
        breadcrumbStyle: _ctx.breadcrumbStyle,
        backTop: backTopProps.value,
        headerMenuProps: navMenuProps.value,
        sidebarMenuProps: sideMenuProps.value,
        sideboxMenuProps: boxMenuProps.value,
        layout: routeLayout.value,
        sidebarLayout: routeSideType.value,
        headerStyle: _ctx.headerStyle,
        sidebarStyle: _ctx.sidebarStyle,
        mixSidebarStyle: _ctx.mixSidebarStyle,
        tabStyle: _ctx.tabStyle,
        fixedHeader: _ctx.fixedHeader,
        fixedSidebar: _ctx.fixedSidebar,
        fixedBody: _ctx.fixedBody,
        logoInHeader: _ctx.logoInHeader,
        fixedHome: _ctx.fixedHome,
        homePath: homeMenuPath.value,
        isHome: isHome.value,
        tabContextMenu: _ctx.tabContextMenu,
        tabContextMenus: _ctx.tabContextMenus,
        tabSortable: _ctx.tabSortable,
        headerTitleSlot: _ctx.headerTitleSlot,
        headerIconSlot: _ctx.headerIconSlot,
        sidebarTitleSlot: _ctx.sidebarTitleSlot,
        sidebarIconSlot: _ctx.sidebarIconSlot,
        sideboxTitleSlot: _ctx.sideboxTitleSlot,
        sideboxIconSlot: _ctx.sideboxIconSlot,
        headerCustomStyle: _ctx.headerCustomStyle,
        sidebarCustomStyle: _ctx.sidebarCustomStyle,
        sideboxCustomStyle: _ctx.sideboxCustomStyle,
        sideCustomStyle: _ctx.sideCustomStyle,
        tabsCustomStyle: _ctx.tabsCustomStyle,
        contentCustomStyle: _ctx.contentCustomStyle,
        contentCustomClass: ["ele-pro-layout-content", _ctx.contentCustomClass ?? ""],
        logoStyle: _ctx.logoStyle,
        logoTitleStyle: _ctx.logoTitleStyle,
        headerMenusStyle: _ctx.headerMenusStyle,
        sidebarMenusStyle: _ctx.sidebarMenusStyle,
        sideboxMenusStyle: _ctx.sideboxMenusStyle,
        logoSrc: _ctx.logoSrc,
        logoTitle: _ctx.logoTitle,
        menuScrollToActive: _ctx.menuScrollToActive,
        mobile: mobile.value,
        class: normalizeClass(["ele-pro-layout", { "ele-admin-limited": !_ctx.fluid }]),
        "onUpdate:collapse": updateCollapse,
        onLogoClick: handleLogoClick,
        onHeadMenuOpen: handleHeadMenuOpen,
        onHeadMenuClose: handleHeadMenuClose,
        onHeadMenuItemClick: handleHeadMenuItemClick,
        onHeadMenuItemMouseenter: handleHeadMenuItemMouseenter,
        onHeadMouseenter: handleHeadMouseenter,
        onHeadMouseleave: handleHeadMouseleave,
        onBoxMenuItemClick: handleBoxMenuItemClick,
        onBoxMenuItemMouseenter: handleBoxMenuItemMouseenter,
        onBoxMouseenter: handleBoxMouseEnter,
        onBoxMouseleave: handleBoxMouseLeave,
        onSideMenuOpen: handleSideMenuOpen,
        onSideMenuClose: handleSideMenuClose,
        onSideMenuItemClick: handleSideMenuItemClick,
        onSideMouseenter: handleSideMouseEnter,
        onSideMouseleave: handleSideMouseLeave,
        onTabClick: handleTabClick,
        onTabRemove: handleTabRemove,
        onTabContextMenu: handleTabContextMenu,
        onTabSortChange: handleTabSortChange
      }, createSlots({
        body: withCtx(() => [
          _ctx.tabBar && _ctx.keepAlive ? (openBlock(), createBlock(IframeGroup, {
            key: 0,
            keepAlive: _ctx.keepAlive,
            transitionName: _ctx.transitionName,
            transitionDelay: _ctx.transitionDelay,
            tabData: tabData.value,
            tabActive: tabActive.value
          }, null, 8, ["keepAlive", "transitionName", "transitionDelay", "tabData", "tabActive"])) : createCommentVNode("", true),
          createVNode(unref(EleModalRender), {
            modals: unref(modals),
            onRemoveItem: unref(removeModal),
            onUpdateItemVisible: unref(updateModalVisible),
            onUpdateItemProps: unref(updateModalProps)
          }, null, 8, ["modals", "onRemoveItem", "onUpdateItemVisible", "onUpdateItemProps"])
        ]),
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default"),
          !hideFooter.value ? renderSlot(_ctx.$slots, "footer", { key: 0 }) : createCommentVNode("", true)
        ]),
        _: 2
      }, [
        _ctx.$slots.logo ? {
          name: "logo",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "logo", {
              collapse: _ctx.collapse,
              sidebar: sidebar.value
            })
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots.logoTitle ? {
          name: "logoTitle",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "logoTitle", {
              collapse: _ctx.collapse,
              sidebar: sidebar.value
            })
          ]),
          key: "1"
        } : void 0,
        _ctx.$slots.breadcrumb ? {
          name: "breadcrumb",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "breadcrumb", {
              levels: levelData.value,
              isHome: isHome.value,
              homePath: homeMenuPath.value,
              sidebar: sidebar.value
            })
          ]),
          key: "2"
        } : void 0,
        _ctx.$slots.left ? {
          name: "left",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "left", { sidebar: sidebar.value })
          ]),
          key: "3"
        } : void 0,
        _ctx.$slots.center ? {
          name: "center",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "center", { sidebar: sidebar.value })
          ]),
          key: "4"
        } : void 0,
        _ctx.$slots.right ? {
          name: "right",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "right", { sidebar: sidebar.value })
          ]),
          key: "5"
        } : void 0,
        renderList(Object.keys(_ctx.$slots).filter(
          (k) => ![
            "default",
            "logo",
            "logoTitle",
            "breadcrumb",
            "left",
            "center",
            "right",
            "footer",
            "body"
          ].includes(k)
        ), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1032, ["height", "headerMenus", "headerActive", "sidebarMenus", "sidebarActive", "sideboxMenus", "sideboxActive", "tabs", "tabActive", "levels", "collapse", "compact", "maximized", "tabBar", "breadcrumb", "breadcrumbStyle", "backTop", "headerMenuProps", "sidebarMenuProps", "sideboxMenuProps", "layout", "sidebarLayout", "headerStyle", "sidebarStyle", "mixSidebarStyle", "tabStyle", "fixedHeader", "fixedSidebar", "fixedBody", "logoInHeader", "fixedHome", "homePath", "isHome", "tabContextMenu", "tabContextMenus", "tabSortable", "headerTitleSlot", "headerIconSlot", "sidebarTitleSlot", "sidebarIconSlot", "sideboxTitleSlot", "sideboxIconSlot", "headerCustomStyle", "sidebarCustomStyle", "sideboxCustomStyle", "sideCustomStyle", "tabsCustomStyle", "contentCustomStyle", "contentCustomClass", "logoStyle", "logoTitleStyle", "headerMenusStyle", "sidebarMenusStyle", "sideboxMenusStyle", "logoSrc", "logoTitle", "menuScrollToActive", "mobile", "class"]);
    };
  }
});
export {
  _sfc_main as default
};

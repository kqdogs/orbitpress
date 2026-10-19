import { defineComponent, shallowRef, computed, shallowReactive, provide, watch, nextTick, onMounted, openBlock, createBlock, normalizeStyle, normalizeClass, withCtx, createElementVNode, renderSlot, mergeProps, createCommentVNode, createSlots, renderList, normalizeProps, guardReactiveProps, createElementBlock, createVNode, unref, Fragment, toDisplayString } from "vue";
import { ElScrollbar } from "element-plus";
import { useTimer } from "../utils/hook";
import EleMenus from "../ele-menus/index";
import EleBreadcrumb from "../ele-breadcrumb/index";
import EleBacktop from "../ele-backtop/index";
import LayoutSkeleton from "./components/layout-skeleton";
import LayoutTabs from "./components/layout-tabs";
import { adminLayoutEmits, adminLayoutProps, LAYOUT_KEY } from "./props";
const _hoisted_1 = ["src"];
const _hoisted_2 = {
  key: 1,
  class: "ele-admin-tools"
};
const _hoisted_3 = {
  key: 5,
  class: "ele-admin-tools"
};
const _hoisted_4 = ["src"];
const _hoisted_5 = ["src"];
const _hoisted_6 = ["data-id"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleAdminLayout" },
  __name: "index",
  props: adminLayoutProps,
  emits: adminLayoutEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const tabSlots = ["tabTitle", "tabExtra", "tabHome"];
    const ownSlots = [
      "logo",
      "logoTitle",
      "left",
      "right",
      "center",
      "breadcrumb",
      "top",
      "bottom",
      "boxTop",
      "boxBottom",
      "body",
      ...tabSlots
    ];
    const props = __props;
    const emit = __emit;
    const [startDisableTransitionTimer] = useTimer(100);
    const [startSidebarMenuTimer, stopSidebarMenuTimer] = useTimer(420);
    const [startSideboxMenuTimer, stopSideboxMenuTimer] = useTimer(420);
    const [startHeaderHoverTimer, stopHeaderHoverTimer] = useTimer(300);
    let isHeaderhover = false;
    const sidebarMenuRef = shallowRef(null);
    const sideboxMenuRef = shallowRef(null);
    const contentRef = shallowRef(null);
    const modalsRef = shallowRef(null);
    const isDisableTransition = shallowRef(false);
    const layoutHeight = computed(
      () => typeof props.height === "number" ? `${props.height}px` : props.height
    );
    const isFixedHeader = computed(
      () => !props.fixedBody && props.fixedHeader
    );
    const isFixedSidebar = computed(
      () => !props.fixedBody && props.fixedSidebar
    );
    const isTopLayout = computed(() => props.layout === "top");
    const isSideLayout = computed(() => props.layout === "side");
    const isBoxSidebar = computed(() => props.sidebarLayout === "box");
    const isMixSidebar = computed(
      () => !isTopLayout.value && (props.sidebarLayout === "mix" || isBoxSidebar.value)
    );
    const isMobile = computed(() => props.mobile && !isTopLayout.value);
    const isHeaderLogo = computed(
      () => (props.logoInHeader || isTopLayout.value) && !isSideLayout.value && !isMobile.value
    );
    const showHeaderMenus = computed(
      () => isTopLayout.value || props.layout === "mix"
    );
    const showHeaderTabs = computed(() => props.tabBar === "header");
    const isDarkHeader = computed(() => props.headerStyle === "dark");
    const isPrimaryHeader = computed(
      () => props.headerStyle === "primary"
    );
    const isButtonTab = computed(() => props.tabStyle === "button");
    const isDarkSidebar = computed(() => props.sidebarStyle === "dark");
    const isDarkMixSidebar = computed(
      () => props.mixSidebarStyle == null ? isMixSidebar.value && !isHeaderLogo.value && isDarkSidebar.value && (isDarkHeader.value || isPrimaryHeader.value) : props.mixSidebarStyle === "dark"
    );
    const isGhostHeader = computed(
      () => !isDarkHeader.value && !isPrimaryHeader.value && showHeaderTabs.value && isButtonTab.value
    );
    const isGhostSidebar = computed(
      () => isGhostHeader.value && !isDarkSidebar.value
    );
    const isCollapseSidebar = computed(
      () => !isMobile.value && props.collapse
    );
    const isCollapseMobile = computed(
      () => isMobile.value && props.collapse
    );
    const getContentEl = () => {
      return contentRef.value;
    };
    const getModalsEl = () => {
      return modalsRef.value;
    };
    const getBodyWrapperEl = () => {
      const contentEl = getContentEl();
      return contentEl?.parentElement;
    };
    const sidebarScrollToActive = () => {
      stopSidebarMenuTimer();
      if (!(props.fixedBody || props.fixedSidebar) || !props.menuScrollToActive || sidebarMenuRef.value == null || isCollapseMobile.value || isMixSidebar.value && isCollapseSidebar.value) {
        return;
      }
      startSidebarMenuTimer(() => {
        sidebarMenuRef.value && sidebarMenuRef.value.scrollToActive();
      });
    };
    const sideboxScrollToActive = () => {
      stopSideboxMenuTimer();
      if (!(props.fixedBody || props.fixedSidebar) || !props.menuScrollToActive || sideboxMenuRef.value == null || isCollapseMobile.value) {
        return;
      }
      startSideboxMenuTimer(() => {
        sideboxMenuRef.value && sideboxMenuRef.value.scrollToActive();
      });
    };
    const updateCollapse = (value) => {
      const collapse = !props.collapse;
      if (collapse !== props.collapse) {
        emit("update:collapse", collapse);
      }
    };
    const handleLogoClick = (e) => {
      emit("logoClick", e);
    };
    const handleHeadMenuOpen = (index, indexPath) => {
      emit("headMenuOpen", index, indexPath);
    };
    const handleHeadMenuClose = (index, indexPath) => {
      emit("headMenuClose", index, indexPath);
    };
    const handleHeadMenuItemClick = (item, e, type) => {
      emit("headMenuItemClick", item, e, type);
    };
    const handleHeadMenuItemMouseenter = (item, e) => {
      emit("headMenuItemMouseenter", item, e);
      handleHeadMouseenter(e);
    };
    const handleHeadMenuItemMouseleave = (item, e) => {
      emit("headMenuItemMouseleave", item, e);
      handleHeadMouseleave(e);
    };
    const handleHeadMouseenter = (e) => {
      stopHeaderHoverTimer();
      if (!isHeaderhover) {
        isHeaderhover = true;
        emit("headMouseenter", e);
      }
    };
    const handleHeadMouseleave = (e) => {
      startHeaderHoverTimer(() => {
        isHeaderhover = false;
        emit("headMouseleave", e);
      });
    };
    const handleBoxMenuItemClick = (item, e, type) => {
      emit("boxMenuItemClick", item, e, type);
    };
    const handleBoxMenuItemMouseenter = (item, e) => {
      emit("boxMenuItemMouseenter", item, e);
    };
    const handleBoxMenuItemMouseleave = (item, e) => {
      emit("boxMenuItemMouseleave", item, e);
    };
    const handleBoxMouseEnter = (e) => {
      emit("boxMouseenter", e);
    };
    const handleBoxMouseLeave = (e) => {
      emit("boxMouseleave", e);
    };
    const handleSideMenuOpen = (index, indexPath) => {
      emit("sideMenuOpen", index, indexPath);
    };
    const handleSideMenuClose = (index, indexPath) => {
      emit("sideMenuClose", index, indexPath);
    };
    const handleSideMenuItemClick = (item, e, type) => {
      emit("sideMenuItemClick", item, e, type);
    };
    const handleSideMouseEnter = (e) => {
      emit("sideMouseenter", e);
    };
    const handleSideMouseLeave = (e) => {
      emit("sideMouseleave", e);
    };
    const handleTabClick = (option) => {
      emit("tabClick", option);
    };
    const handleTabRemove = (name, closeable) => {
      if (closeable == null || closeable) {
        emit("tabRemove", name);
      }
    };
    const handleTabContextMenu = (option) => {
      emit("tabContextMenu", option);
    };
    const handleTabSortChange = (data) => {
      emit("tabSortChange", data);
    };
    const layoutProvide = shallowReactive({
      layout: props.layout,
      maximized: props.maximized,
      fixedHeader: isFixedHeader.value,
      fixedBody: props.fixedBody,
      modalsEl: null,
      getModalsEl,
      getBodyWrapperEl
    });
    provide(LAYOUT_KEY, layoutProvide);
    watch(
      [
        () => props.layout,
        () => props.sidebarLayout,
        () => props.fixedSidebar,
        () => props.fixedBody,
        () => props.logoInHeader,
        () => props.maximized,
        isFixedHeader,
        isMobile
      ],
      () => {
        isDisableTransition.value = true;
        startDisableTransitionTimer(() => {
          isDisableTransition.value = false;
        });
        if (layoutProvide.layout !== props.layout) {
          layoutProvide.layout = props.layout;
        }
        if (layoutProvide.maximized !== props.maximized) {
          layoutProvide.maximized = props.maximized;
        }
        if (layoutProvide.fixedHeader !== isFixedHeader.value) {
          layoutProvide.fixedHeader = isFixedHeader.value;
        }
        if (layoutProvide.fixedBody !== props.fixedBody) {
          layoutProvide.fixedBody = props.fixedBody;
        }
      }
    );
    watch([() => props.sidebarActive, () => props.collapse], () => {
      nextTick(() => {
        sidebarScrollToActive();
      });
    });
    watch([() => props.sideboxActive, () => props.compact], () => {
      nextTick(() => {
        sideboxScrollToActive();
      });
    });
    onMounted(() => {
      sideboxScrollToActive();
      sidebarScrollToActive();
      const modalsEl = getModalsEl();
      layoutProvide.modalsEl = modalsEl;
      const contentEl = getContentEl();
      if (contentEl != null && modalsEl != null) {
        emit("contentMounted", contentEl, modalsEl);
      }
    });
    __expose({
      sidebarMenuRef,
      sideboxMenuRef,
      getContentEl
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(LayoutSkeleton, {
        isHeaderLogo: isHeaderLogo.value,
        class: normalizeClass([
          { "is-fixed-body": _ctx.fixedBody },
          { "is-top-layout": isTopLayout.value },
          { "is-transition-disabled": isDisableTransition.value },
          { "is-maximized": _ctx.maximized },
          { "is-expanded": _ctx.maximized === "expanded" },
          { "is-mobile": isMobile.value },
          { "is-collapse": isCollapseMobile.value }
        ]),
        style: normalizeStyle({
          minHeight: layoutHeight.value,
          height: _ctx.fixedBody ? layoutHeight.value : void 0
        })
      }, {
        head: withCtx(() => [
          !isSideLayout.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["ele-admin-header", [
              { "is-dark": isDarkHeader.value },
              { "is-primary": isPrimaryHeader.value },
              { "is-ghost": isGhostHeader.value },
              { "show-divider": _ctx.tabBar && !showHeaderTabs.value && !isButtonTab.value },
              { "is-fixed": isFixedHeader.value }
            ]]),
            style: normalizeStyle(_ctx.headerCustomStyle),
            onMouseenter: handleHeadMouseenter,
            onMouseleave: handleHeadMouseleave
          }, [
            isHeaderLogo.value && (_ctx.logoSrc || _ctx.logoTitle || _ctx.$slots.logo || _ctx.$slots.logoTitle) ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-admin-logo",
              style: normalizeStyle(_ctx.logoStyle),
              onClick: handleLogoClick
            }, [
              _ctx.logoSrc || _ctx.$slots.logo ? renderSlot(_ctx.$slots, "logo", { key: 0 }, () => [
                createElementVNode("img", { src: _ctx.logoSrc }, null, 8, _hoisted_1)
              ]) : createCommentVNode("", true),
              _ctx.logoTitle || _ctx.$slots.logoTitle ? renderSlot(_ctx.$slots, "logoTitle", { key: 1 }, () => [
                createElementVNode("h1", null, toDisplayString(_ctx.logoTitle), 1)
              ]) : createCommentVNode("", true)
            ], 4)) : createCommentVNode("", true),
            _ctx.$slots.left ? (openBlock(), createElementBlock("div", _hoisted_2, [
              renderSlot(_ctx.$slots, "left")
            ])) : createCommentVNode("", true),
            _ctx.breadcrumb ? (openBlock(), createElementBlock("div", {
              key: 2,
              class: "ele-admin-breadcrumb",
              style: normalizeStyle(_ctx.breadcrumbStyle)
            }, [
              renderSlot(_ctx.$slots, "breadcrumb", {}, () => [
                _ctx.levels && _ctx.levels.length ? (openBlock(), createBlock(EleBreadcrumb, mergeProps({ key: 0 }, _ctx.breadcrumb === true ? {} : _ctx.breadcrumb, { items: _ctx.levels }), null, 16, ["items"])) : createCommentVNode("", true)
              ])
            ], 4)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "center"),
            !showHeaderTabs.value || showHeaderMenus.value ? (openBlock(), createElementBlock("div", {
              key: 3,
              class: "ele-admin-menus",
              style: normalizeStyle(_ctx.headerMenusStyle)
            }, [
              showHeaderMenus.value && _ctx.headerMenus ? (openBlock(), createBlock(EleMenus, mergeProps({
                key: 0,
                mode: "horizontal",
                theme: isDarkHeader.value || isPrimaryHeader.value ? "dark" : "light",
                popupTheme: isDarkHeader.value ? "dark" : "light",
                defaultActive: _ctx.headerActive
              }, _ctx.headerMenuProps || {}, {
                items: _ctx.headerMenus,
                onOpen: handleHeadMenuOpen,
                onClose: handleHeadMenuClose,
                onItemClick: handleHeadMenuItemClick,
                onItemMouseenter: handleHeadMenuItemMouseenter,
                onItemMouseleave: handleHeadMenuItemMouseleave
              }), createSlots({ _: 2 }, [
                _ctx.headerIconSlot && !ownSlots.includes(_ctx.headerIconSlot) && _ctx.$slots[_ctx.headerIconSlot] ? {
                  name: "icon",
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, _ctx.headerIconSlot, normalizeProps(guardReactiveProps(slotProps || {})))
                  ]),
                  key: "0"
                } : void 0,
                _ctx.headerTitleSlot && !ownSlots.includes(_ctx.headerTitleSlot) && _ctx.$slots[_ctx.headerTitleSlot] ? {
                  name: "title",
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, _ctx.headerTitleSlot, normalizeProps(guardReactiveProps(slotProps || {})))
                  ]),
                  key: "1"
                } : void 0
              ]), 1040, ["theme", "popupTheme", "defaultActive", "items"])) : createCommentVNode("", true)
            ], 4)) : createCommentVNode("", true),
            showHeaderTabs.value ? (openBlock(), createBlock(LayoutTabs, {
              key: 4,
              tabs: _ctx.tabs,
              active: _ctx.tabActive,
              fixedHome: _ctx.fixedHome,
              homePath: _ctx.homePath,
              isHome: _ctx.isHome,
              tabStyle: _ctx.tabStyle,
              tabContextMenu: _ctx.tabContextMenu,
              tabContextMenus: _ctx.tabContextMenus,
              tabSortable: _ctx.tabSortable,
              class: normalizeClass([{ "is-fixed-home": _ctx.fixedHome }]),
              style: normalizeStyle(_ctx.tabsCustomStyle),
              onTabClick: handleTabClick,
              onTabRemove: handleTabRemove,
              onTabContextMenu: handleTabContextMenu,
              onTabSortChange: handleTabSortChange
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter(
                (k) => tabSlots.includes(k)
              ), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["tabs", "active", "fixedHome", "homePath", "isHome", "tabStyle", "tabContextMenu", "tabContextMenus", "tabSortable", "class", "style"])) : createCommentVNode("", true),
            _ctx.$slots.right ? (openBlock(), createElementBlock("div", _hoisted_3, [
              renderSlot(_ctx.$slots, "right")
            ])) : createCommentVNode("", true)
          ], 38)) : createCommentVNode("", true)
        ]),
        side: withCtx(() => [
          !isTopLayout.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(["ele-admin-side", [
              { "is-fixed": isFixedSidebar.value },
              { "show-placeholder": isFixedSidebar.value && isHeaderLogo.value },
              { "is-collapse": !isMobile.value && !isBoxSidebar.value && isCollapseSidebar.value },
              { "is-mix": !isMobile.value && !isBoxSidebar.value && isMixSidebar.value },
              { "is-compact": !isMobile.value && _ctx.compact },
              { "is-box": !isMobile.value && isBoxSidebar.value }
            ]]),
            style: normalizeStyle([
              { height: isFixedSidebar.value ? layoutHeight.value : void 0 },
              _ctx.sideCustomStyle
            ])
          }, [
            isMixSidebar.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["ele-admin-sidebox", [
                { "is-dark": isDarkSidebar.value },
                { "is-ghost": isGhostSidebar.value },
                { "show-divider": !isCollapseSidebar.value && !isBoxSidebar.value },
                { "is-compact": _ctx.compact }
              ]]),
              style: normalizeStyle(_ctx.sideboxCustomStyle),
              onMouseenter: handleBoxMouseEnter,
              onMouseleave: handleBoxMouseLeave
            }, [
              !isHeaderLogo.value && (_ctx.logoSrc || _ctx.$slots.logo) ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-admin-logo",
                style: normalizeStyle(_ctx.logoStyle),
                onClick: handleLogoClick
              }, [
                renderSlot(_ctx.$slots, "logo", {}, () => [
                  createElementVNode("img", { src: _ctx.logoSrc }, null, 8, _hoisted_4)
                ])
              ], 4)) : createCommentVNode("", true),
              renderSlot(_ctx.$slots, "boxTop"),
              createVNode(unref(ElScrollbar), {
                class: "ele-admin-menus",
                style: normalizeStyle(_ctx.sideboxMenusStyle)
              }, {
                default: withCtx(() => [
                  _ctx.sideboxMenus ? (openBlock(), createBlock(EleMenus, mergeProps({
                    key: 0,
                    ref_key: "sideboxMenuRef",
                    ref: sideboxMenuRef,
                    mode: "compact",
                    uniqueOpened: true,
                    collapseTransition: false,
                    theme: _ctx.sidebarStyle,
                    defaultActive: _ctx.sideboxActive,
                    collapse: _ctx.compact
                  }, _ctx.sideboxMenuProps || {}, {
                    items: _ctx.sideboxMenus,
                    onItemClick: handleBoxMenuItemClick,
                    onItemMouseenter: handleBoxMenuItemMouseenter,
                    onItemMouseleave: handleBoxMenuItemMouseleave
                  }), createSlots({ _: 2 }, [
                    _ctx.sideboxIconSlot && !ownSlots.includes(_ctx.sideboxIconSlot) && _ctx.$slots[_ctx.sideboxIconSlot] ? {
                      name: "icon",
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, _ctx.sideboxIconSlot, normalizeProps(guardReactiveProps(slotProps || {})))
                      ]),
                      key: "0"
                    } : void 0,
                    _ctx.sideboxTitleSlot && !ownSlots.includes(_ctx.sideboxTitleSlot) && _ctx.$slots[_ctx.sideboxTitleSlot] ? {
                      name: "title",
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, _ctx.sideboxTitleSlot, normalizeProps(guardReactiveProps(slotProps || {})))
                      ]),
                      key: "1"
                    } : void 0
                  ]), 1040, ["theme", "defaultActive", "collapse", "items"])) : createCommentVNode("", true)
                ]),
                _: 3
              }, 8, ["style"]),
              renderSlot(_ctx.$slots, "boxBottom")
            ], 38)) : createCommentVNode("", true),
            !isBoxSidebar.value ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: normalizeClass(["ele-admin-sidebar", [
                { "is-dark": isMixSidebar.value ? isDarkMixSidebar.value : isDarkSidebar.value },
                { "is-ghost": isGhostSidebar.value },
                { "is-mix": isMixSidebar.value },
                { "is-collapse": isCollapseSidebar.value }
              ]]),
              style: normalizeStyle(_ctx.sidebarCustomStyle),
              onMouseenter: handleSideMouseEnter,
              onMouseleave: handleSideMouseLeave
            }, [
              isMixSidebar.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                !isHeaderLogo.value && (_ctx.logoTitle || _ctx.$slots.logoTitle) ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: "ele-admin-logo-title",
                  style: normalizeStyle(_ctx.logoTitleStyle)
                }, [
                  renderSlot(_ctx.$slots, "logoTitle", {}, () => [
                    createElementVNode("h1", null, toDisplayString(_ctx.logoTitle), 1)
                  ])
                ], 4)) : createCommentVNode("", true)
              ], 64)) : !isHeaderLogo.value && (_ctx.logoSrc || _ctx.logoTitle || _ctx.$slots.logo || _ctx.$slots.logoTitle) ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: "ele-admin-logo",
                style: normalizeStyle(_ctx.logoStyle),
                onClick: handleLogoClick
              }, [
                _ctx.logoSrc || _ctx.$slots.logo ? renderSlot(_ctx.$slots, "logo", { key: 0 }, () => [
                  createElementVNode("img", { src: _ctx.logoSrc }, null, 8, _hoisted_5)
                ]) : createCommentVNode("", true),
                _ctx.logoTitle || _ctx.$slots.logoTitle ? renderSlot(_ctx.$slots, "logoTitle", { key: 1 }, () => [
                  createElementVNode("h1", null, toDisplayString(_ctx.logoTitle), 1)
                ]) : createCommentVNode("", true)
              ], 4)) : createCommentVNode("", true),
              renderSlot(_ctx.$slots, "top"),
              createVNode(unref(ElScrollbar), {
                class: "ele-admin-menus",
                style: normalizeStyle(_ctx.sidebarMenusStyle)
              }, {
                default: withCtx(() => [
                  _ctx.sidebarMenus ? (openBlock(), createBlock(EleMenus, mergeProps({
                    key: 0,
                    ref_key: "sidebarMenuRef",
                    ref: sidebarMenuRef,
                    uniqueOpened: true,
                    collapseTransition: false,
                    theme: isMixSidebar.value ? isDarkMixSidebar.value ? "dark" : void 0 : _ctx.sidebarStyle,
                    defaultActive: _ctx.sidebarActive,
                    collapse: isMixSidebar.value ? false : isCollapseSidebar.value
                  }, _ctx.sidebarMenuProps || {}, {
                    items: _ctx.sidebarMenus,
                    onOpen: handleSideMenuOpen,
                    onClose: handleSideMenuClose,
                    onItemClick: handleSideMenuItemClick
                  }), createSlots({ _: 2 }, [
                    _ctx.sidebarIconSlot && !ownSlots.includes(_ctx.sidebarIconSlot) && _ctx.$slots[_ctx.sidebarIconSlot] ? {
                      name: "icon",
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, _ctx.sidebarIconSlot, normalizeProps(guardReactiveProps(slotProps || {})))
                      ]),
                      key: "0"
                    } : void 0,
                    _ctx.sidebarTitleSlot && !ownSlots.includes(_ctx.sidebarTitleSlot) && _ctx.$slots[_ctx.sidebarTitleSlot] ? {
                      name: "title",
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, _ctx.sidebarTitleSlot, normalizeProps(guardReactiveProps(slotProps || {})))
                      ]),
                      key: "1"
                    } : void 0
                  ]), 1040, ["theme", "defaultActive", "collapse", "items"])) : createCommentVNode("", true)
                ]),
                _: 3
              }, 8, ["style"]),
              renderSlot(_ctx.$slots, "bottom")
            ], 38)) : createCommentVNode("", true)
          ], 6)) : createCommentVNode("", true)
        ]),
        tabs: withCtx(({ param }) => [
          _ctx.tabBar && !showHeaderTabs.value ? (openBlock(), createBlock(LayoutTabs, {
            key: 0,
            tabs: _ctx.tabs,
            active: _ctx.tabActive,
            fixedHome: _ctx.fixedHome,
            homePath: _ctx.homePath,
            isHome: _ctx.isHome,
            tabStyle: _ctx.tabStyle,
            tabContextMenu: _ctx.tabContextMenu,
            tabContextMenus: _ctx.tabContextMenus,
            tabSortable: _ctx.tabSortable,
            class: normalizeClass([
              { "is-fixed-home": _ctx.fixedHome },
              { "is-fixed": isFixedHeader.value },
              { "is-fixed-top": isFixedHeader.value && (isSideLayout.value || _ctx.maximized) }
            ]),
            style: normalizeStyle(_ctx.tabsCustomStyle),
            onTabClick: handleTabClick,
            onTabRemove: (name) => handleTabRemove(name, !!param?.label),
            onTabContextMenu: handleTabContextMenu,
            onTabSortChange: handleTabSortChange
          }, createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter(
              (k) => tabSlots.includes(k)
            ), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1032, ["tabs", "active", "fixedHome", "homePath", "isHome", "tabStyle", "tabContextMenu", "tabContextMenus", "tabSortable", "class", "style", "onTabRemove"])) : createCommentVNode("", true)
        ]),
        body: withCtx(({ param }) => [
          createElementVNode("div", {
            ref_key: "contentRef",
            ref: contentRef,
            class: normalizeClass(["ele-admin-content", _ctx.contentCustomClass]),
            style: normalizeStyle(_ctx.contentCustomStyle)
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 6),
          renderSlot(_ctx.$slots, "body"),
          _ctx.backTop ? (openBlock(), createBlock(EleBacktop, mergeProps({
            key: 0,
            target: _ctx.fixedBody && contentRef.value ? contentRef.value : void 0,
            style: _ctx.fixedBody ? { position: "absolute" } : void 0
          }, _ctx.backTop === true ? {} : _ctx.backTop), null, 16, ["target", "style"])) : createCommentVNode("", true),
          createElementVNode("div", {
            ref_key: "modalsRef",
            ref: modalsRef,
            class: "ele-admin-modals",
            "data-id": param?.key
          }, null, 8, _hoisted_6)
        ]),
        default: withCtx(() => [
          createElementVNode("div", {
            class: "ele-admin-mask",
            onClick: _cache[0] || (_cache[0] = ($event) => updateCollapse())
          })
        ]),
        _: 3
      }, 8, ["isHeaderLogo", "class", "style"]);
    };
  }
});
export {
  _sfc_main as default
};

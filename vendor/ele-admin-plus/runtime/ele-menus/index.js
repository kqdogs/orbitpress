import { defineComponent, ref, shallowRef, computed, onMounted, watch, openBlock, createBlock, unref, mergeProps, withCtx, createSlots, renderList, renderSlot, normalizeProps, guardReactiveProps, createCommentVNode, createVNode, resolveDynamicComponent, normalizeStyle } from "vue";
import { ElMenu, ElSubMenu, ElIcon } from "element-plus";
import { EllipsisOutlined } from "../icons/index";
import { pick, contentIsEllipsis } from "../utils/common";
import EleTooltip from "../ele-tooltip/index";
import MenuItems from "./components/menu-items";
import { useMenuEllipsis, getMenuItems, getPopperClass } from "./util";
import { menusEmits, menusProps, menuPropKeys } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleMenus" },
  __name: "index",
  props: menusProps,
  emits: menusEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isWebkit = navigator?.userAgent?.includes?.("WebKit");
    const menuRef = ref(null);
    const ellipsisRef = ref(null);
    const sliceIndex = ref(-1);
    const menuItems = shallowRef([]);
    const moreMenuItems = shallowRef([]);
    const tooltipVirtualRef = ref();
    const tooltipContent = ref("");
    const tooltipVisible = ref(false);
    const isHorizontal = computed(() => props.mode === "horizontal");
    const isCompact = computed(() => props.mode === "compact");
    const collapseTooltipDisabled = computed(
      () => isCompact.value ? !props.collapse : props.tooltipDisabled
    );
    const menuProps = computed(
      () => pick(props, menuPropKeys)
    );
    const open = (index) => {
      if (menuRef.value) {
        menuRef.value.open(index);
      }
    };
    const close = (index) => {
      if (menuRef.value) {
        menuRef.value.open(index);
      }
    };
    const updateActiveIndex = (index) => {
      if (menuRef.value) {
        menuRef.value.updateActiveIndex(index);
      }
    };
    const hideTooltip = () => {
      tooltipVisible.value = false;
    };
    const triggerTooltip = (e) => {
      if (props.textEllipsisTooltip) {
        const itemEl = e.currentTarget?.parentNode;
        if (itemEl) {
          const titleEl = itemEl.querySelector(".ele-menu-title");
          const text = titleEl?.innerText;
          if (text && contentIsEllipsis(titleEl, "horizontal")) {
            tooltipVirtualRef.value = itemEl;
            tooltipContent.value = text;
            tooltipVisible.value = true;
            return;
          }
        }
      }
      hideTooltip();
    };
    const handleOpen = (index, indexPath) => {
      emit("open", index, indexPath);
    };
    const handleClose = (index, indexPath) => {
      emit("close", index, indexPath);
    };
    const handleSelect = (index, indexPath, item, routerResult) => {
      emit("select", index, indexPath, item, routerResult);
    };
    const handleItemClick = (item, e, type) => {
      emit("itemClick", item, e, type);
    };
    const handleItemMouseenter = (item, e) => {
      triggerTooltip(e);
      emit("itemMouseenter", item, e);
    };
    const handleItemMouseleave = (item, e) => {
      hideTooltip();
      emit("itemMouseleave", item, e);
    };
    const handleParentMouseenter = (item, e) => {
      triggerTooltip(e);
      emit("parentMouseenter", item, e);
    };
    const handleParentMouseleave = (item, e) => {
      hideTooltip();
      emit("parentMouseleave", item, e);
    };
    const scrollToActive = () => {
      const menuEl = menuRef.value?.$el;
      if (menuEl) {
        const el = menuEl.querySelector(".el-menu-item.is-active") || menuEl.querySelector(".el-sub-menu.is-active");
        if (el) {
          if (typeof el["scrollIntoViewIfNeeded"] === "function") {
            el.scrollIntoViewIfNeeded(true);
          } else {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    };
    const { observe, unobserve, computedEllipsis } = useMenuEllipsis({
      getMenuEl: () => menuRef.value?.$el,
      getMoreEl: () => ellipsisRef.value?.$el,
      onEllipsis: (index) => {
        if (sliceIndex.value !== index) {
          sliceIndex.value = index;
        }
      }
    });
    onMounted(() => {
      if (props.ellipsis && isHorizontal.value && menuRef.value?.$el) {
        computedEllipsis();
        observe();
      }
    });
    watch(
      [
        () => props.ellipsis,
        isHorizontal,
        () => menuRef.value?.$el,
        () => props.items
      ],
      () => {
        if (props.ellipsis && isHorizontal.value && menuRef.value?.$el) {
          observe();
          return;
        }
        unobserve();
        sliceIndex.value = -1;
      }
    );
    watch(
      [() => props.items, sliceIndex, isHorizontal],
      () => {
        const { items, moreItems } = getMenuItems(
          props.items,
          sliceIndex.value,
          isHorizontal.value
        );
        menuItems.value = items;
        moreMenuItems.value = moreItems;
      },
      {
        immediate: true,
        deep: true
      }
    );
    __expose({
      menuRef,
      ellipsisRef,
      open,
      close,
      updateActiveIndex,
      scrollToActive
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElMenu), mergeProps(menuProps.value, {
        ref_key: "menuRef",
        ref: menuRef,
        ellipsis: false,
        mode: isCompact.value ? "vertical" : _ctx.mode,
        collapse: isCompact.value ? true : _ctx.collapse,
        class: ["ele-menu", [
          { "ele-menu-dark": _ctx.theme === "dark" },
          { "is-night": _ctx.theme === "dark" },
          { "ele-menu-colorful": _ctx.colorful },
          { "is-colorful": _ctx.colorful },
          { "is-compact": isCompact.value },
          { "is-compact-collapse": isCompact.value && _ctx.collapse }
        ]],
        onOpen: handleOpen,
        onClose: handleClose,
        onSelect: handleSelect
      }), {
        default: withCtx(() => [
          menuItems.value && menuItems.value.length ? (openBlock(), createBlock(MenuItems, {
            key: 0,
            items: menuItems.value,
            first: true,
            tipDisabled: collapseTooltipDisabled.value,
            parentIsGroup: false,
            theme: _ctx.theme,
            popTheme: _ctx.popupTheme,
            colorful: _ctx.colorful,
            popupColorful: _ctx.popupColorful,
            firstPopClass: _ctx.firstPopperClass,
            horizontal: isHorizontal.value,
            webkit: unref(isWebkit),
            onItemClick: handleItemClick,
            onItemMouseenter: handleItemMouseenter,
            onItemMouseleave: handleItemMouseleave,
            onParentMouseenter: handleParentMouseenter,
            onParentMouseleave: handleParentMouseleave
          }, createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1032, ["items", "tipDisabled", "theme", "popTheme", "colorful", "popupColorful", "firstPopClass", "horizontal", "webkit"])) : createCommentVNode("", true),
          moreMenuItems.value && moreMenuItems.value.length ? (openBlock(), createBlock(unref(ElSubMenu), mergeProps({
            key: "sub-menu-more",
            teleported: true
          }, _ctx.ellipsisProps || {}, {
            ref_key: "ellipsisRef",
            ref: ellipsisRef,
            index: "sub-menu-more",
            popperClass: unref(getPopperClass)(
              _ctx.ellipsisProps?.popperClass,
              _ctx.theme,
              _ctx.popupTheme,
              _ctx.colorful,
              _ctx.popupColorful,
              _ctx.firstPopperClass,
              true,
              unref(isWebkit)
            ),
            class: "ele-sub-menu-ellipsis"
          }), {
            title: withCtx(() => [
              createVNode(unref(ElIcon), normalizeProps(guardReactiveProps(_ctx.ellipsisProps?.iconProps || {})), {
                default: withCtx(() => [
                  (openBlock(), createBlock(resolveDynamicComponent(_ctx.ellipsisProps?.icon ?? unref(EllipsisOutlined)), {
                    style: normalizeStyle(_ctx.ellipsisProps?.iconStyle)
                  }, null, 8, ["style"]))
                ]),
                _: 1
              }, 16)
            ]),
            default: withCtx(() => [
              createVNode(MenuItems, {
                items: moreMenuItems.value,
                first: false,
                tipDisabled: collapseTooltipDisabled.value,
                parentIsGroup: false,
                theme: _ctx.theme,
                popTheme: _ctx.popupTheme,
                colorful: _ctx.colorful,
                popupColorful: _ctx.popupColorful,
                firstPopClass: _ctx.firstPopperClass,
                webkit: unref(isWebkit),
                onItemClick: handleItemClick,
                onItemMouseenter: handleItemMouseenter,
                onItemMouseleave: handleItemMouseleave,
                onParentMouseenter: handleParentMouseenter,
                onParentMouseleave: handleParentMouseleave
              }, createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                    ])
                  };
                })
              ]), 1032, ["items", "tipDisabled", "theme", "popTheme", "colorful", "popupColorful", "firstPopClass", "webkit"])
            ]),
            _: 3
          }, 16, ["popperClass"])) : createCommentVNode("", true),
          _ctx.textEllipsisTooltip ? (openBlock(), createBlock(EleTooltip, mergeProps({
            key: 2,
            trigger: "click",
            placement: "right",
            fallbackPlacements: [
              "top-end",
              "top",
              "top-start",
              "bottom-end",
              "bottom",
              "bottom-start",
              "left"
            ],
            persistent: false,
            enterable: false,
            triggerKeys: []
          }, _ctx.textEllipsisTooltip === true ? {} : _ctx.textEllipsisTooltip, {
            virtualTriggering: true,
            virtualRef: tooltipVirtualRef.value,
            content: tooltipContent.value,
            visible: tooltipVisible.value
          }), null, 16, ["virtualRef", "content", "visible"])) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16, ["mode", "collapse", "class"]);
    };
  }
});
export {
  _sfc_main as default
};

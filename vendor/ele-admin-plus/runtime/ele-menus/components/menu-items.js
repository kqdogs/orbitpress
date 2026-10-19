import { defineComponent, resolveComponent, openBlock, createElementBlock, Fragment, renderList, createBlock, unref, mergeProps, createSlots, withCtx, createVNode, renderSlot, toDisplayString, createCommentVNode, normalizeStyle, normalizeClass } from "vue";
import { ElMenuItem, ElMenuItemGroup, ElSubMenu } from "element-plus";
import { ArrowRight, ArrowDown } from "../../icons/index";
import { pick } from "../../utils/common";
import ItemTitle from "./item-title";
import { getPopperClass } from "../util";
const _hoisted_1 = {
  key: 0,
  class: "ele-menu-title"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MenuItems" },
  __name: "menu-items",
  props: {
    /** 菜单数据 */
    items: Array,
    /** 是否是第一级菜单 */
    first: Boolean,
    /** 是否禁用折叠的 tooltip */
    tipDisabled: Boolean,
    /** 父级是否是分组菜单 */
    parentIsGroup: Boolean,
    /** 主题 */
    theme: String,
    /** 气泡菜单主题 */
    popTheme: String,
    /** 是否彩色图标 */
    colorful: Boolean,
    /** 气泡菜单是否彩色图标 */
    popupColorful: [Boolean, String],
    /** 第一级气泡菜单类名 */
    firstPopClass: String,
    /** 是否是水平菜单 */
    horizontal: Boolean,
    /** 是否是 webkit 内核 */
    webkit: Boolean
  },
  emits: {
    itemClick: (_item, _e, _type) => true,
    itemMouseenter: (_item, _e) => true,
    itemMouseleave: (_item, _e) => true,
    parentMouseenter: (_item, _e) => true,
    parentMouseleave: (_item, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleMenuItemClick = () => {
    };
    const handleItemClick = (item, e, type) => {
      emit("itemClick", item, e, type);
    };
    const handleParentClick = (item, e) => {
      handleItemClick(item, e, "parent");
    };
    const handleGroupClick = (item, e) => {
      handleItemClick(item, e, "group");
    };
    const handleItemMouseenter = (item, e) => {
      emit("itemMouseenter", item, e);
    };
    const handleItemMouseleave = (item, e) => {
      emit("itemMouseleave", item, e);
    };
    const handleParentMouseenter = (item, e) => {
      emit("parentMouseenter", item, e);
    };
    const handleParentMouseleave = (item, e) => {
      emit("parentMouseleave", item, e);
    };
    return (_ctx, _cache) => {
      const _component_MenuItems = resolveComponent("MenuItems", true);
      return openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
        return openBlock(), createElementBlock(Fragment, null, [
          !item.children || !item.children.length ? (openBlock(), createBlock(unref(ElMenuItem), mergeProps({
            key: 0,
            ref_for: true
          }, unref(pick)(item, ["route", "disabled", "class", "style"]), {
            key: `${item.key || item.index || item.path}-${__props.tipDisabled}`,
            index: item.index || item.path || "",
            class: [{ "ele-menu-overflow": item.overflow }],
            onClick: handleMenuItemClick
          }), createSlots({
            default: withCtx(() => [
              createVNode(ItemTitle, {
                item,
                showTitle: !(__props.first && !__props.tipDisabled),
                showLink: true,
                onItemClick: handleItemClick,
                onItemMouseenter: handleItemMouseenter,
                onItemMouseleave: handleItemMouseleave
              }, createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                    ])
                  };
                })
              ]), 1032, ["item", "showTitle"])
            ]),
            _: 2
          }, [
            __props.first && !__props.tipDisabled ? {
              name: "title",
              fn: withCtx(() => [
                renderSlot(_ctx.$slots, "title", {
                  item,
                  title: item.title
                }, () => [
                  item.title ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(item.title), 1)) : createCommentVNode("", true)
                ])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["index", "class"])) : item.group === true && !__props.horizontal && !__props.parentIsGroup ? (openBlock(), createBlock(unref(ElMenuItemGroup), {
            key: (item.key || item.index || item.path) + "-group",
            class: normalizeClass(item.class),
            style: normalizeStyle(item.style)
          }, {
            title: withCtx(() => [
              createVNode(ItemTitle, {
                item,
                onItemClick: handleGroupClick,
                onItemMouseenter: handleParentMouseenter,
                onItemMouseleave: handleParentMouseleave
              }, createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                    ])
                  };
                })
              ]), 1032, ["item"])
            ]),
            default: withCtx(() => [
              createVNode(_component_MenuItems, {
                items: item.children,
                first: __props.first,
                tipDisabled: __props.tipDisabled,
                parentIsGroup: true,
                theme: __props.theme,
                popTheme: __props.popTheme,
                colorful: __props.colorful,
                popupColorful: __props.popupColorful,
                firstPopClass: __props.firstPopClass,
                webkit: __props.webkit,
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
                      renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                    ])
                  };
                })
              ]), 1032, ["items", "first", "tipDisabled", "theme", "popTheme", "colorful", "popupColorful", "firstPopClass", "webkit"])
            ]),
            _: 2
          }, 1032, ["class", "style"])) : (openBlock(), createBlock(unref(ElSubMenu), mergeProps(
            {
              key: 2,
              ref_for: true
            },
            unref(pick)(item, [
              "showTimeout",
              "hideTimeout",
              "disabled",
              "popperOffset",
              "class",
              "style"
            ]),
            {
              key: (item.key || item.index || item.path) + "-sub",
              index: item.index || item.path || "",
              popperClass: unref(getPopperClass)(
                item.popperClass,
                __props.theme,
                __props.popTheme,
                __props.colorful,
                __props.popupColorful,
                __props.firstPopClass,
                __props.first,
                __props.webkit
              ),
              teleported: item.teleported ?? !!__props.first,
              expandCloseIcon: item.expandCloseIcon ?? unref(ArrowDown),
              expandOpenIcon: item.expandOpenIcon ?? unref(ArrowDown),
              collapseCloseIcon: item.collapseCloseIcon ?? unref(ArrowRight),
              collapseOpenIcon: item.collapseOpenIcon ?? unref(ArrowRight),
              class: [{ "ele-menu-overflow": item.overflow }]
            }
          ), {
            title: withCtx(() => [
              createVNode(ItemTitle, {
                item,
                onItemClick: handleParentClick,
                onItemMouseenter: handleParentMouseenter,
                onItemMouseleave: handleParentMouseleave
              }, createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                    ])
                  };
                })
              ]), 1032, ["item"])
            ]),
            default: withCtx(() => [
              !(item.children.length === 1 && item.children[0] == null) ? (openBlock(), createBlock(_component_MenuItems, {
                key: 0,
                items: item.children,
                first: false,
                tipDisabled: __props.tipDisabled,
                parentIsGroup: false,
                theme: __props.theme,
                popTheme: __props.popTheme,
                colorful: __props.colorful,
                popupColorful: __props.popupColorful,
                firstPopClass: __props.firstPopClass,
                webkit: __props.webkit,
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
                      renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                    ])
                  };
                })
              ]), 1032, ["items", "tipDisabled", "theme", "popTheme", "colorful", "popupColorful", "firstPopClass", "webkit"])) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1040, ["index", "popperClass", "teleported", "expandCloseIcon", "expandOpenIcon", "collapseCloseIcon", "collapseOpenIcon", "class"]))
        ], 64);
      }), 256);
    };
  }
});
export {
  _sfc_main as default
};

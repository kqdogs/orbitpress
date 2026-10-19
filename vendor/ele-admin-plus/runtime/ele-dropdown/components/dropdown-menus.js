import { defineComponent, resolveComponent, openBlock, createElementBlock, normalizeStyle, normalizeClass, Fragment, renderList, createBlock, createSlots, withCtx, renderSlot, mergeProps, createVNode } from "vue";
import DropdownMenuItem from "./dropdown-menu-item";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "DropdownMenus" },
  __name: "dropdown-menus",
  props: {
    /** 下拉菜单数据 */
    items: {
      type: Array,
      required: true
    },
    /** 选中的菜单 */
    selected: [String, Number, Object],
    /** 自定义下拉菜单样式 */
    menuStyle: Object,
    /** 自定义图标属性 */
    iconProps: Object,
    /** 图标尺寸 */
    iconSize: String,
    /** 尺寸 */
    size: String
  },
  emits: {
    itemClick: (_item, _e) => true,
    wrapperContext: (_e) => true
  },
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleItemClick = (item, e) => {
      if (item.disabled) {
        return;
      }
      emit("itemClick", item, e);
    };
    const handleWrapperContext = (e) => {
      emit("wrapperContext", e);
    };
    return (_ctx, _cache) => {
      const _component_DropdownMenus = resolveComponent("DropdownMenus", true);
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-dropdown-menu", [
          { "ele-dropdown-icon-small": __props.iconSize === "small" },
          { "is-small": __props.size === "small" },
          { "is-large": __props.size === "large" }
        ]]),
        style: normalizeStyle(__props.menuStyle)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
          return openBlock(), createBlock(DropdownMenuItem, {
            key: JSON.stringify(item.key ?? item.command ?? item.title),
            item,
            selected: __props.selected,
            iconProps: __props.iconProps,
            onItemClick: handleItemClick,
            onWrapperContext: handleWrapperContext
          }, createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter(
              (k) => "default" !== k && "subMenus" !== k
            ), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                ])
              };
            }),
            item.children && item.children.length ? {
              name: "subMenus",
              fn: withCtx(() => [
                createVNode(_component_DropdownMenus, {
                  items: item.children,
                  selected: __props.selected,
                  menuStyle: __props.menuStyle,
                  iconProps: __props.iconProps,
                  size: __props.size,
                  onItemClick: handleItemClick,
                  onWrapperContext: handleWrapperContext
                }, createSlots({ _: 2 }, [
                  renderList(Object.keys(_ctx.$slots).filter(
                    (k) => "default" !== k && "subMenus" !== k
                  ), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                      ])
                    };
                  })
                ]), 1032, ["items", "selected", "menuStyle", "iconProps", "size"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["item", "selected", "iconProps"]);
        }), 128))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};

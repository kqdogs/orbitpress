import { defineComponent, ref, openBlock, createElementBlock, Fragment, createCommentVNode, createElementVNode, withModifiers, normalizeClass, renderSlot, createBlock, unref, normalizeProps, mergeProps, withCtx, resolveDynamicComponent, normalizeStyle, toDisplayString, createVNode } from "vue";
import { ElIcon } from "element-plus";
import { ArrowRight } from "../../icons/index";
const _hoisted_1 = {
  key: 0,
  class: "ele-dropdown-menu-divider"
};
const _hoisted_2 = { key: 1 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "DropdownMenuItem" },
  __name: "dropdown-menu-item",
  props: {
    /** 菜单项数据 */
    item: {
      type: Object,
      required: true
    },
    /** 选中的菜单 */
    selected: [String, Number, Object],
    /** 自定义图标属性 */
    iconProps: Object
  },
  emits: {
    itemClick: (_item, _e) => true,
    wrapperContext: (_e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const itemRef = ref(null);
    const subMenuRef = ref(null);
    const placement = ref();
    const handleItemClick = (e) => {
      if (props.item.disabled) {
        return;
      }
      emit("itemClick", props.item, e);
    };
    const handleItemMouseenter = () => {
      const subMenuEl = subMenuRef.value;
      if (!subMenuEl || !itemRef.value) {
        return;
      }
      const rect = itemRef.value.getBoundingClientRect();
      const rightOver = rect.right + subMenuEl.offsetWidth > window.innerWidth;
      const bottomOver = rect.top + subMenuEl.offsetHeight > window.innerHeight;
      if (rightOver && bottomOver) {
        placement.value = "leftEnd";
      } else if (rightOver) {
        placement.value = "leftStart";
      } else if (bottomOver) {
        placement.value = "rightEnd";
      } else {
        placement.value = void 0;
      }
    };
    const handleWrapperContext = (e) => {
      emit("wrapperContext", e);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.item.divided ? (openBlock(), createElementBlock("div", _hoisted_1)) : createCommentVNode("", true),
        createElementVNode("div", {
          ref_key: "itemRef",
          ref: itemRef,
          class: normalizeClass(["ele-dropdown-menu-item", [
            { "is-disabled": !!__props.item.disabled },
            { "is-active": __props.item.command != null && __props.selected === __props.item.command },
            { "is-danger": !!__props.item.danger }
          ]]),
          onClick: withModifiers(handleItemClick, ["stop"]),
          onMouseenter: handleItemMouseenter
        }, [
          __props.item.slot && __props.item.slot !== "default" && __props.item.slot !== "subMenus" && _ctx.$slots[__props.item.slot] ? renderSlot(_ctx.$slots, __props.item.slot, {
            key: 0,
            item: __props.item
          }) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            __props.item.icon ? (openBlock(), createBlock(unref(ElIcon), normalizeProps(mergeProps({ key: 0 }, { ...__props.iconProps || {}, ...__props.item.iconProps || {} })), {
              default: withCtx(() => [
                (openBlock(), createBlock(resolveDynamicComponent(__props.item.icon), {
                  style: normalizeStyle(__props.item.iconStyle)
                }, null, 8, ["style"]))
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true),
            __props.item.title ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(__props.item.title), 1)) : createCommentVNode("", true)
          ], 64)),
          __props.item.children && __props.item.children.length ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            createVNode(unref(ElIcon), { class: "ele-dropdown-menu-item-arrow" }, {
              default: withCtx(() => [
                createVNode(unref(ArrowRight))
              ]),
              _: 1
            }),
            createElementVNode("div", {
              ref_key: "subMenuRef",
              ref: subMenuRef,
              class: normalizeClass(["ele-dropdown-wrapper is-sub-menu", [
                { "is-right-end": placement.value === "rightEnd" },
                { "is-left-start": placement.value === "leftStart" },
                { "is-left-end": placement.value === "leftEnd" }
              ]]),
              onContextmenu: handleWrapperContext,
              onClick: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["stop"]))
            }, [
              renderSlot(_ctx.$slots, "subMenus")
            ], 34)
          ], 64)) : createCommentVNode("", true)
        ], 34)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

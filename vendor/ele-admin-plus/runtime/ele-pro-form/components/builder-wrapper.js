import { defineComponent, openBlock, createElementBlock, withModifiers, normalizeClass, renderSlot, createVNode, createSlots, renderList, withCtx, normalizeProps, guardReactiveProps } from "vue";
import BuilderToolWrapper from "./builder-tool-wrapper";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BuilderWrapper" },
  __name: "builder-wrapper",
  props: {
    item: {},
    activeItemKey: {},
    handle: { type: Boolean }
  },
  emits: ["update:activeItemKey"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleItemBuilderWrapperClick = () => {
      emit("update:activeItemKey", props.item.key);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-pro-form-builder-item-wrapper", [
          { "is-div-type": __props.item.type === "div" },
          { "is-active": __props.activeItemKey != null && __props.activeItemKey === __props.item.key }
        ]]),
        onClick: withModifiers(handleItemBuilderWrapperClick, ["stop"])
      }, [
        renderSlot(_ctx.$slots, "default"),
        createVNode(BuilderToolWrapper, {
          item: __props.item,
          activeItemKey: __props.activeItemKey,
          handle: __props.handle
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1032, ["item", "activeItemKey", "handle"])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

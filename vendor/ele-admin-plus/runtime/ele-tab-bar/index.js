import { defineComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, renderList, normalizeStyle, renderSlot, createTextVNode, toDisplayString } from "vue";
import { tabBarEmits, tabBarProps } from "./props";
const _hoisted_1 = { class: "ele-tab-nav" };
const _hoisted_2 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTabBar" },
  __name: "index",
  props: tabBarProps,
  emits: tabBarEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleItemClick = (item) => {
      if (props.modelValue !== item.value) {
        emit("update:modelValue", item.value);
        emit("change", item.value);
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-tab-bar", { "is-plain": _ctx.type === "plain" }])
      }, [
        createElementVNode("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item) => {
            return openBlock(), createElementBlock("div", {
              key: item.value,
              style: normalizeStyle(_ctx.itemStyle),
              class: normalizeClass(["ele-tab-item", { "is-active": item.value === _ctx.modelValue }]),
              onClick: ($event) => handleItemClick(item)
            }, [
              renderSlot(_ctx.$slots, "label", {
                label: item.label,
                item
              }, () => [
                createTextVNode(toDisplayString(item.label), 1)
              ])
            ], 14, _hoisted_2);
          }), 128))
        ]),
        renderSlot(_ctx.$slots, "extra")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

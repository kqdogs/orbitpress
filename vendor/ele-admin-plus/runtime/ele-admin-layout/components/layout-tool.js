import { defineComponent, openBlock, createElementBlock, renderSlot } from "vue";
const _hoisted_1 = { class: "ele-admin-tool" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LayoutTool" },
  __name: "layout-tool",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
export {
  _sfc_main as default
};

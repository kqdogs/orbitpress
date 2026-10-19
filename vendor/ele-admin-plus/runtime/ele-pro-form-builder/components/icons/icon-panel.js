import { defineComponent, openBlock, createElementBlock, normalizeStyle, renderSlot } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-panel",
  props: {
    size: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-icon-border-color-base",
        style: normalizeStyle({
          padding: __props.size === "sm" ? "6px" : "8px",
          margin: "6px 0 0 0",
          borderStyle: "solid",
          borderWidth: "1px",
          borderRadius: "4px"
        })
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};

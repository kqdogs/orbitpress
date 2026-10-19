import { defineComponent, openBlock, createElementBlock, normalizeStyle, renderSlot } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-input",
  props: {
    size: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-icon-border-color-primary5",
        style: normalizeStyle({
          display: "flex",
          alignItems: "center",
          height: __props.size === "sm" ? "20px" : "26px",
          padding: "0 6px",
          boxSizing: "border-box",
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

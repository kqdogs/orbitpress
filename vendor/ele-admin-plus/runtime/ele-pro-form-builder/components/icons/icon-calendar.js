import { defineComponent, openBlock, createElementBlock, normalizeStyle } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-calendar",
  props: {
    size: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-icon-bg-calendar",
        style: normalizeStyle({
          height: __props.size === "sm" ? "38px" : "66px",
          width: __props.size === "sm" ? "82px" : "144px",
          margin: "0 auto",
          backgroundPosition: "center",
          backgroundSize: __props.size === "sm" ? "12px 12px" : "20px 20px",
          maxWidth: "100%"
        })
      }, null, 4);
    };
  }
});
export {
  _sfc_main as default
};

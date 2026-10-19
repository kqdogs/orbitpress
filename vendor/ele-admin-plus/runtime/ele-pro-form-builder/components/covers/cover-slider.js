import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = { style: { display: "flex", alignItems: "center" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-slider",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("div", {
          class: "ele-icon-bg-primary",
          style: {
            flexShrink: 0,
            width: "38px",
            height: "4px",
            borderRadius: "6px"
          }
        }, null, -1),
        createElementVNode("div", {
          class: "ele-icon-border-color-primary",
          style: {
            flexShrink: 0,
            width: "12px",
            height: "12px",
            margin: "0 -6px",
            background: "#fff",
            borderRadius: "50%",
            borderStyle: "solid",
            borderWidth: "3px",
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.4)",
            boxSizing: "border-box",
            position: "relative",
            zIndex: 2
          }
        }, null, -1),
        createElementVNode("div", {
          class: "ele-icon-bg-fill",
          style: { flex: 1, height: "4px", borderRadius: "6px" }
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

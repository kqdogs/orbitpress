import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AnalysisOutlined" },
  __name: "AnalysisOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M0.3 7H47.7M6 7V34H42V7M19 34 12 45M29 34 36 45" }, null, -1),
        createElementVNode("path", { d: "M16 22V27" }, null, -1),
        createElementVNode("path", { d: "M24 18V27" }, null, -1),
        createElementVNode("path", { d: "M32 14V27" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

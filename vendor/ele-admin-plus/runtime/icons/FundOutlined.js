import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FundOutlined" },
  __name: "FundOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M0.3 7H47.7M6 7V34H42V7M19 34 12 45M29 34 36 45" }, null, -1),
        createElementVNode("path", { d: "M13 27 19 20 26 25 35 14" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

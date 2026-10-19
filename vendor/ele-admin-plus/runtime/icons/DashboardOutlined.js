import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "DashboardOutlined" },
  __name: "DashboardOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M8 42C4 36 3 32 3 28 3 17 13 7 24 7 35 7 45 17 45 28 45 32 44 36 40 42Z" }, null, -1),
        createElementVNode("path", {
          d: "M11 27C11 20 17 14 24 14 31 14 37 20 37 27",
          "stroke-width": "3"
        }, null, -1),
        createElementVNode("path", { d: "M24 32 28 22M24 34C25 34 26 33 26 32 26 31 25 30 24 30 23 30 22 31 22 32 22 33 23 34 24 34Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

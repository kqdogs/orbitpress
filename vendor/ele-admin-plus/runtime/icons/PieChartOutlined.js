import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PieChartOutlined" },
  __name: "PieChartOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M45 25C45 35 35 45 24 45 12 45 3 36 3 24 3 13 13 3 23 3V25Z" }, null, -1),
        createElementVNode("path", { d: "M31 3C37 5 43 11 45 17H31Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PinOutlined" },
  __name: "PinOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 34V45M18 22A4 4 90 0 1 16 25L12 27A4 4 90 0 0 10 30V32A2 2 90 0 0 12 34H36A2 2 90 0 0 38 32V30A4 4 90 0 0 36 27L32 25A4 4 90 0 1 30 22V14A2 2 90 0 1 32 12A4 4 90 0 0 32 4H16A4 4 90 0 0 16 12A2 2 90 0 1 18 14Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

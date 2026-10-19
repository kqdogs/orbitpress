import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3.5"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "GlobalOutlined" },
  __name: "GlobalOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 45C29 45 34 36 34 24 34 12 29 3 24 3 19 3 14 12 14 24 14 36 19 45 24 45M3 24H45M24 3V45M9 10C14 15 18 16 24 16 30 16 34 15 39 10M39 38C34 33 30 32 24 32 18 32 14 33 9 38M24 45C35 45 45 35 45 24 45 13 36 3 24 3 13 3 3 13 3 24 3 35 13 45 24 45Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

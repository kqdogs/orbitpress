import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FullscreenExitOutlined" },
  __name: "FullscreenExitOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M5 5 17 17M17 10V17H10" }, null, -1),
        createElementVNode("path", { d: "M43 5 31 17M31 10V17H38" }, null, -1),
        createElementVNode("path", { d: "M43 43 31 31M31 38V31H38" }, null, -1),
        createElementVNode("path", { d: "M5 43 17 31M17 38V31H10" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

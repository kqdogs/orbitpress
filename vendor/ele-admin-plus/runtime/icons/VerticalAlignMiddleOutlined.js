import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "VerticalAlignMiddleOutlined" },
  __name: "VerticalAlignMiddleOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M32 10 24 17 16 10M24 1V17" }, null, -1),
        createElementVNode("path", { d: "M32 38 24 31 16 38M24 47V31" }, null, -1),
        createElementVNode("path", { d: "M6 24H42" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

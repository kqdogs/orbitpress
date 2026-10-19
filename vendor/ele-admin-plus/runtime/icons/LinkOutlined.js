import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LinkOutlined" },
  __name: "LinkOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 29 39 23C42 20 43 13 39 9 35 5 28 6 25 9L19 15" }, null, -1),
        createElementVNode("path", { d: "M29 33 23 39C20 42 13 43 9 39 5 35 6 28 9 25L15 19" }, null, -1),
        createElementVNode("path", { d: "M30 18 18 30" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

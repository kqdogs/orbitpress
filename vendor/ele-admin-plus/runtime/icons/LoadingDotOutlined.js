import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LoadingDotOutlined" },
  __name: "LoadingDotOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 6V14M36.73 11.27 31.07 16.93M42 24H34M36.73 36.73 31.07 31.07M24 42V34M11.27 36.73 16.93 31.07M6 24H14M11.27 11.27 16.92 16.92" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

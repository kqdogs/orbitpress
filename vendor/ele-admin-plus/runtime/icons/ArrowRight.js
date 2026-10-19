import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "ele-arrow-right"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ArrowRight" },
  __name: "ArrowRight",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M17 38 31 24 17 10" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

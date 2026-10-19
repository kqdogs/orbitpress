import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "ele-arrow-left"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ArrowLeft" },
  __name: "ArrowLeft",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M31 38 17 24 31 10" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

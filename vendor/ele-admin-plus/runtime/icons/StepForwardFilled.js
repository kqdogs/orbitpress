import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = { viewBox: "0 0 48 48" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "StepForwardFilled" },
  __name: "StepForwardFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", {
          d: "M5 12C5 9 8 8 10 9L30 21C33 23 33 25 30 27L10 39C8 40 5 40 5 37Z",
          fill: "currentColor"
        }, null, -1),
        createElementVNode("path", {
          d: "M43 6 43 42",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "5"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

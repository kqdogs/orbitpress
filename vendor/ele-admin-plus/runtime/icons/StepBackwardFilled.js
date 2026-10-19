import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = { viewBox: "0 0 48 48" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "StepBackwardFilled" },
  __name: "StepBackwardFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", {
          d: "M43 12C43 9 40 8 38 9L18 21C15 23 15 25 18 27L38 39C40 40 43 39 43 36Z",
          fill: "currentColor"
        }, null, -1),
        createElementVNode("path", {
          d: "M5 6V42",
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

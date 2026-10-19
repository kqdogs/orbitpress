import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BookOutlined" },
  __name: "BookOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M7 40V10C7 6 10 3 13 3H41V45H13C10 45 7 43 7 40 7 37 10 35 13 35H41M18 3V21L24 15 30 21V3" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

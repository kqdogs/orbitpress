import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MessageOutlined" },
  __name: "MessageOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", {
          d: "M5 8H43V38H31L24 45 17 38H5Z",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "4",
          "stroke-linejoin": "round"
        }, null, -1),
        createElementVNode("circle", {
          cx: "14",
          cy: "23",
          r: "3"
        }, null, -1),
        createElementVNode("circle", {
          cx: "24",
          cy: "23",
          r: "3"
        }, null, -1),
        createElementVNode("circle", {
          cx: "34",
          cy: "23",
          r: "3"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

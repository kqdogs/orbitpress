import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "WarningOutlined" },
  __name: "WarningOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 5.5 2.5 42.5H45.5Z" }, null, -1),
        createElementVNode("path", {
          d: "M24 19V30",
          "stroke-width": "3.5"
        }, null, -1),
        createElementVNode("circle", {
          cx: "24",
          cy: "35",
          r: "2.5",
          fill: "currentColor",
          stroke: "none"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

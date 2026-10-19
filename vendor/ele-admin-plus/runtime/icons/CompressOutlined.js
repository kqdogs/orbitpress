import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CompressOutlined" },
  __name: "CompressOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M17 7V17H7" }, null, -1),
        createElementVNode("path", { d: "M31 7V17H41" }, null, -1),
        createElementVNode("path", { d: "M31 41V31H41" }, null, -1),
        createElementVNode("path", { d: "M17 41V31H7" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SizeSlackOutlined" },
  __name: "SizeSlackOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M1 7H26" }, null, -1),
        createElementVNode("path", { d: "M1 41H26" }, null, -1),
        createElementVNode("path", { d: "M1 24H26" }, null, -1),
        createElementVNode("path", { d: "M39 4V44M31 11 39 4 47 11M47 37 39 44 31 37" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

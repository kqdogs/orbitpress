import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CodeOutlined" },
  __name: "CodeOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M13 13 2 24 13 35" }, null, -1),
        createElementVNode("path", { d: "M35 13 46 24 35 35" }, null, -1),
        createElementVNode("path", { d: "M28 8 20 40" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

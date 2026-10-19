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
  ...{ name: "CloudUploadOutlined" },
  __name: "CloudUploadOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M32 40.5C33 41 34 41 35 41 41 41 46 37 46 31 46 25 42 20 37 19 37 12 32 6 24 6 16 6 11 12 11 19 6 20 2 25 2 31 2 37 7 41 13 41 14 41 15 41 16 40.5" }, null, -1),
        createElementVNode("path", { d: "M24 38V21M17 28 24 21 31 28" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MoonOutlined" },
  __name: "MoonOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 5C14 5 5 13 5 24 5 35 14 44 25 44 36 44 44 35 44 25 40 28 37 28 32 28 28 28 23 24 22 20 21 16 20 10 24 5Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

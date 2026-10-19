import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PaperClipOutlined" },
  __name: "PaperClipOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M39.8 28.8 29 40C14 54 -5 35 9 20L22 7C32 -3 46 11 36 21L23 34C18 39 11 32 16 27L29 14" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

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
  ...{ name: "DragOutlined" },
  __name: "DragOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M19 9 24 4 29 9M24 4V44M4 24H44M19 39 24 44 29 39M39 19 44 24 39 29M9 19 4 24 9 29" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

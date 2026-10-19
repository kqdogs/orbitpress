import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ColumnHeightOutlined" },
  __name: "ColumnHeightOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", {
          d: "M24 12V36M18 17 24 12 30 17M30 31 24 36 18 31",
          "stroke-width": "3.5"
        }, null, -1),
        createElementVNode("path", { d: "M6 5H42" }, null, -1),
        createElementVNode("path", { d: "M6 43H42" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

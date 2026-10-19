import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "InsertRowOutlined" },
  __name: "InsertRowOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M3 4H41V12H3Z" }, null, -1),
        createElementVNode("path", { d: "M3 36H41V44H3Z" }, null, -1),
        createElementVNode("path", { d: "M22 20H46V28H22Z" }, null, -1),
        createElementVNode("path", { d: "M9 30L16 24L9 18M16 24H0" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "DatabaseOutlined" },
  __name: "DatabaseOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M9 4H39V44H9ZM9 17H39M9 31H39" }, null, -1),
        createElementVNode("path", { d: "M16 11H22" }, null, -1),
        createElementVNode("path", { d: "M16 24H22" }, null, -1),
        createElementVNode("path", { d: "M16 37H22" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

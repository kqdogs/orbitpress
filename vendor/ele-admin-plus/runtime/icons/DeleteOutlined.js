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
  ...{ name: "DeleteOutlined" },
  __name: "DeleteOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M9 10V44H39V10M15 10 17 3H31L33 10M4 10H44" }, null, -1),
        createElementVNode("path", { d: "M20 20V33" }, null, -1),
        createElementVNode("path", { d: "M28 20V33" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ResizeOutlined" },
  __name: "ResizeOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M44 10 10 44" }, null, -1),
        createElementVNode("path", { d: "M44 28 28 44" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "VerticalLeftOutlined" },
  __name: "VerticalLeftOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M34 6 34 42M11 41 30 24 11 7" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

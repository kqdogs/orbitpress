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
  ...{ name: "ProtectOutlined" },
  __name: "ProtectOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M6 10 24 4 42 10V20C42 31 35 41 24 45 13 41 6 31 6 20Z" }, null, -1),
        createElementVNode("path", { d: "M15 23L22 30L34 18" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

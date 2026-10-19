import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LogoutOutlined" },
  __name: "LogoutOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M13 8C8 11 4 18 4 24 4 35 13 44 24 44 35 44 44 35 44 24 44 18 40 11 35 8" }, null, -1),
        createElementVNode("path", { d: "M24 3V23" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

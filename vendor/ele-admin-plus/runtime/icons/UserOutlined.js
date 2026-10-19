import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "UserOutlined" },
  __name: "UserOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M42 44C42 34 34 26 24 26 14 26 6 34 6 44M24 26C29.5 26 35 21 35 15 35 9 30 4 24 4 18 4 13 9 13 15 13 21 18.5 26 24 26Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

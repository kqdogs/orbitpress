import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ShoppingOutlined" },
  __name: "ShoppingOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M5 14H43V44H5ZM32 22V11C32 7 29 3 24 3V3C19 3 16 7 16 11V22" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

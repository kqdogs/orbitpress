import { defineComponent, openBlock, createElementBlock, createStaticVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SizeCompactOutlined" },
  __name: "SizeCompactOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<path d="M1 7H26"></path><path d="M1 41H26"></path><path d="M1 18H26"></path><path d="M1 30H26"></path><path d="M47 12 39 19 31 12M39 1V19"></path><path d="M47 36 39 29 31 36M39 47V29"></path>', 6)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

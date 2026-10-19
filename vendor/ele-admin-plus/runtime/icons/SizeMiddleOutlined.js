import { defineComponent, openBlock, createElementBlock, createStaticVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SizeMiddleOutlined" },
  __name: "SizeMiddleOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<path d="M1 7H26"></path><path d="M1 41H26"></path><path d="M1 18H26"></path><path d="M1 30H26"></path><path d="M47 10L39 3L31 10M39 3V20"></path><path d="M47 38L39 45L31 38M39 45V28"></path>', 6)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

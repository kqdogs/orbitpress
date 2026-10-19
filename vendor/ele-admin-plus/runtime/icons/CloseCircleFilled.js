import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CloseCircleFilled" },
  __name: "CloseCircleFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 2C36 2 46 12 46 24S36 46 24 46 2 36 2 24 12 2 24 2ZM32 13 24 21 16 13 13 16 21 24 13 32 16 35 24 27 32 35 35 32 27 24 35 16Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CheckCircleFilled" },
  __name: "CheckCircleFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 2C36 2 46 12 46 24S36 46 24 46 2 36 2 24 12 2 24 2ZM21 29 14 22 11 25 21 35 38 18 35 15Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

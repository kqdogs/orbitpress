import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PlayFilled" },
  __name: "PlayFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M7 9C7 6 8 4 12 6L40 21C43 23 43 25 40 27L12 42C8 44 7 42 7 39Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

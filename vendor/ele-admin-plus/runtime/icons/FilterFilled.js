import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FilterFilled" },
  __name: "FilterFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M16 39.5C16 40.5 16.5 41 17.5 41H30.5C31.5 41 32 40.5 32 39.5V30H16ZM7 7C5.5 7 5 8.5 5.5 9.5L16 27H32L42.5 9.5C43 8.5 42.5 7 41 7Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

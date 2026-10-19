import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SendFilled" },
  __name: "SendFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M7 13C4 14 4 17 7 19L18 25C20 26 22 28 23 30L29 41C31 44 34 44 35 41L43 9C43.7 6 42 4.3 39 5Z" }, null, -1),
        createElementVNode("circle", {
          cx: "12",
          cy: "36",
          r: "5.5"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

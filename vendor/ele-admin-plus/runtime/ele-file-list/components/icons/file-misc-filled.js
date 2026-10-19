import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  stroke: "none",
  fill: "#B9C9D6"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconMisc" },
  __name: "file-misc-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M29.5 34.5C32.5 34.5 35 32.5 35 29.5 35 26.5 33 24 30.5 23.5 30.5 20 28 17 24 17 20 17 17.5 20 17.5 23.5 15 24 13 26.5 13 29.5 13 32.5 15.5 34.5 18.5 34.5Z",
          fill: "#FFFFFF"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

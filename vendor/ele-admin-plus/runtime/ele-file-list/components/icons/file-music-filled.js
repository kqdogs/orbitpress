import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  stroke: "none",
  fill: "#8183F1"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconMusic" },
  __name: "file-music-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M24 29.5C23.3 28.5 22 28 21 28 17 28 15 31 15 33 15 35 17 38 21 38 25 38 27 35 27 33V21C29 23 30 23 31 23 32 23 33 22 33 19 32 19.5 31 19.6 29 19 27.2 18.2 27 18 27 17 26 16.8 25 16.8 24 17Z",
          fill: "#FFFFFF"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  "stroke-width": "1.5",
  stroke: "none",
  fill: "#8183F1"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconHtm" },
  __name: "file-htm-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M24 35C26 33 27 29 27 26 27 23 26 19 24 17 22 19 21 23 21 26 21 29 22 33 24 35M15 26H33M24 35C29 35 33 31 33 26 33 21 29 17 24 17 19 17 15 21 15 26 15 31 19 35 24 35",
          stroke: "#FFFFFF",
          fill: "none"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

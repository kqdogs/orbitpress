import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  stroke: "none",
  fill: "#8183F1"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconVideo" },
  __name: "file-video-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M30.5 24V28L33 31C34 32 35 31 35 30V22C35 21 34 20 33 21Z",
          fill: "#FFFFFF"
        }, null, -1),
        createElementVNode("rect", {
          x: "13",
          y: "19",
          width: "16",
          height: "14",
          rx: "2",
          fill: "#FFFFFF"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  "stroke-width": "4",
  stroke: "none",
  fill: "#FF5A5A"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconFlash" },
  __name: "file-flash-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M32 19C30 19 25 20 24 25 21 36 19 36 14 36M24 27H30",
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

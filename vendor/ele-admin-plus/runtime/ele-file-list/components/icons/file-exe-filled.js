import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  stroke: "none",
  fill: "#5EC7FB"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconExe" },
  __name: "file-exe-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M30 26C30 17 18 17 18 26",
          "stroke-width": "6",
          stroke: "#FFFFFF",
          fill: "none"
        }, null, -1),
        createElementVNode("path", {
          d: "M14 28H34V35H14ZM26 30H23V33H26ZM31 30H28V33H31Z",
          fill: "#FFFFFF"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

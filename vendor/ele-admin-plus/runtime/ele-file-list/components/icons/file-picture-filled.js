import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  stroke: "none",
  fill: "#FF7743"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconPicture" },
  __name: "file-picture-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M13.5 36C12 36 11.7 34.6 12 34L16 26C16.5 25 17.85 25 18.7 26L22.1 30C22.5 30.4 23.3 30.4 23.5 30L28 21C28.4 20.2 29.7 20.4 30 21L36 34C36.4 35 36 36 35 36Z",
          fill: "#FFFFFF"
        }, null, -1),
        createElementVNode("circle", {
          cx: "19",
          cy: "19",
          r: "2.5",
          fill: "#FFFFFF"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

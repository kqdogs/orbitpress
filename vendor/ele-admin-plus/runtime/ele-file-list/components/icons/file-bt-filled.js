import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  stroke: "none",
  fill: "#47CCAB"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconBt" },
  __name: "file-bt-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M33 1H8C6 1 4 3 4 5V43C4 45 6 47 8 47H40C42 47 44 45 44 43V14Z" }, null, -1),
        createElementVNode("path", {
          d: "M33 1V10C33 12 35 14 37 14H44Z",
          fill: "rgba(0,0,0,0.3)"
        }, null, -1),
        createElementVNode("path", {
          d: "M15 27V21.4C15 21.2 15.2 21 15.4 21H20C22 21 23 22 23 24 23 26 21 27 20 27ZM20 27C21 27 23 28 23 30 23 32 22 33 20 33H15.4C15.2 33 15 32.8 15 32.6V27",
          stroke: "#FFFFFF",
          fill: "none"
        }, null, -1),
        createElementVNode("path", {
          d: "M26 21.5H34M30 21.5V32.5",
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

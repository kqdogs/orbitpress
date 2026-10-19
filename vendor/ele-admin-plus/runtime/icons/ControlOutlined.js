import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ControlOutlined" },
  __name: "ControlOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M5 10V38C5 41 7 43 10 43H38C41 43 43 41 43 38V10C43 7 41 5 38 5H10C7 5 5 7 5 10Z" }, null, -1),
        createElementVNode("path", { d: "M21 18H36M21 18C21 20 19 22 17 22 15 22 13 20 13 18 13 16 15 14 17 14 19 14 21 16 21 18Z" }, null, -1),
        createElementVNode("path", { d: "M27 30H12M35 30C35 32 33 34 31 34 29 34 27 32 27 30 27 28 29 26 31 26 33 26 35 28 35 30Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

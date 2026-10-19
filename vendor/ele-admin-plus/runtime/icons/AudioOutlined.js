import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AudioOutlined" },
  __name: "AudioOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("rect", {
          x: "16",
          y: "4",
          width: "16",
          height: "26",
          rx: "8"
        }, null, -1),
        createElementVNode("path", { d: "M8 23C8 32 15 38 24 38 33 38 40 32 40 23M24 38V46" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

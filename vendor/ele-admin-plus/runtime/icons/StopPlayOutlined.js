import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "StopPlayOutlined" },
  __name: "StopPlayOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("circle", {
          cx: "24",
          cy: "24",
          r: "21"
        }, null, -1),
        createElementVNode("rect", {
          x: "16",
          y: "16",
          width: "16",
          height: "16",
          rx: "4",
          fill: "currentColor",
          stroke: "none"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

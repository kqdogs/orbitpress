import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CompassOutlined" },
  __name: "CompassOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 45C35 45 45 35 45 24 45 13 35 3 24 3 13 3 3 13 3 24 3 35 13 45 24 45Z" }, null, -1),
        createElementVNode("path", {
          d: "M32 16 21 21 16 32 27 27 32 16Z",
          "stroke-width": "3"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3.5",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EnvironmentOutlined" },
  __name: "EnvironmentOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 46C25 46 43 33 43 21 43 10 35 2 24 2 13 2 5 10 5 21 5 33 23 46 24 46Z" }, null, -1),
        createElementVNode("path", { d: "M24 28C20 28 17 25 17 21S20 14 24 14 31 17 31 21 28 28 24 28Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

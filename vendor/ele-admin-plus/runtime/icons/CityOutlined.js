import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CityOutlined" },
  __name: "CityOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M7 43 7 5H28V43M28 17H41V43M1 43H47M28 34H36M28 26H36" }, null, -1),
        createElementVNode("path", { d: "M13 33H22" }, null, -1),
        createElementVNode("path", { d: "M13 24H22" }, null, -1),
        createElementVNode("path", { d: "M13 15H22" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

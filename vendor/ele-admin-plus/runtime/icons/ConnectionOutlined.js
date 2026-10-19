import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ConnectionOutlined" },
  __name: "ConnectionOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M6 27C3 25 2 22 2 19 2 14 6 9 11 9H29C34 9 38 14 38 19 38 24 34 29 29 29H19" }, null, -1),
        createElementVNode("path", { d: "M29 19H19C14 19 10 24 10 29 10 34 14 39 19 39H37C42 39 46 34 46 29 46 26 45 23 42 21" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

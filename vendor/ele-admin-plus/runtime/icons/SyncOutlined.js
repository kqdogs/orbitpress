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
  ...{ name: "SyncOutlined" },
  __name: "SyncOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M42.7 21C42 14 34 5 24 5 17 5 12 9 8 14M8 6V14H16" }, null, -1),
        createElementVNode("path", { d: "M5.3 27C6 34 14 43 24 43 31 43 36 39 40 34M40 42V34H32" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

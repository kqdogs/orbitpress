import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SoundOutlined" },
  __name: "SoundOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M25 6C24.9 5.2 23.4 5.2 23 5.5L13 13.3C12.5 13.6 11.4 14 11 14H5C4 14 3 15 3 16V32C3 33 4 34 5 34H11C11.4 34 12.5 34.4 13 34.7L23 42.5C23.4 42.8 24.9 42.8 25 42Z" }, null, -1),
        createElementVNode("path", { d: "M33 14C38 19 38 29 33 34" }, null, -1),
        createElementVNode("path", { d: "M40 8C47 17 47 31 40 40" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

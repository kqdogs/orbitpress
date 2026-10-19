import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ExpandOutlined" },
  __name: "ExpandOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M7 17V7H17" }, null, -1),
        createElementVNode("path", { d: "M31 7H41V17" }, null, -1),
        createElementVNode("path", { d: "M41 31V41H31" }, null, -1),
        createElementVNode("path", { d: "M17 41H7V31" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

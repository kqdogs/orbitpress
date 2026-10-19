import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SearchOutlined" },
  __name: "SearchOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M36.3 36.3 45.5 45.5M23 42C33 42 42 33 42 23 42 13 33 4 23 4 13 4 4 13 4 23 4 33 13 42 23 42Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

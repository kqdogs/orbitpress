import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BellOutlined" },
  __name: "BellOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M10 40V20C10 12 16 6 24 6 32 6 38 12 38 20V40M7 40H41M19 40C19 44 21 46 24 46 27 46 29 44 29 40M24 6V2" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

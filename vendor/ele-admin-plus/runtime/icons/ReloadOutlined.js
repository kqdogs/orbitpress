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
  ...{ name: "ReloadOutlined" },
  __name: "ReloadOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M42 30C40 35 34 43 24 43 14 43 5 34 5 24 5 14 14 5 24 5 31 5 36 9 40 14M40 6V14L32 14" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

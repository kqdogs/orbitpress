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
  ...{ name: "CpuOutlined" },
  __name: "CpuOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M9 9H39V39H9ZM18 18V30H30V18ZM15 3V9M24 3V9M33 3V9M45 15H39M45 24H39M45 33H39M33 45V39M24 45V39M15 45V39M3 33H9M3 24H9M3 15H9" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

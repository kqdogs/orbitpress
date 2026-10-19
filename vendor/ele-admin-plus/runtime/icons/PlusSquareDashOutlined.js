import { defineComponent, openBlock, createElementBlock, createStaticVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PlusSquareDashOutlined" },
  __name: "PlusSquareDashOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<path d="M24 13V34M13 24H35" stroke-linecap="round"></path><path d="M19 2H29"></path><path d="M19 46H29"></path><path d="M2 19V29"></path><path d="M46 19V29"></path><path d="M11 2H2V11"></path><path d="M11 46H2V37"></path><path d="M37 46H46V37"></path><path d="M37 2H46V11"></path>', 9)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

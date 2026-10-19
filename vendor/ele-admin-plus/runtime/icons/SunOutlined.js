import { defineComponent, openBlock, createElementBlock, createStaticVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SunOutlined" },
  __name: "SunOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<path d="M24 35C30 35 35 30 35 24 35 18 30 13 24 13 18 13 13 18 13 24 13 30 18 35 24 35Z"></path><path d="M24 2V6"></path><path d="M8 8 11 11"></path><path d="M2 24H6"></path><path d="M8 40 11 37"></path><path d="M24 46V42"></path><path d="M40 40 37 37"></path><path d="M46 24H42"></path><path d="M40 8 37 11"></path>', 9)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

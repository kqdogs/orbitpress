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
  ...{ name: "ModelOutlined" },
  __name: "ModelOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 2C28 18 30 20 46 24 30 28 28 30 24 46 20 30 18 28 2 24 18 20 20 18 24 2" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

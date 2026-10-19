import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FormOutlined" },
  __name: "FormOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M42 26V42H6V6L22 6" }, null, -1),
        createElementVNode("path", { d: "M16 32H22L43 11 37 5 16 26Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MoreOutlined" },
  __name: "MoreOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("circle", {
          cx: "24",
          cy: "8",
          r: "4"
        }, null, -1),
        createElementVNode("circle", {
          cx: "24",
          cy: "24",
          r: "4"
        }, null, -1),
        createElementVNode("circle", {
          cx: "24",
          cy: "40",
          r: "4"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

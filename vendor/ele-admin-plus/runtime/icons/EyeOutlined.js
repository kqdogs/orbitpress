import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EyeOutlined" },
  __name: "EyeOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 40C38 40 45 28 45 24C45 20 38 8 24 8C10 8 3 20 3 24C3 28 10 40 24 40Z" }, null, -1),
        createElementVNode("path", { d: "M24 32C28 32 32 28 32 24C32 20 28 16 24 16C20 16 16 20 16 24C16 28 20 32 24 32Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LogOutlined" },
  __name: "LogOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M7 4H41V44H7Z" }, null, -1),
        createElementVNode("path", { d: "M15 17H26" }, null, -1),
        createElementVNode("path", { d: "M15 26H33" }, null, -1),
        createElementVNode("path", { d: "M15 35H33" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

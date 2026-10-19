import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3.5",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FileOutlined" },
  __name: "FileOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M28 2V16H41M28 2H7V45H41V16Z" }, null, -1),
        createElementVNode("path", { d: "M15 14H22" }, null, -1),
        createElementVNode("path", { d: "M15 25H33" }, null, -1),
        createElementVNode("path", { d: "M15 35H33" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

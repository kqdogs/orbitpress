import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FullscreenOutlined" },
  __name: "FullscreenOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M8 8 19 19M8 15V8H15" }, null, -1),
        createElementVNode("path", { d: "M40 8 29 19M40 15V8H33" }, null, -1),
        createElementVNode("path", { d: "M41 41 29 29M41 34V41H34" }, null, -1),
        createElementVNode("path", { d: "M8 40 19 29M8 33V40H15" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

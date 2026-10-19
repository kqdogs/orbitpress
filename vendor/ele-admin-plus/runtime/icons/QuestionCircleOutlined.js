import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "QuestionCircleOutlined" },
  __name: "QuestionCircleOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 45C35 45 45 35 45 24 45 13 35 3 24 3 13 3 3 13 3 24 3 35 13 45 24 45Z" }, null, -1),
        createElementVNode("path", { d: "M17 19C17 15 20 12 24 12 28 12 31 15 31 18 31 20 30 23 27 24 25 25 24 26 24 27V29" }, null, -1),
        createElementVNode("circle", {
          cx: "24",
          cy: "36",
          r: "2.4",
          fill: "currentColor",
          stroke: "none"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

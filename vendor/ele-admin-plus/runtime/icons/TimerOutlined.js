import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TimerOutlined" },
  __name: "TimerOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 46C34 46 42 38 42 28 42 18 34 10 24 10 14 10 6 18 6 28 6 38 14 46 24 46ZM14 2H34M24 2V10" }, null, -1),
        createElementVNode("path", { d: "M23 18V29H34" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

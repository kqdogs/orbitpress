import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "UndoOutlined" },
  __name: "UndoOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M6 30C8 35 14 43 24 43 34 43 43 34 43 24 43 14 34 5 24 5 17 5 12 9 9 13M9 5V13L17 13" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

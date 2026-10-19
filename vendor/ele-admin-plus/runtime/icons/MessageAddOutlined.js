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
  ...{ name: "MessageAddOutlined" },
  __name: "MessageAddOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M44 11C44 7 42 5 38 5H10C6 5 4 7 4 11V31C4 35 6 37 10 37H12L11 46 24 37H38C42 37 44 35 44 31Z" }, null, -1),
        createElementVNode("path", { d: "M24 14V28M16 21H32" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

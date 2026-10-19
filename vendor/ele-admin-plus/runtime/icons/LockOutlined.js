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
  ...{ name: "LockOutlined" },
  __name: "LockOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M6 20H42V44H6ZM14 20V14C14 8 19 4 24 4 29 4 34 8 34 14V20" }, null, -1),
        createElementVNode("path", { d: "M24 29V35" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

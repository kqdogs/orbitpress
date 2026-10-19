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
  ...{ name: "SideExpand" },
  __name: "SideExpandOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M15 5V43M3 11C3 7 5 5 9 5H39C43 5 45 7 45 11V37C45 41 43 43 39 43H9C5 43 3 41 3 37Z" }, null, -1),
        createElementVNode("path", { d: "M25 33 35 24 25 15" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

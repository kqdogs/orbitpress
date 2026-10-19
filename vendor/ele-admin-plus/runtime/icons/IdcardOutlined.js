import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IdcardOutlined" },
  __name: "IdcardOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M3 8H45V40H3Z" }, null, -1),
        createElementVNode("path", {
          d: "M17 25C19.2 25 21 23.2 21 21 21 18.8 19.2 17 17 17 14.8 17 13 18.8 13 21 13 23.2 14.8 25 17 25M23 31C23 27.7 20.3 25 17 25 13.7 25 11 27.7 11 31",
          "stroke-width": "3"
        }, null, -1),
        createElementVNode("path", { d: "M26 20H38" }, null, -1),
        createElementVNode("path", { d: "M30 28H38" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

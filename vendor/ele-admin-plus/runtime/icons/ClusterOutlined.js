import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ClusterOutlined" },
  __name: "ClusterOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M16 5H32V15H16ZM24 15V33M8 33V24H40V33M3 33H13V43H3ZM19 33H29V43H19ZM35 33H45V43H35Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

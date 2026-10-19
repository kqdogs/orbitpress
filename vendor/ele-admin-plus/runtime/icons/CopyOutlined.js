import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CopyOutlined" },
  __name: "CopyOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M4 11H34V44H4Z" }, null, -1),
        createElementVNode("path", { d: "M13 7V2H43V35H38" }, null, -1),
        createElementVNode("path", { d: "M12 22 26 22" }, null, -1),
        createElementVNode("path", { d: "M12 33 26 33" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

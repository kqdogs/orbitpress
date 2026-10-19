import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "InsertColumnOutlined" },
  __name: "InsertColumnOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M44 3V41H36V3Z" }, null, -1),
        createElementVNode("path", { d: "M12 3V41H4V3Z" }, null, -1),
        createElementVNode("path", { d: "M28 22V46H20V22Z" }, null, -1),
        createElementVNode("path", { d: "M18 9L24 16L30 9M24 16V0" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

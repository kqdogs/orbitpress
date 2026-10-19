import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linejoin": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FolderAddOutlined" },
  __name: "FolderAddOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M3 6H16L25 14H45V42H3Z" }, null, -1),
        createElementVNode("path", { d: "M16 28H32M24 20V36" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

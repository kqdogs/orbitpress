import { defineComponent, openBlock, createElementBlock, createStaticVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MenuFoldOutlined" },
  __name: "MenuFoldOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<path d="M3 7H45"></path><path d="M3 41H45"></path><path d="M19 18H44"></path><path d="M19 30H44"></path><path d="M3 24 13 16V32Z" fill="currentColor" stroke="none"></path>', 5)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

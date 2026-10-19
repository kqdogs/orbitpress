import { defineComponent, openBlock, createElementBlock, createStaticVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "VoiceOutlined" },
  __name: "VoiceOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createStaticVNode('<path d="M6 17V31"></path><path d="M15 9V39"></path><path d="M24 19V29"></path><path d="M33 14V34"></path><path d="M42 16V32"></path>', 5)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

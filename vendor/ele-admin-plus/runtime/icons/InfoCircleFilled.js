import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "currentColor"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "InfoCircleFilled" },
  __name: "InfoCircleFilled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M24 2C36 2 46 12 46 24S36 46 24 46 2 36 2 24 12 2 24 2ZM21 37H27V21H21ZM24 11C22 11 20.5 12.5 20.5 14.5S22 18 24 18 27.5 16.5 27.5 14.5 26 11 24 11Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

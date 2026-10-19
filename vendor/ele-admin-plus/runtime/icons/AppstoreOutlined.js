import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "4",
  "stroke-linecap": "round"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AppstoreOutlined" },
  __name: "AppstoreOutlined",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M18 6H8C7 6 6 7 6 8V18C6 19 7 20 8 20H18C19 20 20 19 20 18V8C20 7 19 6 18 6Z" }, null, -1),
        createElementVNode("path", { d: "M40 6H30C29 6 28 7 28 8V18C28 19 29 20 30 20H40C41 20 42 19 42 18V8C42 7 41 6 40 6Z" }, null, -1),
        createElementVNode("path", { d: "M40 28H30C29 28 28 29 28 30V40C28 41 29 42 30 42H40C41 42 42 41 42 40V30C42 29 41 28 40 28Z" }, null, -1),
        createElementVNode("path", { d: "M18 28H8C7 28 6 29 6 30V40C6 41 7 42 8 42H18C19 42 20 41 20 40V30C20 29 19 28 18 28Z" }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

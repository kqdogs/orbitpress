import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  viewBox: "0 0 48 48",
  stroke: "none",
  fill: "#FFD659"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IconFolder" },
  __name: "file-folder-filled",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("path", { d: "M30 11C27 5 26 5 24 5H5C3 5 1 7 1 9V39C1 41 3 43 5 43H43C45 43 47 41 47 39V15C47 13 45 11 43 11Z" }, null, -1),
        createElementVNode("path", {
          d: "M30 11C27 5 26 5 24 5H5C3 5 1 7 1 9V11Z",
          fill: "rgba(0,0,0,0.1)"
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

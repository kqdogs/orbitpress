import { defineComponent, openBlock, createElementBlock, createElementVNode } from "vue";
const _hoisted_1 = {
  class: "ele-icon-border-color-text",
  style: {
    flexShrink: 0,
    width: "6px",
    margin: "0 0 0 6px",
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    display: "flex",
    justifyContent: "center"
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-cursor",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [..._cache[0] || (_cache[0] = [
        createElementVNode("div", {
          class: "ele-icon-border-color-text",
          style: {
            height: "10px",
            borderLeftStyle: "solid",
            borderLeftWidth: "1px"
          }
        }, null, -1)
      ])]);
    };
  }
});
export {
  _sfc_main as default
};

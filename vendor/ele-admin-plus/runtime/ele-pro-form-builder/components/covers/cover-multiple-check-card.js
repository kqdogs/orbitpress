import { defineComponent, openBlock, createElementBlock, createVNode, unref } from "vue";
import { IconCard } from "../icons/index";
const _hoisted_1 = { style: { width: "62px", margin: "0 auto" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-multiple-check-card",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(IconCard), {
          size: "sm",
          checked: true
        }),
        createVNode(unref(IconCard), {
          size: "sm",
          checked: true,
          style: { marginTop: "4px" }
        }),
        createVNode(unref(IconCard), {
          size: "sm",
          style: { marginTop: "4px" }
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

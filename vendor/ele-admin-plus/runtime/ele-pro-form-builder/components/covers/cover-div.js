import { defineComponent, openBlock, createElementBlock, createVNode, unref } from "vue";
import { IconSkeleton } from "../icons/index";
const _hoisted_1 = {
  class: "ele-icon-border-color-base",
  style: {
    padding: "8px 6px 18px 6px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px"
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-div",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(IconSkeleton), { size: "sm" }),
        createVNode(unref(IconSkeleton), {
          size: "sm",
          style: { marginTop: "6px" }
        }),
        createVNode(unref(IconSkeleton), {
          size: "sm",
          style: { marginTop: "6px", width: "50%" }
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

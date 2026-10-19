import { defineComponent, openBlock, createElementBlock, Fragment, createVNode, unref, createElementVNode, normalizeStyle } from "vue";
import { IconSkeleton } from "./index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-range-skeleton",
  props: {
    size: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(unref(IconSkeleton), {
          size: __props.size,
          style: { flex: 1 }
        }, null, 8, ["size"]),
        createElementVNode("div", {
          class: "ele-icon-border-color-text",
          style: normalizeStyle({
            flexShrink: 0,
            width: __props.size === "sm" ? "6px" : "8px",
            margin: __props.size === "sm" ? "0 4px" : "0 6px",
            borderTopStyle: "solid",
            borderTopWidth: "1px"
          })
        }, null, 4),
        createVNode(unref(IconSkeleton), {
          size: __props.size,
          style: { flex: 1 }
        }, null, 8, ["size"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

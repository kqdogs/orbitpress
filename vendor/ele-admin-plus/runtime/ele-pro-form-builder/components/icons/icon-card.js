import { defineComponent, openBlock, createElementBlock, normalizeStyle, normalizeClass, createVNode, unref, createCommentVNode } from "vue";
import { IconSkeleton } from "./index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-card",
  props: {
    size: {},
    checked: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          { "ele-icon-border-color-primary5": __props.checked },
          { "ele-icon-border-color-base": !__props.checked }
        ]),
        style: normalizeStyle({
          padding: __props.size === "sm" ? "8px" : "10px",
          borderRadius: "4px",
          borderStyle: "solid",
          borderWidth: "1px",
          position: "relative"
        })
      }, [
        createVNode(unref(IconSkeleton), {
          size: __props.size === "sm" ? "xs" : "sm"
        }, null, 8, ["size"]),
        __props.checked ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-icon-border-color-primary",
          style: normalizeStyle({
            borderRadius: "2px",
            borderStyle: "solid",
            borderWidth: "4px",
            borderLeftColor: "transparent",
            borderBottomColor: "transparent",
            position: "absolute",
            right: __props.size === "sm" ? "2px" : "4px",
            top: __props.size === "sm" ? "2px" : "4px"
          })
        }, null, 4)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};

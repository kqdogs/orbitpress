import { defineComponent, openBlock, createElementBlock, normalizeStyle, normalizeClass, createBlock, unref, createCommentVNode } from "vue";
import { SvgIcon } from "./index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-checkbox",
  props: {
    size: {},
    checked: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-icon-border-color-base", [
          { "ele-icon-bg-primary": __props.checked },
          { "ele-icon-bg-fill-blank": !__props.checked }
        ]]),
        style: normalizeStyle({
          flexShrink: 0,
          width: { lg: "14px", md: "12px", sm: "8px", xs: "6px" }[__props.size || "md"],
          height: { lg: "14px", md: "12px", sm: "8px", xs: "6px" }[__props.size || "md"],
          borderRadius: __props.size === "sm" || __props.size === "xs" ? "2px" : "3px",
          borderStyle: __props.checked ? void 0 : "solid",
          borderWidth: __props.checked ? void 0 : "1px",
          marginRight: { xs: "2px", sm: "4px", md: "8px", lg: "8px" }[__props.size || "md"],
          boxSizing: "border-box"
        })
      }, [
        __props.checked ? (openBlock(), createBlock(unref(SvgIcon), {
          key: 0,
          name: "CheckOutlined",
          iconStyle: {
            "stroke-width": 8,
            transform: {
              lg: "scale(0.88)",
              md: "scale(0.76)",
              sm: "scale(0.68)",
              xs: "scale(0.68)"
            }[__props.size || "md"]
          },
          style: {
            color: "#fff",
            fontSize: "12px",
            width: "100%",
            height: "100%"
          }
        }, null, 8, ["iconStyle"])) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};

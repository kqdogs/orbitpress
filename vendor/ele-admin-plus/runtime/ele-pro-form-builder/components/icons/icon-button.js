import { defineComponent, openBlock, createElementBlock, normalizeStyle, normalizeClass, createBlock, unref, createCommentVNode } from "vue";
import { IconSkeleton } from "./index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-button",
  props: {
    size: {},
    type: {},
    hideSkeleton: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-icon-border-color-base", [
          { "ele-icon-bg-primary": __props.type === "primary" },
          { "ele-icon-bg-fill": __props.type !== "primary" && __props.type !== "bordered" }
        ]]),
        style: normalizeStyle({
          display: "flex",
          alignItems: "center",
          height: __props.size === "sm" ? "22px" : "28px",
          padding: __props.size === "sm" ? "0 6px" : "0 10px",
          boxSizing: "border-box",
          borderRadius: "4px",
          borderStyle: __props.type === "bordered" ? "solid" : void 0,
          borderWidth: __props.type === "bordered" ? "1px" : void 0
        })
      }, [
        !__props.hideSkeleton && (__props.type === "primary" || __props.type === "bordered") ? (openBlock(), createBlock(unref(IconSkeleton), {
          key: 0,
          size: __props.size === "sm" ? "xs" : "sm",
          class: normalizeClass([
            { "ele-icon-bg-white": __props.type === "primary" },
            { "ele-icon-bg-fill-light": __props.type !== "primary" }
          ]),
          style: { flex: 1 }
        }, null, 8, ["size", "class"])) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};

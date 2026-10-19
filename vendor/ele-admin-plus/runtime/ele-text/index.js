import { defineComponent, openBlock, createBlock, resolveDynamicComponent, normalizeClass, withCtx, unref, normalizeProps, mergeProps, normalizeStyle, createCommentVNode, renderSlot } from "vue";
import { ElIcon } from "element-plus";
import { textProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleText" },
  __name: "index",
  props: textProps,
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(_ctx.tag || "div"), {
        class: normalizeClass(["ele-text", [
          { "is-heading": _ctx.type === "heading" },
          { "is-regular": _ctx.type === "regular" },
          { "is-secondary": _ctx.type === "secondary" },
          { "is-placeholder": _ctx.type === "placeholder" },
          { "is-primary": _ctx.type === "primary" },
          { "is-success": _ctx.type === "success" },
          { "is-warning": _ctx.type === "warning" },
          { "is-danger": _ctx.type === "danger" },
          { "is-info": _ctx.type === "info" },
          { "is-xs": _ctx.size === "xs" },
          { "is-sm": _ctx.size === "sm" },
          { "is-base": _ctx.size === "base" },
          { "is-md": _ctx.size === "md" },
          { "is-lg": _ctx.size === "lg" },
          { "is-xl": _ctx.size === "xl" },
          { "is-xxl": _ctx.size === "xxl" },
          { "is-xxxl": _ctx.size === "xxxl" },
          { "is-delete": _ctx.deleted },
          { "is-underline": _ctx.underline },
          { "is-strong": _ctx.strong },
          { "is-italic": _ctx.italic },
          { "is-icon": !!_ctx.icon }
        ]])
      }, {
        default: withCtx(() => [
          _ctx.icon ? (openBlock(), createBlock(unref(ElIcon), normalizeProps(mergeProps({ key: 0 }, _ctx.iconProps || {})), {
            default: withCtx(() => [
              (openBlock(), createBlock(resolveDynamicComponent(_ctx.icon), {
                style: normalizeStyle(_ctx.iconStyle)
              }, null, 8, ["style"]))
            ]),
            _: 1
          }, 16)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
export {
  _sfc_main as default
};

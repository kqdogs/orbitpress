import { defineComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createElementVNode, toDisplayString, createCommentVNode } from "vue";
import { loadingProps } from "../props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LoadingSpinner" },
  __name: "loading-spinner",
  props: {
    ...loadingProps,
    plain: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        style: normalizeStyle(_ctx.spinnerStyle),
        class: normalizeClass(["ele-loading-spinner", [
          { "ele-loading": __props.plain },
          { "ele-loading-blur": _ctx.blur },
          { "ele-loading-small": _ctx.size === "small" },
          { "ele-loading-large": _ctx.size === "large" },
          { "ele-loading-spinner-show": _ctx.loading }
        ]])
      }, [
        renderSlot(_ctx.$slots, "spinner", {}, () => [
          _cache[0] || (_cache[0] = createElementVNode("div", { class: "ele-loading-dot" }, [
            createElementVNode("i"),
            createElementVNode("i"),
            createElementVNode("i"),
            createElementVNode("i")
          ], -1))
        ]),
        _ctx.text ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-loading-text",
          style: normalizeStyle(_ctx.textStyle)
        }, toDisplayString(_ctx.text), 5)) : createCommentVNode("", true)
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { pageProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElePage" },
  __name: "index",
  props: pageProps,
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-page", [
          { "is-plain": _ctx.plain },
          { "is-multi-card": _ctx.multiCard },
          { "is-flex-table": _ctx.flexTable && _ctx.flexTable !== "auto" },
          { "is-flex-auto-table": _ctx.flexTable === "auto" },
          { "is-hide-footer": _ctx.hideFooter }
        ]])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

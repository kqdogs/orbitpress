import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { tableProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTable" },
  __name: "index",
  props: tableProps,
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("table", {
        class: normalizeClass(["ele-table", [
          { "has-header": _ctx.hasHeader },
          { "has-footer": _ctx.hasFooter },
          { "is-stripe": _ctx.stripe },
          { "is-border": _ctx.border },
          { "is-large": _ctx.size === "large" },
          { "is-small": _ctx.size === "small" },
          { "is-print-skin": _ctx.printSkin }
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

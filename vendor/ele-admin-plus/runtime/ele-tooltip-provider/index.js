import { defineComponent, openBlock, createElementBlock, Fragment, renderSlot, unref, createBlock, mergeProps, createCommentVNode } from "vue";
import EleTooltip from "../ele-tooltip/index";
import { useTooltipProvider } from "./util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTooltipProvider" },
  __name: "index",
  setup(__props, { expose: __expose }) {
    const {
      tooltipRef,
      tooltipVirtualRef,
      tooltipProps,
      showTooltip,
      removeTooltip
    } = useTooltipProvider();
    __expose({
      showTooltip,
      removeTooltip,
      tooltipRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        renderSlot(_ctx.$slots, "default"),
        unref(tooltipVirtualRef) ? (openBlock(), createBlock(EleTooltip, mergeProps({
          key: 0,
          persistent: false
        }, unref(tooltipProps), {
          ref_key: "tooltipRef",
          ref: tooltipRef,
          virtualTriggering: true,
          virtualRef: unref(tooltipVirtualRef)
        }), null, 16, ["virtualRef"])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

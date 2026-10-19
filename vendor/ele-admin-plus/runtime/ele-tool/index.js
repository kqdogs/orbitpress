import { defineComponent, inject, watch, openBlock, createElementBlock, createElementVNode, renderSlot } from "vue";
import { useTimer } from "../utils/hook";
import { TOOLBAR_KEY } from "../ele-toolbar/props";
import { toolEmits, toolProps } from "./props";
const _hoisted_1 = { class: "ele-tool-body" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTool" },
  __name: "index",
  props: toolProps,
  emits: toolEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toolbarProvider = inject(TOOLBAR_KEY, {});
    const [startHideTipTimer, stopHideTipTimer] = useTimer(200);
    const showTooltip = (text, el, options) => {
      if (toolbarProvider.showTooltip) {
        toolbarProvider.showTooltip(text, el, options);
      }
    };
    const hideTooltip = () => {
      toolbarProvider.hideTooltip && toolbarProvider.hideTooltip();
    };
    const handleClick = (e) => {
      if (props.clickHideTooltip) {
        startHideTipTimer(() => {
          hideTooltip();
        });
      }
      emit("click", e);
    };
    const handleMouseover = (e) => {
      if (props.title && !props.disabled) {
        stopHideTipTimer();
        showTooltip(props.title, e.currentTarget, {
          placement: props.placement,
          offset: 10
        });
      }
    };
    watch([() => props.disabled, () => props.title], () => {
      if (!props.title || props.disabled) {
        hideTooltip();
      }
    });
    __expose({
      showTooltip,
      hideTooltip
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-tool",
        onClick: handleClick,
        onMouseover: handleMouseover
      }, [
        createElementVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ])
      ], 32);
    };
  }
});
export {
  _sfc_main as default
};

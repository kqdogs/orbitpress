import { defineComponent, ref, computed, openBlock, createBlock, mergeProps, withCtx, renderSlot, createCommentVNode, createElementVNode, normalizeStyle, normalizeClass, createElementBlock, createTextVNode, toDisplayString } from "vue";
import { pick } from "../utils/common";
import EleTooltip from "../ele-tooltip/index";
import { tooltipPropKeys } from "../ele-tooltip/props";
import { popoverEmits, popoverProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElePopover" },
  __name: "index",
  props: popoverProps,
  emits: popoverEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const tooltipRef = ref(null);
    const tooltipProps = computed(() => {
      const keys = tooltipPropKeys.filter(
        (k) => !["content", "bodyStyle"].includes(k)
      );
      const options = pick(props, keys);
      options.ariaLabel = props.title;
      options.gpuAcceleration = props.transition === "el-fade-in-linear";
      return options;
    });
    const hide = () => {
      tooltipRef.value && tooltipRef.value.hide();
    };
    const handleUpdateVisible = (visible) => {
      emit("update:visible", visible);
    };
    const handlePopBeforeEnter = () => {
      emit("before-enter");
    };
    const handlePopBeforeLeave = () => {
      emit("before-leave");
    };
    const handlePopAfterEnter = () => {
      emit("after-enter");
    };
    const handlePopAfterLeave = () => {
      emit("after-leave");
    };
    __expose({
      tooltipRef,
      hide
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleTooltip, mergeProps({ tabindex: _ctx.tabindex }, tooltipProps.value, {
        ref_key: "tooltipRef",
        ref: tooltipRef,
        isPopover: true,
        "onUpdate:visible": handleUpdateVisible,
        onBeforeShow: handlePopBeforeEnter,
        onBeforeHide: handlePopBeforeLeave,
        onShow: handlePopAfterEnter,
        onHide: handlePopAfterLeave
      }), {
        body: withCtx(() => [
          createElementVNode("div", {
            class: normalizeClass(["ele-popover-body", _ctx.bodyClass]),
            style: normalizeStyle(_ctx.bodyStyle)
          }, [
            renderSlot(_ctx.$slots, "body", {}, () => [
              _ctx.title != null && _ctx.title != "" || _ctx.$slots.title ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-popover-title",
                style: normalizeStyle(_ctx.titleStyle)
              }, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ])
              ], 4)) : createCommentVNode("", true),
              createElementVNode("div", {
                class: "ele-popover-content",
                style: normalizeStyle(_ctx.contentStyle)
              }, [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  createTextVNode(toDisplayString(_ctx.content), 1)
                ])
              ], 4)
            ])
          ], 6)
        ]),
        default: withCtx(() => [
          _ctx.$slots.reference ? renderSlot(_ctx.$slots, "reference", { key: 0 }) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16, ["tabindex"]);
    };
  }
});
export {
  _sfc_main as default
};

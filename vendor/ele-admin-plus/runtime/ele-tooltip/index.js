import { defineComponent, ref, computed, openBlock, createBlock, unref, mergeProps, withCtx, renderSlot, createCommentVNode, createElementBlock, normalizeStyle, createTextVNode, toDisplayString } from "vue";
import { ElTooltip } from "element-plus";
import { omit } from "../utils/common";
import { tooltipEmits, tooltipProps } from "./props";
const _hoisted_1 = ["innerHTML"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTooltip" },
  __name: "index",
  props: tooltipProps,
  emits: tooltipEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const tooltipRef = ref();
    const rootProps = computed(() => {
      const options = omit(props, [
        "content",
        "bodyStyle",
        "bg",
        "arrowBg",
        "width",
        "isPopover",
        "onUpdate:visible",
        "onBeforeShow",
        "onBeforeHide",
        "onBefore-show",
        "onBefore-hide",
        "onShow",
        "onHide",
        "onOpen",
        "onClose"
      ]);
      const classes = ["ele-popper"];
      if (props.isPopover && props.effect === "light") {
        classes.push("ele-popover");
      } else {
        classes.push("ele-tooltip");
      }
      if (typeof props.popperClass === "string" && props.popperClass) {
        classes.push(props.popperClass);
      }
      options.popperClass = classes.join(" ");
      const style = {};
      if (props.bg || props.arrowBg) {
        options.effect = "dark";
        if (props.bg) {
          style["--ele-tooltip-bg"] = props.bg;
        }
        if (props.arrowBg) {
          style["--ele-tooltip-arrow-bg"] = props.arrowBg;
        }
      }
      const { width, popperStyle } = props;
      if (width != null) {
        style.width = typeof width === "string" ? width : `${width}px`;
      }
      if (!popperStyle) {
        options.popperStyle = style;
      } else if (Array.isArray(popperStyle)) {
        options.popperStyle = [style, ...popperStyle];
      } else {
        options.popperStyle = [style, popperStyle];
      }
      return options;
    });
    const popperRef = computed(
      () => tooltipRef.value?.popperRef
    );
    const contentRef = computed(
      () => tooltipRef.value?.contentRef
    );
    const isFocusInsideContent = () => {
      tooltipRef.value && tooltipRef.value.isFocusInsideContent();
    };
    const updatePopper = () => {
      tooltipRef.value && tooltipRef.value.updatePopper();
    };
    const handleOpen = (opt) => {
      tooltipRef.value && tooltipRef.value.onOpen(opt);
    };
    const handleClose = (opt) => {
      tooltipRef.value && tooltipRef.value.onClose(opt);
    };
    const hide = (opt) => {
      tooltipRef.value && tooltipRef.value.hide(opt);
    };
    const handleUpdateVisible = (visible) => {
      emit("update:visible", visible);
    };
    const handlePopBeforeShow = (e) => {
      emit("before-show", e);
    };
    const handlePopBeforeHide = (e) => {
      emit("before-hide", e);
    };
    const handlePopShow = (e) => {
      emit("show", e);
    };
    const handlePopHide = (e) => {
      emit("hide", e);
    };
    const handlePopOpen = (e) => {
      emit("open", e);
    };
    const handlePopClose = (e) => {
      emit("close", e);
    };
    __expose({
      tooltipRef,
      popperRef,
      contentRef,
      isFocusInsideContent,
      updatePopper,
      handleOpen,
      handleClose,
      onOpen: handleOpen,
      onClose: handleClose,
      hide
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElTooltip), mergeProps(rootProps.value, {
        ref_key: "tooltipRef",
        ref: tooltipRef,
        "onUpdate:visible": handleUpdateVisible,
        onBeforeShow: handlePopBeforeShow,
        onBeforeHide: handlePopBeforeHide,
        onShow: handlePopShow,
        onHide: handlePopHide,
        onOpen: handlePopOpen,
        onClose: handlePopClose
      }), {
        content: withCtx(() => [
          renderSlot(_ctx.$slots, "body", {}, () => [
            _ctx.rawContent && _ctx.content != null && _ctx.content != "" ? (openBlock(), createElementBlock("div", {
              key: 0,
              innerHTML: _ctx.content,
              class: "ele-tooltip-body",
              style: normalizeStyle(_ctx.bodyStyle)
            }, null, 12, _hoisted_1)) : (openBlock(), createElementBlock("div", {
              key: 1,
              class: "ele-tooltip-body",
              style: normalizeStyle(_ctx.bodyStyle)
            }, [
              renderSlot(_ctx.$slots, "content", {}, () => [
                createTextVNode(toDisplayString(_ctx.content), 1)
              ])
            ], 4))
          ])
        ]),
        default: withCtx(() => [
          _ctx.$slots.default ? renderSlot(_ctx.$slots, "default", { key: 0 }) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16);
    };
  }
});
export {
  _sfc_main as default
};

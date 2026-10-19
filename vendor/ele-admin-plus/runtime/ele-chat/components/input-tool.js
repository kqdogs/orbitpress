import { defineComponent, inject, ref, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, renderSlot, createVNode, unref, withCtx, createBlock, mergeProps, resolveDynamicComponent, normalizeStyle, createCommentVNode, toDisplayString } from "vue";
import { ElIcon } from "element-plus";
import { LoadingOutlined } from "../../icons/index";
import { useTooltip } from "../../ele-tooltip-provider/util";
import { useDropdown } from "../../ele-dropdown-provider/util";
import { chatInputToolProps, CHAT_KEY, defaultTooltipProps } from "../props";
const _hoisted_1 = {
  key: 0,
  class: "ele-chat-input-tool-loading"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "input-tool",
  props: chatInputToolProps,
  emits: {
    click: (_e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const chatProvider = inject(CHAT_KEY, null);
    const tooltipProvider = useTooltip();
    const dropdownProvider = useDropdown();
    const toolRef = ref(null);
    const openDropdown = (triggerEl) => {
      if (!props.dropdownItems?.length) {
        const f = dropdownProvider?.removeDropdown ?? chatProvider?.removeDropdown;
        f && f(triggerEl);
        return;
      }
      const option = {
        trigger: "click",
        placement: "top-start",
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 6] } }]
        },
        ...props.dropdownProps || {}
      };
      const func = dropdownProvider?.openDropdown ?? chatProvider?.openDropdown;
      func && func(triggerEl, props.dropdownItems, option);
    };
    const handleMouseover = (e) => {
      const triggerEl = e.currentTarget;
      if (props.dropdownProps?.trigger === "hover") {
        openDropdown(triggerEl);
      }
      if (props.button || !props.label) {
        const ft = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
        ft && ft(triggerEl);
        return;
      }
      const option = {
        ...defaultTooltipProps,
        ...props.tooltipProps || {},
        content: props.label
      };
      const func = tooltipProvider?.showTooltip ?? chatProvider?.showTooltip;
      func && func(triggerEl, option);
    };
    const handleClick = (e) => {
      if (!props.disabled) {
        if (props.dropdownProps?.trigger !== "hover") {
          openDropdown(e.currentTarget);
        }
        emit("click", e);
      }
    };
    onBeforeUnmount(() => {
      const ft = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
      ft && ft(toolRef.value);
      const f = dropdownProvider?.removeDropdown ?? chatProvider?.removeDropdown;
      f && f(toolRef.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "toolRef",
        ref: toolRef,
        class: normalizeClass(["ele-chat-input-tool", {
          "is-primary": _ctx.type === "primary",
          "is-btn": !!_ctx.button,
          "is-round": _ctx.round,
          "is-selected": _ctx.selected,
          "is-disabled": _ctx.disabled,
          "is-loading": _ctx.loading
        }]),
        onClick: handleClick,
        onMouseover: handleMouseover
      }, [
        renderSlot(_ctx.$slots, "prefix"),
        _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(unref(ElIcon), { class: "is-loading" }, {
            default: withCtx(() => [
              createVNode(unref(LoadingOutlined))
            ]),
            _: 1
          })
        ])) : _ctx.icon ? (openBlock(), createBlock(unref(ElIcon), mergeProps({ key: 1 }, _ctx.iconProps || {}, { class: "ele-chat-input-tool-icon" }), {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent(_ctx.icon), {
              style: normalizeStyle(_ctx.iconStyle)
            }, null, 8, ["style"]))
          ]),
          _: 1
        }, 16)) : createCommentVNode("", true),
        _ctx.button && _ctx.label ? (openBlock(), createElementBlock("div", {
          key: 2,
          style: normalizeStyle(_ctx.labelStyle),
          class: "ele-chat-input-tool-label"
        }, toDisplayString(_ctx.label), 5)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};

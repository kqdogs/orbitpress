import { defineComponent, inject, ref, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, renderSlot, createBlock, unref, normalizeProps, mergeProps, withCtx, resolveDynamicComponent, normalizeStyle, createCommentVNode } from "vue";
import { ElIcon } from "element-plus";
import { useTooltip } from "../../ele-tooltip-provider/util";
import { CHAT_KEY, defaultTooltipProps } from "../props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "bubble-tool",
  props: {
    /** 图标 */
    icon: [String, Object, Function],
    /** 图标属性 */
    iconProps: Object,
    /** 图标样式 */
    iconStyle: [Object, Array, String],
    /** 文本 */
    tooltip: String,
    /** 文本提示属性 */
    tooltipProps: Object,
    /** 是否禁用状态 */
    disabled: Boolean,
    /** 按钮类型 */
    type: String
  },
  emits: {
    click: (_e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const chatProvider = inject(CHAT_KEY, null);
    const tooltipProvider = useTooltip();
    const toolRef = ref(null);
    const handleMouseover = (e) => {
      const triggerEl = e.currentTarget;
      if (!props.tooltip) {
        const f = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
        f && f(triggerEl);
        return;
      }
      const option = {
        ...defaultTooltipProps,
        ...props.tooltipProps || {},
        content: props.tooltip
      };
      const func = tooltipProvider?.showTooltip ?? chatProvider?.showTooltip;
      func && func(triggerEl, option);
    };
    const handleClick = (e) => {
      if (!props.disabled) {
        emit("click", e);
      }
    };
    onBeforeUnmount(() => {
      const f = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
      f && f(toolRef.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "toolRef",
        ref: toolRef,
        class: normalizeClass(["ele-chat-bubble-tool", { "is-disabled": __props.disabled, "is-text": __props.type === "text" }]),
        onClick: handleClick,
        onMouseover: handleMouseover
      }, [
        renderSlot(_ctx.$slots, "prefix"),
        __props.icon ? (openBlock(), createBlock(unref(ElIcon), normalizeProps(mergeProps({ key: 0 }, __props.iconProps || {})), {
          default: withCtx(() => [
            (openBlock(), createBlock(resolveDynamicComponent(__props.icon), {
              style: normalizeStyle(__props.iconStyle)
            }, null, 8, ["style"]))
          ]),
          _: 1
        }, 16)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};

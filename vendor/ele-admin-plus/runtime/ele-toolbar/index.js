import { defineComponent, ref, shallowReactive, provide, openBlock, createElementBlock, normalizeClass, normalizeStyle, createBlock, mergeProps, withCtx, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, renderSlot, createVNode } from "vue";
import EleTooltip from "../ele-tooltip/index";
import EleText from "../ele-text/index";
import { toolbarProps, TOOLBAR_KEY } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleToolbar" },
  __name: "index",
  props: toolbarProps,
  setup(__props, { expose: __expose }) {
    const tooltipRef = ref(null);
    const virtualRef = ref();
    const tooltipContent = ref("");
    const tooltipProps = ref({});
    const showTooltip = (text, el, options) => {
      virtualRef.value = el;
      tooltipContent.value = text ?? "";
      tooltipProps.value = options || {};
    };
    const hideTooltip = () => {
      tooltipRef.value && tooltipRef.value.hide();
    };
    const toolbarProvide = shallowReactive({
      showTooltip,
      hideTooltip
    });
    provide(TOOLBAR_KEY, toolbarProvide);
    __expose({
      tooltipRef,
      showTooltip,
      hideTooltip
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-toolbar", [
          { "is-default": "plain" !== _ctx.theme },
          { "is-plain": "plain" === _ctx.theme }
        ]])
      }, [
        _ctx.title || _ctx.subtitle ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-toolbar-title",
          style: normalizeStyle(_ctx.titleStyle)
        }, [
          _ctx.title ? (openBlock(), createBlock(EleText, mergeProps({
            key: 0,
            type: "heading"
          }, _ctx.titleProps || {}), {
            default: withCtx(() => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ]),
            _: 1
          }, 16)) : createCommentVNode("", true),
          _ctx.subtitle ? (openBlock(), createBlock(EleText, mergeProps({
            key: 1,
            size: "xs"
          }, _ctx.subtitleProps || {}), {
            default: withCtx(() => [
              createTextVNode(toDisplayString(_ctx.subtitle), 1)
            ]),
            _: 1
          }, 16)) : createCommentVNode("", true)
        ], 4)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: "ele-toolbar-body",
          style: normalizeStyle(_ctx.bodyStyle)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 4),
        createElementVNode("div", {
          class: "ele-toolbar-tools",
          style: normalizeStyle(_ctx.toolsStyle)
        }, [
          renderSlot(_ctx.$slots, "tools")
        ], 4),
        createVNode(EleTooltip, mergeProps({
          trigger: "hover",
          placement: "top",
          persistent: false,
          content: tooltipContent.value
        }, tooltipProps.value || {}, {
          virtualTriggering: true,
          virtualRef: virtualRef.value,
          ref_key: "tooltipRef",
          ref: tooltipRef
        }), null, 16, ["content", "virtualRef"])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

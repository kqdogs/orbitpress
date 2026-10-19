import { defineComponent, ref, onDeactivated, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, renderSlot, createBlock, unref, normalizeProps, mergeProps, withCtx, resolveDynamicComponent, createVNode } from "vue";
import { ElIcon } from "element-plus";
import { CheckOutlined, CopyOutlined } from "../icons/index";
import { copyText } from "../utils/common";
import { useLocale } from "../ele-config-provider/receiver";
import EleTooltip from "../ele-tooltip/index";
import { copyableEmits, copyableProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCopyable" },
  __name: "index",
  props: copyableProps,
  emits: copyableEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("copyable", props);
    const state = { timer: null };
    const innerRef = ref(null);
    const tooltipRef = ref(null);
    const virtualRef = ref();
    const copied = ref(false);
    const updateTooltip = () => {
      tooltipRef.value && tooltipRef.value.updatePopper();
    };
    const getText = () => {
      if (props.text) {
        return props.text;
      }
      return innerRef.value?.innerText || "";
    };
    const handleCopyClick = () => {
      copyText(getText()).then(() => {
        copied.value = true;
        updateTooltip();
        state.timer && clearTimeout(state.timer);
        state.timer = setTimeout(() => {
          copied.value = false;
          updateTooltip();
        }, props.resetAfter || 1e3);
        emit("copy");
      }).catch((error) => {
        copied.value = false;
        updateTooltip();
        emit("copy", error);
      });
    };
    const handleCopyHover = (e) => {
      if (props.tooltip) {
        virtualRef.value = e.currentTarget;
      }
    };
    onDeactivated(() => {
      state.timer && clearTimeout(state.timer);
      state.timer = null;
      copied.value = false;
    });
    onBeforeUnmount(() => {
      state.timer && clearTimeout(state.timer);
      state.timer = null;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-copyable", { "ele-copyable-done": copied.value }])
      }, [
        createElementVNode("div", {
          ref_key: "innerRef",
          ref: innerRef,
          class: "ele-copyable-inner",
          style: normalizeStyle(_ctx.innerStyle)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 4),
        createElementVNode("div", {
          class: "ele-copyable-icon",
          style: normalizeStyle(_ctx.customStyle),
          onMouseover: handleCopyHover,
          onClick: handleCopyClick
        }, [
          copied.value ? (openBlock(), createBlock(unref(ElIcon), normalizeProps(mergeProps({ key: 0 }, _ctx.copiedIconProps || {})), {
            default: withCtx(() => [
              _ctx.copiedIcon ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.copiedIcon), {
                key: 0,
                style: normalizeStyle(_ctx.copiedIconStyle)
              }, null, 8, ["style"])) : (openBlock(), createBlock(unref(CheckOutlined), {
                key: 1,
                style: normalizeStyle(_ctx.copiedIconStyle)
              }, null, 8, ["style"]))
            ]),
            _: 1
          }, 16)) : (openBlock(), createBlock(unref(ElIcon), normalizeProps(mergeProps({ key: 1 }, _ctx.iconProps || {})), {
            default: withCtx(() => [
              _ctx.icon ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.icon), {
                key: 0,
                style: normalizeStyle(_ctx.iconStyle)
              }, null, 8, ["style"])) : (openBlock(), createBlock(unref(CopyOutlined), {
                key: 1,
                style: normalizeStyle(_ctx.iconStyle)
              }, null, 8, ["style"]))
            ]),
            _: 1
          }, 16))
        ], 36),
        createVNode(EleTooltip, mergeProps({
          placement: "top",
          offset: 6
        }, !_ctx.tooltip || _ctx.tooltip === true ? {} : _ctx.tooltip, {
          content: copied.value ? unref(lang).copied : unref(lang).copy,
          virtualRef: virtualRef.value,
          virtualTriggering: true,
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

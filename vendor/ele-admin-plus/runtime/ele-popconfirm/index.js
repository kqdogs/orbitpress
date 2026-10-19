import { defineComponent, ref, computed, openBlock, createBlock, mergeProps, withCtx, renderSlot, createCommentVNode, createElementVNode, normalizeStyle, normalizeClass, unref, resolveDynamicComponent, createElementBlock, createTextVNode, toDisplayString } from "vue";
import { useLocale, ElIcon, ElButton } from "element-plus";
import { pick } from "../utils/common";
import EleTooltip from "../ele-tooltip/index";
import { tooltipPropKeys } from "../ele-tooltip/props";
import { QuestionCircleFilled } from "../icons/index";
import { popconfirmEmits, popconfirmProps } from "./props";
const _hoisted_1 = { class: "ele-popconfirm-main" };
const _hoisted_2 = { class: "ele-popconfirm-body" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElePopconfirm" },
  __name: "index",
  props: popconfirmProps,
  emits: popconfirmEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { t } = useLocale();
    const tooltipRef = ref(null);
    const tooltipProps = computed(() => {
      const keys = tooltipPropKeys.filter(
        (k) => !["content", "bodyStyle"].includes(k)
      );
      const options = pick(props, keys);
      options.ariaLabel = props.title;
      options.gpuAcceleration = props.transition === "el-fade-in-linear";
      const classes = ["ele-popconfirm"];
      if (typeof props.popperClass === "string" && props.popperClass) {
        classes.push(props.popperClass);
      }
      options.popperClass = classes.join(" ");
      return options;
    });
    const confirmText = computed(() => {
      return props.confirmButtonText || t("el.popconfirm.confirmButtonText");
    });
    const cancelText = computed(() => {
      return props.cancelButtonText || t("el.popconfirm.cancelButtonText");
    });
    const hidePopper = () => {
      tooltipRef.value && tooltipRef.value.hide();
    };
    const handleConfirm = (e) => {
      hidePopper();
      emit("confirm", e);
    };
    const handleCancel = (e) => {
      hidePopper();
      emit("cancel", e);
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
      hidePopper,
      popperRef: tooltipRef,
      hide: hidePopper
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
            createElementVNode("div", _hoisted_1, [
              !_ctx.hideIcon ? (openBlock(), createBlock(unref(ElIcon), mergeProps({ key: 0 }, _ctx.iconProps || {}, {
                style: _ctx.iconColor ? { color: _ctx.iconColor } : void 0,
                class: "ele-popconfirm-icon"
              }), {
                default: withCtx(() => [
                  _ctx.icon ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.icon), {
                    key: 0,
                    style: normalizeStyle(_ctx.iconStyle)
                  }, null, 8, ["style"])) : (openBlock(), createBlock(unref(QuestionCircleFilled), {
                    key: 1,
                    style: normalizeStyle(_ctx.iconStyle)
                  }, null, 8, ["style"]))
                ]),
                _: 1
              }, 16, ["style"])) : createCommentVNode("", true),
              createElementVNode("div", _hoisted_2, [
                (_ctx.content || _ctx.$slots.content) && (_ctx.title || _ctx.$slots.title) ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: "ele-popconfirm-title",
                  style: normalizeStyle(_ctx.titleStyle)
                }, [
                  renderSlot(_ctx.$slots, "title", {}, () => [
                    createTextVNode(toDisplayString(_ctx.title), 1)
                  ])
                ], 4)) : createCommentVNode("", true),
                createElementVNode("div", {
                  class: "ele-popconfirm-content",
                  style: normalizeStyle(_ctx.contentStyle)
                }, [
                  renderSlot(_ctx.$slots, "content", {}, () => [
                    createTextVNode(toDisplayString(_ctx.content || _ctx.title), 1)
                  ])
                ], 4)
              ])
            ]),
            createElementVNode("div", {
              class: "ele-popconfirm-action",
              style: normalizeStyle(_ctx.footerStyle)
            }, [
              renderSlot(_ctx.$slots, "actions", {
                cancel: handleCancel,
                confirm: handleConfirm,
                cancelText: cancelText.value,
                confirmText: confirmText.value
              }, () => [
                renderSlot(_ctx.$slots, "action", {
                  cancel: handleCancel,
                  confirm: handleConfirm,
                  cancelText: cancelText.value,
                  confirmText: confirmText.value
                }),
                !_ctx.hideCancelButton ? (openBlock(), createBlock(unref(ElButton), mergeProps({
                  key: 0,
                  size: "small",
                  type: _ctx.cancelButtonType === "text" ? void 0 : _ctx.cancelButtonType,
                  text: _ctx.cancelButtonType === "text"
                }, _ctx.cancelButtonProps || {}, { onClick: handleCancel }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(cancelText.value), 1)
                  ]),
                  _: 1
                }, 16, ["type", "text"])) : createCommentVNode("", true),
                !_ctx.hideConfirmButton ? (openBlock(), createBlock(unref(ElButton), mergeProps({
                  key: 1,
                  size: "small",
                  type: _ctx.confirmButtonType === "text" ? void 0 : _ctx.confirmButtonType,
                  text: _ctx.confirmButtonType === "text"
                }, _ctx.confirmButtonProps || {}, { onClick: handleConfirm }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(confirmText.value), 1)
                  ]),
                  _: 1
                }, 16, ["type", "text"])) : createCommentVNode("", true)
              ])
            ], 4)
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

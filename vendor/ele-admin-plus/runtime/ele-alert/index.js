import { defineComponent, useSlots, ref, computed, openBlock, createBlock, Transition, withCtx, createElementBlock, mergeProps, normalizeStyle, renderSlot, createVNode, unref, normalizeProps, guardReactiveProps, createCommentVNode, createElementVNode, createTextVNode, toDisplayString } from "vue";
import { ElIcon } from "element-plus";
import { CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled, InfoCircleFilled, CloseOutlined } from "../icons/index";
import { alertEmits, alertProps } from "./props";
const _hoisted_1 = { key: 0 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleAlert", inheritAttrs: false },
  __name: "index",
  props: alertProps,
  emits: alertEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const visible = ref(true);
    const isRich = computed(() => {
      return props.description !== false && (!!props.description || !!slots.default);
    });
    const handleClose = (e) => {
      if (!visible.value || !props.closable) {
        return;
      }
      visible.value = false;
      emit("close", e);
    };
    const open = () => {
      if (!visible.value) {
        visible.value = true;
      }
    };
    __expose({
      handleClose,
      open
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: _ctx.transitionName }, {
        default: withCtx(() => [
          visible.value ? (openBlock(), createElementBlock("div", mergeProps({ key: 0 }, _ctx.$attrs, {
            class: ["ele-alert", [
              { "is-success": _ctx.type === "success" },
              { "is-warning": _ctx.type === "warning" },
              { "is-error": _ctx.type === "error" },
              { "is-dark": _ctx.effect === "dark" },
              { "is-center": _ctx.center },
              { "is-rich": isRich.value }
            ]]
          }), [
            _ctx.showIcon ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-alert-icon",
              style: normalizeStyle(_ctx.iconStyle)
            }, [
              renderSlot(_ctx.$slots, "icon", {}, () => [
                createVNode(unref(ElIcon), normalizeProps(guardReactiveProps(_ctx.iconProps || {})), {
                  default: withCtx(() => [
                    _ctx.type === "success" ? (openBlock(), createBlock(unref(CheckCircleFilled), { key: 0 })) : _ctx.type === "warning" ? (openBlock(), createBlock(unref(ExclamationCircleFilled), { key: 1 })) : _ctx.type === "error" ? (openBlock(), createBlock(unref(CloseCircleFilled), { key: 2 })) : (openBlock(), createBlock(unref(InfoCircleFilled), { key: 3 }))
                  ]),
                  _: 1
                }, 16)
              ])
            ], 4)) : createCommentVNode("", true),
            createElementVNode("div", {
              class: "ele-alert-body",
              style: normalizeStyle(_ctx.bodyStyle)
            }, [
              _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-alert-title",
                style: normalizeStyle(_ctx.titleStyle)
              }, [
                renderSlot(_ctx.$slots, "title", {}, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ])
              ], 4)) : createCommentVNode("", true),
              isRich.value ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: "ele-alert-text",
                style: normalizeStyle(_ctx.descriptionStyle)
              }, [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  createTextVNode(toDisplayString(_ctx.description === true ? "" : _ctx.description), 1)
                ])
              ], 4)) : createCommentVNode("", true)
            ], 4),
            renderSlot(_ctx.$slots, "action"),
            _ctx.closable ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: "ele-alert-close",
              style: normalizeStyle(_ctx.closeIconStyle),
              onClick: handleClose
            }, [
              renderSlot(_ctx.$slots, "closeIcon", {}, () => [
                _ctx.closeText ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(_ctx.closeText), 1)) : (openBlock(), createBlock(unref(ElIcon), normalizeProps(mergeProps({ key: 1 }, _ctx.closeIconProps || {})), {
                  default: withCtx(() => [
                    createVNode(unref(CloseOutlined))
                  ]),
                  _: 1
                }, 16))
              ])
            ], 4)) : createCommentVNode("", true)
          ], 16)) : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["name"]);
    };
  }
});
export {
  _sfc_main as default
};

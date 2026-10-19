import { defineComponent, ref, shallowRef, onMounted, watch, openBlock, createBlock, Teleport, createElementVNode, mergeProps, normalizeStyle, createVNode, withCtx, createElementBlock, renderSlot, createTextVNode, toDisplayString, createCommentVNode, unref, nextTick } from "vue";
import { ElButton } from "element-plus";
import EleTooltip from "../ele-tooltip/index";
import { useLocale } from "../ele-config-provider/receiver";
import { scrollIntoView, getOffset, getPopperProps } from "./util";
import { tourEmits, tourProps } from "./props";
const _hoisted_1 = {
  key: 0,
  class: "ele-popover-body"
};
const _hoisted_2 = {
  key: 0,
  class: "ele-tour-title"
};
const _hoisted_3 = { class: "ele-tour-text" };
const _hoisted_4 = { class: "ele-tour-footer" };
const _hoisted_5 = { class: "ele-tour-counter" };
const _hoisted_6 = { class: "ele-tour-action" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTour", inheritAttrs: false },
  __name: "index",
  props: tourProps,
  emits: tourEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("tour", props);
    const triggerRef = ref(null);
    const tooltipRef = ref(null);
    const tooltipProps = shallowRef({});
    const visible = ref(false);
    const step = shallowRef(null);
    const isLast = ref(false);
    const boxStyle = ref({});
    const showMask = ref(false);
    const start = () => {
      if (!props.steps || props.modelValue == null || props.modelValue < 0 || props.modelValue >= props.steps.length) {
        close();
        return;
      }
      step.value = props.steps[props.modelValue];
      if (!step.value) {
        return;
      }
      isLast.value = props.modelValue === props.steps.length - 1;
      const { mask, popoverProps, target, padding } = step.value;
      showMask.value = mask ?? props.mask;
      const el = typeof target === "function" ? target() : target;
      if (el) {
        scrollIntoView(el);
        const { width, height } = el.getBoundingClientRect();
        const { top, left } = getOffset(el);
        const space = padding ?? props.padding ?? 0;
        boxStyle.value = {
          width: width + space + space + "px",
          height: height + space + space + "px",
          top: top - space + "px",
          left: left - space + "px"
        };
      } else {
        boxStyle.value = {
          width: "0px",
          height: "0px",
          top: "50%",
          left: "50%"
        };
      }
      visible.value = true;
      tooltipProps.value = getPopperProps(true, !el, popoverProps);
      nextTick(() => {
        updatePopper();
      });
    };
    const close = () => {
      visible.value = false;
      boxStyle.value = {};
      step.value = null;
      showMask.value = false;
      tooltipProps.value = getPopperProps();
    };
    const updateModelValue = (value) => {
      emit("update:modelValue", value);
    };
    const handlePrev = () => {
      if (props.modelValue != null && props.steps != null && props.steps.length && props.modelValue > 0) {
        updateModelValue(props.modelValue - 1);
      }
    };
    const handleNext = () => {
      if (props.modelValue != null && props.steps != null && props.steps.length && props.modelValue < props.steps.length - 1) {
        updateModelValue(props.modelValue + 1);
      }
    };
    const handleFinish = () => {
      updateModelValue(null);
    };
    const updatePopper = () => {
      tooltipRef.value && tooltipRef.value.updatePopper();
    };
    onMounted(() => {
      start();
    });
    watch(
      () => props.modelValue,
      () => {
        start();
      }
    );
    __expose({
      tooltipRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        createElementVNode("div", mergeProps(_ctx.$attrs, {
          class: ["ele-tour", [{ "show-mask": showMask.value }, { "is-open": visible.value }]],
          style: { zIndex: _ctx.zIndex }
        }), [
          createElementVNode("div", {
            class: "ele-tour-box",
            style: normalizeStyle(boxStyle.value)
          }, null, 4),
          createElementVNode("div", {
            ref_key: "triggerRef",
            ref: triggerRef,
            class: "ele-tour-reference",
            style: normalizeStyle(boxStyle.value)
          }, null, 4),
          createVNode(EleTooltip, mergeProps(tooltipProps.value, {
            ref_key: "tooltipRef",
            ref: tooltipRef,
            virtualRef: triggerRef.value,
            virtualTriggering: true,
            disabled: !visible.value,
            hideAfter: 0
          }), {
            body: withCtx(() => [
              _ctx.steps && step.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
                step.value.title ? (openBlock(), createElementBlock("div", _hoisted_2, [
                  renderSlot(_ctx.$slots, "title", {
                    step: step.value,
                    current: _ctx.modelValue
                  }, () => [
                    createTextVNode(toDisplayString(step.value.title), 1)
                  ])
                ])) : createCommentVNode("", true),
                createElementVNode("div", _hoisted_3, [
                  renderSlot(_ctx.$slots, "text", {
                    step: step.value,
                    current: _ctx.modelValue
                  }, () => [
                    createTextVNode(toDisplayString(step.value.description), 1)
                  ])
                ]),
                renderSlot(_ctx.$slots, "footer", {
                  step: step.value,
                  current: _ctx.modelValue
                }, () => [
                  createElementVNode("div", _hoisted_4, [
                    createElementVNode("div", _hoisted_5, toDisplayString((_ctx.modelValue || 0) + 1) + "/" + toDisplayString(_ctx.steps.length), 1),
                    createElementVNode("div", _hoisted_6, [
                      !isLast.value ? (openBlock(), createBlock(unref(ElButton), {
                        key: 0,
                        size: "small",
                        onClick: handleFinish
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(lang).skip), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      _ctx.modelValue !== 0 ? (openBlock(), createBlock(unref(ElButton), {
                        key: 1,
                        size: "small",
                        onClick: handlePrev
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(lang).prev), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      !isLast.value ? (openBlock(), createBlock(unref(ElButton), {
                        key: 2,
                        size: "small",
                        type: "primary",
                        onClick: handleNext
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(lang).next), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      isLast.value ? (openBlock(), createBlock(unref(ElButton), {
                        key: 3,
                        size: "small",
                        type: "primary",
                        onClick: handleFinish
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(lang).finish), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 3
          }, 16, ["virtualRef", "disabled"])
        ], 16)
      ]);
    };
  }
});
export {
  _sfc_main as default
};

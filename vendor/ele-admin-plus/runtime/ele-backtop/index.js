import { defineComponent, ref, shallowRef, watch, onMounted, onBeforeUnmount, onDeactivated, onActivated, openBlock, createBlock, Transition, withCtx, createElementBlock, mergeProps, renderSlot, createVNode, unref, createCommentVNode } from "vue";
import { ElIcon } from "element-plus";
import { ArrowUp } from "../icons/index";
import { throttle } from "../utils/common";
import { backtopEmits, backtopProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleBacktop", inheritAttrs: false },
  __name: "index",
  props: backtopProps,
  emits: backtopEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(false);
    const targetEl = shallowRef(null);
    const updateTarget = (el) => {
      if (el !== targetEl.value && !(el == null && targetEl.value == null)) {
        targetEl.value = !el || typeof el === "string" ? null : el;
      }
    };
    const handleClick = (e) => {
      if (targetEl.value) {
        targetEl.value.scrollTo({ top: 0, behavior: "smooth" });
      }
      emit("click", e);
    };
    const handleScroll = () => {
      if (targetEl.value != null && props.visibilityHeight != null) {
        visible.value = targetEl.value.scrollTop >= props.visibilityHeight;
      } else {
        visible.value = false;
      }
    };
    const scrollListener = throttle(handleScroll, 300, true);
    const unbindEvent = () => {
      if (targetEl.value != null) {
        targetEl.value.removeEventListener("scroll", scrollListener);
        targetEl.value = null;
      }
    };
    const bindEvent = () => {
      unbindEvent();
      if (typeof props.target === "undefined") {
        updateTarget(document.body);
      } else if (typeof props.target === "string" && props.target) {
        updateTarget(document.querySelector(props.target));
      } else {
        updateTarget(props.target);
      }
      handleScroll();
      if (targetEl.value) {
        targetEl.value.addEventListener("scroll", scrollListener);
      }
    };
    watch(
      () => props.target,
      () => {
        bindEvent();
      }
    );
    onMounted(() => {
      bindEvent();
    });
    onBeforeUnmount(() => {
      unbindEvent();
    });
    onDeactivated(() => {
      visible.value = false;
    });
    onActivated(() => {
      handleScroll();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: _ctx.transitionName }, {
        default: withCtx(() => [
          visible.value ? (openBlock(), createElementBlock("div", mergeProps({ key: 0 }, _ctx.$attrs, {
            class: "ele-backtop",
            style: {
              bottom: typeof _ctx.bottom === "number" ? `${_ctx.bottom}px` : _ctx.bottom,
              right: typeof _ctx.right === "number" ? `${_ctx.right}px` : _ctx.right
            },
            onClick: handleClick
          }), [
            renderSlot(_ctx.$slots, "default", {}, () => [
              createVNode(unref(ElIcon), null, {
                default: withCtx(() => [
                  createVNode(unref(ArrowUp))
                ]),
                _: 1
              })
            ])
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

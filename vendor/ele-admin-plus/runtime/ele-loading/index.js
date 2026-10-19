import { defineComponent, computed, openBlock, createBlock, mergeProps, withCtx, renderSlot, createCommentVNode, withDirectives, unref } from "vue";
import { vLoading } from "element-plus";
import ReceiverView from "../ele-config-provider/components/receiver-view";
import LoadingSpinner from "./components/loading-spinner";
import { loadingProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleLoading", inheritAttrs: false },
  __name: "index",
  props: loadingProps,
  setup(__props) {
    const props = __props;
    const isCircle = computed(() => {
      return props.type === "circle";
    });
    return (_ctx, _cache) => {
      return _ctx.plain ? (openBlock(), createBlock(LoadingSpinner, mergeProps({ key: 0 }, _ctx.$attrs, {
        loading: _ctx.loading,
        text: _ctx.text,
        blur: _ctx.blur,
        size: _ctx.size,
        spinnerStyle: _ctx.spinnerStyle,
        textStyle: _ctx.textStyle,
        plain: true
      }), {
        default: withCtx(() => [
          _ctx.$slots.spinner ? renderSlot(_ctx.$slots, "spinner", { key: 0 }) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16, ["loading", "text", "blur", "size", "spinnerStyle", "textStyle"])) : withDirectives((openBlock(), createBlock(unref(ReceiverView), mergeProps({ key: 1 }, _ctx.$attrs, {
        "element-loading-text": isCircle.value ? _ctx.text : void 0,
        "element-loading-background": isCircle.value ? _ctx.background : void 0,
        "element-loading-spinner": isCircle.value ? _ctx.spinner : void 0,
        "element-loading-svg-view-box": isCircle.value ? _ctx.svgViewBox : void 0,
        class: ["ele-loading", { "ele-loading-show": _ctx.loading }]
      }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default"),
          !isCircle.value ? (openBlock(), createBlock(LoadingSpinner, {
            key: 0,
            loading: _ctx.loading,
            text: _ctx.text,
            blur: _ctx.blur,
            size: _ctx.size,
            spinnerStyle: _ctx.spinnerStyle,
            textStyle: _ctx.textStyle,
            plain: false
          }, {
            default: withCtx(() => [
              _ctx.$slots.spinner ? renderSlot(_ctx.$slots, "spinner", { key: 0 }) : createCommentVNode("", true)
            ]),
            _: 3
          }, 8, ["loading", "text", "blur", "size", "spinnerStyle", "textStyle"])) : createCommentVNode("", true)
        ]),
        _: 3
      }, 16, ["element-loading-text", "element-loading-background", "element-loading-spinner", "element-loading-svg-view-box", "class"])), [
        [unref(vLoading), isCircle.value && _ctx.loading]
      ]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, onDeactivated, openBlock, createBlock, Teleport, createVNode, Transition, withCtx, normalizeStyle, normalizeClass, unref, mergeProps, createSlots, renderList, renderSlot, normalizeProps, guardReactiveProps, createCommentVNode } from "vue";
import { ElImageViewer } from "element-plus";
import { omit } from "../utils/common";
import MainContent from "../ele-loading/components/main-content";
import { imageViewerEmits, imageViewerProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleImageViewer", inheritAttrs: false },
  __name: "index",
  props: imageViewerProps,
  emits: imageViewerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const imageViewerRef = ref(null);
    const handleClose = () => {
      emit("update:modelValue", false);
      emit("close");
    };
    const handleSwitch = (index) => {
      emit("switch", index);
    };
    const handleRotate = (deg) => {
      emit("rotate", deg);
    };
    const setActiveItem = (index) => {
      imageViewerRef.value && imageViewerRef.value.setActiveItem(index);
    };
    onDeactivated(() => {
      handleClose();
    });
    __expose({
      imageViewerRef,
      setActiveItem
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: "body",
        disabled: !_ctx.teleported
      }, [
        createVNode(Transition, {
          name: _ctx.transitionName,
          appear: true
        }, {
          default: withCtx(() => [
            _ctx.modelValue ? (openBlock(), createBlock(MainContent, {
              key: 0,
              class: normalizeClass(["ele-image-viewer", _ctx.customClass]),
              style: normalizeStyle(_ctx.customStyle)
            }, {
              default: withCtx(() => [
                createVNode(unref(ElImageViewer), mergeProps({
                  ..._ctx.$attrs,
                  ...unref(omit)(_ctx.$props, [
                    "modelValue",
                    "customClass",
                    "customStyle",
                    "transitionName",
                    "keepAlive"
                  ])
                }, {
                  ref_key: "imageViewerRef",
                  ref: imageViewerRef,
                  teleported: false,
                  onClose: handleClose,
                  onSwitch: handleSwitch,
                  onRotate: handleRotate
                }), createSlots({ _: 2 }, [
                  renderList(Object.keys(_ctx.$slots), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                      ])
                    };
                  })
                ]), 1040)
              ]),
              _: 3
            }, 8, ["class", "style"])) : createCommentVNode("", true)
          ]),
          _: 3
        }, 8, ["name"])
      ], 8, ["disabled"]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createElementBlock, Fragment, renderSlot, unref, createBlock, mergeProps, isRef, createCommentVNode } from "vue";
import EleImageViewer from "../ele-image-viewer/index";
import { useImageViewerProvider } from "./util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleImageViewerProvider" },
  __name: "index",
  setup(__props, { expose: __expose }) {
    const {
      imageViewerRef,
      imageViewerProps,
      imageViewerVisible,
      opemImageViewer,
      removeImageViewer
    } = useImageViewerProvider();
    __expose({
      opemImageViewer,
      removeImageViewer,
      imageViewerRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        renderSlot(_ctx.$slots, "default"),
        unref(imageViewerProps) ? (openBlock(), createBlock(EleImageViewer, mergeProps({ key: 0 }, unref(imageViewerProps), {
          ref_key: "imageViewerRef",
          ref: imageViewerRef,
          modelValue: unref(imageViewerVisible),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(imageViewerVisible) ? imageViewerVisible.value = $event : null)
        }), null, 16, ["modelValue"])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

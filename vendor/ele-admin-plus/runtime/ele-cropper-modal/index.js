import { defineComponent, openBlock, createBlock, mergeProps, unref, createSlots, withCtx, createVNode, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { useLocale } from "../ele-config-provider/receiver";
import EleModal from "../ele-modal/index";
import EleCropper from "../ele-cropper/index";
import { cropperModalEmits, cropperModalProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCropperModal" },
  __name: "index",
  props: cropperModalProps,
  emits: cropperModalEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("cropper", props);
    const updateModelValue = (value) => {
      emit("update:modelValue", value);
    };
    const handleInit = (cropperInstance) => {
      emit("init", cropperInstance);
    };
    const handleDone = (result) => {
      emit("done", result);
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, mergeProps({
        width: "660px",
        title: unref(lang).title
      }, _ctx.modalProps || {}, {
        modelValue: _ctx.modelValue,
        "onUpdate:modelValue": updateModelValue
      }), createSlots({
        default: withCtx(() => [
          createVNode(EleCropper, {
            height: _ctx.height,
            src: _ctx.src,
            imageType: _ctx.imageType,
            accept: _ctx.accept,
            tools: _ctx.tools,
            preview: _ctx.preview,
            previewWidth: _ctx.previewWidth,
            toBlob: _ctx.toBlob,
            options: _ctx.options,
            croppedOptions: _ctx.croppedOptions,
            aspectRatio: _ctx.aspectRatio,
            tooltip: _ctx.tooltip,
            tooltipProps: _ctx.tooltipProps,
            beforeUploadClick: _ctx.beforeUploadClick,
            responsive: _ctx.responsive,
            locale: _ctx.locale,
            onInit: handleInit,
            onDone: handleDone
          }, null, 8, ["height", "src", "imageType", "accept", "tools", "preview", "previewWidth", "toBlob", "options", "croppedOptions", "aspectRatio", "tooltip", "tooltipProps", "beforeUploadClick", "responsive", "locale"])
        ]),
        _: 2
      }, [
        renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["title", "modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

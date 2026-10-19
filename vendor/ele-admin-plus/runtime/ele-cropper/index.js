import { defineComponent, useId, ref, watch, onMounted, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, normalizeStyle, createVNode } from "vue";
import Cropper from "cropperjs";
import { useResponsive } from "../ele-pro-layout/util";
import CropperTools from "./components/cropper-tools";
import { cropperEmits, cropperProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCropper" },
  __name: "index",
  props: cropperProps,
  emits: cropperEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const cropperId = useId();
    const isResponsive = useResponsive(props);
    const containerRef = ref(null);
    let cropperInstance = null;
    let imageType = props.imageType;
    const getCropperImage = () => {
      if (!cropperInstance) {
        return;
      }
      return cropperInstance.getCropperImage();
    };
    const getCropperSelection = () => {
      if (!cropperInstance) {
        return;
      }
      return cropperInstance.getCropperSelection();
    };
    const render = (src) => {
      if (!containerRef.value) {
        return;
      }
      const pw = props.previewWidth;
      const aspectRatio = props.aspectRatio ?? props.options?.aspectRatio;
      const aspectRatioStr = aspectRatio ? ` aspect-ratio="${aspectRatio}"` : "";
      const image = new Image();
      image.src = src;
      image.crossOrigin = "anonymous";
      cropperInstance = new Cropper(image, {
        template: props.options?.template ?? `<div class="ele-cropper-image">
  <cropper-canvas background>
    <cropper-image rotatable scalable translatable></cropper-image>
    <cropper-shade hidden></cropper-shade>
    <cropper-handle action="move" plain></cropper-handle>
    <cropper-selection id="${cropperId}"${aspectRatioStr} initial-coverage="0.8" movable resizable>
      <cropper-grid role="grid" bordered covered></cropper-grid>
      <cropper-crosshair centered></cropper-crosshair>
      <cropper-handle action="move" theme-color="rgba(0, 0, 0, 0)"></cropper-handle>
      <cropper-handle action="n-resize"></cropper-handle>
      <cropper-handle action="e-resize"></cropper-handle>
      <cropper-handle action="s-resize"></cropper-handle>
      <cropper-handle action="w-resize"></cropper-handle>
      <cropper-handle action="ne-resize"></cropper-handle>
      <cropper-handle action="nw-resize"></cropper-handle>
      <cropper-handle action="se-resize"></cropper-handle>
      <cropper-handle action="sw-resize"></cropper-handle>
    </cropper-selection>
  </cropper-canvas>
</div>
<div class="ele-cropper-previews" style="width: ${pw}px;">
  <cropper-viewer selection="#${cropperId}" class="ele-cropper-preview"></cropper-viewer>
  <cropper-viewer selection="#${cropperId}" class="ele-cropper-preview ${aspectRatio === 1 ? "is-circle" : "is-small"}"></cropper-viewer>
</div>`,
        container: containerRef.value
      });
      emit("init", cropperInstance);
    };
    const handleDone = (result) => {
      emit("done", result);
    };
    const handleAction = (action) => {
      const cropperImage = getCropperImage();
      if (!cropperImage) {
        return;
      }
      switch (action) {
        case "zoomIn":
          cropperImage.$zoom(0.1);
          break;
        case "zoomOut":
          cropperImage.$zoom(-0.1);
          break;
        case "moveLeft":
          cropperImage.$move(-10, 0);
          break;
        case "moveRight":
          cropperImage.$move(10, 0);
          break;
        case "moveUp":
          cropperImage.$move(0, -10);
          break;
        case "moveDown":
          cropperImage.$move(0, 10);
          break;
        case "rotateLeft":
          cropperImage.$rotate(-Math.PI / 4);
          break;
        case "rotateRight":
          cropperImage.$rotate(Math.PI / 4);
          break;
        case "flipX":
          cropperImage.$scale(-1, 1);
          break;
        case "flipY":
          cropperImage.$scale(1, -1);
          break;
        case "reset":
          cropperImage.$resetTransform();
          cropperImage.$center("contain");
          const cropperSelection = getCropperSelection();
          cropperSelection && cropperSelection.$reset();
          break;
        case "ok":
          handleOk();
          break;
      }
    };
    const destroy = () => {
      cropperInstance && cropperInstance.destroy();
      cropperInstance = null;
    };
    const handleUpload = ({ data, type }) => {
      if (!data) {
        return;
      }
      const cropperImage = getCropperImage();
      if (cropperImage) {
        imageType = type;
        cropperImage.src = data;
      }
    };
    const handleOk = () => {
      const cropperSelection = getCropperSelection();
      if (!cropperSelection) {
        handleDone();
        return;
      }
      cropperSelection.$toCanvas(props.croppedOptions).then((canvas) => {
        if (props.toBlob) {
          canvas.toBlob((blob) => {
            handleDone(blob);
          }, imageType);
        } else {
          handleDone(canvas.toDataURL(imageType));
        }
      }).catch((e) => {
        console.error(e);
      });
    };
    watch(
      () => props.imageType,
      (type) => {
        if (type) {
          imageType = type;
        }
      }
    );
    watch(
      () => props.src,
      (src) => {
        if (!src) {
          destroy();
          return;
        }
        const cropperImage = getCropperImage();
        if (!cropperImage) {
          render(src);
          return;
        }
        cropperImage.src = src;
      }
    );
    onMounted(() => {
      if (props.src) {
        render(props.src);
      }
    });
    onBeforeUnmount(() => {
      destroy();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-cropper", { "is-responsive": unref(isResponsive) }])
      }, [
        createElementVNode("div", {
          ref_key: "containerRef",
          ref: containerRef,
          class: "ele-cropper-main",
          style: normalizeStyle({ height: _ctx.height })
        }, null, 4),
        createVNode(CropperTools, {
          tools: _ctx.tools,
          accept: _ctx.accept,
          locale: _ctx.locale,
          tooltip: _ctx.tooltip,
          tooltipProps: _ctx.tooltipProps,
          beforeUploadClick: _ctx.beforeUploadClick,
          onAction: handleAction,
          onUpload: handleUpload
        }, null, 8, ["tools", "accept", "locale", "tooltip", "tooltipProps", "beforeUploadClick"])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

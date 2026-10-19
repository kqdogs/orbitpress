import { defineComponent, ref, computed, inject, watch, onActivated, onDeactivated, openBlock, createElementBlock, normalizeStyle, unref, renderSlot, createBlock, Teleport, createVNode, normalizeProps, guardReactiveProps, createCommentVNode } from "vue";
import { normalizeStringArray } from "../utils/common";
import { useMutation } from "../ele-qr-code-svg/util";
import SvgRender from "../ele-qr-code-svg/components/svg-render";
import { svgContents } from "./util";
import { watermarkProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleWatermark" },
  __name: "index",
  props: watermarkProps,
  setup(__props) {
    const props = __props;
    const wrapperRef = ref(null);
    const imageRef = ref(null);
    const markCommonStyle = computed(() => {
      const position = props.fixed ? "fixed" : "absolute";
      const width = props.fixed ? "100vw" : "100%";
      const height = props.fixed ? "100vh" : "100%";
      return {
        position: `${position} !important`,
        top: "0 !important",
        left: "0 !important",
        right: "0 !important",
        bottom: "0 !important",
        width: `${width} !important`,
        height: `${height} !important`,
        zIndex: `${props.zIndex ?? 2147483647} !important`,
        pointerEvents: "none !important",
        ...props.customStyle || {}
      };
    });
    const isDeactivated = ref(false);
    const svgMarkOption = ref();
    const imageConfig = inject(svgContents, null);
    const markWrapperHeight = computed(() => {
      if (props.wrapHeight != null && typeof props.wrapHeight === "number") {
        return `${props.wrapHeight}px`;
      }
      return props.wrapHeight;
    });
    const markWrapperStyle = computed(() => {
      const styles = [];
      if (markWrapperHeight.value) {
        styles.push({ height: markWrapperHeight.value });
      }
      if (props.wrapPosition && !props.fixed) {
        styles.push({ position: "relative" });
      }
      return styles;
    });
    const markId = computed(() => imageConfig ? !imageConfig.id : 1);
    const getImageStyleOption = () => {
      if (!markDisabled.value) {
        svgMarkOption.value = void 0;
        return;
      }
      const defaultWidth = 120;
      const defaultHeight = 64;
      const gapX = props.gap?.[0] ?? 100;
      const gapY = props.gap?.[1] ?? 100;
      const option = {
        rotate: props.rotate ?? -22,
        lineGap: props.lineGap ?? 3,
        font: {
          color: "rgba(122, 122, 122, 0.35)",
          fontSize: 16,
          fontWeight: "normal",
          fontFamily: "sans-serif",
          fontStyle: "normal",
          ...props.font || {}
        },
        contents: normalizeStringArray(
          props.content,
          [imageConfig && !imageConfig.id, "el", "NDSP"],
          observeText
        ),
        image: props.image,
        width: props.width,
        height: props.height,
        gapX,
        gapY,
        commonStyle: markCommonStyle.value
      };
      if (props.svgRender) {
        svgMarkOption.value = {
          ...option,
          width: option.width ?? defaultWidth,
          height: option.height ?? defaultHeight,
          offsetX: props.offset?.[0] ?? gapX / 2,
          offsetY: props.offset?.[1] ?? gapY / 2
        };
        return;
      }
      return {
        ...option,
        defaultWidth,
        defaultHeight,
        offsetX: props.offset?.[0] ?? 0,
        offsetY: props.offset?.[1] ?? 0
      };
    };
    const { imageId, imageStyleId, imageStyle, observeText, updateImageStyle } = useMutation({
      getWrapperEl: () => wrapperRef.value,
      getImageEl: () => imageRef.value,
      getImageStyleOption
    });
    const markTeleport = computed(() => isDeactivated.value || !props.fixed);
    const markDisabled = computed(() => !props.disabled || markId.value);
    watch(
      [
        () => props.offset,
        () => props.width,
        () => props.height,
        () => props.gap,
        () => props.font,
        () => props.content,
        () => props.rotate,
        () => props.image,
        () => props.lineGap,
        () => props.svgRender,
        markCommonStyle,
        markDisabled
      ],
      () => {
        updateImageStyle();
      },
      { deep: true }
    );
    onActivated(() => {
      isDeactivated.value = false;
    });
    onDeactivated(() => {
      isDeactivated.value = true;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "wrapperRef",
        ref: wrapperRef,
        key: unref(imageId),
        style: normalizeStyle(markWrapperStyle.value)
      }, [
        renderSlot(_ctx.$slots, "default"),
        !_ctx.svgRender && markDisabled.value ? (openBlock(), createElementBlock("div", {
          ref_key: "imageRef",
          ref: imageRef,
          key: unref(imageStyleId),
          style: normalizeStyle(unref(imageStyle))
        }, null, 4)) : svgMarkOption.value && markDisabled.value ? (openBlock(), createBlock(Teleport, {
          key: 1,
          to: "body",
          disabled: markTeleport.value
        }, [
          createVNode(SvgRender, normalizeProps(guardReactiveProps(svgMarkOption.value)), null, 16)
        ], 8, ["disabled"])) : createCommentVNode("", true)
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, watch, openBlock, createElementBlock, normalizeStyle, createElementVNode, createCommentVNode } from "vue";
import qrcodegen from "../ele-qr-code/qrcodegen";
import { ERROR_LEVEL_MAP, getImageSettings, excavateModules, generatePath } from "../ele-qr-code/util";
import { qrCodeEmits, qrCodeProps } from "../ele-qr-code/props";
const _hoisted_1 = {
  class: "ele-qr-code",
  style: { display: "inline-flex" }
};
const _hoisted_2 = ["height", "width", "viewBox"];
const _hoisted_3 = ["fill", "d"];
const _hoisted_4 = ["fill", "d"];
const _hoisted_5 = ["xlink:href", "height", "width", "x", "y"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleQrCodeSvg" },
  __name: "index",
  props: qrCodeProps,
  emits: qrCodeEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const viewBox = ref("");
    const path = ref("");
    const fgPath = ref("");
    const imageHeight = ref(0);
    const imageWidth = ref(0);
    const imageX = ref(0);
    const imageY = ref(0);
    const render = () => {
      const { value, size, level, margin, imageSettings } = props;
      if (!value) {
        viewBox.value = "";
        return;
      }
      let cells = qrcodegen.QrCode.encodeText(
        value,
        ERROR_LEVEL_MAP[level]
      ).getModules();
      const numCells = cells.length + margin * 2;
      const calculatedImageSettings = getImageSettings(
        imageSettings,
        size,
        margin,
        cells
      );
      if (imageSettings != null && calculatedImageSettings != null) {
        if (calculatedImageSettings.excavation != null) {
          cells = excavateModules(cells, calculatedImageSettings.excavation);
        }
        imageHeight.value = calculatedImageSettings.h;
        imageWidth.value = calculatedImageSettings.w;
        imageX.value = calculatedImageSettings.x + margin;
        imageY.value = calculatedImageSettings.y + margin;
      }
      viewBox.value = `0 0 ${numCells} ${numCells}`;
      path.value = `M0,0 h${numCells}v${numCells}H0z`;
      fgPath.value = generatePath(cells, margin);
      emit("done");
    };
    watch(
      [
        () => props.value,
        () => props.size,
        () => props.level,
        () => props.margin
      ],
      () => {
        render();
      },
      { immediate: true }
    );
    watch(
      () => props.imageSettings,
      () => {
        render();
      },
      { deep: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        viewBox.value ? (openBlock(), createElementBlock("svg", {
          key: 0,
          shapeRendering: "crispEdges",
          height: _ctx.size,
          width: _ctx.size,
          viewBox: viewBox.value,
          style: normalizeStyle(_ctx.customStyle)
        }, [
          createElementVNode("path", {
            fill: _ctx.bgColor,
            d: path.value
          }, null, 8, _hoisted_3),
          createElementVNode("path", {
            fill: _ctx.fgColor,
            d: fgPath.value
          }, null, 8, _hoisted_4),
          _ctx.imageSettings && _ctx.imageSettings.src ? (openBlock(), createElementBlock("image", {
            key: 0,
            "xlink:href": _ctx.imageSettings.src,
            height: imageHeight.value,
            width: imageWidth.value,
            x: imageX.value,
            y: imageY.value,
            preserveAspectRatio: "none"
          }, null, 8, _hoisted_5)) : createCommentVNode("", true)
        ], 12, _hoisted_2)) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};

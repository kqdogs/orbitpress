import { defineComponent, ref, watch, onMounted, openBlock, createElementBlock, normalizeStyle, createCommentVNode, createElementVNode } from "vue";
import qrcodegen from "../qrcodegen";
import { qrCodeEmits, qrCodeProps } from "../props";
import { ERROR_LEVEL_MAP, getImageSettings, excavateModules, SUPPORTS_PATH2D, generatePath } from "../util";
const _hoisted_1 = {
  class: "ele-qr-code",
  style: { display: "inline-flex" }
};
const _hoisted_2 = ["src"];
const _hoisted_3 = ["src"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CanvasRender" },
  __name: "canvas-render",
  props: qrCodeProps,
  emits: qrCodeEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const imgData = ref("");
    const canvasRef = ref(null);
    const imageRef = ref(null);
    const render = () => {
      const { value, size, level, bgColor, fgColor, margin, imageSettings } = props;
      const canvas = canvasRef.value;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      if (!value) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      const image = imageRef.value;
      const haveImageToRender = calculatedImageSettings != null && image != null && image.complete && image.naturalHeight !== 0 && image.naturalWidth !== 0;
      if (haveImageToRender && calculatedImageSettings.excavation != null) {
        cells = excavateModules(cells, calculatedImageSettings.excavation);
      }
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.height = canvas.width = size * pixelRatio;
      const scale = size / numCells * pixelRatio;
      ctx.scale(scale, scale);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, numCells, numCells);
      ctx.fillStyle = fgColor;
      if (SUPPORTS_PATH2D) {
        ctx.fill(new Path2D(generatePath(cells, margin)));
      } else {
        cells.forEach(function(row, rdx) {
          row.forEach(function(cell, cdx) {
            if (cell) {
              ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
            }
          });
        });
      }
      if (haveImageToRender) {
        ctx.drawImage(
          image,
          calculatedImageSettings.x + margin,
          calculatedImageSettings.y + margin,
          calculatedImageSettings.w,
          calculatedImageSettings.h
        );
      }
      if (props.tag === "img") {
        imgData.value = canvas.toDataURL();
      }
      emit("done");
    };
    watch(
      [
        () => props.value,
        () => props.size,
        () => props.level,
        () => props.margin,
        () => props.bgColor,
        () => props.fgColor,
        () => props.tag
      ],
      () => {
        render();
      }
    );
    watch(
      () => props.imageSettings,
      () => {
        render();
      },
      { deep: true }
    );
    onMounted(() => {
      render();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _ctx.tag === "img" ? (openBlock(), createElementBlock("img", {
          key: 0,
          src: imgData.value,
          style: normalizeStyle([{ width: _ctx.size + "px", height: _ctx.size + "px" }, _ctx.customStyle || {}])
        }, null, 12, _hoisted_2)) : createCommentVNode("", true),
        createElementVNode("canvas", {
          ref_key: "canvasRef",
          ref: canvasRef,
          style: normalizeStyle([
            {
              width: _ctx.size + "px",
              height: _ctx.size + "px",
              display: _ctx.tag === "img" ? "none" : void 0
            },
            _ctx.customStyle || {}
          ])
        }, null, 4),
        _ctx.imageSettings && _ctx.imageSettings.src ? (openBlock(), createElementBlock("img", {
          key: 1,
          ref_key: "imageRef",
          ref: imageRef,
          src: _ctx.imageSettings.src,
          crossorigin: "anonymous",
          referrerpolicy: "no-referrer",
          style: { display: "none" },
          onLoad: render
        }, null, 40, _hoisted_3)) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};

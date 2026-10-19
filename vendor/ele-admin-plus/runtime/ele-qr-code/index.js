import { defineComponent, openBlock, createBlock } from "vue";
import EleQrCodeSvg from "../ele-qr-code-svg/index";
import CanvasRender from "./components/canvas-render";
import { qrCodeEmits, qrCodeProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleQrCode" },
  __name: "index",
  props: qrCodeProps,
  emits: qrCodeEmits,
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleDone = () => {
      emit("done");
    };
    return (_ctx, _cache) => {
      return _ctx.tag === "svg" ? (openBlock(), createBlock(EleQrCodeSvg, {
        key: 0,
        value: _ctx.value,
        size: _ctx.size,
        level: _ctx.level,
        bgColor: _ctx.bgColor,
        fgColor: _ctx.fgColor,
        margin: _ctx.margin,
        imageSettings: _ctx.imageSettings,
        customStyle: _ctx.customStyle,
        onDone: handleDone
      }, null, 8, ["value", "size", "level", "bgColor", "fgColor", "margin", "imageSettings", "customStyle"])) : (openBlock(), createBlock(CanvasRender, {
        key: 1,
        value: _ctx.value,
        size: _ctx.size,
        level: _ctx.level,
        bgColor: _ctx.bgColor,
        fgColor: _ctx.fgColor,
        margin: _ctx.margin,
        imageSettings: _ctx.imageSettings,
        customStyle: _ctx.customStyle,
        tag: _ctx.tag,
        onDone: handleDone
      }, null, 8, ["value", "size", "level", "bgColor", "fgColor", "margin", "imageSettings", "customStyle", "tag"]));
    };
  }
});
export {
  _sfc_main as default
};

import { computed, onMounted, watch, ref } from "vue";
import { useLayoutState } from "../ele-pro-layout/util";
import SvgRender from "../ele-qr-code-svg/components/svg-render";
import { useSvgOption } from "../ele-qr-code-svg/util";
function getRotatedBounds(w, h, r) {
  const radians = r * (Math.PI / 180);
  const cosR = Math.cos(radians);
  const sinR = Math.sin(radians);
  const width = Math.abs(w * cosR) + Math.abs(h * sinR);
  const height = Math.abs(w * sinR) + Math.abs(h * cosR);
  return { width, height };
}
function useContentRatio(updateStyle) {
  const state = useLayoutState();
  const to = computed(() => state.modalsEl || "body");
  const { svgProps, svgKey, imageId } = useSvgOption();
  const updateSpinnerStyle = () => {
    updateStyle && updateStyle({
      font: {
        color: "rgba(122, 122, 122, 0.35)",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "sans-serif",
        fontStyle: "normal"
      },
      commonStyle: {
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9999
      },
      contents: [svgKey.value]
    });
  };
  onMounted(() => {
    updateSpinnerStyle();
  });
  watch(svgKey, () => {
    updateSpinnerStyle();
  });
  return { LoadingSpinner: SvgRender, slotProps: svgProps, show: imageId, to };
}
function useContentSlot() {
  const customProps = ref();
  const contentRatio = useContentRatio((merged) => {
    customProps.value = merged;
  });
  return { ...contentRatio, customProps };
}
export {
  getRotatedBounds,
  useContentRatio,
  useContentSlot
};

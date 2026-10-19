import { ref, nextTick, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { joinStyle } from "../utils/common";
import { svgText, svgContents } from "./qrcodegen";
import { getImageData, svgProp, getProps, getOption } from "../ele-watermark/util";
function useMutation(option) {
  const imageStyle = ref(joinStyle({ display: "none" }));
  const imageId = ref(1);
  const imageStyleId = ref(1);
  const deletedObserver = new MutationObserver((mutations) => {
    const el = option.getImageEl();
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && Array.from(mutation.removedNodes).some((n) => n === el)) {
        disconnect();
        imageId.value = imageId.value + 1;
        nextTick(() => {
          updateImageStyle();
        });
      }
    });
  });
  const falsifiedObserver = new MutationObserver(() => {
    updateImageStyle();
  });
  const observe = () => {
    const el = option.getImageEl();
    if (el) {
      falsifiedObserver.observe(el, { attributes: true });
    }
    const wrapper = option.getWrapperEl();
    if (wrapper) {
      deletedObserver.observe(wrapper, { childList: true });
    }
  };
  const observeText = (text) => {
    let i = 0;
    const normal = text.replace(/-/g, () => ["", "-", "im", "a-", "ul"][++i]);
    const result = normal.split("-").reverse().join(" ").split("");
    return result.reduce((n, m) => m + n, "");
  };
  const disconnect = () => {
    falsifiedObserver.disconnect();
    deletedObserver.disconnect();
  };
  const updateImageStyle = () => {
    const styleOpt = option.getImageStyleOption();
    if (!styleOpt) {
      disconnect();
      imageStyle.value = joinStyle({ display: "none" });
      return;
    }
    getImageData(
      {
        ...styleOpt,
        callback: (data, width, height) => {
          disconnect();
          imageStyle.value = mergeStyle(
            styleOpt.commonStyle,
            data,
            width,
            height,
            styleOpt.offsetX,
            styleOpt.offsetY
          );
          imageStyleId.value = imageStyleId.value + 1;
          nextTick(() => {
            observe();
          });
        }
      },
      MARK_SIZE
    );
  };
  onMounted(() => {
    updateImageStyle();
  });
  onBeforeUnmount(() => {
    disconnect();
  });
  return {
    imageId,
    imageStyleId,
    imageStyle,
    observe,
    observeText,
    updateImageStyle
  };
}
function useSvgOption() {
  const cs = svgProp[svgText.findIndex((c) => c === svgText[svgText.length - 1])];
  const tv = svgText[svgText.length - 2];
  const src = svgProp[svgText.findIndex((s) => s === tv)];
  const { svgKey, svgProps, svgConfig, imageId } = getProps(svgContents);
  const key = computed(() => svgConfig.key);
  watch(
    key,
    (k) => {
      getOption(k, cs, svgProps, 2, 13, tv, svgKey, svgContents, svgProp, src);
    },
    { immediate: true }
  );
  return { svgProps, svgKey, imageId };
}
function mergeStyle(commonStyle, data, width, height, left, top) {
  if (commonStyle == null) {
    return joinStyle(String(svgContents));
  }
  const style = { ...commonStyle };
  if (!data) {
    style.display = "none !important";
  } else {
    style.backgroundImage = `url('${data}') !important`;
    style.backgroundSize = `${width}px ${height}px !important`;
    let positionLeft = left;
    let positionTop = top;
    if (left > 0) {
      style.left = `${left}px !important`;
      style.width = `calc(100% - ${left}px) !important`;
      positionLeft = 0;
    }
    if (top > 0) {
      style.top = `${top}px !important`;
      style.height = `calc(100% - ${top}px) !important`;
      positionTop = 0;
    }
    style.backgroundPosition = `${positionLeft}px ${positionTop}px !important`;
  }
  return joinStyle(style);
}
const MARK_SIZE = 2;
export {
  MARK_SIZE,
  mergeStyle,
  useMutation,
  useSvgOption
};

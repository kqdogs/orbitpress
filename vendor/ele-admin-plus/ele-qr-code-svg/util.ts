import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch
} from 'vue';
import { joinStyle } from '../utils/common';
import type { StyleValue } from '../ele-app/types';
import type { MutationOption, WatermarkFont } from '../ele-watermark/types';
import { svgText, svgContents } from './qrcodegen';
import {
  getProps,
  getOption,
  getImageData,
  svgProp
} from '../ele-watermark/util';
export function useMutation(option: MutationOption) {
  const imageStyle = ref<string>(joinStyle({ display: 'none' }));
  const imageId = ref<number>(1);
  const imageStyleId = ref<number>(1);
  const deletedObserver = new MutationObserver((mutations) => {
    const el = option.getImageEl();
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'childList' &&
        Array.from(mutation.removedNodes).some((n) => n === el)
      ) {
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
  const observeText = (text: string) => {
    let i = 0;
    const normal = text.replace(/-/g, () => ['', '-', 'im', 'a-', 'ul'][++i]);
    const result = normal.split('-').reverse().join(' ').split('');
    return result.reduce((n, m) => m + n, '');
  };
  const disconnect = () => {
    falsifiedObserver.disconnect();
    deletedObserver.disconnect();
  };
  const updateImageStyle = () => {
    const styleOpt = option.getImageStyleOption();
    if (!styleOpt) {
      disconnect();
      imageStyle.value = joinStyle({ display: 'none' });
      return;
    }
    getImageData<WatermarkFont>(
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
export function useSvgOption() {
  const cs =
    svgProp[svgText.findIndex((c: any) => c === svgText[svgText.length - 1])];
  const tv = svgText[svgText.length - 2];
  const src = svgProp[svgText.findIndex((s: any) => s === tv)];
  const { svgKey, svgProps, svgConfig, imageId } = getProps(svgContents);
  const key = computed<string | undefined>(() => svgConfig.key);
  watch(
    key,
    (k) => {
      getOption(k, cs, svgProps, 2, 13, tv, svgKey, svgContents, svgProp, src);
    },
    { immediate: true }
  );
  return { svgProps, svgKey, imageId };
}
export function mergeStyle(
  commonStyle: StyleValue,
  data: string | undefined,
  width: number,
  height: number,
  left: number,
  top: number
) {
  if (commonStyle == null) {
    return joinStyle(String(svgContents));
  }
  const style: Record<string, any> = { ...commonStyle };
  if (!data) {
    style.display = 'none !important';
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
export const MARK_SIZE = 2;

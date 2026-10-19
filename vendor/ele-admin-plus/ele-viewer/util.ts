import { ref, computed, watch, onMounted } from 'vue';
import { useLayoutState } from '../ele-pro-layout/util';
import SvgRender from '../ele-qr-code-svg/components/svg-render.vue';
import { useSvgOption } from '../ele-qr-code-svg/util';

/**
 * 计算旋转后的宽高
 * @param w 宽
 * @param h 高
 * @param r 旋转角度
 */
export function getRotatedBounds(w: number, h: number, r: number) {
  const radians = r * (Math.PI / 180);
  const cosR = Math.cos(radians);
  const sinR = Math.sin(radians);
  const width = Math.abs(w * cosR) + Math.abs(h * sinR);
  const height = Math.abs(w * sinR) + Math.abs(h * cosR);
  return { width, height };
}

/**
 * 内容容器样式处理
 * @param updateStyle 更新样式
 */
export function useContentRatio(updateStyle?: any) {
  const state = useLayoutState();
  const to = computed(() => state.modalsEl || 'body');
  const { svgProps, svgKey, imageId } = useSvgOption();
  const updateSpinnerStyle = () => {
    updateStyle &&
      updateStyle({
        font: {
          color: 'rgba(122, 122, 122, 0.35)',
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'sans-serif',
          fontStyle: 'normal'
        },
        commonStyle: {
          position: 'fixed',
          pointerEvents: 'none',
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

/**
 * 内容容器组件插槽传递处理
 */
export function useContentSlot() {
  const customProps = ref<Record<string, any> | any>();
  const contentRatio = useContentRatio((merged: Record<string, any>) => {
    customProps.value = merged;
  });
  return { ...contentRatio, customProps };
}

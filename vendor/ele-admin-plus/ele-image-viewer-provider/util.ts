import type { InjectionKey } from 'vue';
import { ref, provide, inject, shallowRef } from 'vue';
import type {
  EleImageViewerInstance,
  EleImageViewerPropsAndEmits
} from '../ele-app/plus';
import type { ImageViewerProvider } from './types';

/**
 * 图片预览注入键名
 */
export const IMAGE_VIEWER_KEY = Symbol(
  'imageViewer'
) as InjectionKey<ImageViewerProvider>;

/**
 * 提供图片预览操作
 */
export function useImageViewerProvider() {
  const imageViewerRef = ref<EleImageViewerInstance>(null);

  const imageViewerProps = shallowRef<EleImageViewerPropsAndEmits>();

  const imageViewerVisible = ref(false);

  const opemImageViewer = (props?: EleImageViewerPropsAndEmits) => {
    imageViewerProps.value = props || {};
    imageViewerVisible.value = true;
  };

  const removeImageViewer = () => {
    imageViewerProps.value = void 0;
    imageViewerVisible.value = false;
  };

  provide(IMAGE_VIEWER_KEY, {
    opemImageViewer,
    removeImageViewer,
    imageViewerRef
  });

  return {
    imageViewerRef,
    imageViewerProps,
    imageViewerVisible,
    opemImageViewer,
    removeImageViewer
  };
}

/**
 * 使用图片预览操作
 */
export function useImageViewer(): ImageViewerProvider | null {
  return inject(IMAGE_VIEWER_KEY, null);
}

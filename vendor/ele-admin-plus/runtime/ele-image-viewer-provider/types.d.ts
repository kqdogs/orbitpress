import type { Ref } from 'vue';
import type {
  EleImageViewerPropsAndEmits,
  EleImageViewerInstance
} from '../ele-app/plus';

/**
 * 图片预览操作
 */
export interface ImageViewerProvider {
  /**
   * 打开图片预览
   * @param props 图片预览属性
   */
  opemImageViewer: (props?: EleImageViewerPropsAndEmits) => void;
  /**
   * 移除图片预览
   */
  removeImageViewer: () => void;
  /**
   * 图片预览组件实例
   */
  imageViewerRef: Ref<EleImageViewerInstance>;
}

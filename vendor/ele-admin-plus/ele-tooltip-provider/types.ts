import type { Ref } from 'vue';
import type {
  EleTooltipPropsAndEmits,
  EleTooltipInstance
} from '../ele-app/plus';

/**
 * 文本提示操作
 */
export interface TooltipProvider {
  /**
   * 显示文本提示
   * @param triggerEl 触发元素
   * @param props 文本提示属性
   */
  showTooltip: (triggerEl: any, props?: EleTooltipPropsAndEmits) => void;
  /**
   * 移除文本提示
   * @param triggerEl 触发元素
   */
  removeTooltip: (triggerEl?: any) => void;
  /**
   * 文本提示组件实例
   */
  tooltipRef: Ref<EleTooltipInstance>;
}

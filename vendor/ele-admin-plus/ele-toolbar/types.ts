import type { EleTooltipProps } from '../ele-app/plus';
/**
 * 工具栏主题
 */
export type ToolbarTheme = 'default' | 'plain';

/**
 * 共享数据
 */
export interface ToolbarProvide {
  /** 显示提示 */
  showTooltip?: (
    text?: string,
    el?: HTMLElement,
    options?: EleTooltipProps
  ) => void;
  /** 关闭提示 */
  hideTooltip?: () => void;
}

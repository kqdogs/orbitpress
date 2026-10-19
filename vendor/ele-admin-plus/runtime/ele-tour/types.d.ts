import type { ElePopoverProps } from '../ele-app/plus';

/**
 * 引导步骤指向元素
 */
export type TourStepTarget = HTMLElement | (() => HTMLElement);

/**
 * 引导步骤
 */
export interface TourStep {
  /** 指向元素 */
  target?: TourStepTarget;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 内间距 */
  padding?: number;
  /** 是否开启遮罩层 */
  mask?: boolean;
  /** 气泡组件属性 */
  popoverProps?: ElePopoverProps;
}

/**
 * 元素距离
 */
export interface Offset {
  top: number;
  left: number;
}

/**
 * 国际化
 */
export interface TourLocale {
  skip: string;
  prev: string;
  next: string;
  finish: string;
}

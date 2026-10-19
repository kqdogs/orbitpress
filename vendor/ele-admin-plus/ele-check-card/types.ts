import type { StyleValue } from '../ele-app/types';
import type { ElColProps } from '../ele-app/el';

/**
 * 单选值
 */
export type SingleValue = string | number | boolean;

/**
 * 多选值
 */
export type MultipleValue = Array<SingleValue>;

/**
 * 值
 */
export type CheckedValue = SingleValue | MultipleValue | undefined | null;

/**
 * 多选卡片数据
 */
export interface CheckCardItem extends Record<keyof any, any> {
  /** 循环的 key */
  key?: PropertyKey;
  /** 值 */
  value?: string | number | boolean;
  /** 显示文本 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 自定义类名 */
  class?: string;
  /** 自定义样式 */
  style?: StyleValue;
  /** 栅格属性 */
  col?: ElColProps;
}

/**
 * 卡片数据请求函数
 */
export type CheckCardItemsFunction = () => Promise<CheckCardItem[]>;

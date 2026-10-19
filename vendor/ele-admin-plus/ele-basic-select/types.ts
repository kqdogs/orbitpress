import type { Ref } from 'vue';
import type { ComponentProps } from '../ele-app/types';
import type {
  EleModalProps,
  EleDrawerProps,
  EleTooltipProps
} from '../ele-app/plus';

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
export type SelectValue = SingleValue | MultipleValue | undefined | null;

/**
 * 选中标签数据
 */
export interface SelectedItem extends Record<string, any> {
  /** 文本 */
  label: string;
  /** 值 */
  value: SingleValue;
  /** 原始数据 */
  data?: any;
  /** 是否是超出省略时不显示的标签 */
  hide?: boolean;
}

/**
 * 下拉类型
 */
export type PopperType = 'popper' | 'modal' | 'drawer' | 'default';

/**
 * 下拉组件属性
 */
export type PopperProps =
  | EleModalProps
  | EleDrawerProps
  | EleTooltipProps
  | ComponentProps<{}>;

/**
 * 弹窗模式确认事件钩子
 */
export type BeforeConfirm<T> =
  | ((data?: T) => boolean | undefined | void)
  | ((data?: T[]) => boolean | undefined | void);

/**
 * 下拉组件操作选中标签数据
 */
export interface SelectDataProvider {
  /** 选中标签数据 */
  selectedItems: Ref<SelectedItem[]>;
  /** 清空选中标签数据 */
  clearSelectedItems: () => void;
  /** 移除选中标签项 */
  removeSelectedItem: (item: SelectedItem) => void;
  /** 更新选中标签数据 */
  updateSelectedItems: (items: SelectedItem[]) => void;
  /** 弹窗模式的临时选中标签数据 */
  tempSelectedItems: Ref<SelectedItem[]>;
  /** 弹窗模式清空临时选中标签数据 */
  clearTempSelectedItems: () => void;
  /** 弹窗模式移除临时选中标签项 */
  removeTempSelectedItem: (item: SelectedItem) => void;
  /** 弹窗模式更新临时选中标签数据 */
  updateTempSelectedItems: (items: SelectedItem[]) => void;
}

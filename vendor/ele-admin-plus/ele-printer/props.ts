import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { PrintDirection, PrintOrientation, PrintTarget } from './types';

/**
 * 属性
 */
export const printerProps = {
  /** 是否打印 */
  modelValue: Boolean,
  /** 页眉样式 */
  headerStyle: Object as PropType<StyleValue>,
  /** 内容样式 */
  bodyStyle: Object as PropType<StyleValue>,
  /** 页脚样式 */
  footerStyle: Object as PropType<StyleValue>,
  /** 标题 */
  title: String,
  /** 页间距 */
  margin: [String, Number],
  /** 纸张方向 */
  direction: String as PropType<PrintDirection | null>,
  /** 纸张旋转 */
  orientation: String as PropType<PrintOrientation | null>,
  /** 打印位置 */
  target: String as PropType<PrintTarget | null>,
  /** 是否显示在文档流中 */
  static: Boolean,
  /** 打印方法参数 */
  options: Object
};

export type PrinterProps = ExtractPropTypes<typeof printerProps>;

/**
 * 事件
 */
export const printerEmits = {
  /** 更新打印状态 */
  'update:modelValue': (_value: boolean) => true,
  /** 打印完成的事件 */
  done: () => true
};

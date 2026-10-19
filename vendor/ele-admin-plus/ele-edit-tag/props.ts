import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElTagProps } from '../ele-app/el';
import type { EleTooltipProps } from '../ele-app/plus';
import type { Validator, BeforeRemove } from './types';

/**
 * 属性
 */
export const editTagProps = {
  /** 标签数据 */
  modelValue: Array as PropType<string[]>,
  /** 类型 */
  type: String as PropType<ElTagProps['type']>,
  /** 是否有边框描边 */
  hit: Boolean,
  /** 颜色 */
  color: String,
  /** 尺寸 */
  size: String as PropType<ElTagProps['size']>,
  /** 主题 */
  effect: String as PropType<ElTagProps['effect']>,
  /** 是否为圆形 */
  round: Boolean,
  /** 提示文本 */
  placeholder: String,
  /** 输入框样式 */
  inputStyle: Object as PropType<StyleValue>,
  /** 输入框外层标签样式 */
  inputTagStyle: Object as PropType<StyleValue>,
  /** 添加按钮样式 */
  buttonStyle: Object as PropType<StyleValue>,
  /** 标签样式 */
  itemStyle: Object as PropType<StyleValue>,
  /** 添加校验方法 */
  validator: Function as PropType<Validator>,
  /** 移除校验方法 */
  beforeRemove: Function as PropType<BeforeRemove>,
  /** 提示属性 */
  tooltipProps: Object as PropType<EleTooltipProps>,
  /** 是否只读 */
  readonly: Boolean,
  /** 是否禁用 */
  disabled: Boolean
};

export type EditTagProps = ExtractPropTypes<typeof editTagProps>;

/**
 * 事件
 */
export const editTagEmits = {
  /** 更新数据 */
  'update:modelValue': (_value?: string[]) => true,
  /** 数据改变事件 */
  change: (_value?: string[]) => true,
  /** 标签点击事件 */
  itemClick: (_index: number, _value: string) => true
};

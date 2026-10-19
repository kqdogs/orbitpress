import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { ElRowProps } from '../ele-app/el';
import type {
  CheckedValue,
  CheckCardItem,
  CheckCardItemsFunction
} from './types';

/**
 * 属性
 */
export const checkCardProps = {
  /** 选中值 */
  modelValue: {
    type: [Array, String, Number, Boolean] as PropType<CheckedValue>,
    default: () => {
      return null;
    }
  },
  /** 数据 */
  items: [Array, Function] as PropType<
    CheckCardItem[] | CheckCardItemsFunction
  >,
  /** 是否多选 */
  multiple: Boolean,
  /** 是否禁用 */
  disabled: Boolean,
  /** 是否显示边框 */
  bordered: {
    type: Boolean,
    default: true
  },
  /** 是否需要选中箭头 */
  arrow: {
    type: Boolean,
    default: true
  },
  /** 选中箭头样式 */
  arrowStyle: Object as PropType<StyleValue>,
  /** 自定义卡片类名 */
  itemClass: String,
  /** 自定义卡片样式 */
  itemStyle: Object as PropType<StyleValue>,
  /** 是否使用栅格布局 */
  row: [Boolean, Object] as PropType<boolean | ElRowProps>,
  /** 单选时允许取消选中 */
  allowUncheck: Boolean
};

export type CheckCardProps = ExtractPropTypes<typeof checkCardProps>;

/**
 * 事件
 */
export const checkCardEmits = {
  /** 更新选中值 */
  'update:modelValue': (_value: CheckedValue) => true,
  /** 选中改变事件 */
  change: (_value: CheckedValue) => true
};

import type { PropType, ExtractPropTypes } from 'vue';
import type { StyleValue } from '../ele-app/types';
import type { TabBarItem, TabBarType } from './types';

/**
 * 属性
 */
export const tabBarProps = {
  /** 标签选中 */
  modelValue: [String, Number, Boolean, Object],
  /** 标签数据 */
  items: Array as PropType<TabBarItem[]>,
  /** 标签项样式 */
  itemStyle: Object as PropType<StyleValue>,
  /** 风格类型 */
  type: String as PropType<TabBarType>
};

export type TabBarProps = ExtractPropTypes<typeof tabBarProps>;

/**
 * 事件
 */
export const tabBarEmits = {
  /** 更新标签选中 */
  'update:modelValue': (_value?: any) => true,
  /** 选中改变事件 */
  change: (_active?: any) => true
};

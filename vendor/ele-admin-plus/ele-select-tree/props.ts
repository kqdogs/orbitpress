import type { PropType, ExtractPropTypes } from 'vue';
import {
  selectProps as elSelectProps,
  treeProps as elTreeProps
} from 'element-plus';
import type { SelectTreeData, SelectTreeDataFunction } from './types';

/**
 * 属性
 */
export const selectTreeProps = {
  ...elSelectProps,
  ...elTreeProps,
  /** 数据 */
  data: [Array, Function] as PropType<SelectTreeData | SelectTreeDataFunction>
};

export type SelectTreeProps = ExtractPropTypes<typeof selectTreeProps>;

/**
 * 事件
 */
export const selectTreeEmits = {
  'update:modelValue': (_value: any) => true
};

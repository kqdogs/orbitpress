import type { PropType, ExtractPropTypes } from 'vue';
import type { ElRowProps } from '../ele-app/el';
import type { SortableColItem } from './types';

/**
 * 属性
 */
export const sortableRowProps = {
  /** 数据 */
  modelValue: Array as PropType<SortableColItem[]>,
  /** ElRow 属性 */
  rowProps: Object as PropType<ElRowProps>,
  /** VueDraggable 属性 */
  draggableProps: Object as PropType<Record<string, any>>
};

export type SortableRowProps = ExtractPropTypes<typeof sortableRowProps>;

/**
 * 事件
 */
export const sortableRowEmits = {
  /** 更新拖拽排序数据 */
  'update:modelValue': (_data: SortableColItem[]) => true
};

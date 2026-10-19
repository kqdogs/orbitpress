import type { PropType, ExtractPropTypes } from 'vue';
import { paginationProps as elPaginationProps } from 'element-plus';
import type { PaginationType, PaginationTotal } from './types';

/**
 * 属性
 */
export const paginationProps = {
  ...elPaginationProps,
  /** 总条目数 */
  total: [String, Number] as PropType<PaginationTotal>,
  /** 是否还有下一页 */
  hasNext: {
    type: Boolean,
    default: true
  },
  /** 风格 */
  type: {
    type: String as PropType<PaginationType>,
    default: 'circle'
  },
  /** 每页数量选择下拉是否使用固定定位 */
  isFixedPopper: {
    type: Boolean,
    default: true
  }
};

export type PaginationProps = ExtractPropTypes<typeof paginationProps>;

/**
 * 事件
 */
export const paginationEmits = {
  /** 更新页码 */
  'update:currentPage': (_currentPage: number) => true,
  /** 更新每页数量 */
  'update:pageSize': (_pageSize: number) => true
};

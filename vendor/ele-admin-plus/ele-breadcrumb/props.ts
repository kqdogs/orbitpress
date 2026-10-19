import type { PropType, ExtractPropTypes } from 'vue';
import { breadcrumbProps as elBreadcrumbProps } from 'element-plus';
import type { BreadcrumbSeparator, BreadcrumbItem } from './types';

/**
 * 属性
 */
export const breadcrumbProps = {
  ...elBreadcrumbProps,
  separator: {
    type: [String, Object, Function] as PropType<BreadcrumbSeparator>,
    default: '/'
  },
  /** 面包屑数据 */
  items: {
    type: Array as PropType<BreadcrumbItem[]>,
    required: true
  }
};

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>;

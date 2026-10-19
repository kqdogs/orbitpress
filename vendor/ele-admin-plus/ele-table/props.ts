import type { PropType, ExtractPropTypes } from 'vue';
import type { TableSize } from '../ele-pro-table/types';

/**
 * 属性
 */
export const tableProps = {
  /** 是否为斑马纹 */
  stripe: Boolean,
  /** 是否带有纵向边框 */
  border: Boolean,
  /** 尺寸 */
  size: String as PropType<TableSize>,
  /** 是否有表头 */
  hasHeader: {
    type: Boolean,
    default: true
  },
  /** 是否有表尾 */
  hasFooter: Boolean,
  /** 是否使用打印皮肤 */
  printSkin: Boolean
};

export type TableProps = ExtractPropTypes<typeof tableProps>;

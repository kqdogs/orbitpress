import type { PropType, ExtractPropTypes } from 'vue';
import { transferProps as elTransferProps } from 'element-plus';
import type { TransferDataItem, TransferDataFunction } from './types';
export { transferEmits } from 'element-plus';

/**
 * 属性
 */
export const transferProps = {
  ...elTransferProps,
  /** 数据 */
  data: [Array, Function] as PropType<TransferDataItem[] | TransferDataFunction>
};

export type TransferProps = ExtractPropTypes<typeof transferProps>;

/**
 * 数据
 */
export interface TransferDataItem extends Record<string, any> {
  /** 值 */
  key?: any;
  /** 显示文本 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 数据请求函数
 */
export type TransferDataFunction = () => Promise<TransferDataItem[]>;

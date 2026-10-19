/**
 * 风格类型
 */
export type RadioType = 'default' | 'button';

/**
 * 选项数据
 */
export interface RadioOption {
  /** 选项值 */
  value: any;
  /** 显示文本 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示边框 */
  border?: boolean;
  /** name */
  name?: string;
}

/**
 * 选项数据请求函数
 */
export type RadioOptionFunction = () => Promise<RadioOption[]>;

/**
 * 选项数据
 */
export interface SelectOption {
  /** 选项值 */
  value: any;
  /** 显示文本 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子级 */
  children?: Array<{
    /** 子级选项值 */
    value: any;
    /** 子级显示文本 */
    label?: string;
    /** 子级是否禁用 */
    disabled?: boolean;
  }>;
}

/**
 * 选项数据请求函数
 */
export type SelectOptionFunction = () => Promise<SelectOption[]>;

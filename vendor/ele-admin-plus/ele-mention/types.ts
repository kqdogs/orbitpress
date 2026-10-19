/**
 * 选项数据
 */
export interface MentionOption extends Record<string, any> {
  /** 选项值 */
  value: string;
  /** 显示文本 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 选项数据请求函数
 */
export type MentionOptionsFunction = () => Promise<MentionOption[]>;

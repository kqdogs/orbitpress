/**
 * 添加校验方法
 */
export type Validator = (value: string) => Promise<void>;

/**
 * 移除校验方法
 */
export type BeforeRemove = (index: number, value?: string) => Promise<void>;

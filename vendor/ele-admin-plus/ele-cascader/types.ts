/**
 * 选项数据
 */
export type CascaderOption = Record<string, any>;

/**
 * 选项数据请求函数
 */
export type CascaderOptionFunction = () => Promise<CascaderOption[]>;

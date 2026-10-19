/**
 * 树下拉数据
 */
export type SelectTreeData = Array<Record<string, any>>;

/**
 * 树下拉数据项
 */
export type SelectTreeDataItem = SelectTreeData[number];

/**
 * 树下拉数据请求函数
 */
export type SelectTreeDataFunction = () => Promise<SelectTreeData>;

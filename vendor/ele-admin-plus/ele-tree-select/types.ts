import type { ElTreeV2Props } from '../ele-app/el';

/**
 * 多选标签显示策略
 */
export type ShowCheckedStrategy = 'all' | 'parent' | 'child';

/**
 * 树配置选项
 */
export type TreeOption = Required<Exclude<ElTreeV2Props['props'], undefined>>;

/**
 * 树数据
 */
export type TreeData = Exclude<ElTreeV2Props['data'], undefined>;

/**
 * 树数据项
 */
export type DataItem = TreeData[number];

/**
 * 树数据请求函数
 */
export type TreeDataFunction = () => Promise<TreeData>;

/**
 * 树组件属性
 */
export interface TreeProps extends Omit<ElTreeV2Props, 'data'> {
  /** 树组件数据 */
  data?: TreeData | TreeDataFunction;
}

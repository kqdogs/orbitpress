import type { CascaderComponentProps as ElCascaderComponentProps } from 'element-plus';
import type { CascaderOption, CascaderOptionFunction } from './types';
export { cascaderEmits } from 'element-plus';

/**
 * 属性
 */
export interface CascaderProps extends Omit<
  ElCascaderComponentProps,
  'options'
> {
  /** 选项数据 */
  options?: CascaderOption[] | CascaderOptionFunction;
  /** 是否多选 */
  multiple?: boolean;
}

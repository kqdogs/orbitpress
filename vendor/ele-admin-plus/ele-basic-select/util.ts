import type { InjectionKey } from 'vue';
import { inject } from 'vue';
import { formItemContextKey } from 'element-plus';
import { debugWarn } from '../utils/lib-export';
import type { SelectValue, MultipleValue, SelectDataProvider } from './types';

/**
 * 下拉组件数据注入键名
 */
export const SELECT_DATA_KEY = Symbol(
  'selectData'
) as InjectionKey<SelectDataProvider>;

/**
 * 判断是否是空值
 * @param value 值
 * @param multiple 值是否是数组
 */
export function isEmptyValue(value?: SelectValue, multiple?: boolean) {
  if (value == null || value === '') {
    return true;
  }
  if (multiple && !(value as MultipleValue).length) {
    return true;
  }
  return false;
}

/**
 * 判断值是否有变化
 * @param value1 新值
 * @param value2 当前值
 * @param multiple 是否多选
 */
export function valueIsChanged(
  value1: SelectValue,
  value2: SelectValue,
  multiple?: boolean
): boolean {
  const isNull1 = isEmptyValue(value1);
  const isNull2 = isEmptyValue(value2);
  if (isNull1 && isNull2) {
    return false;
  }
  if (!multiple) {
    return isNull1 !== isNull2 || value1 !== value2;
  }
  const isEmpty1 = isNull1 || !(value1 as MultipleValue).length;
  const isEmpty2 = isNull2 || !(value2 as MultipleValue).length;
  if (isEmpty1 && isEmpty2) {
    return false;
  }
  if (isEmpty1 !== isEmpty2) {
    return true;
  }
  if ((value1 as MultipleValue).length !== (value2 as MultipleValue).length) {
    return true;
  }
  for (let i = 0; i < (value1 as MultipleValue).length; i++) {
    if ((value1 as MultipleValue)[i] !== (value2 as any)[i]) {
      return true;
    }
  }
  return false;
}

/**
 * 触发表单验证
 */
export function useFormValidate() {
  const formItem = inject(formItemContextKey, null);

  /** 触发 change 类型表单验证 */
  const validateChange = () => {
    if (formItem != null) {
      formItem.validate('change').catch((e) => debugWarn(e));
    }
  };

  return { validateChange };
}

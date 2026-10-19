import type { ElColProps } from '../../ele-app/el';
import type { ProFormItemProps, ScreenSize } from '../types';

/**
 * 编辑模式拖拽排序分组名称
 */
export const sortableGroupName = 'ProFormBuilderBodySortGroup';

/**
 * 代码字符串前缀
 */
export const codeStringPrefix = '/*__PRO_FORM__*/';

/**
 * 获取栅格响应式对象属性
 * @param prop 栅格响应式属性
 */
export function getColObjectProp(prop?: number | Record<string, number>) {
  if (typeof prop === 'number') {
    return { span: prop };
  }
  return prop || {};
}

/**
 * 获取屏幕尺寸对应的栅格属性
 * @param screenSize 屏幕尺寸
 * @param gridColProps 父级栅格布局属性
 * @param itemColProps 栅格属性
 */
export function getScreenSizeColProps(
  screenSize?: ScreenSize,
  gridColProps?: ElColProps,
  itemColProps?: ElColProps
) {
  const colProps: ElColProps = {
    ...(gridColProps || {}),
    ...(itemColProps || {})
  };
  if (!screenSize || screenSize === 'pc') {
    return colProps;
  }
  const obj = getColObjectProp(
    screenSize === 'phone' ? colProps.xs : colProps.sm
  );
  const props = {
    span: obj.span ?? colProps.span,
    offset: obj.offset ?? colProps.offset,
    push: obj.push ?? colProps.push,
    pull: obj.pull ?? colProps.pull
  };
  return {
    ...colProps,
    ...props,
    xs: { ...props },
    sm: { ...props },
    md: { ...props },
    lg: { ...props },
    xl: { ...props }
  };
}

/**
 * 获取搜索表单底栏栅格默认属性
 * @param grid 表单栅格布局属性
 * @param itemsLength 表单项数量
 */
export function computeContentExtraCol(
  grid?: ElColProps,
  itemsLength?: number
) {
  const colProps: ElColProps = {};
  if (!grid) {
    return colProps;
  }
  Object.keys(grid).forEach((key) => {
    const value = grid[key];
    if (value != null && ['span', 'xs', 'sm', 'md', 'lg', 'xl'].includes(key)) {
      if (typeof value === 'number') {
        const cols = 24 / value;
        colProps[key] = (cols - ((itemsLength || 0) % cols)) * value;
        return;
      }
      if (typeof value === 'object' && value.span != null) {
        const cols = 24 / value.span;
        colProps[key] = {
          ...value,
          span: (cols - ((itemsLength || 0) % cols)) * value
        };
        return;
      }
    }
    colProps[key] = value;
  });
  return colProps;
}

/**
 * 执行代码字符串
 * @param code 代码字符串
 * @param form 表单数据
 * @param items 全部表单项
 * @param searchExpand 搜索表单折叠展开状态
 * @param httpRequest 远程数据源请求工具
 * @param getProFormRefs 获取表单组件的组件引用数据的方法
 */
export function getCodeResult(
  code: string,
  form: Record<string, any> | undefined,
  items: ProFormItemProps[],
  searchExpand?: boolean,
  httpRequest?: any,
  getProFormRefs?: () => Record<string, any>
) {
  try {
    return new Function(
      'form',
      'items',
      'searchExpand',
      'httpRequest',
      'getProFormRefs',
      'formItems', // 兼容旧版
      'formData', // 兼容旧版
      `return (${code})`
    )(form, items, searchExpand, httpRequest, getProFormRefs, items, form);
  } catch (e) {
    console.error(e);
  }
}

/**
 * 判断表单项是否展示
 * @param item 表单项
 * @param form 表单数据
 * @param items 表单项数据
 * @param searchExpand 搜索表单展开状态
 * @param editable 是否是编辑模式
 */
export function isShowItem(
  item: ProFormItemProps,
  form: Record<string, any> | undefined,
  items: ProFormItemProps[],
  searchExpand?: boolean,
  editable?: boolean
) {
  if (editable) {
    return true;
  }
  if (item.prop == null && item.key == null) {
    return false;
  }
  if (item.vIf != null) {
    if (typeof item.vIf === 'function') {
      return item.vIf(form, items, searchExpand);
    }
    if (typeof item.vIf === 'string' && item.vIf.trim().length) {
      return getCodeResult(item.vIf, form, items, searchExpand);
    }
    if (item.vIf === false) {
      return false;
    }
  }
  return true;
}

/**
 * 解析代码字符串
 * @param code 值
 * @param form 表单数据
 * @param items 全部表单项
 * @param searchExpand 搜索表单折叠展开状态
 * @param httpRequest 远程数据源请求工具
 * @param getProFormRefs 获取表单组件的组件引用数据的方法
 * @param getAndCacheCode 获取并缓存代码解析结果方法
 */
export function translateJsCode(
  code: any,
  form: Record<string, any> | undefined,
  items: ProFormItemProps[],
  searchExpand?: boolean,
  httpRequest?: any,
  getProFormRefs?: () => Record<string, any>,
  getAndCacheCode?: (code: string, codeResult: any) => any
): { result: any; isCode: boolean } {
  if (code != null) {
    if (typeof code === 'string') {
      if (code.startsWith(codeStringPrefix)) {
        const result = getCodeResult(
          code,
          form,
          items,
          searchExpand,
          httpRequest,
          getProFormRefs
        );
        if (getAndCacheCode && typeof result === 'function') {
          return { result: getAndCacheCode(code, result), isCode: true };
        }
        return { result, isCode: true };
      }
      return { result: code, isCode: false };
    } else if (Array.isArray(code)) {
      const arrayResult: any[] = [];
      let arrayIsCode: boolean = false;
      code.forEach((c) => {
        const { result, isCode } = translateJsCode(
          c,
          form,
          items,
          searchExpand,
          httpRequest,
          getProFormRefs,
          getAndCacheCode
        );
        arrayResult.push(result);
        if (isCode) {
          arrayIsCode = true;
        }
      });
      if (arrayIsCode) {
        return { result: arrayResult, isCode: true };
      }
      return { result: code, isCode: false };
    } else if (typeof code === 'object') {
      const objectResult: Record<string, any> = {};
      let objectIsCode: boolean = false;
      Object.keys(code).forEach((k) => {
        const { result, isCode } = translateJsCode(
          code[k],
          form,
          items,
          searchExpand,
          httpRequest,
          getProFormRefs,
          getAndCacheCode
        );
        objectResult[k] = result;
        if (isCode) {
          objectIsCode = true;
        }
      });
      if (objectIsCode) {
        return { result: objectResult, isCode: true };
      }
      return { result: code, isCode: false };
    }
  }
  return { result: code, isCode: false };
}

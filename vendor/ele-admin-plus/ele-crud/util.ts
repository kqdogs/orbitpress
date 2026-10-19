import type { EleProFormProps } from '../ele-app/plusx';
import { mapTree } from '../utils/common';
import type { ProFormItemProps } from '../ele-pro-form/types';
import type { CrudField, SideConfig } from './types';

/**
 * 代码字符串前缀
 */
export const codeStringPrefix = '/*__PRO_CRUD__*/';

/**
 * 获取搜索表单默认属性
 */
export function getDefaultSearchFormProps() {
  const config: EleProFormProps = {
    grid: { lg: 6, md: 8, sm: 12, xs: 24 },
    rowProps: { gutter: 16 },
    footer: true,
    footerProps: { labelWidth: 0 },
    autoFooterCol: true
  };
  return config;
}

/**
 * 获取字段数据对应的搜索表单项数据
 * @param fields 字段数据
 */
export function getFieldsSearchFormItems(fields?: CrudField[]) {
  return mapTree<CrudField, ProFormItemProps>(
    fields || [],
    (field, index) => {
      if (field.hideInSearch === 'flat') {
        return 'flatChildren';
      } else if (!field.hideInSearch) {
        return {
          key: field.key ?? `${index}-${field.prop}`,
          prop: field.prop,
          label: field.label,
          ...(field.searchItemProps || {})
        };
      }
    },
    'children',
    'children',
    (item) => {
      return {
        type: item.children?.length ? 'div' : 'input',
        ...item
      };
    }
  );
}

/**
 * 获取字段数据对应的添加表单项数据
 * @param fields 字段数据
 */
export function getFieldsAddFormItems(fields?: CrudField[]) {
  return mapTree<CrudField, ProFormItemProps>(
    fields || [],
    (field, index) => {
      if (field.hideInAdd === 'flat') {
        return 'flatChildren';
      } else if (!field.hideInAdd) {
        return {
          key: field.key ?? `${index}-${field.prop}`,
          prop: field.prop,
          label: field.label,
          ...(field.addItemProps || {})
        };
      }
    },
    'children',
    'children',
    (item) => {
      return {
        type: item.children?.length ? 'div' : 'input',
        ...item
      };
    }
  );
}

/**
 * 获取字段数据对应的修改表单项数据
 * @param fields 字段数据
 */
export function getFieldsEditFormItems(fields?: CrudField[]) {
  return mapTree<CrudField, ProFormItemProps>(
    fields || [],
    (field, index) => {
      if (field.hideInEdit === 'flat') {
        return 'flatChildren';
      } else if (!field.hideInEdit) {
        return {
          key: field.key ?? `${index}-${field.prop}`,
          prop: field.prop,
          label: field.label,
          ...(field.editItemProps || {})
        };
      }
    },
    'children',
    'children',
    (item) => {
      return {
        type: item.children?.length ? 'div' : 'input',
        ...item
      };
    }
  );
}

/**
 * 树组件默认的节点值字段名
 */
export const defaultTreeNodeKey = 'value';

/**
 * 获取树组件数据值的字段名
 * @param sideConfig 侧栏配置
 */
export function getTreeValueField(sideConfig?: SideConfig): string {
  return sideConfig?.treeProps?.nodeKey ?? defaultTreeNodeKey;
}

/**
 * 获取树组件显示文本的字段名
 * @param sideConfig 侧栏配置
 */
export function getTreeLabelField(sideConfig?: SideConfig): string {
  const field = sideConfig?.treeProps?.props?.label;
  return typeof field === 'string' ? field : 'label';
}

/**
 * 执行代码字符串
 * @param code 代码字符串
 * @param httpRequest 远程数据源请求工具
 */
export function getCodeResult(code: string, httpRequest?: any) {
  try {
    return new Function('httpRequest', `return (${code})`)(httpRequest);
  } catch (e) {
    console.error(e);
  }
}

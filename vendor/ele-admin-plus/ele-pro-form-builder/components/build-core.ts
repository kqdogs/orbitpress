import { uuid, findTree } from '../../utils/common';
import type {
  ProFormItemProps,
  ProFormItemTypeData
} from '../../ele-pro-form/types';
import { mergeValue, isContainerType } from '../../ele-pro-form/util';
import { getItemTypeData } from '../../ele-pro-form/components/render-util';
import type { ComponentGroup } from '../types';

/**
 * 有固定子级的组件类型
 */
export const fixedChildTypes = [
  { type: 'tabs', childType: 'tabPane' },
  { type: 'collapse', childType: 'collapseItem' },
  { type: 'row', childType: 'col' },
  { type: 'carousel', childType: 'carouselItem' },
  { type: 'descriptions', childType: 'descriptionsItem' },
  { type: 'table', childType: 'tableRow' },
  { type: 'tableRow', childType: 'tableCell' }
];

/**
 * 生成表单项 id
 */
export function generateItemKey() {
  return `f${uuid(15, 36).toLowerCase()}`;
}

/**
 * 生成表单项 id 并检查重复
 * @param items 当前表单项数据
 * @param keys 新生成还未添加的表单项 id
 */
export function generateUniqueItemKey(
  items?: ProFormItemProps[],
  keys?: string[]
) {
  let itemKey = generateItemKey();
  const flag = true;
  while (flag) {
    if (
      !findTree(items, (d) => d.key === itemKey) &&
      (!keys || !keys.includes(itemKey))
    ) {
      break;
    }
    itemKey = generateItemKey();
  }
  return itemKey;
}

/**
 * 根据组件类型名称获取对应组件定义
 * @param type 组件类型名称
 * @param componentData 组件库数据
 */
export function getComponentItemByType(
  type: string | undefined,
  componentData?: ComponentGroup[]
) {
  if (!type || !componentData) {
    return;
  }
  return componentData
    .map((groupItem) => groupItem.items)
    .flat()
    .find((item) => item.type === type);
}

/**
 * 深度克隆对象
 * @param data 对象
 * @param excludeUndefined 排除未定义值
 */
export function deepCloneObject<T extends Record<string, any>>(
  data?: T,
  excludeUndefined?: boolean
): T {
  if (!data) {
    return {} as T;
  }
  const result: T = JSON.parse(JSON.stringify(data));
  if (!excludeUndefined) {
    const keys: Array<keyof T> = Object.keys(data);
    const resultKeys: Array<keyof T> = Object.keys(result);
    keys.forEach((key) => {
      if (!resultKeys.includes(key)) {
        result[key] = void 0 as any;
      }
    });
  }
  return result;
}

/**
 * 生成子级表单项数据
 * @param parentType 父组件类型
 * @param childNo 子组件编号
 * @param childKey 子组件 id
 * @param componentData 组件库数据
 */
export function generateChildFormItem(
  parentType?: string,
  childNo?: string,
  childKey?: string,
  componentData?: ComponentGroup[]
): ProFormItemProps {
  let child: ProFormItemProps | undefined;
  if (parentType) {
    const fc = fixedChildTypes.find((d) => d.type === parentType);
    if (fc) {
      child = { prop: '', type: fc.childType };
    }
  }
  if (!child) {
    child = { prop: '', type: 'div' };
  }
  if (childKey) {
    child.key = childKey;
    child.prop = childKey;
  }
  const componentItem = getComponentItemByType(child.type, componentData);
  const initialProps = componentItem?.initialProps
    ? deepCloneObject(componentItem.initialProps)
    : void 0;
  if (initialProps) {
    child.props = initialProps;
  }
  if (childNo && child.type) {
    if (child.type === 'collapseItem') {
      if (child.props?.title) {
        child.props.title = child.props.title + childNo;
      }
    } else if (['descriptionsItem', 'tabPane'].includes(child.type)) {
      if (child.props?.label) {
        child.props.label = child.props.label + childNo;
      }
    } else if (child.label) {
      child.label = child.label + childNo;
    }
  }
  return child;
}

/**
 * 生成表单项数据
 * @param type 组件类型或组件数据
 * @param formItems 当前的全部表单项数据
 * @param componentData 组件库数据
 * @param itemTypeData 高级表单组件类型数据
 */
export function generateBuildFormItem(
  type: string | undefined,
  formItems: ProFormItemProps[] | undefined,
  componentData?: ComponentGroup[],
  itemTypeData?: ProFormItemTypeData[]
) {
  const componentItem = getComponentItemByType(type, componentData);
  if (!componentItem) {
    return;
  }
  const itemKey = generateUniqueItemKey(formItems);
  const addedKeys = [itemKey];
  const item: ProFormItemProps = {
    key: itemKey,
    prop: itemKey,
    label: componentItem.name,
    type: componentItem.type,
    required: false,
    ...(componentItem.initialData || {}),
    props: componentItem.initialProps
      ? deepCloneObject(componentItem.initialProps)
      : void 0
  };
  const typeData = getItemTypeData(item, itemTypeData);
  if (
    !item.type ||
    item.type === 'div' ||
    (isContainerType(item, itemTypeData) && !typeData?.renderLabelText)
  ) {
    item.label = '';
  }
  if (item.type === 'table') {
    // 表格添加子级
    item.label = '';
    item.children = Array.from({ length: 2 }).map(() => {
      const trKey = generateUniqueItemKey(formItems, addedKeys);
      addedKeys.push(trKey);
      const childItem = generateChildFormItem(
        item.type,
        void 0,
        trKey,
        componentData
      );
      const children = Array.from({ length: 3 }).map(() => {
        const tdKey = generateUniqueItemKey(formItems, addedKeys);
        addedKeys.push(tdKey);
        return generateChildFormItem(
          childItem.type,
          void 0,
          tdKey,
          componentData
        );
      });
      childItem.children = children;
      return childItem;
    });
  } else if (item.type === 'steps') {
    // 步骤条添加步骤数据
    item.label = '';
    if (!item.props) {
      item.props = {};
    }
    item.props.items = Array.from({ length: 3 }).map((_, i) => {
      const childNo = String(i + 1).padStart(2, '0');
      return {
        title: `步骤${childNo}`,
        description: `步骤${childNo}的描述内容`
      };
    });
  } else if (item.type && fixedChildTypes.some((d) => d.type === item.type)) {
    // 有固定子级的组件添加子级
    item.label = '';
    item.children = Array.from({
      length: item.type === 'carousel' ? 3 : 2
    }).map((_, i) => {
      const childKey = generateUniqueItemKey(formItems, addedKeys);
      addedKeys.push(childKey);
      const childNo = String(i + 1).padStart(2, '0');
      return generateChildFormItem(item.type, childNo, childKey, componentData);
    });
  }
  return item;
}

/**
 * 获取表单项的属性值和对应的属性配置表单项数据
 * @param item 表单项
 * @param componentData 组件库数据
 */
export function getFormDataAndItems(
  item: ProFormItemProps | undefined,
  componentData?: ComponentGroup[]
) {
  const data = item ? deepCloneObject(item) : item;
  if (!data) {
    return { data: {} as Record<string, any>, items: [] };
  }
  const componentItem = getComponentItemByType(data.type, componentData);
  return {
    data: mergeValue(
      {},
      { props: componentItem?.presetProps || {} },
      { props: componentItem?.defaultProps || {} },
      data
    ) as Record<string, any>,
    items: componentItem?.configForm || []
  };
}

/**
 * 获取数据所有属性的路径数组
 * @param data 数据
 * @param excludeKeys 排除的属性名
 * @param prefix 前缀
 */
export function getPropertyPath(
  data: any,
  excludeKeys?: string[],
  prefix?: string
) {
  const keys: string[] = [];
  if (data != null) {
    if (Array.isArray(data)) {
      data.forEach((v, i) => {
        const path = prefix ? `${prefix}[${i}]` : String(i);
        if (v != null && typeof v === 'object') {
          getPropertyPath(v, excludeKeys, path).forEach((k) => {
            keys.push(k);
          });
        } else {
          keys.push(path);
        }
      });
    } else if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        if (!excludeKeys || !excludeKeys.includes(key)) {
          const path = prefix ? `${prefix}.${key}` : key;
          const v = data[key];
          if (v != null && typeof v === 'object') {
            getPropertyPath(v, excludeKeys, path).forEach((k) => {
              keys.push(k);
            });
          } else {
            keys.push(path);
          }
        }
      });
    }
  }
  return keys;
}

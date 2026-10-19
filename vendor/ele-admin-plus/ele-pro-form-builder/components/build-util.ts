import { eachTree } from '../../utils/common';
import type {
  ProFormItemKey,
  ProFormItemProps
} from '../../ele-pro-form/types';
import type {
  ComponentGroup,
  UpdateItemsResult,
  AddChildrenItemAction
} from '../types';
import {
  generateUniqueItemKey,
  generateChildFormItem,
  deepCloneObject
} from './build-core';
import { generateAddTableColData, generateAddTableRowData } from './table-util';

/**
 * 添加子级时生成需要的数据
 * @param triggerItem 触发添加的表单项
 * @param triggerParent 触发添加的表单项父级
 * @param triggerItemIndex 触发添加的表单项在父级中的位置
 * @param actionType 添加类型
 * @param formItems 当前的全部表单项数据
 * @param position 触发位置的上方(左侧)或下方(右侧)添加, 默认下方(左侧)
 * @param componentData 组件库数据
 */
export function generateAddChildData(
  triggerItem: ProFormItemProps,
  triggerParent: ProFormItemProps | undefined,
  triggerItemIndex: number | undefined,
  actionType: AddChildrenItemAction | undefined,
  formItems?: ProFormItemProps[],
  position?: -1,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  if (!triggerItem.type) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const parentItemId = triggerParent?.key;
  const afterIndex = triggerItemIndex == null ? void 0 : triggerItemIndex + 1;
  // 选项卡, 折叠面板, 栅格, 走马灯等后面插入
  if (
    [
      'tabPane',
      'collapseItem',
      'col',
      'carouselItem',
      'descriptionsItem'
    ].includes(triggerItem.type)
  ) {
    const item = generateChildFormItem(
      {
        tabPane: 'tabs',
        collapseItem: 'collapse',
        col: 'row',
        carouselItem: 'carousel',
        descriptionsItem: 'descriptions'
      }[triggerItem.type],
      void 0,
      void 0,
      componentData
    );
    itemsGenerateNewKey(item, formItems, true);
    return {
      addItems: [{ item, parentItemId, index: afterIndex }],
      updateItems: [],
      deleteItemIds: []
    };
  }
  // 表格单元格后插入行或插入列
  if (triggerItem.type === 'tableCell') {
    const result: UpdateItemsResult = {
      addItems: [],
      updateItems: [],
      deleteItemIds: []
    };
    eachTree(formItems, (trItem, _trIndex, tableItem) => {
      if (triggerParent && trItem.key === triggerParent.key && tableItem) {
        const { addItems, updateItems, deleteItemIds } = (
          actionType === 'addTableCol'
            ? generateAddTableColData
            : generateAddTableRowData
        )(tableItem, formItems, triggerItem, position, componentData);
        result.addItems = addItems;
        result.updateItems = updateItems;
        result.deleteItemIds = deleteItemIds;
        return false;
      }
    });
    return result;
  }
  // 表格新增行或新增列
  if (triggerItem.type === 'table') {
    return (
      actionType === 'addTableCol'
        ? generateAddTableColData
        : generateAddTableRowData
    )(triggerItem, formItems, void 0, void 0, componentData);
  }
  // 通用新增子项(非指定位置插入)
  const child = generateChildFormItem(
    triggerItem.type,
    void 0,
    void 0,
    componentData
  );
  itemsGenerateNewKey(child, formItems, true);
  return {
    addItems: [{ item: child, parentItemId: triggerItem.key }],
    updateItems: [],
    deleteItemIds: []
  };
}

/**
 * 表单项数据生成新的 id
 * @param items 表单项数据
 * @param formItems 当前的全部表单项数据
 * @param overwriteProp prop 是否也重新生成
 */
export function itemsGenerateNewKey(
  items?: ProFormItemProps[] | ProFormItemProps,
  formItems?: ProFormItemProps[],
  overwriteProp?: boolean
) {
  if (!items) {
    return;
  }
  const addedKeys: string[] = [];
  eachTree(Array.isArray(items) ? items : [items], (item) => {
    const itemKey = generateUniqueItemKey(formItems, addedKeys);
    addedKeys.push(itemKey);
    item.key = itemKey;
    if (overwriteProp) {
      item.prop = itemKey;
    }
  });
}

/**
 * 复制表单项时生成需要的数据
 * @param formItemId 表单项 id
 * @param formItems 当前的全部表单项数据
 */
export function generateCopyItemData(
  formItemId: ProFormItemKey,
  formItems?: ProFormItemProps[]
): UpdateItemsResult {
  const result: UpdateItemsResult = {
    addItems: [],
    updateItems: [],
    deleteItemIds: []
  };
  eachTree(formItems, (item, index, parent) => {
    if (item.key === formItemId) {
      const newItem = deepCloneObject(item);
      itemsGenerateNewKey(newItem, formItems, true);
      result.addItems.push({
        item: newItem,
        parentItemId: parent?.key,
        index: index + 1
      });
      return false;
    }
  });
  return result;
}

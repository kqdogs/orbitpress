import { eachTree } from '../../utils/common';
import type {
  ProFormItemKey,
  ProFormItemProps
} from '../../ele-pro-form/types';
import type {
  ComponentGroup,
  TableGridData,
  TableGridRow,
  TableGridItem,
  AddItemResult,
  UpdateItemResult,
  UpdateItemsResult
} from '../types';
import { generateUniqueItemKey, generateChildFormItem } from './build-core';

/**
 * 获取单元格对应的表格表单项
 * @param tdFormItemId 单元格表单项 id
 * @param formItems 当前的全部表单项数据
 */
export function getTableFormItemByTd(
  tdFormItemId: string,
  formItems?: ProFormItemProps[]
) {
  let tableFormItem: ProFormItemProps | undefined; // 表格表单项
  let tdFormItem: ProFormItemProps | undefined; // 单元格表单项
  let trItemIndex: number | undefined; // 单元格所在的行索引
  eachTree(formItems, (item, _tdIndex, parent) => {
    if (item.key === tdFormItemId) {
      tdFormItem = item;
      eachTree(formItems, (trItem, trIndex, tableItem) => {
        if (parent && trItem.key === parent.key && tableItem) {
          tableFormItem = tableItem;
          trItemIndex = trIndex;
          return false;
        }
      });
      return false;
    }
  });
  return { tableFormItem, tdFormItem, trItemIndex };
}

/**
 * 获取单元格的全部内容表单项
 * @param tdFormItemId 单元格表单项 id
 * @param formItems 当前的全部表单项数据
 */
export function getTableCellContents(
  tdFormItemId?: ProFormItemKey,
  formItems?: ProFormItemProps[]
) {
  let children: ProFormItemProps[] | undefined;
  if (tdFormItemId != null) {
    eachTree(formItems, (item) => {
      if (item.key === tdFormItemId) {
        children = item.children;
        return false;
      }
    });
  }
  return children || [];
}

/**
 * 生成用于处理表格跨行跨列的数据
 * @param tableRowFormItems 表格所有行表单项
 */
export function generateTableGrid(tableRowFormItems?: ProFormItemProps[]) {
  const tableRowItems = tableRowFormItems || [];
  const rowLength = tableRowItems.length;
  const cellLength = Math.max(
    0,
    ...tableRowItems.map((rowItem) =>
      (rowItem.children || [])
        .map((cellItem) => cellItem.props?.colspan ?? 1)
        .reduce((sum, current) => sum + current, 0)
    )
  );
  const gridData: TableGridData = Array.from({ length: rowLength }, (_, i) => ({
    itemId: tableRowItems[i].key as string,
    children: Array.from({ length: cellLength }, () => ({
      rowspan: 0,
      colspan: 0
    }))
  }));
  for (let i = 0; i < rowLength; i++) {
    const tableCellItems = tableRowItems[i].children || [];
    for (let j = 0; j < tableCellItems.length; j++) {
      const tableCellItem = tableCellItems[j];
      const cellRowspan = tableCellItem.props?.rowspan ?? 1;
      const cellColspan = tableCellItem.props?.colspan ?? 1;
      for (let gj = j; gj < cellLength; gj++) {
        const gridItem = gridData[i].children[gj];
        if (gridItem.itemId == null) {
          gridItem.itemId = tableCellItem.key as string;
          gridItem.rowspan = cellRowspan;
          gridItem.colspan = cellColspan;
          if (cellColspan > 1) {
            for (let nj = gj + 1; nj < gj + cellColspan; nj++) {
              if (nj < cellLength) {
                gridData[i].children[nj].itemId = gridItem.itemId;
                gridData[i].children[nj].rowspan = 1;
              }
            }
          }
          if (cellRowspan > 1) {
            for (let ni = i + 1; ni < i + cellRowspan; ni++) {
              if (ni < rowLength) {
                gridData[ni].children[gj].itemId = gridItem.itemId;
                gridData[ni].children[gj].colspan = 1;
              }
            }
          }
          if (cellColspan > 1 && cellRowspan > 1) {
            for (let ni = i + 1; ni < i + cellRowspan; ni++) {
              for (let nj = gj + 1; nj < gj + cellColspan; nj++) {
                if (ni < rowLength && nj < cellLength) {
                  gridData[ni].children[nj].itemId = gridItem.itemId;
                }
              }
            }
          }
          break;
        }
      }
    }
  }
  for (let i = 0; i < gridData.length; i++) {
    for (let j = 0; j < gridData[i].children.length; j++) {
      const gridItem = gridData[i].children[j];
      if (gridItem.colspan === 0 || gridItem.rowspan === 0) {
        gridItem.itemId = void 0;
      }
    }
  }
  return gridData;
}

/**
 * 表格数据拆分单元格合并
 * @param gridData 表格封装后的数据
 * @param tdFormItemId 单元格表单项 id
 */
export function splitTableGridCell(
  gridData: TableGridRow[],
  tdFormItemId: ProFormItemKey
) {
  for (let i = 0; i < gridData.length; i++) {
    for (let j = 0; j < gridData[i].children.length; j++) {
      const gridItem = gridData[i].children[j];
      if (gridItem.itemId != null && gridItem.itemId === tdFormItemId) {
        // 恢复被跨列的单元格
        if (gridItem.colspan != null && gridItem.colspan > 1) {
          for (let n = 1; n < gridItem.colspan; n++) {
            const temp = gridData[i].children[j + n];
            if (temp.oldColspan == null) {
              temp.oldColspan = temp.colspan;
            }
            temp.colspan = 1;
            temp.newColspan = temp.colspan;
          }
        }
        // 恢复被跨行的单元格
        if (gridItem.rowspan != null && gridItem.rowspan > 1) {
          for (let n = 1; n < gridItem.rowspan; n++) {
            const temp = gridData[i + n].children[j];
            if (temp.oldRowspan == null) {
              temp.oldRowspan = temp.rowspan;
            }
            temp.rowspan = 1;
            temp.newRowspan = temp.rowspan;
          }
        }
        // 恢复既被跨列又被跨行的单元格
        if (
          gridItem.colspan != null &&
          gridItem.colspan > 1 &&
          gridItem.rowspan != null &&
          gridItem.rowspan > 1
        ) {
          for (let ni = 1; ni < gridItem.rowspan; ni++) {
            for (let nj = 1; nj < gridItem.colspan; nj++) {
              const temp = gridData[i + ni].children[j + nj];
              if (temp.oldColspan == null) {
                temp.oldColspan = temp.colspan;
              }
              if (temp.oldRowspan == null) {
                temp.oldRowspan = temp.rowspan;
              }
              temp.colspan = 1;
              temp.rowspan = 1;
              temp.newColspan = temp.colspan;
              temp.newRowspan = temp.rowspan;
            }
          }
        }
        // 正常化当前单元格
        if (gridItem.oldColspan == null) {
          gridItem.oldColspan = gridItem.colspan;
        }
        if (gridItem.oldRowspan == null) {
          gridItem.oldRowspan = gridItem.rowspan;
        }
        gridItem.colspan = 1;
        gridItem.rowspan = 1;
        gridItem.newColspan = gridItem.colspan;
        gridItem.newRowspan = gridItem.rowspan;
        return;
      }
    }
  }
}

/**
 * 重新计算表格数据的跨行跨列
 * @param gridData 表格封装后的数据
 * @param precorrect 是否先纠正之前的跨行跨列
 */
export function computeTableGridSpan(
  gridData: TableGridRow[],
  precorrect?: boolean
) {
  if (precorrect) {
    for (let i = 0; i < gridData.length; i++) {
      for (let j = 0; j < gridData[i].children.length; j++) {
        const gridItem = gridData[i].children[j];
        // 修正被跨列的单元格
        if (gridItem.colspan != null && gridItem.colspan > 1) {
          for (let n = 1; n < gridItem.colspan; n++) {
            gridData[i].children[j + n].colspan = 0;
            gridData[i].children[j + n].rowspan = 1;
          }
        }
        // 修正被跨行的单元格
        if (gridItem.rowspan != null && gridItem.rowspan > 1) {
          for (let n = 1; n < gridItem.rowspan; n++) {
            gridData[i + n].children[j].colspan = 1;
            gridData[i + n].children[j].rowspan = 0;
          }
        }
        // 修正既被跨列又被跨行的单元格
        if (
          gridItem.colspan != null &&
          gridItem.colspan > 1 &&
          gridItem.rowspan != null &&
          gridItem.rowspan > 1
        ) {
          for (let ni = 1; ni < gridItem.rowspan; ni++) {
            for (let nj = 1; nj < gridItem.colspan; nj++) {
              gridData[i + ni].children[j + nj].colspan = 0;
              gridData[i + ni].children[j + nj].rowspan = 0;
            }
          }
        }
      }
    }
  }
  for (let i = 0; i < gridData.length; i++) {
    for (let j = 0; j < gridData[i].children.length; j++) {
      const gridItem = gridData[i].children[j];
      if (gridItem.colspan !== 0 && gridItem.rowspan !== 0) {
        // 重新计算跨列
        if (gridItem.oldColspan == null) {
          gridItem.oldColspan = gridItem.colspan;
        }
        gridItem.colspan = 1;
        for (let n = j + 1; n < gridData[i].children.length; n++) {
          if (gridData[i].children[n].colspan !== 0) {
            break;
          }
          gridItem.colspan++;
        }
        gridItem.newColspan = gridItem.colspan;
        // 重新计算跨行
        if (gridItem.oldRowspan == null) {
          gridItem.oldRowspan = gridItem.rowspan;
        }
        gridItem.rowspan = 1;
        for (let n = i + 1; n < gridData.length; n++) {
          if (gridData[n].children[j].rowspan !== 0) {
            break;
          }
          gridItem.rowspan++;
        }
        gridItem.newRowspan = gridItem.rowspan;
      }
    }
  }
}

/**
 * 表格数据删除所有空行
 * @param gridData 表格封装后的数据
 */
export function deleteTableGridEmptyRow(gridData: TableGridRow[]) {
  const deleteItemIds: ProFormItemKey[] = [];
  for (let i = 0; i < gridData.length; i++) {
    if (gridData[i].children.every((c) => c.colspan === 0 || c.rowspan === 0)) {
      deleteItemIds.push(gridData[i].itemId);
      gridData.splice(i, 1);
      deleteTableGridEmptyRow(gridData).forEach((itemId) => {
        deleteItemIds.push(itemId);
      });
      return deleteItemIds;
    }
  }
  return deleteItemIds;
}

/**
 * 表格数据删除所有空列
 * @param gridData 表格封装后的数据
 */
export function deleteTableGridEmptyCol(gridData: TableGridRow[]) {
  const deleteItemIds: ProFormItemKey[] = [];
  const colLength = gridData.length ? gridData[0].children.length : 0;
  for (let j = 0; j < colLength; j++) {
    let isEmptyCol = true;
    for (let i = 0; i < gridData.length; i++) {
      const c = gridData[i].children[j];
      if (!(c.colspan === 0 || c.rowspan === 0)) {
        isEmptyCol = false;
        break;
      }
    }
    if (isEmptyCol) {
      for (let i = 0; i < gridData.length; i++) {
        const itemId = gridData[i].children[j].itemId;
        if (itemId != null) {
          deleteItemIds.push(itemId);
        }
        gridData[i].children.splice(j, 1);
      }
      deleteTableGridEmptyCol(gridData).forEach((itemId) => {
        deleteItemIds.push(itemId);
      });
      return deleteItemIds;
    }
  }
  return deleteItemIds;
}

/**
 * 表格数据删除整行
 * @param gridData 表格封装后的数据
 * @param deleteRowIndex 要删除的行索引
 */
export function deleteTableGridRow(
  gridData: TableGridRow[],
  deleteRowIndex: number
) {
  const deleteItemIds: ProFormItemKey[] = [];
  gridData[deleteRowIndex].children.forEach((gridItem) => {
    if (
      gridItem.itemId != null &&
      gridItem.rowspan != null &&
      gridItem.rowspan > 1
    ) {
      splitTableGridCell(gridData, gridItem.itemId);
    }
  });
  const deletedItemId = gridData[deleteRowIndex].itemId;
  gridData.splice(deleteRowIndex, 1);
  deleteTableGridEmptyCol(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  deleteTableGridEmptyRow(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  computeTableGridSpan(gridData);
  deleteItemIds.push(deletedItemId);
  return deleteItemIds;
}

/**
 * 表格数据删除整列
 * @param gridData 表格封装后的数据
 * @param deleteColIndex 要删除的列索引
 */
export function deleteTableGridCol(
  gridData: TableGridRow[],
  deleteColIndex: number
) {
  const deleteItemIds: ProFormItemKey[] = [];
  gridData.forEach((gridRow) => {
    const gridItem = gridRow.children[deleteColIndex];
    if (
      gridItem.itemId != null &&
      gridItem.colspan != null &&
      gridItem.colspan > 1
    ) {
      splitTableGridCell(gridData, gridItem.itemId);
    }
  });
  gridData.forEach((gridRow) => {
    const gridItem = gridRow.children[deleteColIndex];
    if (gridItem.itemId != null) {
      deleteItemIds.push(gridItem.itemId);
    }
    gridRow.children.splice(deleteColIndex, 1);
  });
  deleteTableGridEmptyCol(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  deleteTableGridEmptyRow(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  computeTableGridSpan(gridData);
  return deleteItemIds;
}

/**
 * 获取表格数据添加和删除以及拆分后导致跨行跨列变化的影响
 * @param gridData 表格封装后的数据
 * @param formItems 当前的全部表单项数据
 * @param componentData 组件库数据
 */
export function getTableGridEffects(
  gridData: TableGridRow[],
  formItems?: ProFormItemProps[],
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const addItems: AddItemResult[] = [];
  const updateItems: UpdateItemResult[] = [];
  const addedKeys: string[] = [];
  gridData.forEach((gridRow) => {
    gridRow.children.forEach((gridItem, gridItemIndex) => {
      const rowspanChanged =
        gridItem.newRowspan != null &&
        gridItem.oldRowspan != null &&
        gridItem.newRowspan !== gridItem.oldRowspan;
      const colspanChanged =
        gridItem.newColspan != null &&
        gridItem.oldColspan != null &&
        gridItem.newColspan !== gridItem.oldColspan;
      // 拆分时添加新填充数据
      if (
        (rowspanChanged || colspanChanged) &&
        gridItem.itemId == null &&
        gridItem.newRowspan !== 0 &&
        gridItem.newColspan !== 0
      ) {
        const tdKey = generateUniqueItemKey(formItems, addedKeys);
        addedKeys.push(tdKey);
        const childTd = generateChildFormItem(
          'tableRow',
          void 0,
          tdKey,
          componentData
        );
        const index = gridRow.children.filter(
          (cell, i) =>
            i < gridItemIndex && cell.colspan !== 0 && cell.rowspan !== 0
        ).length;
        addItems.push({ item: childTd, parentItemId: gridRow.itemId, index });
      }
      // 修改原来数据的跨行
      if (gridItem.itemId != null && rowspanChanged) {
        updateItems.push({
          itemId: gridItem.itemId,
          field: 'props.rowspan',
          value: gridItem.newRowspan
        });
      }
      // 修改原来数据的跨列
      if (gridItem.itemId != null && colspanChanged) {
        updateItems.push({
          itemId: gridItem.itemId,
          field: 'props.colspan',
          value: gridItem.newColspan
        });
      }
    });
  });
  return { addItems, updateItems, deleteItemIds: [] };
}

/**
 * 添加表格行时获取插入的位置索引
 * @param gridData 表格封装后的数据
 * @param tdFormItem 指定位置对应的单元格表单项
 * @param position 指定位置的上方或下方添加, 默认下方
 */
export function getTableRowInsertIndex(
  gridData: TableGridRow[],
  tdFormItem?: ProFormItemProps,
  position?: -1
) {
  const defaultIndex = position === -1 ? 0 : gridData.length;
  if (!tdFormItem) {
    return { insertIndex: defaultIndex };
  }
  for (let i = 0; i < gridData.length; i++) {
    for (let j = 0; j < gridData[i].children.length; j++) {
      const gridItem = gridData[i].children[j];
      if (gridItem.itemId != null && gridItem.itemId === tdFormItem.key) {
        if (position === -1) {
          return {
            trFormItemIndex: i,
            insertIndex: i,
            tdFormItemIndex: j
          };
        }
        return {
          trFormItemIndex: i,
          insertIndex: i + gridItem.rowspan,
          tdFormItemIndex: j
        };
      }
    }
  }
  return { insertIndex: defaultIndex };
}

/**
 * 添加表格列时获取插入的位置索引
 * @param gridData 表格封装后的数据
 * @param tdFormItem 指定位置对应的单元格表单项
 * @param position 指定位置的左侧或右侧添加, 默认右侧
 */
export function getTableColInsertIndex(
  gridData: TableGridRow[],
  tdFormItem?: ProFormItemProps,
  position?: -1
) {
  const defaultIndex = position === -1 ? 0 : gridData[0]?.children?.length || 0;
  if (!tdFormItem) {
    return { insertIndex: defaultIndex };
  }
  for (let i = 0; i < gridData.length; i++) {
    for (let j = 0; j < gridData[i].children.length; j++) {
      const gridItem = gridData[i].children[j];
      if (gridItem.itemId != null && gridItem.itemId === tdFormItem.key) {
        if (position === -1) {
          return {
            tdFormItemIndex: j,
            insertIndex: j,
            trFormItemIndex: i
          };
        }
        return {
          tdFormItemIndex: j,
          insertIndex: j + gridItem.colspan,
          trFormItemIndex: i
        };
      }
    }
  }
  return { insertIndex: defaultIndex };
}

/**
 * 表格添加行时生成需要的数据
 * @param tableFormItem 表格表单项
 * @param formItems 当前的全部表单项数据
 * @param tdFormItem 指定位置对应的单元格表单项
 * @param position 指定位置的上方或下方添加, 默认下方
 * @param componentData 组件库数据
 */
export function generateAddTableRowData(
  tableFormItem: ProFormItemProps,
  formItems?: ProFormItemProps[],
  tdFormItem?: ProFormItemProps,
  position?: -1,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const addItems: AddItemResult[] = [];
  const trKey = generateUniqueItemKey(formItems);
  const addedKeys = [trKey];
  const childTr = generateChildFormItem(
    tableFormItem.type,
    void 0,
    trKey,
    componentData
  );
  const gridData = generateTableGrid(tableFormItem.children);
  const { trFormItemIndex, insertIndex } = getTableRowInsertIndex(
    gridData,
    tdFormItem,
    position
  );
  const trGridRowChilds: TableGridItem[] = (gridData.length
    ? gridData[trFormItemIndex ?? gridData.length - 1]?.children
    : void 0) || [{ rowspan: 1, colspan: 1 }];
  gridData.splice(insertIndex, 0, {
    itemId: trKey,
    children: trGridRowChilds.map(() => ({ colspan: 1, rowspan: 1 }))
  });
  computeTableGridSpan(gridData, true);
  gridData[insertIndex].children.forEach((gridItem) => {
    if (gridItem.rowspan !== 0 && gridItem.colspan !== 0) {
      const tdKey = generateUniqueItemKey(formItems, addedKeys);
      addedKeys.push(tdKey);
      const childTd = generateChildFormItem(
        'tableRow',
        void 0,
        tdKey,
        componentData
      );
      if (childTr.children) {
        childTr.children.push(childTd);
        if (!gridData) {
          childTr.children.push(generateChildFormItem('form15737'));
        }
      } else {
        childTr.children = [childTd];
      }
    }
  });
  addItems.push({
    item: childTr,
    parentItemId: tableFormItem.key as string,
    index: insertIndex
  });
  const updateItems = getTableGridEffects(
    gridData,
    void 0,
    componentData
  ).updateItems;
  return { addItems, updateItems, deleteItemIds: [] };
}

/**
 * 表格添加列时生成需要的数据
 * @param tableFormItem 表格表单项
 * @param formItems 当前的全部表单项数据
 * @param tdFormItem 指定位置对应的单元格表单项
 * @param position 指定位置的左侧或右侧添加, 默认右侧
 * @param componentData 组件库数据
 */
export function generateAddTableColData(
  tableFormItem: ProFormItemProps,
  formItems?: ProFormItemProps[],
  tdFormItem?: ProFormItemProps,
  position?: -1,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const addItems: AddItemResult[] = [];
  if (!tableFormItem.children?.length) {
    return generateAddTableRowData(
      tableFormItem,
      formItems,
      tdFormItem,
      position,
      componentData
    );
  }
  const gridData = generateTableGrid(tableFormItem.children);
  const { insertIndex } = getTableColInsertIndex(
    gridData,
    tdFormItem,
    position
  );
  const addedKeys: string[] = [];
  gridData.forEach((gridRow) => {
    gridRow.children.splice(insertIndex, 0, { rowspan: 1, colspan: 1 });
  });
  computeTableGridSpan(gridData, true);
  gridData.forEach((gridRow) => {
    const gridItem = gridRow.children[insertIndex];
    if (gridItem.rowspan !== 0 && gridItem.colspan !== 0) {
      const tdKey = generateUniqueItemKey(formItems, addedKeys);
      addedKeys.push(tdKey);
      const childTd = generateChildFormItem(
        'tableRow',
        void 0,
        tdKey,
        componentData
      );
      const index = gridRow.children.filter(
        (cell, i) => i < insertIndex && cell.colspan !== 0 && cell.rowspan !== 0
      ).length;
      addItems.push({ item: childTd, parentItemId: gridRow.itemId, index });
    }
  });
  const updateItems = getTableGridEffects(
    gridData,
    void 0,
    componentData
  ).updateItems;
  return { addItems, updateItems, deleteItemIds: [] };
}

/**
 * 获取表格拆分单元格的影响数据
 * @param tableFormItem 表格表单项
 * @param formItems 当前的全部表单项数据
 * @param tdFormItem 单元格表单项
 * @param componentData 组件库数据
 */
export function getTableSplitEffects(
  tableFormItem: ProFormItemProps,
  formItems: ProFormItemProps[] | undefined,
  tdFormItem: ProFormItemProps,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const gridData = generateTableGrid(tableFormItem.children);
  splitTableGridCell(gridData, tdFormItem.key as string);
  return getTableGridEffects(gridData, formItems, componentData);
}

/**
 * 获取表格删除整行的影响数据
 * @param tableFormItem 表格表单项
 * @param formItems 当前的全部表单项数据
 * @param deleteRowIndex 要删除的行索引
 * @param componentData 组件库数据
 */
export function getTableDeleteRowEffects(
  tableFormItem: ProFormItemProps,
  formItems: ProFormItemProps[] | undefined,
  deleteRowIndex: number,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const gridData = generateTableGrid(tableFormItem.children);
  if (!gridData.length || gridData.length === 1) {
    return {
      addItems: [],
      updateItems: [],
      deleteItemIds: [tableFormItem.key as string]
    };
  }
  const deleteItemIds = deleteTableGridRow(gridData, deleteRowIndex);
  const result = getTableGridEffects(gridData, formItems, componentData);
  result.deleteItemIds = deleteItemIds;
  return result;
}

/**
 * 获取表格删除整列的影响数据
 * @param tableFormItem 表格表单项
 * @param formItems 当前的全部表单项数据
 * @param tdFormItem 要删除所在列的单元格表单项
 * @param componentData 组件库数据
 */
export function getTableDeleteColEffects(
  tableFormItem: ProFormItemProps,
  formItems: ProFormItemProps[] | undefined,
  tdFormItem: ProFormItemProps,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const gridData = generateTableGrid(tableFormItem.children);
  if (
    !gridData.length ||
    !gridData[0].children.length ||
    gridData[0].children.length === 1
  ) {
    return {
      addItems: [],
      updateItems: [],
      deleteItemIds: [tableFormItem.key as string]
    };
  }
  const deleteColIndex = getTableColInsertIndex(
    gridData,
    tdFormItem
  ).tdFormItemIndex;
  if (deleteColIndex == null) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const deleteItemIds = deleteTableGridCol(gridData, deleteColIndex);
  const result = getTableGridEffects(gridData, formItems, componentData);
  result.deleteItemIds = deleteItemIds;
  return result;
}

/**
 * 获取表格合并右侧的影响数据
 * @param tableFormItem 表格表单项
 * @param formItems 当前的全部表单项数据
 * @param tdFormItem 单元格表单项
 * @param componentData 组件库数据
 */
export function getTableMergeRightEffects(
  tableFormItem: ProFormItemProps,
  formItems: ProFormItemProps[] | undefined,
  tdFormItem: ProFormItemProps,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const gridData = generateTableGrid(tableFormItem.children);
  const { tdFormItemIndex, insertIndex, trFormItemIndex } =
    getTableColInsertIndex(gridData, tdFormItem);
  if (
    tdFormItemIndex == null ||
    trFormItemIndex == null ||
    insertIndex === tdFormItemIndex
  ) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const gridItem = gridData[trFormItemIndex]?.children?.[tdFormItemIndex];
  const targetGridItem = gridData[trFormItemIndex]?.children?.[insertIndex];
  if (
    !gridItem ||
    !targetGridItem ||
    gridItem.rowspan !== targetGridItem.rowspan
  ) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const deleteItemIds: ProFormItemKey[] = [];
  const targetChildren = getTableCellContents(targetGridItem.itemId, formItems);
  gridItem.oldColspan = gridItem.colspan;
  gridItem.colspan += targetGridItem.colspan;
  gridItem.newColspan = gridItem.colspan;
  targetGridItem.oldColspan = targetGridItem.colspan;
  targetGridItem.colspan = 0;
  targetGridItem.newColspan = targetGridItem.colspan;
  if (targetGridItem.itemId != null) {
    deleteItemIds.push(targetGridItem.itemId);
    targetGridItem.itemId = void 0;
  }
  deleteTableGridEmptyCol(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  deleteTableGridEmptyRow(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  computeTableGridSpan(gridData);
  const result = getTableGridEffects(gridData, formItems, componentData);
  result.deleteItemIds = deleteItemIds;
  targetChildren.forEach((child) => {
    result.addItems.push({
      item: child,
      parentItemId: gridItem.itemId as string
    });
  });
  return result;
}

/**
 * 获取表格合并下方的影响数据
 * @param tableFormItem 表格表单项
 * @param formItems 当前的全部表单项数据
 * @param tdFormItem 单元格表单项
 * @param componentData 组件库数据
 */
export function getTableMergeBelowEffects(
  tableFormItem: ProFormItemProps,
  formItems: ProFormItemProps[] | undefined,
  tdFormItem: ProFormItemProps,
  componentData?: ComponentGroup[]
): UpdateItemsResult {
  const gridData = generateTableGrid(tableFormItem.children);
  const { tdFormItemIndex, insertIndex, trFormItemIndex } =
    getTableRowInsertIndex(gridData, tdFormItem);
  if (
    tdFormItemIndex == null ||
    trFormItemIndex == null ||
    insertIndex === trFormItemIndex
  ) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const gridItem = gridData[trFormItemIndex]?.children?.[tdFormItemIndex];
  const targetGridItem = gridData[insertIndex]?.children?.[tdFormItemIndex];
  if (
    !gridItem ||
    !targetGridItem ||
    gridItem.colspan !== targetGridItem.colspan
  ) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const deleteItemIds: ProFormItemKey[] = [];
  const targetChildren = getTableCellContents(targetGridItem.itemId, formItems);
  gridItem.oldRowspan = gridItem.rowspan;
  gridItem.rowspan += targetGridItem.rowspan;
  gridItem.newRowspan = gridItem.rowspan;
  targetGridItem.oldRowspan = targetGridItem.rowspan;
  targetGridItem.rowspan = 0;
  targetGridItem.newRowspan = targetGridItem.rowspan;
  if (targetGridItem.itemId != null) {
    deleteItemIds.push(targetGridItem.itemId);
    targetGridItem.itemId = void 0;
  }
  deleteTableGridEmptyCol(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  deleteTableGridEmptyRow(gridData).forEach((itemId) => {
    deleteItemIds.push(itemId);
  });
  computeTableGridSpan(gridData);
  const result = getTableGridEffects(gridData, formItems, componentData);
  result.deleteItemIds = deleteItemIds;
  targetChildren.forEach((child) => {
    result.addItems.push({
      item: child,
      parentItemId: gridItem.itemId as string
    });
  });
  return result;
}

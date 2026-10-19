import { eachTree } from "../../utils/common";
import { generateUniqueItemKey, generateChildFormItem } from "./build-core";
function getTableFormItemByTd(tdFormItemId, formItems) {
  let tableFormItem;
  let tdFormItem;
  let trItemIndex;
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
function getTableCellContents(tdFormItemId, formItems) {
  let children;
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
function generateTableGrid(tableRowFormItems) {
  const tableRowItems = tableRowFormItems || [];
  const rowLength = tableRowItems.length;
  const cellLength = Math.max(
    0,
    ...tableRowItems.map(
      (rowItem) => (rowItem.children || []).map((cellItem) => cellItem.props?.colspan ?? 1).reduce((sum, current) => sum + current, 0)
    )
  );
  const gridData = Array.from({ length: rowLength }, (_, i) => ({
    itemId: tableRowItems[i].key,
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
          gridItem.itemId = tableCellItem.key;
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
function splitTableGridCell(gridData, tdFormItemId) {
  for (let i = 0; i < gridData.length; i++) {
    for (let j = 0; j < gridData[i].children.length; j++) {
      const gridItem = gridData[i].children[j];
      if (gridItem.itemId != null && gridItem.itemId === tdFormItemId) {
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
        if (gridItem.colspan != null && gridItem.colspan > 1 && gridItem.rowspan != null && gridItem.rowspan > 1) {
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
function computeTableGridSpan(gridData, precorrect) {
  if (precorrect) {
    for (let i = 0; i < gridData.length; i++) {
      for (let j = 0; j < gridData[i].children.length; j++) {
        const gridItem = gridData[i].children[j];
        if (gridItem.colspan != null && gridItem.colspan > 1) {
          for (let n = 1; n < gridItem.colspan; n++) {
            gridData[i].children[j + n].colspan = 0;
            gridData[i].children[j + n].rowspan = 1;
          }
        }
        if (gridItem.rowspan != null && gridItem.rowspan > 1) {
          for (let n = 1; n < gridItem.rowspan; n++) {
            gridData[i + n].children[j].colspan = 1;
            gridData[i + n].children[j].rowspan = 0;
          }
        }
        if (gridItem.colspan != null && gridItem.colspan > 1 && gridItem.rowspan != null && gridItem.rowspan > 1) {
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
function deleteTableGridEmptyRow(gridData) {
  const deleteItemIds = [];
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
function deleteTableGridEmptyCol(gridData) {
  const deleteItemIds = [];
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
function deleteTableGridRow(gridData, deleteRowIndex) {
  const deleteItemIds = [];
  gridData[deleteRowIndex].children.forEach((gridItem) => {
    if (gridItem.itemId != null && gridItem.rowspan != null && gridItem.rowspan > 1) {
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
function deleteTableGridCol(gridData, deleteColIndex) {
  const deleteItemIds = [];
  gridData.forEach((gridRow) => {
    const gridItem = gridRow.children[deleteColIndex];
    if (gridItem.itemId != null && gridItem.colspan != null && gridItem.colspan > 1) {
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
function getTableGridEffects(gridData, formItems, componentData) {
  const addItems = [];
  const updateItems = [];
  const addedKeys = [];
  gridData.forEach((gridRow) => {
    gridRow.children.forEach((gridItem, gridItemIndex) => {
      const rowspanChanged = gridItem.newRowspan != null && gridItem.oldRowspan != null && gridItem.newRowspan !== gridItem.oldRowspan;
      const colspanChanged = gridItem.newColspan != null && gridItem.oldColspan != null && gridItem.newColspan !== gridItem.oldColspan;
      if ((rowspanChanged || colspanChanged) && gridItem.itemId == null && gridItem.newRowspan !== 0 && gridItem.newColspan !== 0) {
        const tdKey = generateUniqueItemKey(formItems, addedKeys);
        addedKeys.push(tdKey);
        const childTd = generateChildFormItem(
          "tableRow",
          void 0,
          tdKey,
          componentData
        );
        const index = gridRow.children.filter(
          (cell, i) => i < gridItemIndex && cell.colspan !== 0 && cell.rowspan !== 0
        ).length;
        addItems.push({ item: childTd, parentItemId: gridRow.itemId, index });
      }
      if (gridItem.itemId != null && rowspanChanged) {
        updateItems.push({
          itemId: gridItem.itemId,
          field: "props.rowspan",
          value: gridItem.newRowspan
        });
      }
      if (gridItem.itemId != null && colspanChanged) {
        updateItems.push({
          itemId: gridItem.itemId,
          field: "props.colspan",
          value: gridItem.newColspan
        });
      }
    });
  });
  return { addItems, updateItems, deleteItemIds: [] };
}
function getTableRowInsertIndex(gridData, tdFormItem, position) {
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
function getTableColInsertIndex(gridData, tdFormItem, position) {
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
function generateAddTableRowData(tableFormItem, formItems, tdFormItem, position, componentData) {
  const addItems = [];
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
  const trGridRowChilds = (gridData.length ? gridData[trFormItemIndex ?? gridData.length - 1]?.children : void 0) || [{ rowspan: 1, colspan: 1 }];
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
        "tableRow",
        void 0,
        tdKey,
        componentData
      );
      if (childTr.children) {
        childTr.children.push(childTd);
        if (!gridData) {
          childTr.children.push(generateChildFormItem("form15737"));
        }
      } else {
        childTr.children = [childTd];
      }
    }
  });
  addItems.push({
    item: childTr,
    parentItemId: tableFormItem.key,
    index: insertIndex
  });
  const updateItems = getTableGridEffects(
    gridData,
    void 0,
    componentData
  ).updateItems;
  return { addItems, updateItems, deleteItemIds: [] };
}
function generateAddTableColData(tableFormItem, formItems, tdFormItem, position, componentData) {
  const addItems = [];
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
  const addedKeys = [];
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
        "tableRow",
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
function getTableSplitEffects(tableFormItem, formItems, tdFormItem, componentData) {
  const gridData = generateTableGrid(tableFormItem.children);
  splitTableGridCell(gridData, tdFormItem.key);
  return getTableGridEffects(gridData, formItems, componentData);
}
function getTableDeleteRowEffects(tableFormItem, formItems, deleteRowIndex, componentData) {
  const gridData = generateTableGrid(tableFormItem.children);
  if (!gridData.length || gridData.length === 1) {
    return {
      addItems: [],
      updateItems: [],
      deleteItemIds: [tableFormItem.key]
    };
  }
  const deleteItemIds = deleteTableGridRow(gridData, deleteRowIndex);
  const result = getTableGridEffects(gridData, formItems, componentData);
  result.deleteItemIds = deleteItemIds;
  return result;
}
function getTableDeleteColEffects(tableFormItem, formItems, tdFormItem, componentData) {
  const gridData = generateTableGrid(tableFormItem.children);
  if (!gridData.length || !gridData[0].children.length || gridData[0].children.length === 1) {
    return {
      addItems: [],
      updateItems: [],
      deleteItemIds: [tableFormItem.key]
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
function getTableMergeRightEffects(tableFormItem, formItems, tdFormItem, componentData) {
  const gridData = generateTableGrid(tableFormItem.children);
  const { tdFormItemIndex, insertIndex, trFormItemIndex } = getTableColInsertIndex(gridData, tdFormItem);
  if (tdFormItemIndex == null || trFormItemIndex == null || insertIndex === tdFormItemIndex) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const gridItem = gridData[trFormItemIndex]?.children?.[tdFormItemIndex];
  const targetGridItem = gridData[trFormItemIndex]?.children?.[insertIndex];
  if (!gridItem || !targetGridItem || gridItem.rowspan !== targetGridItem.rowspan) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const deleteItemIds = [];
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
      parentItemId: gridItem.itemId
    });
  });
  return result;
}
function getTableMergeBelowEffects(tableFormItem, formItems, tdFormItem, componentData) {
  const gridData = generateTableGrid(tableFormItem.children);
  const { tdFormItemIndex, insertIndex, trFormItemIndex } = getTableRowInsertIndex(gridData, tdFormItem);
  if (tdFormItemIndex == null || trFormItemIndex == null || insertIndex === trFormItemIndex) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const gridItem = gridData[trFormItemIndex]?.children?.[tdFormItemIndex];
  const targetGridItem = gridData[insertIndex]?.children?.[tdFormItemIndex];
  if (!gridItem || !targetGridItem || gridItem.colspan !== targetGridItem.colspan) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const deleteItemIds = [];
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
      parentItemId: gridItem.itemId
    });
  });
  return result;
}
export {
  computeTableGridSpan,
  deleteTableGridCol,
  deleteTableGridEmptyCol,
  deleteTableGridEmptyRow,
  deleteTableGridRow,
  generateAddTableColData,
  generateAddTableRowData,
  generateTableGrid,
  getTableCellContents,
  getTableColInsertIndex,
  getTableDeleteColEffects,
  getTableDeleteRowEffects,
  getTableFormItemByTd,
  getTableGridEffects,
  getTableMergeBelowEffects,
  getTableMergeRightEffects,
  getTableRowInsertIndex,
  getTableSplitEffects,
  splitTableGridCell
};

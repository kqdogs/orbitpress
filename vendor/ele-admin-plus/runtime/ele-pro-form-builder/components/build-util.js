import { eachTree } from "../../utils/common";
import { generateChildFormItem, generateUniqueItemKey, deepCloneObject } from "./build-core";
import { generateAddTableColData, generateAddTableRowData } from "./table-util";
function generateAddChildData(triggerItem, triggerParent, triggerItemIndex, actionType, formItems, position, componentData) {
  if (!triggerItem.type) {
    return { addItems: [], updateItems: [], deleteItemIds: [] };
  }
  const parentItemId = triggerParent?.key;
  const afterIndex = triggerItemIndex == null ? void 0 : triggerItemIndex + 1;
  if ([
    "tabPane",
    "collapseItem",
    "col",
    "carouselItem",
    "descriptionsItem"
  ].includes(triggerItem.type)) {
    const item = generateChildFormItem(
      {
        tabPane: "tabs",
        collapseItem: "collapse",
        col: "row",
        carouselItem: "carousel",
        descriptionsItem: "descriptions"
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
  if (triggerItem.type === "tableCell") {
    const result = {
      addItems: [],
      updateItems: [],
      deleteItemIds: []
    };
    eachTree(formItems, (trItem, _trIndex, tableItem) => {
      if (triggerParent && trItem.key === triggerParent.key && tableItem) {
        const { addItems, updateItems, deleteItemIds } = (actionType === "addTableCol" ? generateAddTableColData : generateAddTableRowData)(tableItem, formItems, triggerItem, position, componentData);
        result.addItems = addItems;
        result.updateItems = updateItems;
        result.deleteItemIds = deleteItemIds;
        return false;
      }
    });
    return result;
  }
  if (triggerItem.type === "table") {
    return (actionType === "addTableCol" ? generateAddTableColData : generateAddTableRowData)(triggerItem, formItems, void 0, void 0, componentData);
  }
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
function itemsGenerateNewKey(items, formItems, overwriteProp) {
  if (!items) {
    return;
  }
  const addedKeys = [];
  eachTree(Array.isArray(items) ? items : [items], (item) => {
    const itemKey = generateUniqueItemKey(formItems, addedKeys);
    addedKeys.push(itemKey);
    item.key = itemKey;
    if (overwriteProp) {
      item.prop = itemKey;
    }
  });
}
function generateCopyItemData(formItemId, formItems) {
  const result = {
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
export {
  generateAddChildData,
  generateCopyItemData,
  itemsGenerateNewKey
};

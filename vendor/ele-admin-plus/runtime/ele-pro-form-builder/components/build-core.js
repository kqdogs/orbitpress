import { uuid, findTree } from "../../utils/common";
import { isContainerType, mergeValue } from "../../ele-pro-form/util";
import { getItemTypeData } from "../../ele-pro-form/components/render-util";
const fixedChildTypes = [
  { type: "tabs", childType: "tabPane" },
  { type: "collapse", childType: "collapseItem" },
  { type: "row", childType: "col" },
  { type: "carousel", childType: "carouselItem" },
  { type: "descriptions", childType: "descriptionsItem" },
  { type: "table", childType: "tableRow" },
  { type: "tableRow", childType: "tableCell" }
];
function generateItemKey() {
  return `f${uuid(15, 36).toLowerCase()}`;
}
function generateUniqueItemKey(items, keys) {
  let itemKey = generateItemKey();
  const flag = true;
  while (flag) {
    if (!findTree(items, (d) => d.key === itemKey) && (!keys || !keys.includes(itemKey))) {
      break;
    }
    itemKey = generateItemKey();
  }
  return itemKey;
}
function getComponentItemByType(type, componentData) {
  if (!type || !componentData) {
    return;
  }
  return componentData.map((groupItem) => groupItem.items).flat().find((item) => item.type === type);
}
function deepCloneObject(data, excludeUndefined) {
  if (!data) {
    return {};
  }
  const result = JSON.parse(JSON.stringify(data));
  if (!excludeUndefined) {
    const keys = Object.keys(data);
    const resultKeys = Object.keys(result);
    keys.forEach((key) => {
      if (!resultKeys.includes(key)) {
        result[key] = void 0;
      }
    });
  }
  return result;
}
function generateChildFormItem(parentType, childNo, childKey, componentData) {
  let child;
  if (parentType) {
    const fc = fixedChildTypes.find((d) => d.type === parentType);
    if (fc) {
      child = { prop: "", type: fc.childType };
    }
  }
  if (!child) {
    child = { prop: "", type: "div" };
  }
  if (childKey) {
    child.key = childKey;
    child.prop = childKey;
  }
  const componentItem = getComponentItemByType(child.type, componentData);
  const initialProps = componentItem?.initialProps ? deepCloneObject(componentItem.initialProps) : void 0;
  if (initialProps) {
    child.props = initialProps;
  }
  if (childNo && child.type) {
    if (child.type === "collapseItem") {
      if (child.props?.title) {
        child.props.title = child.props.title + childNo;
      }
    } else if (["descriptionsItem", "tabPane"].includes(child.type)) {
      if (child.props?.label) {
        child.props.label = child.props.label + childNo;
      }
    } else if (child.label) {
      child.label = child.label + childNo;
    }
  }
  return child;
}
function generateBuildFormItem(type, formItems, componentData, itemTypeData) {
  const componentItem = getComponentItemByType(type, componentData);
  if (!componentItem) {
    return;
  }
  const itemKey = generateUniqueItemKey(formItems);
  const addedKeys = [itemKey];
  const item = {
    key: itemKey,
    prop: itemKey,
    label: componentItem.name,
    type: componentItem.type,
    required: false,
    ...componentItem.initialData || {},
    props: componentItem.initialProps ? deepCloneObject(componentItem.initialProps) : void 0
  };
  const typeData = getItemTypeData(item, itemTypeData);
  if (!item.type || item.type === "div" || isContainerType(item, itemTypeData) && !typeData?.renderLabelText) {
    item.label = "";
  }
  if (item.type === "table") {
    item.label = "";
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
  } else if (item.type === "steps") {
    item.label = "";
    if (!item.props) {
      item.props = {};
    }
    item.props.items = Array.from({ length: 3 }).map((_, i) => {
      const childNo = String(i + 1).padStart(2, "0");
      return {
        title: `步骤${childNo}`,
        description: `步骤${childNo}的描述内容`
      };
    });
  } else if (item.type && fixedChildTypes.some((d) => d.type === item.type)) {
    item.label = "";
    item.children = Array.from({
      length: item.type === "carousel" ? 3 : 2
    }).map((_, i) => {
      const childKey = generateUniqueItemKey(formItems, addedKeys);
      addedKeys.push(childKey);
      const childNo = String(i + 1).padStart(2, "0");
      return generateChildFormItem(item.type, childNo, childKey, componentData);
    });
  }
  return item;
}
function getFormDataAndItems(item, componentData) {
  const data = item ? deepCloneObject(item) : item;
  if (!data) {
    return { data: {}, items: [] };
  }
  const componentItem = getComponentItemByType(data.type, componentData);
  return {
    data: mergeValue(
      {},
      { props: componentItem?.presetProps || {} },
      { props: componentItem?.defaultProps || {} },
      data
    ),
    items: componentItem?.configForm || []
  };
}
function getPropertyPath(data, excludeKeys, prefix) {
  const keys = [];
  if (data != null) {
    if (Array.isArray(data)) {
      data.forEach((v, i) => {
        const path = prefix ? `${prefix}[${i}]` : String(i);
        if (v != null && typeof v === "object") {
          getPropertyPath(v, excludeKeys, path).forEach((k) => {
            keys.push(k);
          });
        } else {
          keys.push(path);
        }
      });
    } else if (typeof data === "object") {
      Object.keys(data).forEach((key) => {
        if (!excludeKeys || !excludeKeys.includes(key)) {
          const path = prefix ? `${prefix}.${key}` : key;
          const v = data[key];
          if (v != null && typeof v === "object") {
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
export {
  deepCloneObject,
  fixedChildTypes,
  generateBuildFormItem,
  generateChildFormItem,
  generateItemKey,
  generateUniqueItemKey,
  getComponentItemByType,
  getFormDataAndItems,
  getPropertyPath
};

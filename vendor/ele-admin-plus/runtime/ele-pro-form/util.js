import { eachTree } from "../utils/common";
import { getItemTypeData, setValue, getValue } from "./components/render-util";
import { ChildrenRender, cloneDeep, getValue as getValue2, mergeValue, setValue as setValue2 } from "./components/render-util";
import { sortableGroupName } from "./components/render-core";
function isContainerType(item, itemTypeData) {
  const typeData = getItemTypeData(item, itemTypeData);
  return typeData?.isContainer || item.itemType === "container" || item.itemType === "view";
}
function getFormInitValue(items, itemTypeData, excludeUndefined) {
  const init = {};
  eachTree(items, (item) => {
    if (item.initValue != null && item.initValue !== "" && item.prop) {
      setValue(init, item.prop, item.initValue);
      return;
    }
    if (item.type && item.prop) {
      if ("tabs" === item.type) {
        const active = item.props?.modelValue ?? item.children?.[0]?.prop;
        setValue(init, item.prop, active);
        return;
      }
      if ("collapse" === item.type) {
        const active = item.props?.modelValue ?? (item.props?.accordion ? item.children?.[0]?.props?.name ?? item.children?.[0]?.prop : []);
        setValue(init, item.prop, active);
        return;
      }
      if ("sliderRange" === item.type) {
        setValue(init, item.prop, [
          item.props?.min ?? 0,
          item.props?.max ?? 100
        ]);
        return;
      }
    }
    if (excludeUndefined || isContainerType(item, itemTypeData) || !item.prop || typeof getValue(init, item.prop) !== "undefined") {
      return;
    }
    setValue(init, item.prop, void 0);
  });
  return init;
}
export {
  ChildrenRender,
  cloneDeep,
  getFormInitValue,
  getValue2 as getValue,
  isContainerType,
  mergeValue,
  setValue2 as setValue,
  sortableGroupName
};

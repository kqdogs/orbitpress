import { unref, computed } from "vue";
import { mapTree, findTree, eachTree, getValue } from "../utils/common";
import { getValue as getValue2 } from "../utils/common";
import { useComponentEvents } from "../utils/hook";
import { useLayoutState } from "../ele-pro-layout/util";
import { elDataTableEmits } from "./props";
function getRowClass(rowClass, param) {
  if (rowClass != null) {
    if (typeof rowClass === "function") {
      return rowClass(param);
    } else if (typeof rowClass === "string" && rowClass) {
      return rowClass;
    }
  }
}
function getBodyRowClass(rowClass, param) {
  const classes = ["ele-table-tr"];
  const custom = getRowClass(rowClass, param);
  if (custom != null) {
    classes.push(custom);
  }
  return classes.join(" ");
}
function getHeadRowClass(rowClass, param, ellipsis) {
  const classes = ["ele-table-head-tr"];
  if (ellipsis) {
    classes.push("is-ellipsis");
  }
  const custom = getRowClass(rowClass, param);
  if (custom != null) {
    classes.push(custom);
  }
  return classes.join(" ");
}
function getGlobalTooltipProps(showOverflowTooltip, tooltipEffect, tooltipOptions) {
  if (!showOverflowTooltip) {
    return false;
  }
  return {
    effect: tooltipEffect,
    ...tooltipOptions || {},
    ...showOverflowTooltip === true ? {} : showOverflowTooltip
  };
}
function mergeTooltipProps(props, globalProps) {
  if (props === false || props == null && !globalProps) {
    return false;
  }
  return {
    ...!globalProps || globalProps === true ? {} : globalProps,
    ...!props || props === true ? {} : props
  };
}
function getTooltipProps(props, globalProps) {
  const opt = mergeTooltipProps(props, globalProps);
  if (!opt) {
    return false;
  }
  const classes = ["ele-popper", "ele-tooltip", "ele-table-tooltip"];
  if (opt.popperClass) {
    classes.push(opt.popperClass);
  }
  opt.popperClass = classes.join(" ");
  return opt;
}
function toggleRowSelectionPro(tableRef, row, selected) {
  if (tableRef == null) {
    return;
  }
  const store = unref(tableRef)?.store;
  const selection = unref(store?.states?.selection);
  const index = selection.indexOf(row);
  const included = index !== -1;
  if (selected && !included) {
    selection.push(row);
  } else if (!selected && included) {
    selection.splice(index, 1);
  }
  store.updateAllSelected();
}
function getTableFilter(tableRef) {
  const states = unref(tableRef)?.store?.states;
  const columns = unref(states?.columns);
  const filters = unref(states?.filters);
  if (!filters || !columns) {
    return;
  }
  const keys = Object.keys(filters);
  const filter = {};
  columns.forEach((col) => {
    if (keys.includes(col.id)) {
      filter[col.columnKey || col.id] = filters[col.id];
    }
  });
  return filter;
}
function getStateCols(cols, sorter, filter) {
  if (!sorter && !filter) {
    return { cols };
  }
  const filterKeys = filter == null ? [] : Object.keys(filter);
  const hasSorter = sorter != null && sorter.prop != null && sorter.prop != "";
  let hasSortCol = false;
  const result = mapTree(cols, (col) => {
    if (hasSorter && col.prop === sorter.prop) {
      hasSortCol = true;
    }
    const filterProp = col.columnKey ?? col.prop;
    const flag = filterProp ? filterKeys.includes(filterProp) : false;
    const filtered = flag && filter ? filter[filterProp] : void 0;
    return { ...col, filteredValue: filtered ?? col.filteredValue };
  });
  return { cols: result, sorter: hasSorter && hasSortCol ? sorter : void 0 };
}
function getSelectableFunction(columns) {
  const col = findTree(columns, (c) => c.type === "selection");
  if (col != null) {
    return typeof col.selectable === "function" ? col.selectable : null;
  }
}
function isDisableRow(row, index, columns) {
  const selectable = getSelectableFunction(columns);
  if (typeof selectable === "undefined") {
    return true;
  }
  return !(selectable == null || selectable(row, index) === true);
}
function isReserveChecked(columns) {
  let isReserve = false;
  eachTree(columns, (col) => {
    if (col.type === "selection") {
      isReserve = !!col.reserveSelection;
      return false;
    }
  });
  return isReserve;
}
function getColFixedNumber(fixed) {
  if (fixed === true || fixed === "left") {
    return 0;
  }
  if (fixed === "right") {
    return 2;
  }
  return 1;
}
function getCellClass(col) {
  const classes = [];
  if (col.type === "index") {
    classes.push("is-index");
  }
  if (col.className) {
    classes.push(col.className);
  }
  return classes.length ? classes.join(" ") : void 0;
}
function getFilterPopperClass(filterClassName) {
  const classes = ["ele-table-filter-popper"];
  if (filterClassName) {
    classes.push(filterClassName);
  }
  return classes.join(" ");
}
function getRowKeys(rows, rowKey) {
  const keys = [];
  if (rows) {
    rows.forEach((row) => {
      const key = getValue(row, rowKey);
      if (key != null) {
        keys.push(key);
      }
    });
  }
  return keys;
}
function getRowByKey(key, data, rowKey, childrenField) {
  return findTree(data, (d) => getValue(d, rowKey) === key, childrenField);
}
function getKeysAndList(data, rowKey, childrenField) {
  const keys = [];
  const list = [];
  eachTree(
    data,
    (d) => {
      keys.push(getValue(d, rowKey));
      list.push(d);
    },
    childrenField
  );
  return [keys, list];
}
function valueIsChanged(value1, value2) {
  return !(value1 == null && value2 == null || value1 === value2);
}
function arrayIsChanged(list1, list2) {
  const isEmpty1 = list1 == null || !list1.length;
  const isEmpty2 = list2 == null || !list2.length;
  if (isEmpty1 && isEmpty2) {
    return false;
  }
  if (isEmpty1 !== isEmpty2) {
    return true;
  }
  if (list1.length !== list2.length) {
    return true;
  }
  return list1.some((k) => !list2.includes(k));
}
function useStickyHeader() {
  const layoutState = useLayoutState();
  const isLayoutFixedHead = computed(() => layoutState.fixedHeader);
  const isLayoutMaximized = computed(
    () => layoutState.maximized && layoutState.maximized !== "expanded"
  );
  return { isLayoutFixedHead, isLayoutMaximized };
}
function useMethods(getInstance) {
  const methods = {
    setCurrentRowKey: (key) => {
      const ins = getInstance();
      ins && ins.setCurrentRowKey(key);
    },
    getCurrentRow: () => {
      const ins = getInstance();
      if (ins) {
        return ins.getCurrentRow();
      }
    },
    setSelectedRows: (rows) => {
      const ins = getInstance();
      ins && ins.setSelectedRows(rows);
    },
    setSelectedRowKeys: (keys, rows) => {
      const ins = getInstance();
      ins && ins.setSelectedRowKeys(keys, rows);
    },
    toggleRowExpansionAll: (expanded) => {
      const ins = getInstance();
      ins && ins.toggleRowExpansionAll(expanded);
    },
    updateSelectedAndChecked: () => {
      const ins = getInstance();
      ins && ins.updateSelectedAndChecked();
    }
  };
  [
    "clearSelection",
    "getSelectionRows",
    "toggleRowSelection",
    "toggleAllSelection",
    "toggleRowExpansion",
    "setCurrentRow",
    "clearSort",
    "clearFilter",
    "doLayout",
    "sort",
    "scrollTo",
    "setScrollTop",
    "setScrollLeft",
    "updateKeyChildren"
  ].forEach((key) => {
    methods[key] = (...params) => {
      const ins = getInstance();
      if (!ins) {
        throw new Error("Table instance is null");
      }
      return ins[key](...params);
    };
  });
  return methods;
}
function useEmits(emit) {
  const { emitProps } = useComponentEvents(elDataTableEmits, emit);
  return {
    ...emitProps,
    /** 新增的事件 */
    "onUpdate:currentRowKey": (currentRowKey) => {
      emit("update:currentRowKey", currentRowKey);
    },
    "onUpdate:selectedRowKeys": (selectedRowKeys) => {
      emit("update:selectedRowKeys", selectedRowKeys);
    }
  };
}
export {
  arrayIsChanged,
  getBodyRowClass,
  getCellClass,
  getColFixedNumber,
  getFilterPopperClass,
  getGlobalTooltipProps,
  getHeadRowClass,
  getKeysAndList,
  getRowByKey,
  getRowClass,
  getRowKeys,
  getSelectableFunction,
  getStateCols,
  getTableFilter,
  getTooltipProps,
  getValue2 as getValue,
  isDisableRow,
  isReserveChecked,
  mergeTooltipProps,
  toggleRowSelectionPro,
  useEmits,
  useMethods,
  useStickyHeader,
  valueIsChanged
};

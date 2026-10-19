import { defineComponent, ref, computed, watch, nextTick, onMounted, createVNode, mergeProps, h } from "vue";
import { ElTable, ElEmpty, ElTableColumn } from "element-plus";
import { FilterFilled } from "../icons/index";
import { omit, pick, getValue, eachTree } from "../utils/common";
import { useEmits, useMethods, useStickyHeader, isReserveChecked, getGlobalTooltipProps, getStateCols, getHeadRowClass, getBodyRowClass, isDisableRow, getTableFilter, getRowKeys, valueIsChanged, getRowByKey, arrayIsChanged, getKeysAndList, toggleRowSelectionPro, getTooltipProps, getFilterPopperClass, getCellClass } from "./util";
import { dataTableEmits, dataTableProps, tablePropKeys } from "./props";
const ownSlots = ["default", "append", "empty"];
const index = /* @__PURE__ */ defineComponent({
  name: "EleDataTable",
  props: dataTableProps,
  emits: dataTableEmits,
  setup(props, {
    emit,
    slots,
    expose
  }) {
    const events = useEmits(emit);
    const methods = useMethods(() => tableRef.value);
    const {
      isLayoutFixedHead,
      isLayoutMaximized
    } = useStickyHeader();
    const tableState = {
      sorter: props.defaultSort,
      key: null,
      checkedKeys: [],
      checked: [],
      reserveChecked: isReserveChecked(props.columns)
    };
    const tableRef = ref(null);
    const tableCols = ref(props.columns ?? []);
    const tableOverflowTooltip = computed(() => {
      return getGlobalTooltipProps(props.showOverflowTooltip, props.tooltipEffect, props.tooltipOptions);
    });
    const childKey = computed(() => {
      return props.treeProps?.children || "children";
    });
    const borderKey = computed(() => {
      if (tableCols.value.some((col) => col.children?.length)) {
        return 1;
      }
      return props.border ? 1 : 0;
    });
    const tableProps = computed(() => {
      const propKeys = tablePropKeys.filter((k) => !["currentRowKey", "showOverflowTooltip", "tooltipOptions", "tooltipEffect"].includes(k));
      return {
        ...pick(props, propKeys),
        ...omit(events, ["onUpdate:currentRowKey", "onUpdate:selectedRowKeys", "onRowClick", "onHeaderClick", "onSortChange", "onFilterChange", "onCurrentChange", "onSelect", "onSelectAll", "onSelectionChange"])
      };
    });
    const handleRowClick = (row, column, event) => {
      const disabled = isDisableRow(row, props.data.indexOf(row), props.columns);
      if (props.rowClickChecked && !disabled) {
        const selections = methods.getSelectionRows();
        if (props.rowClickChecked === "smart" && (!selections || !selections.length || selections.length === 1)) {
          const key = getValue(row, props.rowKey);
          updateCheckedState(key == null ? [] : [key]);
        } else {
          toggleRowSelection(row);
        }
      }
      events.onRowClick(row, column, event, disabled, methods.getSelectionRows());
    };
    const handleHeaderClick = (column, e) => {
      if (column.sortable && column.filters) {
        const targetEl = e.target;
        const el = e.currentTarget;
        if (el && targetEl && !targetEl.classList.contains("el-table__column-filter-trigger")) {
          const caretEl = el.querySelector(".caret-wrapper");
          caretEl && caretEl.dispatchEvent(new MouseEvent("click"));
        }
      }
      events.onHeaderClick(column, e);
    };
    const handleSortChange = (sorter) => {
      const currentSorter = tableState.sorter;
      if (currentSorter && sorter.prop === currentSorter.prop && sorter.order === currentSorter.order) {
        return;
      }
      tableState.sorter = sorter;
      events.onSortChange(sorter);
    };
    const handleFilterChange = (filter) => {
      tableState.filter = getTableFilter(tableRef.value) ?? filter;
      events.onFilterChange(tableState.filter);
    };
    const handleCurrentChange = (row, old) => {
      if (row != null && row !== old) {
        updateSelectedState(getValue(row, props.rowKey), row);
      }
    };
    const handleSelect = (selection, row) => {
      events.onSelect(selection, row);
      updateCheckedState(getRowKeys(selection, props.rowKey), selection);
    };
    const handleSelectAll = (selection) => {
      updateCheckedState(getRowKeys(selection, props.rowKey), selection);
      events.onSelectAll(selection);
    };
    const updateScrollBar = () => {
      const scrollBarRef = tableRef.value?.scrollBarRef;
      if (scrollBarRef && typeof scrollBarRef.update === "function") {
        scrollBarRef.update();
      }
    };
    const clearSort = () => {
      methods.clearSort();
      tableState.sorter = {};
    };
    const clearSelection = () => {
      updateCheckedState([]);
    };
    const toggleRowSelection = (row, selected, ignoreSelectable) => {
      methods.toggleRowSelection(row, selected, ignoreSelectable);
      const selection = methods.getSelectionRows() || [];
      updateCheckedState(getRowKeys(selection, props.rowKey), selection);
    };
    const setCurrentRow = (row) => {
      updateSelectedState(getValue(row, props.rowKey), row);
    };
    const setCurrentRowKey = (key) => {
      updateSelectedState(key);
    };
    const getCurrentRow = () => {
      return tableState.row;
    };
    const setSelectedRows = (rows) => {
      if (rows) {
        updateCheckedState(getRowKeys(rows, props.rowKey), rows, !!rows.length);
      }
    };
    const setSelectedRowKeys = (keys) => {
      if (keys) {
        updateCheckedState(keys);
      }
    };
    const toggleRowExpansionAll = (expanded) => {
      eachTree(props.data, (row) => {
        if (row[childKey.value]?.length) {
          methods.toggleRowExpansion(row, expanded);
        }
      }, childKey.value);
    };
    const updateSelectedState = (key, item) => {
      if (!valueIsChanged(tableState.key, key)) {
        if (key != null && item != null) {
          if (tableState.row !== item) {
            tableState.row = item;
            events.onCurrentChange(item, tableState.oldRow);
          }
          methods.setCurrentRow(item);
        }
        return;
      }
      if (key != null) {
        const row = getRowByKey(key, props.data, props.rowKey, childKey.value);
        if (row != null || props.reserveCurrent) {
          tableState.oldRow = tableState.row;
          tableState.row = row || item || void 0;
          if (tableState.row == null && props.cacheData != null) {
            tableState.row = getRowByKey(key, props.cacheData, props.rowKey, childKey.value);
          }
          tableState.key = key;
          methods.setCurrentRow(row);
          updateCurrentRowKey(key);
          events.onCurrentChange(tableState.row, tableState.oldRow);
          return;
        }
      }
      if (tableState.key != null) {
        tableState.oldRow = tableState.row;
        tableState.row = void 0;
        tableState.key = null;
        methods.setCurrentRow(null);
        updateCurrentRowKey();
        events.onCurrentChange(void 0, tableState.oldRow);
      }
    };
    const updateCheckedState = (keys, items, force) => {
      if (!force && !arrayIsChanged(tableState.checkedKeys, keys)) {
        return;
      }
      const [dataKeys, list] = getKeysAndList(props.data, props.rowKey, childKey.value);
      const [cacheKeys, cacheList] = getKeysAndList(props.cacheData, props.rowKey, childKey.value);
      const itemKeys = items ? items.map((d) => getValue(d, props.rowKey)) : [];
      const oldKeys = tableState.checked.map((d) => getValue(d, props.rowKey));
      const checkedKeys = [];
      const checked = [];
      keys.forEach((key) => {
        const index2 = dataKeys.indexOf(key);
        if (index2 !== -1) {
          checkedKeys.push(key);
          checked.push(list[index2]);
        } else if (tableState.reserveChecked) {
          checkedKeys.push(key);
          if (items != null) {
            const tIndex = itemKeys.indexOf(key);
            if (tIndex !== -1 && !items[tIndex]._isMock) {
              checked.push(items[tIndex]);
              return;
            }
          }
          if (props.cacheData != null) {
            const i = cacheKeys.indexOf(key);
            if (i !== -1) {
              checked.push(cacheList[i]);
              return;
            }
          }
          const oIndex = oldKeys.indexOf(key);
          if (oIndex !== -1) {
            checked.push(tableState.checked[oIndex]);
            return;
          }
          if (typeof props.rowKey === "string") {
            checked.push({
              [props.rowKey]: key,
              _isMock: true
            });
          }
        }
      });
      const isChanged = arrayIsChanged(tableState.checked, checked);
      tableState.checked = checked;
      tableState.checkedKeys = checkedKeys;
      if (isChanged || force && arrayIsChanged(methods.getSelectionRows(), checked)) {
        methods.clearSelection();
        checked.forEach((row) => {
          toggleRowSelectionPro(tableRef.value, row, true);
        });
      }
      updateSelectedRowKeys(checkedKeys);
      if (isChanged) {
        events.onSelectionChange(checked);
      }
    };
    const updateSelectedAndChecked = () => {
      const key = tableState.key;
      if (key != null) {
        const row = getRowByKey(key, props.data, props.rowKey, childKey.value);
        if (row != null) {
          updateSelectedState(key, row);
        } else if (!props.reserveCurrent) {
          updateSelectedState(null);
        } else if (props.cacheData != null) {
          const temp = getRowByKey(key, props.cacheData, props.rowKey, childKey.value);
          if (temp != null) {
            updateSelectedState(key, temp);
          }
        }
      }
      if (tableState.checkedKeys.length) {
        updateCheckedState(tableState.checkedKeys, void 0, true);
      }
    };
    const updateCurrentRowKey = (key) => {
      if (valueIsChanged(props.currentRowKey, key)) {
        events["onUpdate:currentRowKey"](key);
      }
    };
    const updateSelectedRowKeys = (keys) => {
      const selected = props.selectedRowKeys || [];
      if (arrayIsChanged(selected, keys)) {
        events["onUpdate:selectedRowKeys"](keys);
      }
    };
    watch(() => props.columns, (columns) => {
      tableState.reserveChecked = isReserveChecked(columns);
      if (!columns) {
        tableCols.value = [];
      } else {
        const {
          cols,
          sorter
        } = getStateCols(columns, tableState.sorter, tableState.filter);
        tableCols.value = cols;
        nextTick(() => {
          methods.doLayout();
          updateScrollBar();
          if (sorter) {
            methods.sort(sorter.prop, sorter.order || "ascending");
          }
        });
      }
    }, {
      deep: true
    });
    watch([() => props.data, () => props.cacheData], () => {
      nextTick(() => {
        updateSelectedAndChecked();
        if (props.defaultExpandAll) {
          toggleRowExpansionAll(true);
        }
      });
    });
    watch(() => props.currentRowKey, (key) => {
      updateSelectedState(key);
    });
    watch(() => props.selectedRowKeys, (selectedRowKeys) => {
      updateCheckedState(selectedRowKeys || []);
    }, {
      deep: true
    });
    onMounted(() => {
      if (props.currentRowKey != null) {
        updateSelectedState(props.currentRowKey);
      }
      if (props.selectedRowKeys != null && props.selectedRowKeys.length) {
        updateCheckedState(props.selectedRowKeys);
      }
    });
    const exposeValue = {
      ...methods,
      clearSort,
      clearSelection,
      toggleRowSelection,
      setCurrentRow,
      setCurrentRowKey,
      getCurrentRow,
      setSelectedRows,
      setSelectedRowKeys,
      toggleRowExpansionAll,
      updateSelectedAndChecked,
      tableRef
    };
    expose(exposeValue);
    const renderTableColumn = (col) => {
      return createVNode(ElTableColumn, mergeProps(omit(col, ["showOverflowTooltip", "filterClassName", "columnKey", "className", "uid", "slot", "headerSlot", "hideInTable", "hideInSetting", "hideInExport", "hideInPrint", "printSlot", "children"]), {
        "key": col.uid ?? col.columnKey ?? col.prop,
        "index": col.index ?? props.pageIndex,
        "className": getCellClass(col),
        "columnKey": col.columnKey ?? col.prop,
        "filterClassName": getFilterPopperClass(col.filterClassName),
        "showOverflowTooltip": getTooltipProps(col.showOverflowTooltip, tableOverflowTooltip.value)
      }), {
        header: (slotProps) => createVNode("div", {
          "class": "ele-cell-title",
          "title": slotProps?.column?.label
        }, [col.headerSlot && !ownSlots.includes(col.headerSlot) && slots[col.headerSlot] ? slots[col.headerSlot]?.(slotProps) : slotProps?.column?.label]),
        ["filter-icon"]: (slotProps) => !col.filterIcon ? createVNode(FilterFilled, null, null) : typeof col.filterIcon === "string" && !ownSlots.includes(col.filterIcon) && slots[col.filterIcon] ? slots[col.filterIcon]?.(slotProps) : h(col.filterIcon),
        default: col.children && col.children.length ? () => col?.children?.map?.(renderTableColumn) : col.slot && !ownSlots.includes(col.slot) && slots[col.slot] ? (slotProps) => (!props.slotNormalize || slotProps?.$index != -1) && col.slot ? slots[col.slot]?.(slotProps) : void 0 : void 0
      });
    };
    return () => createVNode(ElTable, mergeProps({
      "key": borderKey.value
    }, tableProps.value, {
      "ref": tableRef,
      "emptyText": props.errorText || props.emptyText,
      "rowClassName": (param) => getBodyRowClass(props.rowClassName, param),
      "headerRowClassName": (param) => getHeadRowClass(props.headerRowClassName, param, props.headerEllipsis),
      "class": ["ele-data-table", {
        "is-sticky": props.sticky
      }, {
        "is-layout-fixed-head": props.sticky && isLayoutFixedHead.value
      }, {
        "is-layout-maximized": props.sticky && isLayoutMaximized.value
      }, {
        "is-sticky": props.sticky
      }, {
        "hide-header": !props.showHeader
      }, {
        "hide-bottom-line": !props.bottomLine
      }],
      "onRowClick": handleRowClick,
      "onHeaderClick": handleHeaderClick,
      "onSortChange": handleSortChange,
      "onFilterChange": handleFilterChange,
      "onCurrentChange": handleCurrentChange,
      "onSelect": handleSelect,
      "onSelectAll": handleSelectAll
    }), {
      append: slots.append ? (slotProps) => slots.append?.(slotProps) : void 0,
      empty: slots.empty ? () => slots.empty?.({
        text: props.emptyText,
        error: props.errorText
      }) : props.emptyProps ? () => createVNode(ElEmpty, mergeProps({
        "imageSize": 68
      }, !props.emptyProps || props.emptyProps === true ? {} : props.emptyProps, {
        "description": props.errorText || props.emptyText,
        "class": "ele-table-empty"
      }), null) : void 0,
      default: () => tableCols.value.map(renderTableColumn)
    });
  }
});
export {
  index as default
};

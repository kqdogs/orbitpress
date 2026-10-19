import { defineComponent, ref, reactive, computed, onActivated, onDeactivated, watch, nextTick, openBlock, createElementBlock, normalizeClass, unref, createBlock, mergeProps, createSlots, withCtx, renderSlot, toDisplayString, renderList, normalizeProps, guardReactiveProps, createCommentVNode, createVNode, createElementVNode, normalizeStyle } from "vue";
import { useLocale, ElTableV2, ElEmpty } from "element-plus";
import { eachTree, queryChild, findTree, getValue } from "../utils/common";
import { useResizeObserver } from "../utils/hook";
import EleTooltip from "../ele-tooltip/index";
import { useEmits, useStickyHeader, isReserveChecked, valueIsChanged, arrayIsChanged, getRowKeys, mergeTooltipProps, getGlobalTooltipProps } from "../ele-data-table/util";
import { getDefaultSorter, getDefaultSort, getDefaultFiltered, getTreeProps, getRowHeight, isAutoRowHeight, getTableHeight, analyseColumns, getColKey, transformTableData, getSelectableFunction, getSortBy, getOrderValue, getRowByKey, getKeysAndList, computeColSizes, colSizesIsChanged, getTableColumns, getColumnByKey, getSortOrder, cellIsOverflow, getSortCompareValue } from "./util";
import HeaderRow from "./components/header-row";
import BodyRow from "./components/body-row";
import ExpandRow from "./components/expand-row";
import FooterRow from "./components/footer-row";
import { virtualTableEmits, virtualTableProps } from "./props";
const _hoisted_1 = {
  key: 0,
  class: "ele-table-empty-text"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleVirtualTable" },
  __name: "index",
  props: virtualTableProps,
  emits: virtualTableEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const ownSlots = ["default", "empty", "append"];
    const props = __props;
    const emit = __emit;
    const { t } = useLocale();
    const events = useEmits(emit);
    const [wrapWidth, wrapHeight, updateWrapSize] = useResizeObserver({
      getEl: () => rootRef.value
    });
    const { isLayoutFixedHead, isLayoutMaximized } = useStickyHeader();
    const tableState = {
      checked: /* @__PURE__ */ new Map(),
      reserveChecked: false,
      scrollTop: 0,
      sorter: getDefaultSorter(props.defaultSort, props.columns)
    };
    const rootRef = ref(null);
    const tableRef = ref(null);
    const tableKey = ref(0);
    const headerRows = ref([]);
    const bodyCols = ref([]);
    const headerRowSizes = ref([]);
    const bodyColSizes = ref([]);
    const colsSumWidth = ref(0);
    const tableWidth = ref(0);
    const tableHeight = ref(0);
    const tableData = ref([]);
    const tableCurrentData = ref([]);
    const tableColumns = ref([]);
    const tableScrollLeft = ref(0);
    const columnResizeLineLeft = ref("0px");
    const isColumnResizing = ref(false);
    const selectedRowKey = ref(props.currentRowKey ?? null);
    const checkedRowKeys = ref(
      new Set(props.selectedRowKeys || [])
    );
    const isCheckAll = ref(false);
    const expandedRowKeys = ref([]);
    const sortBy = ref(
      getDefaultSort(props.defaultSort)
    );
    const filtered = reactive(getDefaultFiltered(props.columns));
    const tableTooltipProps = reactive({
      placement: "top",
      trigger: "click",
      offset: 0,
      hideAfter: 0,
      content: "",
      virtualRef: void 0,
      virtualTriggering: true,
      disabled: true,
      visible: false,
      teleported: false,
      transition: "ele-transition-none"
    });
    const treeTableProps = computed(() => {
      return getTreeProps(props.treeProps);
    });
    const treeChildrenName = computed(() => {
      return treeTableProps.value.childrenName;
    });
    const treeHasChildrenName = computed(() => {
      return treeTableProps.value.hasChildrenName;
    });
    const isTreeData = computed(() => {
      return tableData.value.some(
        (d) => d.children?.length || props.lazy && d.hasChildren
      );
    });
    const tableExpandCol = computed(() => {
      return bodyCols.value.find((d) => {
        return !!(d && d.originalCol && d.originalCol.type === "expand");
      });
    });
    const hasExpandCol = computed(() => {
      return !!tableExpandCol.value;
    });
    const tableExpandColumnKey = computed(() => {
      if (tableExpandCol.value) {
        return tableExpandCol.value.key;
      }
      if (!isTreeData.value) {
        return;
      }
      const treeCol = bodyCols.value.find((d) => {
        if (!d || !d.key || !d.originalCol) {
          return false;
        }
        const colType = d.originalCol.type;
        return !colType || !["selection", "index"].includes(colType);
      });
      return treeCol ? treeCol.key : void 0;
    });
    const tableRowHeight = computed(() => {
      return getRowHeight(props.size, props.rowHeight);
    });
    const autoRowHeight = computed(() => {
      return isAutoRowHeight(
        hasExpandCol.value,
        bodyCols.value,
        props.showOverflowTooltip
      );
    });
    const headerNums = computed(() => {
      return props.showHeader ? headerRows.value.length : 0;
    });
    const hasFooter = computed(() => {
      return !!(props.showSummary && tableCurrentData.value.length);
    });
    const tableProps = computed(() => {
      const rowHeight = tableRowHeight.value;
      const headerHeight = new Array(headerNums.value).fill(rowHeight);
      const opt = {
        cache: 2,
        estimatedRowHeight: autoRowHeight.value ? rowHeight : void 0,
        headerClass: ((params) => {
          const rowClass = props.headerRowClassName;
          const classes = ["ele-table-head-tr"];
          if (typeof rowClass === "function") {
            const custom = rowClass({ rowIndex: params.headerIndex });
            if (custom) {
              classes.push(custom);
            }
          } else if (typeof rowClass === "string" && rowClass) {
            classes.push(rowClass);
          }
          return classes.join(" ");
        }),
        headerProps: (params) => {
          const opt2 = { rowIndex: params.headerIndex };
          const style = props.headerRowStyle;
          return { style: typeof style === "function" ? style(opt2) : style };
        },
        //headerCellProps: void 0,
        headerHeight: headerNums.value ? headerHeight : 0,
        footerHeight: hasFooter.value ? rowHeight : void 0,
        rowClass: ((params) => {
          const classes = ["ele-table-tr"];
          const row = params.rowData;
          const rowIndex = row.rowIndex;
          if (row && row.isExpandRow === true) {
            classes.push("is-expand-row");
          } else if (row) {
            if (props.stripe && (rowIndex + 1) % 2 === 0) {
              classes.push("is-even");
            }
            if (props.highlightCurrentRow && selectedRowKey.value != null && selectedRowKey.value === row.rowId) {
              classes.push("is-current");
            }
            const rowClass = props.rowClassName;
            if (typeof rowClass === "function") {
              const custom = rowClass({ row: row.rowData, rowIndex });
              if (custom) {
                classes.push(custom);
              }
            } else if (typeof rowClass === "string" && rowClass) {
              classes.push(rowClass);
            }
          }
          return classes.join(" ");
        }),
        rowKey: "rowId",
        rowProps: (params) => {
          const row = params.rowData;
          const opt2 = { row: row.rowData, rowIndex: row.rowIndex };
          const style = props.rowStyle;
          return { style: typeof style === "function" ? style(opt2) : style };
        },
        rowHeight: autoRowHeight.value ? void 0 : rowHeight,
        //cellProps: void 0,
        columns: tableColumns.value,
        data: tableCurrentData.value,
        //dataGetter: void 0,
        //fixedData: void 0,
        expandColumnKey: tableExpandColumnKey.value,
        expandedRowKeys: expandedRowKeys.value,
        defaultExpandedRowKeys: expandedRowKeys.value,
        //class: void 0,
        fixed: true,
        width: tableWidth.value,
        height: tableHeight.value,
        //maxHeight: void 0,
        hScrollbarSize: 0,
        vScrollbarSize: 0,
        scrollbarAlwaysOn: props.scrollbarAlwaysOn,
        sortBy: sortBy.value
        //sortState: void 0
      };
      return opt;
    });
    const isIndeterminate = computed(() => {
      return !!(checkedRowKeys.value.size && !isCheckAll.value);
    });
    const isPingLeft = computed(() => {
      return tableScrollLeft.value > 1;
    });
    const isPingRight = computed(() => {
      const scrollWidth = colsSumWidth.value - tableWidth.value - 1;
      return scrollWidth > 1 && tableScrollLeft.value < scrollWidth;
    });
    const tableSumText = computed(() => {
      return props.sumText ?? t("el.table.sumText");
    });
    const tableEmptyText = computed(() => {
      return props.errorText || props.emptyText || t("el.table.emptyText");
    });
    const hideTooltip = () => {
      tableTooltipProps.visible = false;
      tableTooltipProps.disabled = true;
    };
    const triggerTooltip = (cell, col) => {
      const cellText = cell.innerText;
      const tooltip = mergeTooltipProps(
        col ? col.showOverflowTooltip : void 0,
        getGlobalTooltipProps(
          props.showOverflowTooltip,
          props.tooltipEffect,
          props.tooltipOptions
        )
      );
      if (cellText && !!tooltip && cellIsOverflow(cell)) {
        tableTooltipProps.content = cellText;
        const excludes = [
          "virtualRef",
          "virtualTriggering",
          "disabled",
          "visible",
          "teleported"
        ];
        Object.keys(tooltip).forEach((key) => {
          const value = tooltip[key];
          if (!excludes.includes(key) && tableTooltipProps[key] !== value) {
            tableTooltipProps[key] = value;
          }
        });
        tableTooltipProps.virtualRef = cell;
        tableTooltipProps.disabled = false;
        tableTooltipProps.visible = true;
      } else {
        hideTooltip();
      }
    };
    const sortAndFilterTableData = (sorter) => {
      if (sorter && tableState.sorter !== sorter) {
        tableState.sorter = sorter;
      }
      let data = [...tableData.value];
      if (tableState.sorter) {
        const { prop, order, column: col } = tableState.sorter;
        if (col?.sortable === true) {
          const reverse = order === "descending" ? -1 : 1;
          data.sort((a, b) => {
            if (!order) {
              return a.rowIndex - b.rowIndex;
            }
            const v = getSortCompareValue(col.sortMethod, a, b, prop);
            return v * reverse;
          });
        }
      }
      Object.keys(filtered).forEach((key) => {
        const col = getColumnByKey(props.columns, key);
        const filterMethod = col?.filterMethod;
        const values = filtered[key];
        if (!values?.length || !filterMethod) {
          return;
        }
        data = data.filter((d) => {
          const row = d.rowData;
          return values.some((value) => filterMethod(value, row, col));
        });
      });
      tableCurrentData.value = data;
    };
    const handleTableFilterChange = (params) => {
      const key = getColKey(params.column);
      if (key) {
        filtered[key] = params.value;
        sortAndFilterTableData();
        events.onFilterChange(filtered);
      }
    };
    const handleCellCheckedChange = (row, checked) => {
      toggleSelected(row.rowData, row.rowId, checked);
      const selection = getSelectionRows();
      events.onSelect(selection, row.rowData);
      events.onSelectionChange(selection);
    };
    const handleCellExpandChange = (row, expanded, children) => {
      if (expanded && children != null) {
        const childs = transformTableData(
          children,
          hasExpandCol.value,
          treeChildrenName.value,
          treeHasChildrenName.value,
          props.rowKey,
          getSelectableFunction(bodyCols.value)
        );
        let index = -1;
        eachTree(tableData.value, (d) => {
          index++;
          if (d.rowId === row.rowId) {
            d.children = childs;
            if (!childs.length) {
              d.hasChildren = false;
            }
          }
          d.rowIndex = index;
        });
        if (!childs.length) {
          return;
        }
      }
      toggleRowExpansion(row, expanded);
    };
    const handleCellClick = (row, col, e) => {
      const cell = e.currentTarget;
      const rowData = row.rowData;
      const rowDataKey = row.rowId;
      events.onCellClick(rowData, col, cell, e);
      if (props.highlightCurrentRow) {
        setCurrentRow(rowData);
      }
      if (props.rowClickChecked && !row.isDisabled) {
        if (props.rowClickChecked === "smart" && (!checkedRowKeys.value.size || checkedRowKeys.value.size === 1)) {
          if (rowDataKey != null && !checkedRowKeys.value.has(rowDataKey)) {
            checkedRowKeys.value = /* @__PURE__ */ new Set([rowDataKey]);
            tableState.checked.clear();
            tableState.checked.set(rowDataKey, rowData);
            updateIsCheckAll();
            updateSelectedRowKeys([rowDataKey]);
            events.onSelectionChange([rowData]);
          }
        } else {
          toggleSelected(rowData, rowDataKey);
          events.onSelectionChange(getSelectionRows());
        }
      }
      events.onRowClick(rowData, col, e, row.isDisabled, getSelectionRows());
    };
    const handleCellDblclick = (row, col, e) => {
      const cell = e.currentTarget;
      events.onCellDblclick(row.rowData, col, cell, e);
      events.onRowDblclick(row.rowData, col, e);
    };
    const handleCellContextmenu = (row, col, e) => {
      const cell = e.currentTarget;
      events.onCellContextmenu(row.rowData, col, cell, e);
      events.onRowContextmenu(row.rowData, col, e);
    };
    const handleCellMouseenter = (row, col, e) => {
      const cell = e.currentTarget;
      triggerTooltip(cell, col);
      events.onCellMouseEnter(row.rowData, col, cell, e);
    };
    const handleCellMouseleave = (row, col, e) => {
      const cell = e.currentTarget;
      events.onCellMouseLeave(row.rowData, col, cell, e);
    };
    const handleHeaderCellClick = (col, e) => {
      if (col && (col.sortable === true || col.sortable === "custom")) {
        sortBy.value = getSortBy(sortBy.value, col);
        const prop = col.property || col.prop;
        const order = getOrderValue(
          sortBy.value ? sortBy.value.order : void 0
        );
        const sorter = { prop, order, column: col };
        sortAndFilterTableData(sorter);
        events.onSortChange(sorter);
      }
      events.onHeaderClick(col, e);
    };
    const handleHeaderCellResizeStart = (_headerCol, _width, lineLeft) => {
      isColumnResizing.value = true;
      columnResizeLineLeft.value = `${lineLeft - tableScrollLeft.value}px`;
    };
    const handleHeaderCellResize = (_headerCol, _width, lineLeft) => {
      columnResizeLineLeft.value = `${lineLeft - tableScrollLeft.value}px`;
    };
    const handleHeaderCellResizeEnd = (headerCol, width, e) => {
      isColumnResizing.value = false;
      const col = bodyCols.value.find((col2) => col2.key === headerCol.key);
      if (col) {
        const oldWidth = col.width;
        col.width = width;
        doLayout(false, false);
        events.onHeaderDragend(width, oldWidth, col.originalCol, e);
      }
    };
    const handleHeaderCellContextmenu = (col, e) => {
      events.onHeaderContextmenu(col, e);
    };
    const handleHeaderCellMouseenter = () => {
      hideTooltip();
    };
    const handleFooterCellMouseenter = (e) => {
      triggerTooltip(e.currentTarget, { showOverflowTooltip: true });
    };
    const handleExpandCellMouseenter = () => {
      hideTooltip();
    };
    const handleTableMouseleave = () => {
      hideTooltip();
    };
    const handleTableScroll = (option) => {
      tableState.scrollTop = option.scrollTop;
      const scrollLeft = option.scrollLeft;
      if (tableScrollLeft.value !== scrollLeft) {
        tableScrollLeft.value = scrollLeft;
      }
      if (hasFooter.value && tableRef.value && tableRef.value.$el) {
        const el = queryChild(tableRef.value.$el, "el-table-v2__footer");
        if (el && el.scrollLeft != scrollLeft) {
          el.scrollLeft = scrollLeft;
        }
      }
      emit("scroll", option);
    };
    const handleEndEeached = (params) => {
      emit("endEeached", params);
    };
    const handleRowsRendered = (params) => {
      emit("rowsRendered", params);
    };
    const updateTableData = () => {
      tableData.value = transformTableData(
        props.data,
        hasExpandCol.value,
        treeChildrenName.value,
        treeHasChildrenName.value,
        props.rowKey,
        getSelectableFunction(bodyCols.value)
      );
      sortAndFilterTableData();
      if (props.defaultExpandAll) {
        toggleRowExpansionAll(true);
      } else if (props.expandRowKeys && props.expandRowKeys.length) {
        expandedRowKeys.value = [...props.expandRowKeys];
      } else {
        toggleRowExpansionAll(false);
      }
    };
    const updateSelectedState = (key, item) => {
      if (!valueIsChanged(selectedRowKey.value, key)) {
        if (key != null && item != null && tableState.row !== item) {
          tableState.row = item;
          events.onCurrentChange(item, tableState.oldRow);
        }
        return;
      }
      if (key != null) {
        const row = getRowByKey(key, tableData.value);
        if (row != null || props.reserveCurrent) {
          tableState.oldRow = tableState.row;
          tableState.row = row?.rowData || item || void 0;
          if (tableState.row == null && props.cacheData != null) {
            tableState.row = getRowByKey(
              key,
              props.cacheData,
              props.rowKey,
              treeChildrenName.value
            );
          }
          selectedRowKey.value = key;
          updateCurrentRowKey(key);
          events.onCurrentChange(tableState.row, tableState.oldRow);
          return;
        }
      }
      if (selectedRowKey.value != null) {
        tableState.oldRow = tableState.row;
        tableState.row = void 0;
        selectedRowKey.value = null;
        updateCurrentRowKey();
        events.onCurrentChange(void 0, tableState.oldRow);
      }
    };
    const updateSelectedAndChecked = () => {
      const key = selectedRowKey.value;
      if (key != null) {
        const row = getRowByKey(key, tableData.value);
        if (row != null) {
          updateSelectedState(key, row.rowData);
        } else if (!props.reserveCurrent) {
          updateSelectedState(null);
        } else if (props.cacheData != null) {
          const temp = getRowByKey(
            key,
            props.cacheData,
            props.rowKey,
            treeChildrenName.value
          );
          if (temp != null) {
            updateSelectedState(key, temp);
          }
        }
      }
      if (checkedRowKeys.value.size) {
        const oldSelection = getSelectionRows();
        const deletedKeys = [];
        const [dataKeys, list] = getKeysAndList(tableData.value);
        const [cacheKeys, cacheList] = getKeysAndList(
          props.cacheData,
          props.rowKey,
          treeChildrenName.value
        );
        checkedRowKeys.value.forEach((key2) => {
          const index = dataKeys.indexOf(key2);
          if (index !== -1) {
            const row = list[index].rowData;
            if (tableState.checked.get(key2) !== row) {
              tableState.checked.set(key2, row);
            }
          } else if (!tableState.reserveChecked) {
            deletedKeys.push(key2);
          } else if (props.cacheData != null) {
            const i = cacheKeys.indexOf(key2);
            const temp = i !== -1 ? cacheList[i] : void 0;
            if (i !== -1 && tableState.checked.get(key2) !== temp) {
              tableState.checked.set(key2, temp);
            }
          }
        });
        deletedKeys.forEach((key2) => {
          checkedRowKeys.value.delete(key2);
          tableState.checked.delete(key2);
        });
        updateIsCheckAll();
        if (deletedKeys.length) {
          updateSelectedRowKeys(Array.from(checkedRowKeys.value));
        }
        const selection = getSelectionRows();
        if (arrayIsChanged(oldSelection, selection)) {
          events.onSelectionChange(selection);
        }
      }
    };
    const updateIsCheckAll = () => {
      if (!tableData.value.length || !checkedRowKeys.value.size) {
        isCheckAll.value = false;
        return;
      }
      const unchecked = findTree(
        tableData.value,
        (d) => !d.isExpandRow && !d.isDisabled && d.rowId != null && !checkedRowKeys.value.has(d.rowId)
      );
      isCheckAll.value = unchecked == null;
    };
    const toggleSelected = (row, rowDataKey, selected) => {
      const isChecked = checkedRowKeys.value.has(rowDataKey);
      const checked = selected == null ? !isChecked : selected;
      if (checked === isChecked) {
        return;
      }
      if (checked) {
        checkedRowKeys.value.add(rowDataKey);
        tableState.checked.set(rowDataKey, row);
      } else {
        checkedRowKeys.value.delete(rowDataKey);
        tableState.checked.delete(rowDataKey);
      }
      updateIsCheckAll();
      updateSelectedRowKeys(Array.from(checkedRowKeys.value));
    };
    const setSelectedRows = (rows) => {
      if (!rows || !arrayIsChanged(getSelectionRows(), rows)) {
        return;
      }
      if (tableState.reserveChecked) {
        const oldSelection = getSelectionRows();
        checkedRowKeys.value.clear();
        tableState.checked.clear();
        rows.forEach((r) => {
          const k = getValue(r, props.rowKey);
          if (k != null) {
            checkedRowKeys.value.add(k);
            tableState.checked.set(k, r);
          }
        });
        updateIsCheckAll();
        updateSelectedRowKeys(Array.from(checkedRowKeys.value));
        const selection = getSelectionRows();
        if (arrayIsChanged(oldSelection, selection)) {
          events.onSelectionChange(selection);
        }
        return;
      }
      setSelectedRowKeys(getRowKeys(rows, props.rowKey));
    };
    const setSelectedRowKeys = (keys) => {
      if (!keys || !arrayIsChanged(Array.from(checkedRowKeys.value), keys)) {
        return;
      }
      const oldSelection = getSelectionRows();
      if (tableState.reserveChecked) {
        const [dataKeys, list] = getKeysAndList(tableData.value);
        const [cacheKeys, cacheList] = getKeysAndList(
          props.cacheData,
          props.rowKey,
          treeChildrenName.value
        );
        checkedRowKeys.value = new Set(keys);
        tableState.checked.clear();
        keys.forEach((key) => {
          const index = dataKeys.indexOf(key);
          if (index !== -1) {
            tableState.checked.set(key, list[index].rowData);
          } else if (props.cacheData != null) {
            const i = cacheKeys.indexOf(key);
            if (i !== -1) {
              tableState.checked.set(key, cacheList[i]);
            }
          }
        });
      } else {
        checkedRowKeys.value.clear();
        tableState.checked.clear();
        if (keys.length) {
          eachTree(tableData.value, (d) => {
            if (!d.isExpandRow && d.rowId != null && keys.includes(d.rowId)) {
              checkedRowKeys.value.add(d.rowId);
              tableState.checked.set(d.rowId, d.rowData);
            }
          });
        }
      }
      updateIsCheckAll();
      updateSelectedRowKeys(Array.from(checkedRowKeys.value));
      const selection = getSelectionRows();
      if (arrayIsChanged(oldSelection, selection)) {
        events.onSelectionChange(selection);
      }
    };
    const toggleRowExpansionAll = (expanded) => {
      if (!expanded) {
        if (expandedRowKeys.value.length) {
          expandedRowKeys.value = [];
          events.onExpandChange(void 0, []);
        }
        return;
      }
      const keys = [];
      const rows = [];
      eachTree(tableData.value, (row) => {
        if (row.children && row.children.length && row.rowId != null) {
          keys.push(row.rowId);
          rows.push(row.rowData);
        }
      });
      expandedRowKeys.value = keys;
      events.onExpandChange(void 0, rows);
    };
    const clearSelection = () => {
      if (checkedRowKeys.value.size) {
        const isChanged = !!tableState.checked.size;
        checkedRowKeys.value.clear();
        tableState.checked.clear();
        isCheckAll.value = false;
        updateSelectedRowKeys([]);
        if (isChanged) {
          events.onSelectionChange([]);
        }
      }
    };
    const getSelectionRows = () => {
      return Array.from(tableState.checked.values());
    };
    const toggleRowSelection = (row, selected) => {
      const key = getValue(row, props.rowKey);
      if (key == null || !tableState.reserveChecked && !getRowByKey(key, tableData.value)) {
        return;
      }
      const oldSelection = getSelectionRows();
      toggleSelected(row, key, selected);
      const selection = getSelectionRows();
      if (arrayIsChanged(oldSelection, selection)) {
        events.onSelectionChange(selection);
      }
    };
    const toggleAllSelection = () => {
      if (!tableData.value.length) {
        return;
      }
      if (isCheckAll.value || isIndeterminate.value && !props.selectOnIndeterminate) {
        if (checkedRowKeys.value.size) {
          if (tableState.reserveChecked) {
            eachTree(tableData.value, (d) => {
              if (!d.isExpandRow && d.rowId != null) {
                checkedRowKeys.value.delete(d.rowId);
                tableState.checked.delete(d.rowId);
              }
            });
            isCheckAll.value = false;
            updateSelectedRowKeys(Array.from(checkedRowKeys.value));
            const selection2 = getSelectionRows();
            events.onSelectionChange(selection2);
            events.onSelectAll(selection2);
          } else {
            clearSelection();
            events.onSelectAll([]);
          }
        }
        return;
      }
      eachTree(tableData.value, (d) => {
        if (!d.isExpandRow && !d.isDisabled && d.rowId != null) {
          checkedRowKeys.value.add(d.rowId);
          tableState.checked.set(d.rowId, d.rowData);
        }
      });
      isCheckAll.value = true;
      updateSelectedRowKeys(Array.from(checkedRowKeys.value));
      const selection = getSelectionRows();
      events.onSelectionChange(selection);
      events.onSelectAll(selection);
    };
    const toggleRowExpansion = (row, expanded) => {
      const dataKey = row.rowId;
      const isSpread = expandedRowKeys.value.includes(dataKey);
      const spread = expanded == null ? !isSpread : expanded;
      if (spread === isSpread) {
        return;
      }
      if (spread) {
        expandedRowKeys.value.push(dataKey);
      } else {
        const index = expandedRowKeys.value.findIndex((t2) => t2 === dataKey);
        expandedRowKeys.value.splice(index, 1);
      }
      events.onExpandChange(row.rowData, spread);
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
    const clearSort = () => {
      if (sortBy.value != null) {
        sortBy.value = void 0;
        tableState.sorter = void 0;
        sortAndFilterTableData();
      }
    };
    const clearFilter = (columnKeys) => {
      const keys = columnKeys == null ? Object.keys(filtered) : columnKeys;
      keys.forEach((key) => {
        const v = filtered[key];
        if (v == null || v.length) {
          filtered[key] = [];
        }
      });
      sortAndFilterTableData();
    };
    const doLayout = (force, updateTable) => {
      const { width, sumWidth, rowSizes, colSizes } = computeColSizes(
        bodyCols.value,
        headerRows.value,
        wrapWidth.value
      );
      if (!width) {
        return;
      }
      const isUpdate = colsSumWidth.value && colsSumWidth.value !== sumWidth;
      const isSizesChanged = colSizesIsChanged(bodyColSizes.value, colSizes);
      tableWidth.value = width;
      colsSumWidth.value = sumWidth;
      headerRowSizes.value = rowSizes;
      if (force || isSizesChanged) {
        bodyColSizes.value = colSizes;
        tableColumns.value = getTableColumns(bodyCols.value, bodyColSizes.value);
      }
      if (isUpdate && updateTable !== false) {
        tableKey.value++;
      }
    };
    const sort = (prop, order) => {
      const col = getColumnByKey(props.columns, void 0, prop);
      sortBy.value = {
        key: getColKey(col),
        order: getSortOrder(order)
      };
      const sorter = { prop, order, column: col };
      sortAndFilterTableData(sorter);
      events.onSortChange(sorter);
    };
    const scrollTo = (options, yCoord) => {
      if (!tableRef.value) {
        return;
      }
      const isNumber = typeof options === "number";
      const left = isNumber ? options : options.left;
      const top = isNumber ? yCoord : options.top;
      tableRef.value.scrollTo({
        scrollTop: top,
        scrollLeft: left
      });
    };
    const setScrollTop = (top) => {
      if (!tableRef.value) {
        return;
      }
      tableRef.value.scrollToTop(top);
    };
    const setScrollLeft = (left) => {
      if (!tableRef.value) {
        return;
      }
      tableRef.value.scrollToLeft(left);
    };
    const scrollToRow = (row, strategy) => {
      if (!tableRef.value) {
        return;
      }
      tableRef.value.scrollToRow(row, strategy);
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
    onActivated(() => {
      const top = tableState.scrollTop;
      const left = tableScrollLeft.value;
      if (top || left) {
        scrollTo(left ? left - 1 : 0, top ? top - 1 : 0);
      }
    });
    onDeactivated(() => {
      hideTooltip();
    });
    watch(
      [
        () => props.height,
        () => props.maxHeight,
        tableRowHeight,
        headerNums,
        hasFooter,
        wrapHeight
      ],
      () => {
        const minRows = headerNums.value + (hasFooter.value ? 2 : 1);
        const height = getTableHeight(
          props.height,
          props.maxHeight,
          minRows * tableRowHeight.value,
          wrapHeight.value
        );
        if (height !== tableHeight.value) {
          tableHeight.value = height;
        }
      },
      { immediate: true }
    );
    watch(
      () => props.columns,
      (columns) => {
        tableState.reserveChecked = isReserveChecked(columns);
        const { cols, rows } = analyseColumns(columns);
        bodyCols.value = cols;
        headerRows.value = rows;
        doLayout(true);
      },
      {
        deep: true,
        immediate: true
      }
    );
    watch(wrapWidth, () => {
      doLayout();
    });
    watch(
      [() => props.data, hasExpandCol, treeChildrenName],
      () => {
        updateTableData();
      },
      { immediate: true }
    );
    watch(
      () => props.rowKey,
      () => {
        setCurrentRow();
        clearSelection();
        toggleRowExpansionAll(false);
        updateTableData();
      }
    );
    watch([tableData, () => props.cacheData], () => {
      updateSelectedAndChecked();
    });
    watch(
      () => props.currentRowKey,
      (key) => {
        updateSelectedState(key);
      }
    );
    watch(
      () => props.selectedRowKeys,
      (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys || []);
      },
      { deep: true }
    );
    watch(
      () => props.expandRowKeys,
      (expandKeys) => {
        if (expandKeys != null) {
          expandedRowKeys.value = [...expandKeys];
        }
      },
      { deep: true }
    );
    watch(
      () => props.showHeader,
      (showHeader) => {
        if (showHeader) {
          nextTick(() => {
            const left = tableScrollLeft.value;
            if (left) {
              setScrollLeft(left - 1);
            }
          });
        }
      }
    );
    __expose({
      tableRef,
      updateWrapSize,
      updateTableData,
      updateSelectedAndChecked,
      setSelectedRows,
      setSelectedRowKeys,
      toggleRowExpansionAll,
      clearSelection,
      getSelectionRows,
      toggleRowSelection,
      toggleAllSelection,
      toggleRowExpansion,
      setCurrentRow,
      setCurrentRowKey,
      getCurrentRow,
      clearSort,
      clearFilter,
      doLayout,
      sort,
      scrollTo,
      setScrollTop,
      setScrollLeft,
      scrollToRow,
      hideTooltip
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "rootRef",
        ref: rootRef,
        class: normalizeClass(["ele-virtual-table", [
          { "is-border": _ctx.border || headerRows.value.length > 1 },
          { "is-stripe": _ctx.stripe },
          { "is-sticky": _ctx.sticky },
          { "is-layout-fixed-head": _ctx.sticky && unref(isLayoutFixedHead) },
          { "is-layout-maximized": _ctx.sticky && unref(isLayoutMaximized) },
          { "has-footer": hasFooter.value },
          { "hide-header": !_ctx.showHeader },
          { "hide-bottom-line": !_ctx.bottomLine },
          { "is-ping-left": isPingLeft.value },
          { "is-ping-right": isPingRight.value },
          { "is-auto-width": unref(wrapWidth) === tableWidth.value },
          { "is-column-resizing": isColumnResizing.value },
          { "is-small": _ctx.size === "small" },
          { "is-large": _ctx.size === "large" }
        ]]),
        onMouseleave: handleTableMouseleave
      }, [
        tableProps.value.width ? (openBlock(), createBlock(unref(ElTableV2), mergeProps({ key: 0 }, tableProps.value, {
          key: tableKey.value,
          ref_key: "tableRef",
          ref: tableRef,
          onScroll: handleTableScroll,
          onEndEeached: handleEndEeached,
          onRowsRendered: handleRowsRendered
        }), createSlots({
          header: withCtx((headerProps) => [
            headerProps && headerRows.value[headerProps.headerIndex] ? (openBlock(), createBlock(HeaderRow, {
              key: 0,
              headerCols: headerRows.value[headerProps.headerIndex],
              headerColSizes: headerRowSizes.value[headerProps.headerIndex],
              headerIndex: headerProps.headerIndex,
              sortBy: sortBy.value,
              filtered,
              isCheckAll: isCheckAll.value,
              isIndeterminate: isIndeterminate.value,
              disabledCheckbox: !tableData.value.length,
              tableSize: _ctx.size,
              headerCellClass: _ctx.headerCellClassName,
              headerCellStyle: _ctx.headerCellStyle,
              headerEllipsis: true,
              rowHeight: tableRowHeight.value,
              onCheckedChange: _cache[0] || (_cache[0] = ($event) => toggleAllSelection()),
              onFilterChange: handleTableFilterChange,
              onCellClick: handleHeaderCellClick,
              onCellContextmenu: handleHeaderCellContextmenu,
              onCellMouseenter: handleHeaderCellMouseenter,
              onCellResizeStart: handleHeaderCellResizeStart,
              onCellResize: handleHeaderCellResize,
              onCellResizeEnd: handleHeaderCellResizeEnd
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter(
                (k) => !ownSlots.includes(k)
              ), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["headerCols", "headerColSizes", "headerIndex", "sortBy", "filtered", "isCheckAll", "isIndeterminate", "disabledCheckbox", "tableSize", "headerCellClass", "headerCellStyle", "rowHeight"])) : createCommentVNode("", true)
          ]),
          row: withCtx((rowProps) => [
            rowProps && rowProps.rowData && rowProps.rowData.isExpandRow ? (openBlock(), createBlock(ExpandRow, {
              key: 0,
              column: tableExpandCol.value?.originalCol,
              rowIndex: rowProps.rowData.rowIndex,
              rowData: rowProps.rowData.rowData,
              onMouseenter: handleExpandCellMouseenter
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter(
                (k) => !ownSlots.includes(k)
              ), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["column", "rowIndex", "rowData"])) : rowProps && rowProps.rowData && rowProps.rowData.rowData ? (openBlock(), createBlock(BodyRow, {
              key: 1,
              bodyCols: bodyCols.value,
              colSizes: bodyColSizes.value,
              rowIndex: rowProps.rowData.rowIndex,
              rowItem: rowProps.rowData,
              rowId: rowProps.rowData.rowId,
              checkedRowKeys: checkedRowKeys.value,
              bodyCellClass: _ctx.cellClassName,
              bodyCellStyle: _ctx.cellStyle,
              spanMethod: _ctx.spanMethod,
              tableTooltipProps: _ctx.showOverflowTooltip,
              pageIndex: _ctx.pageIndex,
              rowHeight: tableRowHeight.value,
              tableSize: _ctx.size,
              expandColumnKey: tableExpandColumnKey.value,
              expandedRowKeys: expandedRowKeys.value,
              lazy: _ctx.lazy,
              load: _ctx.load,
              level: rowProps.depth,
              indent: _ctx.indent,
              fixedCellHeight: hasExpandCol.value,
              autoRowHeight: autoRowHeight.value,
              onCellCheckedChange: handleCellCheckedChange,
              onCellExpandChange: handleCellExpandChange,
              onCellClick: handleCellClick,
              onCellDblclick: handleCellDblclick,
              onCellContextmenu: handleCellContextmenu,
              onCellMouseenter: handleCellMouseenter,
              onCellMouseleave: handleCellMouseleave
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter(
                (k) => !ownSlots.includes(k)
              ), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["bodyCols", "colSizes", "rowIndex", "rowItem", "rowId", "checkedRowKeys", "bodyCellClass", "bodyCellStyle", "spanMethod", "tableTooltipProps", "pageIndex", "rowHeight", "tableSize", "expandColumnKey", "expandedRowKeys", "lazy", "load", "level", "indent", "fixedCellHeight", "autoRowHeight"])) : createCommentVNode("", true)
          ]),
          empty: withCtx(() => [
            renderSlot(_ctx.$slots, "empty", {
              text: _ctx.emptyText,
              error: _ctx.errorText
            }, () => [
              _ctx.emptyProps === false ? (openBlock(), createElementBlock("div", _hoisted_1, toDisplayString(tableEmptyText.value), 1)) : (openBlock(), createBlock(unref(ElEmpty), mergeProps({
                key: 1,
                imageSize: 68
              }, !_ctx.emptyProps || _ctx.emptyProps === true ? {} : _ctx.emptyProps, {
                description: tableEmptyText.value,
                class: "ele-table-empty"
              }), null, 16, ["description"]))
            ])
          ]),
          _: 2
        }, [
          hasFooter.value ? {
            name: "footer",
            fn: withCtx(() => [
              createVNode(FooterRow, {
                bodyCols: bodyCols.value,
                colSizes: bodyColSizes.value,
                sumWidth: colsSumWidth.value,
                tableData: tableCurrentData.value,
                rowHeight: tableRowHeight.value,
                sumText: tableSumText.value,
                summaryMethod: _ctx.summaryMethod,
                onMouseenter: handleFooterCellMouseenter
              }, null, 8, ["bodyCols", "colSizes", "sumWidth", "tableData", "rowHeight", "sumText", "summaryMethod"])
            ]),
            key: "0"
          } : void 0
        ]), 1040)) : createCommentVNode("", true),
        createElementVNode("div", {
          class: "ele-table-resize-line",
          style: normalizeStyle({ left: columnResizeLineLeft.value })
        }, null, 4),
        createVNode(EleTooltip, normalizeProps(guardReactiveProps(tableTooltipProps)), null, 16)
      ], 34);
    };
  }
});
export {
  _sfc_main as default
};

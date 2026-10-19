import { defineComponent, ref, shallowRef, computed, watch, onMounted, openBlock, createBlock, mergeProps as mergeProps$1, unref, withCtx, renderSlot, normalizeProps, createSlots, renderList, guardReactiveProps, createCommentVNode, createElementBlock, normalizeStyle, createVNode, nextTick } from "vue";
import { pick, getValue, uuid } from "../utils/common";
import { useGlobalProps, useLocale } from "../ele-config-provider/receiver";
import EleLoading from "../ele-loading/index";
import ElePagination from "../ele-pagination/index";
import { dataTablePropKeys } from "../ele-data-table/props";
import { useEmits, useMethods, arrayIsChanged, getRowKeys } from "../ele-data-table/util";
import EleDataTable from "../ele-data-table/index";
import EleVirtualTable from "../ele-virtual-table/index";
import EleToolbar from "../ele-toolbar/index";
import TableTools from "./components/table-tools";
import ToolExport from "./components/tool-export";
import ToolPrint from "./components/tool-print";
import { getDefaultFilter, getTablePage, getTableLimit, getTableSize, getRowKey, getPaginationProps, mergeProps, cacheColWidth, getInitCacheColumns, getResponseResult, reloadData, getResponseName, isAutoAmend, sortData, getRequestOrders, getRequestFilters, getRequestPages } from "./util";
import { proTableEmits, proTableProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleProTable" },
  __name: "index",
  props: proTableProps,
  emits: proTableEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const ownSlots = [
      "default",
      "toolbar",
      "tools",
      "footer",
      "topExtra",
      "bottomExtra"
    ];
    const toolsSlotExcludes = [...ownSlots, "empty", "append"];
    const tableSlotExcludes = [...ownSlots, "printTop", "printBottom"];
    const pageSlotExcludes = [...toolsSlotExcludes, "printTop", "printBottom"];
    const props = __props;
    const emit = __emit;
    const tableState = {
      sorter: props.defaultSort ?? {},
      filter: getDefaultFilter(props.columns),
      where: props.where ?? {},
      reloadId: null
    };
    const globalProps = useGlobalProps("table");
    const { lang } = useLocale("table", props);
    const tableViewRef = ref(null);
    const getTableRef = () => {
      return tableViewRef.value;
    };
    const events = useEmits(emit);
    const methods = useMethods(() => getTableRef());
    const virtualTableEvents = {
      onEndEeached: (params) => {
        emit("endEeached", params);
      },
      onScroll: (params) => {
        emit("scroll", params);
      },
      onRowsRendered: (params) => {
        emit("rowsRendered", params);
      }
    };
    const toolExportRef = ref(null);
    const toolPrintRef = ref(null);
    const tableData = ref([]);
    const tablePage = ref(
      getTablePage(props.pagination, globalProps.value.pagination)
    );
    const tableLimit = ref(
      getTableLimit(props.pagination, globalProps.value.pagination)
    );
    const tableTotal = ref(0);
    const tableLoading = ref(props.loading);
    const tableCols = ref([]);
    const tableSize = ref(
      getTableSize(props.cacheKey, props.size, globalProps.value.size)
    );
    const tableMaximized = ref(props.maximized);
    const errorText = ref("");
    const cacheData = ref();
    const tableRowKey = shallowRef(getRowKey(props.rowKey));
    const tableIndex = computed(() => {
      return ((tablePage.value ?? 1) - 1) * (tableLimit.value ?? 0) + 1;
    });
    const tableCurrentIndex = ref(tableIndex.value);
    const paginationProps = computed(() => {
      return getPaginationProps(
        tableSize.value,
        props.pagination,
        globalProps.value.pagination,
        {
          total: tableTotal.value,
          pageSize: tableLimit.value,
          currentPage: tablePage.value,
          hasNext: tableData.value.length >= tableLimit.value
        }
      );
    });
    const tableEmptyProps = computed(() => {
      return mergeProps(
        props.emptyProps,
        globalProps.value.emptyProps
      );
    });
    const isFunctionSource = computed(() => {
      return typeof props.datasource === "function";
    });
    const tableProps = computed(() => {
      const isMaximized = tableMaximized.value && props.maximizedHeight;
      const options = {
        ...pick(props, dataTablePropKeys),
        height: isMaximized ? props.maximizedHeight : props.height,
        border: props.border ?? globalProps.value.border ?? false,
        stripe: props.stripe ?? globalProps.value.stripe ?? false,
        load: tableLoad,
        size: tableSize.value,
        data: tableData.value,
        columns: tableCols.value,
        cacheData: cacheData.value,
        errorText: errorText.value,
        pageIndex: tableCurrentIndex.value,
        emptyProps: tableEmptyProps.value,
        rowHeight: props.virtual ? props.rowHeight : void 0,
        rowKey: tableRowKey.value,
        style: props.tableStyle,
        class: "ele-pro-table-view",
        ...events,
        onSelectionChange: handleSelectionChange,
        onSortChange: handleSortChange,
        onFilterChange: handleFilterChange,
        onCurrentChange: handleCurrentChange,
        onHeaderDragend: handleHeaderDragend
      };
      if (props.virtual) {
        Object.assign(options, virtualTableEvents);
      }
      return options;
    });
    const toolNames = computed(() => {
      const tools = props.tools ?? globalProps.value.tools ?? true;
      if (tools === true) {
        return ["reload", "size", "columns", "maximized"];
      }
      return tools || [];
    });
    const tableToolbarProps = computed(() => {
      const result = mergeProps(
        props.toolbar,
        globalProps.value.toolbar
      );
      return result === true ? {} : result;
    });
    const toolExportConfig = computed(() => {
      const globalExportConfig = globalProps.value.exportConfig || {};
      const userExportConfig = props.exportConfig || {};
      return {
        ...globalExportConfig,
        ...userExportConfig,
        modalProps: {
          ...globalExportConfig.modalProps || {},
          ...userExportConfig.modalProps || {}
        }
      };
    });
    const toolPrintConfig = computed(() => {
      const globalPrintConfig = globalProps.value.printConfig || {};
      const userPrintConfig = props.printConfig || {};
      return {
        ...globalPrintConfig,
        ...userPrintConfig,
        modalProps: {
          ...globalPrintConfig.modalProps || {},
          ...userPrintConfig.modalProps || {}
        },
        printerProps: {
          ...globalPrintConfig.printerProps || {},
          ...userPrintConfig.printerProps || {}
        },
        tableProps: {
          ...globalPrintConfig.tableProps || {},
          ...userPrintConfig.tableProps || {}
        }
      };
    });
    const getRequestParams = (parent) => {
      const { sorter, filter } = tableState;
      const orders = getRequestOrders(
        sorter,
        props.request,
        globalProps.value.request
      );
      return {
        page: tablePage.value,
        limit: tableLimit.value,
        pages: getRequestPages(
          tablePage.value,
          tableLimit.value,
          props.request,
          globalProps.value.request
        ),
        where: Object.assign({}, tableState.where),
        orders,
        filters: getRequestFilters(filter),
        sorter,
        filter,
        parent,
        columns: tableCols.value
      };
    };
    const getDatasourceResult = (response) => {
      const parseData = props.parseData ?? globalProps.value.parseData;
      const result = parseData ? parseData(response) : response;
      return getResponseResult(
        result,
        props.response,
        globalProps.value.response,
        props.lazy,
        props.treeProps
      );
    };
    const reload = (option, parent, resolve, backTop) => {
      if (option) {
        if (option.page) {
          tablePage.value = option.page;
        }
        if (option.limit) {
          tableLimit.value = option.limit;
        }
        if (option.where) {
          tableState.where = option.where;
        }
        if (option.sorter) {
          tableState.sorter = option.sorter;
        }
        if (option.filter) {
          tableState.filter = option.filter;
        }
      }
      errorText.value = "";
      const sorter = tableState.sorter;
      if (!isFunctionSource.value) {
        const { data, page, total } = reloadData(
          props.datasource,
          sorter,
          paginationProps.value ? tablePage.value : void 0,
          tableLimit.value
        );
        cacheData.value = props.datasource;
        tableData.value = data;
        tablePage.value = page;
        tableTotal.value = total;
        handleDone(
          { data, page, total, response: props.datasource },
          void 0,
          backTop
        );
        return;
      }
      const tempId = uuid(8);
      tableState.reloadId = tempId;
      if (!parent) {
        tableLoading.value = true;
      }
      const params = getRequestParams(parent);
      props.datasource(params).then((response) => {
        if (tableState.reloadId !== tempId) {
          return;
        }
        const { data, total, result } = getDatasourceResult(response);
        requestCallback(data, total, parent, result, resolve, backTop);
      }).catch((e) => {
        if (tableState.reloadId !== tempId) {
          return;
        }
        const errorMsg = e?.message;
        requestCallback(
          errorMsg == null ? errorMsg : String(errorMsg),
          void 0,
          parent,
          e,
          resolve,
          backTop
        );
        resolve && console.error(e);
      });
    };
    const requestCallback = (data, total, parent, response, resolve, backTop) => {
      if (data == null || !Array.isArray(data)) {
        if (resolve) {
          if (parent != null) {
            parent[props.treeProps?.children || "children"] = [];
          }
          resolve([]);
        } else {
          tableData.value = [];
        }
        tableLoading.value = false;
        if (typeof data === "string" && data) {
          errorText.value = data;
          return;
        }
        errorText.value = "获取数据失败";
        console.error(
          "返回的数据格式与配置的不一致, 返回的数据:",
          response,
          "需要的格式:",
          getResponseName(globalProps.value.response, props.response)
        );
        return;
      }
      if (resolve) {
        if (parent != null) {
          parent[props.treeProps?.children || "children"] = data;
        }
        resolve(data);
      } else {
        if (isAutoAmend(props.pagination, globalProps.value.pagination) && !data.length && total && "*" !== total && tablePage.value && tableLimit.value) {
          const maxPage = Math.ceil(total / tableLimit.value);
          if (maxPage && tablePage.value > maxPage) {
            tablePage.value = maxPage;
            reload(void 0, void 0, void 0, true);
            return;
          }
        }
        tableData.value = data;
        tableTotal.value = total || data.length;
      }
      tableLoading.value = false;
      const result = {
        data: tableData.value,
        page: tablePage.value,
        total: tableTotal.value,
        response
      };
      handleDone(result, parent, backTop);
    };
    const tableLoad = (row, treeNode, resolve) => {
      if (props.load) {
        props.load(row, treeNode, resolve);
        return;
      }
      reload(void 0, row, resolve);
    };
    const handleDone = (result, parent, backTop) => {
      checkTableCurrentIndex();
      nextTick(() => {
        if (props.current != null) {
          methods.setCurrentRowKey(getValue(props.current, tableRowKey.value));
        }
        if (props.selections != null && props.selections.length) {
          methods.setSelectedRowKeys(
            getRowKeys(props.selections, tableRowKey.value)
          );
        }
        if (backTop && getTableRef()) {
          methods.setScrollTop(0);
        }
      });
      emit("done", result, parent);
    };
    const handleRefresh = () => {
      if (isFunctionSource.value) {
        reload();
        return;
      }
      emit("refresh");
    };
    const handleSizeChange = (size) => {
      tableSize.value = size;
      emit("sizeChange", size);
    };
    const handleColumnsChange = (columns, tableColumns, isReset) => {
      tableCols.value = columns;
      emit("columnsChange", columns, tableColumns, isReset);
    };
    const handleMaximizedChange = (maximized) => {
      tableMaximized.value = maximized;
      if (props.maximized !== maximized) {
        emit("update:maximized", maximized);
      }
      emit("maximizedChange", maximized);
    };
    const handlePageSizeChange = (limit) => {
      if (tableLimit.value !== limit) {
        tableLimit.value = limit;
        if (tableTotal.value !== "*") {
          const maxPage = Math.ceil(tableTotal.value / limit);
          if (maxPage && tablePage.value > maxPage) {
            tablePage.value = maxPage;
          }
        }
        reload();
      }
    };
    const handlePageCurrentChange = (page) => {
      if (tablePage.value !== page) {
        tablePage.value = page;
        reload(void 0, void 0, void 0, true);
      }
    };
    const handleSortChange = (sorter) => {
      if (props.loadOnChanged) {
        tableState.sorter = sorter;
        reload();
      }
      events.onSortChange(sorter);
    };
    const handleFilterChange = (filter) => {
      if (props.loadOnChanged) {
        tableState.filter = filter;
        reload();
      }
      events.onFilterChange(filter);
    };
    const handleHeaderDragend = (newWidth, oldWidth, column, event) => {
      cacheColWidth(newWidth, column, props.cacheKey);
      events.onHeaderDragend(newWidth, oldWidth, column, event);
    };
    const handleCurrentChange = (currentRow, oldCurrentRow) => {
      updateCurrent(currentRow);
      events.onCurrentChange(currentRow, oldCurrentRow);
    };
    const handleSelectionChange = (selection) => {
      updateSelections(selection);
      events.onSelectionChange(selection);
    };
    const updateCurrent = (currentRow) => {
      if (currentRow !== props.current) {
        emit("update:current", currentRow);
      }
    };
    const updateSelections = (selection) => {
      if (arrayIsChanged(selection, props.selections)) {
        emit("update:selections", selection);
      }
    };
    const checkTableCurrentIndex = () => {
      if (tableCurrentIndex.value !== tableIndex.value) {
        tableCurrentIndex.value = tableIndex.value;
      }
    };
    const reloadTable = () => {
      methods.doLayout();
    };
    const getData = () => {
      return tableData.value;
    };
    const setData = (data) => {
      tableData.value = data;
      checkTableCurrentIndex();
    };
    const goPageByRowKey = (key) => {
      if (!paginationProps.value || tableLimit.value == null || isFunctionSource.value) {
        return;
      }
      const rowKey = tableRowKey.value;
      const data = sortData(props.datasource, tableState.sorter);
      const index = data.findIndex((d) => getValue(d, rowKey) === key);
      const page = Math.floor(index / tableLimit.value) + 1;
      if (tablePage.value !== page) {
        reload({ page });
      }
    };
    const fetch = (callback) => {
      callback(getRequestParams());
    };
    const openPrintModal = () => {
      if (toolPrintRef.value) {
        toolPrintRef.value.openModal();
      }
    };
    const printData = (params) => {
      if (toolPrintRef.value) {
        toolPrintRef.value.printData(params);
      }
    };
    const openExportModal = () => {
      if (toolExportRef.value) {
        toolExportRef.value.openModal();
      }
    };
    const exportData = (params) => {
      if (toolExportRef.value) {
        toolExportRef.value.exportData(params);
      }
    };
    watch(
      () => props.columns,
      (columns) => {
        if (columns) {
          tableCols.value = getInitCacheColumns(
            columns,
            props.cacheKey,
            props.columnSortable
          );
        } else if (tableCols.value.length) {
          tableCols.value = [];
        }
      },
      { immediate: true, deep: true }
    );
    watch(
      () => props.datasource,
      () => {
        reload();
      },
      { deep: true }
    );
    watch(
      () => props.loading,
      (loading) => {
        tableLoading.value = loading;
      }
    );
    watch(
      () => props.size,
      (size) => {
        tableSize.value = getTableSize(void 0, size, globalProps.value.size);
      }
    );
    watch(
      () => props.current,
      (current) => {
        methods.setCurrentRowKey(getValue(current, tableRowKey.value));
      }
    );
    watch(
      () => props.selections,
      (selections) => {
        methods.setSelectedRowKeys(getRowKeys(selections, tableRowKey.value));
      }
    );
    watch(
      () => props.rowKey,
      () => {
        tableRowKey.value = getRowKey(props.rowKey);
      }
    );
    watch(
      globalProps,
      (config) => {
        tableSize.value = getTableSize(props.cacheKey, props.size, config.size);
      },
      { deep: true }
    );
    watch(
      () => props.maximized,
      (maximized) => {
        if (tableMaximized.value !== maximized) {
          handleMaximizedChange(maximized);
        }
      }
    );
    onMounted(() => {
      if (props.current != null) {
        methods.setCurrentRowKey(getValue(props.current, tableRowKey.value));
      }
      if (props.selections?.length) {
        methods.setSelectedRowKeys(
          getRowKeys(props.selections, tableRowKey.value)
        );
      }
      if (props.loadOnCreated) {
        reload();
      }
    });
    __expose({
      ...methods,
      tableViewRef,
      reload,
      getData,
      setData,
      fetch,
      openPrintModal,
      printData,
      openExportModal,
      exportData,
      getTableRef,
      // 兼容旧版导出
      tableData,
      tableLoading,
      tableProps,
      reloadTable,
      goPageByRowKey
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleLoading, mergeProps$1(props.loadingProps || {}, {
        loading: tableLoading.value,
        class: ["ele-pro-table", [
          { "is-maximized": tableMaximized.value },
          { "is-border": tableProps.value.border },
          {
            "is-default-toolbar": tableToolbarProps.value && tableToolbarProps.value.theme === "default"
          }
        ]],
        style: tableMaximized.value ? { zIndex: _ctx.maximizedIndex ?? unref(globalProps).maximizedIndex } : void 0
      }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "topExtra"),
          tableToolbarProps.value ? (openBlock(), createBlock(EleToolbar, normalizeProps(mergeProps$1({ key: 0 }, tableToolbarProps.value)), {
            tools: withCtx(() => [
              renderSlot(_ctx.$slots, "tools"),
              toolNames.value && toolNames.value.length ? (openBlock(), createBlock(TableTools, {
                key: 0,
                tools: toolNames.value,
                size: tableSize.value,
                columns: _ctx.columns,
                columnSortable: _ctx.columnSortable,
                columnFixed: _ctx.columnFixed,
                maximized: tableMaximized.value,
                cacheKey: _ctx.cacheKey,
                lang: unref(lang),
                onReload: handleRefresh,
                "onUpdate:size": handleSizeChange,
                "onUpdate:columns": handleColumnsChange,
                "onUpdate:maximized": handleMaximizedChange,
                onOpenExportModal: openExportModal,
                onOpenPrintModal: openPrintModal
              }, createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots).filter(
                  (k) => !toolsSlotExcludes.includes(k)
                ), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                    ])
                  };
                })
              ]), 1032, ["tools", "size", "columns", "columnSortable", "columnFixed", "maximized", "cacheKey", "lang"])) : createCommentVNode("", true)
            ]),
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "toolbar")
            ]),
            _: 3
          }, 16)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default"),
          _ctx.virtual ? (openBlock(), createBlock(EleVirtualTable, mergeProps$1({ key: 1 }, tableProps.value, {
            ref_key: "tableViewRef",
            ref: tableViewRef
          }), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter(
              (k) => !tableSlotExcludes.includes(k)
            ), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040)) : (openBlock(), createBlock(unref(EleDataTable), mergeProps$1({ key: 2 }, tableProps.value, {
            ref_key: "tableViewRef",
            ref: tableViewRef
          }), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter(
              (k) => !tableSlotExcludes.includes(k)
            ), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040)),
          paginationProps.value || _ctx.$slots.footer ? (openBlock(), createElementBlock("div", {
            key: 3,
            class: "ele-pro-table-footer",
            style: normalizeStyle(_ctx.footerStyle)
          }, [
            renderSlot(_ctx.$slots, "footer"),
            paginationProps.value && paginationProps.value.total ? (openBlock(), createBlock(ElePagination, mergeProps$1({ key: 0 }, paginationProps.value, {
              "onUpdate:currentPage": handlePageCurrentChange,
              "onUpdate:pageSize": handlePageSizeChange
            }), createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter(
                (k) => !pageSlotExcludes.includes(k)
              ), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1040)) : createCommentVNode("", true)
          ], 4)) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "bottomExtra"),
          createVNode(ToolExport, {
            ref_key: "toolExportRef",
            ref: toolExportRef,
            locale: unref(lang),
            cacheKey: _ctx.cacheKey,
            modalProps: toolExportConfig.value.modalProps,
            columns: toolExportConfig.value.columns || _ctx.columns,
            selections: _ctx.selections,
            pageData: tableData.value,
            datasource: toolExportConfig.value.datasource,
            spanMethod: toolExportConfig.value.spanMethod || _ctx.spanMethod,
            tableHeader: toolExportConfig.value.showHeader ?? _ctx.showHeader,
            showSummary: _ctx.showSummary,
            sumText: _ctx.sumText,
            summaryMethod: toolExportConfig.value.summaryMethod || _ctx.summaryMethod,
            pageIndex: tableIndex.value,
            treeProps: _ctx.treeProps,
            fetch,
            defaultFileName: toolExportConfig.value.fileName,
            defaultDataType: toolExportConfig.value.dataType,
            defaultShowFooter: toolExportConfig.value.showFooter,
            defaultShowTreeIndex: toolExportConfig.value.showTreeIndex,
            beforeExport: toolExportConfig.value.beforeExport,
            exportPlugin: toolExportConfig.value.exportPlugin,
            getDatasourceResult
          }, null, 8, ["locale", "cacheKey", "modalProps", "columns", "selections", "pageData", "datasource", "spanMethod", "tableHeader", "showSummary", "sumText", "summaryMethod", "pageIndex", "treeProps", "defaultFileName", "defaultDataType", "defaultShowFooter", "defaultShowTreeIndex", "beforeExport", "exportPlugin"]),
          createVNode(ToolPrint, {
            ref_key: "toolPrintRef",
            ref: toolPrintRef,
            locale: unref(lang),
            cacheKey: _ctx.cacheKey,
            modalProps: toolPrintConfig.value.modalProps,
            printerProps: toolPrintConfig.value.printerProps,
            tableProps: toolPrintConfig.value.tableProps,
            columns: toolPrintConfig.value.columns || _ctx.columns,
            selections: _ctx.selections,
            pageData: tableData.value,
            datasource: toolPrintConfig.value.datasource,
            spanMethod: toolPrintConfig.value.spanMethod || _ctx.spanMethod,
            tableHeader: toolPrintConfig.value.showHeader ?? _ctx.showHeader,
            showSummary: _ctx.showSummary,
            sumText: _ctx.sumText,
            summaryMethod: toolPrintConfig.value.summaryMethod || _ctx.summaryMethod,
            tableStyle: _ctx.tableStyle,
            cellStyle: _ctx.cellStyle,
            cellClassName: _ctx.cellClassName,
            headerCellStyle: _ctx.headerCellStyle,
            headerCellClassName: _ctx.headerCellClassName,
            pageIndex: tableIndex.value,
            treeProps: _ctx.treeProps,
            fetch,
            defaultDataType: toolPrintConfig.value.dataType,
            defaultShowFooter: toolPrintConfig.value.showFooter,
            defaultShowTreeIndex: toolPrintConfig.value.showTreeIndex,
            beforePrint: toolPrintConfig.value.beforePrint,
            printPlugin: toolPrintConfig.value.printPlugin,
            getDatasourceResult
          }, createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter(
              (k) => !toolsSlotExcludes.includes(k)
            ), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1032, ["locale", "cacheKey", "modalProps", "printerProps", "tableProps", "columns", "selections", "pageData", "datasource", "spanMethod", "tableHeader", "showSummary", "sumText", "summaryMethod", "tableStyle", "cellStyle", "cellClassName", "headerCellStyle", "headerCellClassName", "pageIndex", "treeProps", "defaultDataType", "defaultShowFooter", "defaultShowTreeIndex", "beforePrint", "printPlugin"])
        ]),
        _: 3
      }, 16, ["loading", "class", "style"]);
    };
  }
});
export {
  _sfc_main as default
};

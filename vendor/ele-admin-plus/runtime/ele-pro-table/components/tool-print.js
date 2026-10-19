import { defineComponent, ref, reactive, watch, openBlock, createElementBlock, Fragment, createVNode, mergeProps, withCtx, unref, withModifiers, createBlock, createCommentVNode, createElementVNode, normalizeClass, toDisplayString, createTextVNode, renderSlot, renderList, createSlots, normalizeStyle, nextTick } from "vue";
import { ElForm, ElFormItem, ElSelect, ElOption, ElCheckbox, ElButton } from "element-plus";
import { findTree, eachTree } from "../../utils/common";
import EleModal from "../../ele-modal/index";
import ElePrinter from "../../ele-printer/index";
import EleTable from "../../ele-table/index";
import { CellRender } from "../../ele-virtual-table/util";
import { getCheckedColumns, columnsPrintFilter, getExportData, getCacheColsWidth, getColItems } from "../util";
import ToolColumnList from "./tool-column-list";
import ToolPrintBodyCell from "./tool-print-body-cell";
import ToolPrintHeaderCell from "./tool-print-header-cell";
const _hoisted_1 = { class: "ele-tool-column-header" };
const _hoisted_2 = { class: "ele-tool-column-label" };
const _hoisted_3 = { class: "ele-tool-form-options" };
const _hoisted_4 = ["width"];
const _hoisted_5 = { key: 0 };
const _hoisted_6 = ["colspan", "rowspan"];
const _hoisted_7 = ["rowspan", "colspan"];
const _hoisted_8 = ["colspan", "rowspan"];
const _hoisted_9 = { key: 1 };
const _hoisted_10 = ["colspan", "rowspan"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ToolPrint" },
  __name: "tool-print",
  props: {
    /** 表格国际化 */
    locale: {
      type: Object,
      required: true
    },
    /** 缓存本地的名称 */
    cacheKey: String,
    /** 弹窗参数 */
    modalProps: Object,
    /** 打印组件参数 */
    printerProps: Object,
    /** 打印表格参数 */
    tableProps: Object,
    /** 列数据 */
    columns: Array,
    /** 表格选中数据 */
    selections: Array,
    /** 表格当前页数据 */
    pageData: Array,
    /** 表格全部数据 */
    datasource: [Array, Function],
    /** 单元格合并行列方法 */
    spanMethod: Function,
    /** 表格是否有表头 */
    tableHeader: Boolean,
    /** 是否显示合计行 */
    showSummary: Boolean,
    /** 合计行文本 */
    sumText: String,
    /** 合计行自定义方法 */
    summaryMethod: Function,
    /** 自定义表格样式 */
    tableStyle: Object,
    /** 单元格样式 */
    cellStyle: [Object, Function],
    /** 单元格类名自定义 */
    cellClassName: [String, Function],
    /** 单元格样式 */
    headerCellStyle: [Object, Function],
    /** 单元格类名自定义 */
    headerCellClassName: [String, Function],
    /** 序号列起始索引 */
    pageIndex: Number,
    /** 树表字段名 */
    treeProps: Object,
    /** 表格请求数据方法 */
    fetch: Function,
    /** 默认数据类型 */
    defaultDataType: {
      type: String,
      default: "pageData"
    },
    /** 默认是否勾选表尾 */
    defaultShowFooter: {
      type: Boolean,
      default: true
    },
    /** 默认是否勾选层级序号 */
    defaultShowTreeIndex: Boolean,
    /** 打印前的钩子函数 */
    beforePrint: Function,
    /** 打印插件 */
    printPlugin: Function,
    /** 获取数据源返回结果方法 */
    getDatasourceResult: {
      type: Function,
      required: true
    }
  },
  setup(__props, { expose: __expose }) {
    const ownSlots = ["printTop", "printBottom"];
    const props = __props;
    const visible = ref(false);
    const loading = ref(false);
    const dataType = ref(props.defaultDataType);
    const colItems = ref([]);
    const isCheckAll = ref(false);
    const isIndeterminate = ref(false);
    const showHeader = ref(true);
    const showFooter = ref(false);
    const showTreeIndex = ref(false);
    const treeIndexDisabled = ref(true);
    const isDragging = ref(false);
    const printOptions = reactive({
      printing: false,
      headerData: [],
      bodyData: [],
      footerData: [],
      hasHeader: false,
      hasFooter: false,
      bodyCols: [],
      data: []
    });
    const showLoading = () => {
      loading.value = true;
    };
    const hideLoading = () => {
      loading.value = false;
    };
    const openModal = () => {
      visible.value = true;
    };
    const closeModal = () => {
      hideLoading();
      visible.value = false;
    };
    const handlePrintDone = () => {
      hideLoading();
    };
    const printData = (params) => {
      showLoading();
      const printDataValue = params?.data || [];
      const isShowHeader = params?.showHeader ?? showHeader.value;
      const isShowFooter = params?.showFooter ?? showFooter.value;
      const isShowTreeIndex = params?.showTreeIndex ?? showTreeIndex.value;
      const printDataType = params?.dataType ?? dataType.value;
      const printColumns = params?.columns || getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsPrintFilter,
        false,
        colItems.value
      );
      const tableColumns = params?.tableColumns || params?.columns || getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsPrintFilter,
        true,
        colItems.value
      );
      const { headerData, bodyData, footerData, bodyCols } = getExportData(
        printDataValue,
        printColumns,
        props.spanMethod,
        printDataType === "pageData" ? props.pageIndex : void 0,
        isShowFooter,
        props.sumText,
        props.summaryMethod,
        props.treeProps?.children,
        isShowTreeIndex,
        isShowHeader
      );
      const printParams = {
        data: printDataValue,
        columns: printColumns,
        headerData,
        bodyData,
        footerData,
        bodyCols,
        dataType: printDataType,
        hideLoading,
        closeModal,
        showHeader: isShowHeader,
        showFooter: isShowFooter,
        showTreeIndex: isShowTreeIndex,
        tableColumns
      };
      if (typeof props.beforePrint === "function") {
        const flag = props.beforePrint(printParams);
        if (flag === false) {
          return;
        }
      }
      if (props.printPlugin == null) {
        printOptions.data = printDataValue;
        printOptions.headerData = headerData;
        printOptions.bodyData = bodyData;
        printOptions.footerData = footerData;
        printOptions.hasHeader = !!printOptions.headerData.length;
        printOptions.hasFooter = !!printOptions.footerData.length;
        printOptions.bodyCols = bodyCols;
        nextTick(() => {
          printOptions.printing = true;
        });
        return;
      }
      props.printPlugin(printParams).then(() => {
        hideLoading();
        closeModal();
      }).catch(() => {
        hideLoading();
      });
    };
    const handlePrint = () => {
      if (dataType.value === "selections") {
        printData({ data: [...props.selections || []] });
        return;
      }
      if (dataType.value !== "data") {
        printData({ data: [...props.pageData || []] });
        return;
      }
      if (props.datasource == null || typeof props.datasource !== "function" || typeof props.fetch !== "function") {
        return;
      }
      const columns = getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsPrintFilter,
        false,
        colItems.value
      );
      const tableColumns = getCheckedColumns(
        props.columns,
        colItems.value,
        true,
        void 0,
        columnsPrintFilter,
        true,
        colItems.value
      );
      showLoading();
      props.fetch((params) => {
        props.datasource({
          ...params,
          columns,
          tableColumns
        }).then((result) => {
          if (result == null) {
            hideLoading();
            closeModal();
            return;
          }
          if (Array.isArray(result)) {
            printData({ data: result });
            return;
          }
          const { data } = props.getDatasourceResult(result);
          if (data == null) {
            hideLoading();
            closeModal();
            return;
          }
          printData({ data });
        }).catch((e) => {
          console.error(e);
          hideLoading();
        });
      });
    };
    const initColItems = () => {
      const colsWidth = getCacheColsWidth(props.cacheKey);
      const { cols, checkAll, indeterminate } = getColItems(
        props.columns,
        props.locale,
        columnsPrintFilter,
        void 0,
        true,
        true,
        colsWidth
      );
      colItems.value = cols;
      isCheckAll.value = checkAll;
      isIndeterminate.value = indeterminate;
    };
    const handleCheckedChange = (item, checked, type) => {
      let checkAll = true;
      let indeterminate = false;
      eachTree(colItems.value, (d) => {
        const flag = item == null ? type === d.type : d.uid === item.uid;
        if (flag) {
          d.checked = checked;
        }
        if (!d.checked && checkAll) {
          checkAll = false;
        }
        if (d.checked && !indeterminate) {
          indeterminate = true;
        }
        if (flag && !checkAll && indeterminate) {
          return false;
        }
      });
      isCheckAll.value = colItems.value.length > 0 && checkAll;
      isIndeterminate.value = !checkAll && indeterminate;
    };
    const handleCheckAllChange = (checked) => {
      isCheckAll.value = checked;
      isIndeterminate.value = false;
      eachTree(colItems.value, (d) => {
        if (d.checked !== checked) {
          d.checked = checked;
        }
      });
    };
    const handleSortChange = (items, parent) => {
      if (!parent) {
        colItems.value = items;
      } else {
        eachTree(colItems.value, (d) => {
          if (d.uid === parent.uid) {
            d.children = items;
            return false;
          }
        });
      }
    };
    const handleColWidthChange = (item, width) => {
      eachTree(colItems.value, (d) => {
        if (d.uid === item.uid) {
          d.width = width;
          return false;
        }
      });
    };
    const handleReset = () => {
      initColItems();
    };
    const handleTreeIndexChange = (checked) => {
      if (checked) {
        handleCheckedChange(void 0, false, "index");
      }
    };
    const handleSortStart = () => {
      isDragging.value = true;
    };
    const handleSortEnd = () => {
      isDragging.value = false;
    };
    watch(visible, (visible2) => {
      if (visible2) {
        dataType.value = props.defaultDataType;
        initColItems();
        showHeader.value = !!props.tableHeader;
        showFooter.value = props.showSummary ? !!props.defaultShowFooter : false;
        treeIndexDisabled.value = !(props.pageData && props.pageData.some(
          (d) => d[props.treeProps?.children || "children"]?.length || d[props.treeProps?.hasChildren || "hasChildren"]
        )) && findTree(colItems.value, (c) => c.type === "expand") == null;
        showTreeIndex.value = treeIndexDisabled.value ? false : !!props.defaultShowTreeIndex;
        return;
      }
      printOptions.data = [];
      printOptions.headerData = [];
      printOptions.bodyData = [];
      printOptions.footerData = [];
      printOptions.bodyCols = [];
      printOptions.hasHeader = false;
      printOptions.hasFooter = false;
      printOptions.printing = false;
      hideLoading();
    });
    __expose({
      openModal,
      closeModal,
      printData
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(EleModal, mergeProps({
          form: true,
          width: "460px",
          title: __props.locale.print,
          position: "center"
        }, __props.modalProps || {}, {
          modelValue: visible.value,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => visible.value = $event)
        }), {
          footer: withCtx(() => [
            createVNode(unref(ElButton), { onClick: closeModal }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(__props.locale.exportCancel), 1)
              ]),
              _: 1
            }),
            createVNode(unref(ElButton), {
              loading: loading.value,
              type: "primary",
              onClick: handlePrint
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(__props.locale.exportOk), 1)
              ]),
              _: 1
            }, 8, ["loading"])
          ]),
          default: withCtx(() => [
            createVNode(unref(ElForm), {
              labelWidth: "80px",
              onSubmit: _cache[4] || (_cache[4] = withModifiers(() => {
              }, ["prevent"])),
              class: "ele-tool-print-form"
            }, {
              default: withCtx(() => [
                createVNode(unref(ElFormItem), {
                  label: __props.locale.exportSelectData
                }, {
                  default: withCtx(() => [
                    createVNode(unref(ElSelect), {
                      modelValue: dataType.value,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => dataType.value = $event),
                      placeholder: __props.locale.exportSelectData
                    }, {
                      default: withCtx(() => [
                        __props.pageData != null ? (openBlock(), createBlock(unref(ElOption), {
                          key: 0,
                          value: "pageData",
                          label: __props.locale.exportDataTypePage
                        }, null, 8, ["label"])) : createCommentVNode("", true),
                        __props.selections != null ? (openBlock(), createBlock(unref(ElOption), {
                          key: 1,
                          value: "selections",
                          label: __props.locale.exportDataTypeSelected
                        }, null, 8, ["label"])) : createCommentVNode("", true),
                        __props.datasource != null ? (openBlock(), createBlock(unref(ElOption), {
                          key: 2,
                          value: "data",
                          label: __props.locale.exportDataTypeAll
                        }, null, 8, ["label"])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["modelValue", "placeholder"])
                  ]),
                  _: 1
                }, 8, ["label"]),
                createVNode(unref(ElFormItem), {
                  label: __props.locale.exportSelectColumn
                }, {
                  default: withCtx(() => [
                    createElementVNode("div", {
                      class: normalizeClass(["ele-tool-column is-sortable", { "is-dragging": isDragging.value }])
                    }, [
                      createElementVNode("div", _hoisted_1, [
                        createElementVNode("div", _hoisted_2, [
                          createVNode(unref(ElCheckbox), {
                            label: __props.locale.columnTitle,
                            modelValue: isCheckAll.value,
                            indeterminate: isIndeterminate.value,
                            "onUpdate:modelValue": handleCheckAllChange
                          }, null, 8, ["label", "modelValue", "indeterminate"])
                        ]),
                        createElementVNode("div", {
                          class: "ele-tool-column-link",
                          onClick: handleReset
                        }, toDisplayString(__props.locale.columnReset), 1)
                      ]),
                      createVNode(ToolColumnList, {
                        data: colItems.value,
                        sortable: true,
                        allowWidth: true,
                        columnWidthPlaceholder: __props.locale.columnWidth,
                        onSortChange: handleSortChange,
                        onCheckedChange: handleCheckedChange,
                        onColWidthChange: handleColWidthChange,
                        onSortStart: handleSortStart,
                        onSortEnd: handleSortEnd
                      }, null, 8, ["data", "columnWidthPlaceholder"])
                    ], 2)
                  ]),
                  _: 1
                }, 8, ["label"]),
                createVNode(unref(ElFormItem), {
                  label: __props.locale.exportOther
                }, {
                  default: withCtx(() => [
                    createElementVNode("div", _hoisted_3, [
                      createVNode(unref(ElCheckbox), {
                        label: __props.locale.exportOtherHeader,
                        modelValue: showHeader.value,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => showHeader.value = $event)
                      }, null, 8, ["label", "modelValue"]),
                      createVNode(unref(ElCheckbox), {
                        label: __props.locale.exportOtherFooter,
                        modelValue: showFooter.value,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => showFooter.value = $event),
                        disabled: !__props.showSummary
                      }, null, 8, ["label", "modelValue", "disabled"]),
                      createVNode(unref(ElCheckbox), {
                        label: __props.locale.exportOtherTreeIndex,
                        modelValue: showTreeIndex.value,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => showTreeIndex.value = $event),
                        disabled: treeIndexDisabled.value,
                        onChange: handleTreeIndexChange
                      }, null, 8, ["label", "modelValue", "disabled"])
                    ])
                  ]),
                  _: 1
                }, 8, ["label"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 16, ["title", "modelValue"]),
        createVNode(ElePrinter, mergeProps({ target: "_iframe" }, __props.printerProps || {}, {
          modelValue: printOptions.printing,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => printOptions.printing = $event),
          onDone: handlePrintDone
        }), {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "printTop", {
              data: printOptions.data
            }),
            createVNode(EleTable, mergeProps({
              border: true,
              printSkin: true,
              hasHeader: printOptions.hasHeader,
              hasFooter: printOptions.hasFooter,
              style: __props.tableStyle
            }, __props.tableProps || {}), {
              default: withCtx(() => [
                createElementVNode("colgroup", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(printOptions.bodyCols, (col) => {
                    return openBlock(), createElementBlock("col", {
                      key: col.key,
                      width: col.width
                    }, null, 8, _hoisted_4);
                  }), 128))
                ]),
                printOptions.hasHeader ? (openBlock(), createElementBlock("thead", _hoisted_5, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(printOptions.headerData, (item, index) => {
                    return openBlock(), createElementBlock("tr", { key: index }, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(item, (col, columnIndex) => {
                        return openBlock(), createElementBlock(Fragment, {
                          key: col.key
                        }, [
                          col.isTreeIndex ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                            col.rowspan !== 0 && col.colspan !== 0 ? (openBlock(), createElementBlock("th", {
                              key: 0,
                              colspan: col.colspan,
                              rowspan: col.rowspan,
                              class: "ele-print-tree-index"
                            }, null, 8, _hoisted_6)) : createCommentVNode("", true)
                          ], 64)) : col.rowspan !== 0 && col.colspan !== 0 ? (openBlock(), createBlock(ToolPrintHeaderCell, {
                            key: 1,
                            col,
                            columnIndex,
                            headerCellStyle: __props.headerCellStyle,
                            headerCellClass: __props.headerCellClassName
                          }, createSlots({ _: 2 }, [
                            renderList(Object.keys(_ctx.$slots).filter(
                              (k) => !ownSlots.includes(k)
                            ), (name) => {
                              return {
                                name,
                                fn: withCtx((slotProps) => [
                                  renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                                ])
                              };
                            })
                          ]), 1032, ["col", "columnIndex", "headerCellStyle", "headerCellClass"])) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true),
                createElementVNode("tbody", null, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(printOptions.bodyData, (item, index) => {
                    return openBlock(), createElementBlock("tr", { key: index }, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(item, (col, columnIndex) => {
                        return openBlock(), createElementBlock(Fragment, {
                          key: col.key
                        }, [
                          col.isExpandCell ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                            col.rowspan !== 0 && col.colspan !== 0 ? (openBlock(), createElementBlock("td", {
                              key: 0,
                              rowspan: col.rowspan,
                              colspan: col.colspan,
                              style: { paddingLeft: 0, paddingRight: 0 },
                              class: "ele-print-expand-td"
                            }, [
                              col.column && (col.column.printSlot || col.column.slot) && !ownSlots.includes(
                                col.column.printSlot || col.column.slot
                              ) ? renderSlot(_ctx.$slots, col.column.printSlot || col.column.slot, mergeProps({
                                key: 0,
                                ref_for: true
                              }, {
                                row: col.row,
                                column: col.column,
                                $index: col.index
                              })) : createCommentVNode("", true)
                            ], 8, _hoisted_7)) : createCommentVNode("", true)
                          ], 64)) : col.isTreeIndex ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                            col.rowspan !== 0 && col.colspan !== 0 ? (openBlock(), createElementBlock("td", {
                              key: 0,
                              colspan: col.colspan,
                              rowspan: col.rowspan,
                              style: normalizeStyle({
                                paddingLeft: 0,
                                paddingRight: 0,
                                textAlign: "center",
                                verticalAlign: "top",
                                borderLeftColor: col.hideLeftBorder ? "transparent" : void 0
                              }),
                              class: normalizeClass(["ele-print-tree-index", {
                                "is-placeholder": col.text == null || col.text === ""
                              }])
                            }, toDisplayString(col.text), 15, _hoisted_8)) : createCommentVNode("", true)
                          ], 64)) : col.rowspan !== 0 && col.colspan !== 0 ? (openBlock(), createBlock(ToolPrintBodyCell, {
                            key: 2,
                            col,
                            columnIndex,
                            bodyCellStyle: __props.cellStyle,
                            bodyCellClass: __props.cellClassName
                          }, createSlots({ _: 2 }, [
                            renderList(Object.keys(_ctx.$slots).filter(
                              (k) => !ownSlots.includes(k)
                            ), (name) => {
                              return {
                                name,
                                fn: withCtx((slotProps) => [
                                  renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                                ])
                              };
                            })
                          ]), 1032, ["col", "columnIndex", "bodyCellStyle", "bodyCellClass"])) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ]);
                  }), 128))
                ]),
                printOptions.hasFooter ? (openBlock(), createElementBlock("tfoot", _hoisted_9, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(printOptions.footerData, (item, index) => {
                    return openBlock(), createElementBlock("tr", { key: index }, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(item, (col) => {
                        return openBlock(), createElementBlock(Fragment, null, [
                          col.rowspan !== 0 && col.colspan !== 0 ? (openBlock(), createElementBlock("td", {
                            key: col.key,
                            colspan: col.colspan,
                            rowspan: col.rowspan
                          }, [
                            !col.isExpandCell ? (openBlock(), createBlock(unref(CellRender), {
                              key: 0,
                              render: () => col.text,
                              params: []
                            }, null, 8, ["render"])) : createCommentVNode("", true)
                          ], 8, _hoisted_10)) : createCommentVNode("", true)
                        ], 64);
                      }), 256))
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
              ]),
              _: 3
            }, 16, ["hasHeader", "hasFooter", "style"]),
            renderSlot(_ctx.$slots, "printBottom", {
              data: printOptions.data
            })
          ]),
          _: 3
        }, 16, ["modelValue"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

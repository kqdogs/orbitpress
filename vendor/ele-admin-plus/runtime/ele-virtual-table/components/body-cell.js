import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeStyle, normalizeClass, createElementVNode, Fragment, createCommentVNode, withModifiers, createVNode, unref, withCtx, createBlock, normalizeProps, mergeProps, createTextVNode, toDisplayString } from "vue";
import { ElIcon } from "element-plus";
import { getValue } from "../../utils/common";
import { LoadingDotOutlined, ArrowDown } from "../../icons/index";
import CellCheckbox from "./cell-checkbox";
import { getCellSpan, getIndexValue, CellRender } from "../util";
const _hoisted_1 = {
  key: 2,
  class: "ele-table-placeholder"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BodyCell" },
  __name: "body-cell",
  props: {
    /** 列配置 */
    column: {
      type: Object,
      required: true
    },
    /** 列索引 */
    columnIndex: {
      type: Number,
      required: true
    },
    /** 行索引 */
    rowIndex: {
      type: Number,
      required: true
    },
    /** 行数据 */
    rowData: {
      type: Object,
      required: true
    },
    /** 所有列的列宽 */
    colSizes: {
      type: Array,
      required: true
    },
    /** 单元格类名自定义 */
    bodyCellClass: [String, Function],
    /** 单元格样式自定义 */
    bodyCellStyle: [Object, Function],
    /** 单元格合并行列方法 */
    spanMethod: Function,
    /** 溢出提示组件全局属性 */
    tableTooltipProps: [Boolean, Object],
    /** 序号列起始编号 */
    pageIndex: Number,
    /** 表格行高 */
    rowHeight: Number,
    /** 多选当前行是否选中 */
    isChecked: Boolean,
    /** 多选当前行是否禁用 */
    isDisabled: Boolean,
    /** 表格尺寸 */
    tableSize: String,
    /** 树表格展开图标的列 */
    expandColumnKey: String,
    /** 树表格当前行是否有子级 */
    hasChildren: Boolean,
    /** 树表格当前行缩进 */
    rowIndent: String,
    /** 树表格当前行是否折叠 */
    isCollapse: Boolean,
    /** 树表格子级加载状态 */
    loading: Boolean,
    /** 是否需要固定单元格高度 */
    fixedCellHeight: Boolean,
    /** 表格是否是自适应行高 */
    autoRowHeight: Boolean
  },
  emits: {
    /** 多选框选中改变事件 */
    checkedChange: (_checked) => true,
    /** 展开状态改变事件 */
    expandChange: (_expanded) => true,
    /** 点击事件 */
    click: (_col, _e) => true,
    /** 双击事件 */
    dblclick: (_col, _e) => true,
    /** 右键事件 */
    contextmenu: (_col, _e) => true,
    /** 鼠标移入事件 */
    mouseenter: (_col, _e) => true,
    /** 鼠标移出事件 */
    mouseleave: (_col, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const originalCol = computed(() => props.column.originalCol);
    const colType = computed(() => originalCol.value.type ?? "");
    const cellParam = computed(() => {
      return {
        column: originalCol.value,
        columnIndex: props.columnIndex,
        rowIndex: props.rowIndex,
        row: props.rowData
      };
    });
    const cellSpan = computed(() => {
      const span = getCellSpan(cellParam.value, props.spanMethod);
      if (["index", "selection", "expand"].includes(colType.value)) {
        span.rowspan = 1;
      }
      return span;
    });
    const isEllipsis = computed(() => {
      if (colType.value === "selection" || colType.value === "expand") {
        return true;
      }
      const col = originalCol.value;
      if (col && col.showOverflowTooltip != null) {
        return col.showOverflowTooltip !== false;
      }
      return !!props.tableTooltipProps;
    });
    const cellClass = computed(() => {
      const classes = ["el-table-v2__row-cell", "ele-table-td"];
      if (!cellSpan.value.colspan) {
        classes.push("is-none");
      } else if (cellSpan.value.colspan > 1) {
        classes.push("is-multi-cell");
      }
      if (!cellSpan.value.rowspan) {
        classes.push("is-placeholder");
      } else if (cellSpan.value.rowspan > 1) {
        classes.push("is-multi-row");
      }
      if (colType.value === "index") {
        classes.push("is-index");
      }
      if (colType.value === "selection") {
        classes.push("is-selection");
      }
      if (colType.value === "expand") {
        classes.push("is-expand");
      }
      const col = originalCol.value;
      if (col) {
        if (col.align) {
          classes.push(`is-align-${col.align}`);
        }
        if (isEllipsis.value) {
          classes.push("is-ellipsis");
        }
        if (col.fixed === "right") {
          classes.push("is-fixed-right");
        } else if (col.fixed === "left" || col.fixed === true) {
          classes.push("is-fixed-left");
        }
        if (props.column) {
          if (props.column.isFixedLeftLast) {
            classes.push("is-fixed-left-last");
          }
          if (props.column.isFixedRightFirst) {
            classes.push("is-fixed-right-first");
          }
        }
        if (typeof props.bodyCellClass === "function") {
          const temp = props.bodyCellClass(cellParam.value);
          if (temp) {
            classes.push(temp);
          }
        } else if (props.bodyCellClass) {
          classes.push(props.bodyCellClass);
        }
        if (col.className) {
          classes.push(col.className);
        }
      }
      return classes.join(" ");
    });
    const cellWidth = computed(() => {
      const colspan = cellSpan.value.colspan;
      if (colspan === 0) {
        return "0px";
      }
      let width = props.colSizes[props.columnIndex].width || 0;
      if (colspan && colspan > 1) {
        const end = props.columnIndex + colspan;
        for (let i = props.columnIndex + 1; i < end; i++) {
          if (props.colSizes[i] && props.colSizes[i].width != null) {
            width += props.colSizes[i].width;
          }
        }
      }
      return width + "px";
    });
    const cellHeight = computed(() => {
      if (props.fixedCellHeight && props.rowHeight != null) {
        return props.rowHeight + "px";
      }
      const rowspan = cellSpan.value.rowspan;
      if (props.rowHeight == null || rowspan == null || rowspan <= 1) {
        return;
      }
      return rowspan * props.rowHeight + "px";
    });
    const cellMinHeight = computed(() => {
      if (!props.autoRowHeight || !props.rowHeight) {
        return;
      }
      return props.rowHeight + "px";
    });
    const colSize = computed(() => {
      if (!props.colSizes || props.columnIndex == null) {
        return;
      }
      return props.colSizes[props.columnIndex];
    });
    const cellStyle = computed(() => {
      const userStyle = props.bodyCellStyle;
      const param = cellParam.value;
      return [
        {
          width: cellWidth.value,
          height: cellHeight.value,
          minHeight: cellMinHeight.value,
          left: colSize.value ? colSize.value.fixedLeft : void 0,
          right: colSize.value ? colSize.value.fixedRight : void 0
        },
        (typeof userStyle === "function" ? userStyle(param) : userStyle) || {}
      ];
    });
    const cellText = computed(() => {
      const col = originalCol.value;
      if (col && col.type === "index") {
        if (typeof col.index === "function") {
          return;
        }
        return getIndexValue(props.rowIndex, col.index, props.pageIndex);
      }
      const prop = props.column ? props.column.dataKey : void 0;
      const { rowspan, colspan } = cellSpan.value;
      if (rowspan === 0 || colspan === 0 || prop == null || !props.rowData) {
        return;
      }
      return getValue(props.rowData, prop);
    });
    const isExpandCol = computed(() => {
      return props.column != null && props.expandColumnKey != null && props.expandColumnKey === props.column.key;
    });
    const renderOpt = computed(() => {
      const col = originalCol.value;
      const { rowspan, colspan } = cellSpan.value;
      if (col && rowspan !== 0 && colspan !== 0) {
        const { rowIndex, rowData } = props;
        if (col.type === "index") {
          if (typeof col.index === "function") {
            return { render: col.index, params: [rowIndex] };
          }
          return {};
        }
        if (col.slot && typeof slots[col.slot] === "function") {
          return {
            render: slots[col.slot],
            params: [{ row: rowData, column: col, $index: rowIndex }]
          };
        }
        if (typeof col.formatter === "function") {
          return {
            render: col.formatter,
            params: [rowData, col, cellText.value, rowIndex]
          };
        }
      }
      return {};
    });
    const handleTextClick = (e) => {
      if (colType.value === "selection") {
        e.stopPropagation();
      }
    };
    const handleCheckedChange = (checked) => {
      emit("checkedChange", checked);
    };
    const handleExpandChange = () => {
      if (!props.loading) {
        emit("expandChange", props.isCollapse);
      }
    };
    const handleClick = (e) => {
      emit("click", originalCol.value, e);
    };
    const handleDblclick = (e) => {
      emit("dblclick", originalCol.value, e);
    };
    const handleContextmenu = (e) => {
      emit("contextmenu", originalCol.value, e);
    };
    const handleMouseenter = (e) => {
      emit("mouseenter", originalCol.value, e);
    };
    const handleMouseleave = (e) => {
      emit("mouseleave", originalCol.value, e);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(cellClass.value),
        style: normalizeStyle(cellStyle.value),
        onClick: handleClick,
        onDblclick: handleDblclick,
        onContextmenu: handleContextmenu,
        onMouseenter: handleMouseenter,
        onMouseleave: handleMouseleave
      }, [
        createElementVNode("div", {
          class: "ele-table-cell",
          onClick: handleTextClick
        }, [
          isExpandCol.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            __props.rowIndent ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "ele-table-indent",
              style: normalizeStyle({ width: __props.rowIndent })
            }, null, 4)) : createCommentVNode("", true),
            __props.hasChildren ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: normalizeClass(["ele-table-expand", { "is-collapse": __props.isCollapse }]),
              onClick: withModifiers(handleExpandChange, ["stop"])
            }, [
              createVNode(unref(ElIcon), {
                class: normalizeClass({ "is-loading": __props.loading })
              }, {
                default: withCtx(() => [
                  __props.loading ? (openBlock(), createBlock(unref(LoadingDotOutlined), { key: 0 })) : (openBlock(), createBlock(unref(ArrowDown), { key: 1 }))
                ]),
                _: 1
              }, 8, ["class"])
            ], 2)) : (openBlock(), createElementBlock("div", _hoisted_1))
          ], 64)) : createCommentVNode("", true),
          colType.value === "selection" ? (openBlock(), createBlock(CellCheckbox, {
            key: 1,
            checked: __props.isChecked,
            disabled: __props.isDisabled,
            size: __props.tableSize,
            onChange: handleCheckedChange
          }, null, 8, ["checked", "disabled", "size"])) : colType.value !== "expand" ? (openBlock(), createBlock(unref(CellRender), normalizeProps(mergeProps({ key: 2 }, renderOpt.value)), {
            default: withCtx(() => [
              createTextVNode(toDisplayString(cellText.value), 1)
            ]),
            _: 1
          }, 16)) : createCommentVNode("", true)
        ])
      ], 38);
    };
  }
});
export {
  _sfc_main as default
};

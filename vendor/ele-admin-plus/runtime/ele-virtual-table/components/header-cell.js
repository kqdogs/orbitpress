import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeStyle, normalizeClass, Fragment, createElementVNode, createBlock, unref, normalizeProps, mergeProps, withCtx, createTextVNode, toDisplayString, createCommentVNode, withModifiers } from "vue";
import { useMoveEvent } from "../../utils/hook";
import { getColKey, getOrderValue, CellRender, getNumberSize } from "../util";
import CellCheckbox from "./cell-checkbox";
import CellFilter from "./cell-filter";
const _hoisted_1 = { class: "ele-table-cell" };
const _hoisted_2 = ["title"];
const _hoisted_3 = {
  key: 0,
  class: "ele-table-sorter"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "HeaderCell" },
  __name: "header-cell",
  props: {
    /** 当前列配置 */
    column: Object,
    /** 当前列索引 */
    columnIndex: Number,
    /** 当前行索引 */
    headerIndex: Number,
    /** 当前列宽 */
    colSize: Object,
    /** 表格排序状态 */
    sortBy: Object,
    /** 表格当前筛选值 */
    filterValue: Object,
    /** 表格是否是全选状态 */
    isCheckAll: Boolean,
    /** 表格是否是半选状态 */
    isIndeterminate: Boolean,
    /** 是否禁用表头选择框 */
    disabledCheckbox: Boolean,
    /** 表格尺寸 */
    tableSize: String,
    /** 单元格类名自定义 */
    headerCellClass: [String, Function],
    /** 单元格样式自定义 */
    headerCellStyle: [Object, Function],
    /** 表头单元格是否溢出省略 */
    headerEllipsis: Boolean,
    /** 表格行高 */
    rowHeight: Number
  },
  emits: {
    /** 多选框选中改变事件 */
    checkedChange: (_checked) => true,
    /** 列筛选改变事件 */
    filterChange: (_params) => true,
    /** 点击事件 */
    click: (_col, _e) => true,
    /** 右键事件 */
    contextmenu: (_col, _e) => true,
    /** 鼠标移入事件 */
    mouseenter: (_col, _e) => true,
    /** 列宽开始拉伸事件 */
    resizeStart: (_headerCol, _width, _lineLeft, _e) => true,
    /** 列宽拉伸事件 */
    resize: (_headerCol, _width, _lineLeft, _e) => true,
    /** 列宽结束拉伸事件 */
    resizeEnd: (_headerCol, _width, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = useSlots();
    const originalCol = computed(() => {
      return props.column ? props.column.originalCol : void 0;
    });
    const cellParam = computed(() => {
      return {
        column: originalCol.value,
        columnIndex: props.columnIndex,
        rowIndex: props.headerIndex
      };
    });
    const cellClass = computed(() => {
      const classes = ["el-table-v2__header-cell", "ele-table-td"];
      if (props.column) {
        if (!props.column.colspan) {
          classes.push("is-none");
        } else if (props.column.colspan > 1) {
          classes.push("is-multi-cell");
        }
        if (!props.column.rowspan) {
          classes.push("is-placeholder");
        } else if (props.column.rowspan > 1) {
          classes.push("is-multi-row");
        }
      }
      const col = originalCol.value;
      if (col) {
        const align = col.headerAlign || col.align;
        if (align) {
          classes.push(`is-align-${align}`);
        }
        if (col.sortable === true || col.sortable === "custom") {
          classes.push("is-sortable");
        }
        if (props.sortBy != null && getColKey(col) === props.sortBy.key) {
          const sortClass = getOrderValue(props.sortBy.order);
          if (sortClass) {
            classes.push(`is-${sortClass}`);
          }
        }
        if (col.filters && col.filters.length && props.filterValue && props.filterValue.length) {
          classes.push("is-filtered");
        }
        if (col.type === "selection") {
          classes.push("is-selection");
        }
        if (col.type === "expand") {
          classes.push("is-expand");
        }
        if (props.headerEllipsis) {
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
        if (typeof props.headerCellClass === "function") {
          const temp = props.headerCellClass(cellParam.value);
          if (temp) {
            classes.push(temp);
          }
        } else if (props.headerCellClass) {
          classes.push(props.headerCellClass);
        }
        if (col.labelClassName) {
          classes.push(col.labelClassName);
        }
      }
      return classes.join(" ");
    });
    const cellHeight = computed(() => {
      if (props.rowHeight == null || props.column == null || !props.column.rowspan || props.column.rowspan <= 1) {
        return;
      }
      return props.column.rowspan * props.rowHeight + "px";
    });
    const cellStyle = computed(() => {
      if (!props.colSize) {
        return;
      }
      const { width, fixedLeft, fixedRight } = props.colSize;
      const userStyle = props.headerCellStyle;
      const param = cellParam.value;
      return [
        {
          width: width + "px",
          height: cellHeight.value,
          left: fixedLeft,
          right: fixedRight
        },
        (typeof userStyle === "function" ? userStyle(param) : userStyle) || {}
      ];
    });
    const cellTitle = computed(() => {
      return originalCol.value ? originalCol.value.label : void 0;
    });
    const renderOpt = computed(() => {
      const col = originalCol.value;
      if (col) {
        const param = { column: col, $index: props.columnIndex };
        if (col.headerSlot) {
          const headerSlot = slots[col.headerSlot];
          if (typeof headerSlot === "function") {
            return { render: headerSlot, params: [param] };
          }
        }
        if (typeof col.renderHeader === "function") {
          return { render: col.renderHeader, params: [param] };
        }
      }
      return {};
    });
    const handleCheckedChange = (checked) => {
      emit("checkedChange", checked);
    };
    const handleFilterChange = (value) => {
      emit("filterChange", { column: originalCol.value, value });
    };
    const handleClick = (e) => {
      emit("click", originalCol.value, e);
    };
    const handleContextmenu = (e) => {
      emit("contextmenu", originalCol.value, e);
    };
    const handleMouseenter = (e) => {
      emit("mouseenter", originalCol.value, e);
    };
    let resizeEventData;
    const { handleMousedown, handleTouchstart } = useMoveEvent({
      start: ({ e }) => {
        const el = e.currentTarget?.parentElement;
        if (!el || !props.column) {
          resizeEventData = null;
          return;
        }
        const downW = el.offsetWidth;
        const lineLeft = el.offsetLeft + downW;
        resizeEventData = { downW, width: downW, left: lineLeft };
        emit("resizeStart", props.column, downW, lineLeft, e);
      },
      move: ({ distanceX, e }) => {
        if (!props.column || !resizeEventData) {
          return;
        }
        e.preventDefault();
        const width = (distanceX ?? 0) + resizeEventData.downW;
        resizeEventData.width = width;
        const minWidth = getNumberSize(props.column.originalCol?.minWidth, 30);
        if (width < minWidth) {
          resizeEventData.width = minWidth;
        }
        const lineLeft = resizeEventData.width + resizeEventData.left - resizeEventData.downW;
        emit("resize", props.column, resizeEventData.width, lineLeft, e);
      },
      end: ({ e }) => {
        if (!props.column || !resizeEventData) {
          return;
        }
        emit("resizeEnd", props.column, resizeEventData.width, e);
      },
      touchmoveOptions: { passive: false }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(cellClass.value),
        style: normalizeStyle(cellStyle.value),
        onClick: handleClick,
        onContextmenu: handleContextmenu,
        onMouseenter: handleMouseenter
      }, [
        originalCol.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createElementVNode("div", _hoisted_1, [
            createElementVNode("div", {
              class: "ele-cell-title",
              title: __props.headerEllipsis ? cellTitle.value : void 0
            }, [
              originalCol.value.type === "selection" ? (openBlock(), createBlock(CellCheckbox, {
                key: 0,
                checked: __props.isCheckAll,
                indeterminate: __props.isIndeterminate,
                disabled: __props.disabledCheckbox,
                size: __props.tableSize,
                onChange: handleCheckedChange
              }, null, 8, ["checked", "indeterminate", "disabled", "size"])) : (openBlock(), createBlock(unref(CellRender), normalizeProps(mergeProps({ key: 1 }, renderOpt.value)), {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(cellTitle.value), 1)
                ]),
                _: 1
              }, 16))
            ], 8, _hoisted_2),
            originalCol.value.sortable ? (openBlock(), createElementBlock("div", _hoisted_3)) : createCommentVNode("", true),
            originalCol.value.filters && originalCol.value.filters.length ? (openBlock(), createBlock(CellFilter, {
              key: 1,
              filtered: __props.filterValue,
              filterMultiple: originalCol.value.filterMultiple,
              filters: originalCol.value.filters,
              filterPlacement: originalCol.value.filterPlacement,
              onChange: handleFilterChange
            }, null, 8, ["filtered", "filterMultiple", "filters", "filterPlacement"])) : createCommentVNode("", true)
          ]),
          originalCol.value.resizable !== false && !(__props.column && __props.column.colspan && __props.column.colspan > 1) ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "ele-table-resize-handle",
            onClick: _cache[0] || (_cache[0] = withModifiers(() => {
            }, ["stop"])),
            onMousedown: _cache[1] || (_cache[1] = //@ts-ignore
            (...args) => unref(handleMousedown) && unref(handleMousedown)(...args)),
            onTouchstartPassive: _cache[2] || (_cache[2] = //@ts-ignore
            (...args) => unref(handleTouchstart) && unref(handleTouchstart)(...args))
          }, null, 32)) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true)
      ], 38);
    };
  }
});
export {
  _sfc_main as default
};

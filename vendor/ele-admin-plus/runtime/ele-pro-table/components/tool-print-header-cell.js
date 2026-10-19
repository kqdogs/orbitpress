import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createVNode, unref, normalizeProps, guardReactiveProps } from "vue";
import { CellRender } from "../../ele-virtual-table/util";
const _hoisted_1 = ["colspan", "rowspan"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ToolPrintHeaderCell" },
  __name: "tool-print-header-cell",
  props: {
    /** 列数据 */
    col: {
      type: Object,
      required: true
    },
    /** 列索引 */
    columnIndex: Number,
    /** 单元格样式 */
    headerCellStyle: [Object, Function],
    /** 单元格类名自定义 */
    headerCellClass: [String, Function]
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const renderOpt = computed(() => {
      const { text, column } = props.col;
      const params = [{ column, $index: props.columnIndex }];
      const slotName = column ? column.printHeaderSlot || column.headerSlot : void 0;
      if (column && slotName && typeof slots[slotName] === "function") {
        return { render: slots[slotName], params };
      }
      return { render: () => text, params };
    });
    const cellParam = computed(() => {
      return {
        column: props.col.column,
        columnIndex: props.columnIndex,
        rowIndex: props.col.index
      };
    });
    const cellStyle = computed(() => {
      if (typeof props.headerCellStyle === "function") {
        if (cellParam.value.column == null) {
          return;
        }
        return props.headerCellStyle(cellParam.value);
      }
      return props.headerCellStyle;
    });
    const cellClass = computed(() => {
      const classes = [];
      const column = cellParam.value.column;
      if (column) {
        const align = column.headerAlign || column.align;
        if (align) {
          classes.push(`is-align-${align}`);
        }
        if (typeof props.headerCellClass === "function") {
          const temp = props.headerCellClass(cellParam.value);
          if (temp) {
            classes.push(temp);
          }
        } else if (props.headerCellClass) {
          classes.push(props.headerCellClass);
        }
        if (column.labelClassName) {
          classes.push(column.labelClassName);
        }
      }
      return classes.join(" ");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("th", {
        colspan: __props.col.colspan,
        rowspan: __props.col.rowspan,
        style: normalizeStyle(cellStyle.value),
        class: normalizeClass(cellClass.value)
      }, [
        createVNode(unref(CellRender), normalizeProps(guardReactiveProps(renderOpt.value)), null, 16)
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, useSlots, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, Fragment, createTextVNode, toDisplayString, createBlock, unref, withCtx, createVNode, createCommentVNode, normalizeProps, guardReactiveProps } from "vue";
import { ElIcon } from "element-plus";
import { ArrowDown } from "../../icons/index";
import { CellRender } from "../../ele-virtual-table/util";
const _hoisted_1 = ["colspan", "rowspan"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ToolPrintBodyCell" },
  __name: "tool-print-body-cell",
  props: {
    /** 列数据 */
    col: {
      type: Object,
      required: true
    },
    /** 列索引 */
    columnIndex: Number,
    /** 单元格样式 */
    bodyCellStyle: [Object, Function],
    /** 单元格类名自定义 */
    bodyCellClass: [String, Function]
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const renderOpt = computed(() => {
      const { text, row, column, index: $index } = props.col;
      const params = [{ row, column, $index }];
      const slotName = column ? column.printSlot || column.slot : void 0;
      if (column && "expand" !== column.type && slotName && typeof slots[slotName] === "function") {
        return { render: slots[slotName], params };
      }
      return { render: () => text, params };
    });
    const cellParam = computed(() => {
      return {
        column: props.col.column,
        columnIndex: props.columnIndex,
        rowIndex: props.col.index,
        row: props.col.row
      };
    });
    const cellStyle = computed(() => {
      if (typeof props.bodyCellStyle === "function") {
        if (cellParam.value.column == null) {
          return;
        }
        return props.bodyCellStyle(cellParam.value);
      }
      return props.bodyCellStyle;
    });
    const cellClass = computed(() => {
      const classes = [];
      const column = cellParam.value.column;
      if (column) {
        if (column.align) {
          classes.push(`is-align-${column.align}`);
        }
        if (typeof props.bodyCellClass === "function") {
          const temp = props.bodyCellClass(cellParam.value);
          if (temp) {
            classes.push(temp);
          }
        } else if (props.bodyCellClass) {
          classes.push(props.bodyCellClass);
        }
        if (column.className) {
          classes.push(column.className);
        }
      }
      return classes.join(" ");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("td", {
        colspan: __props.col.colspan,
        rowspan: __props.col.rowspan,
        style: normalizeStyle(cellStyle.value),
        class: normalizeClass(cellClass.value)
      }, [
        "expand" === __props.col.column?.type ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          __props.col.text != null && __props.col.text !== "" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createTextVNode(toDisplayString(__props.col.text), 1)
          ], 64)) : (openBlock(), createBlock(unref(ElIcon), {
            key: 1,
            style: { "vertical-align": "middle" },
            class: "ele-print-expand-icon"
          }, {
            default: withCtx(() => [
              createVNode(unref(ArrowDown))
            ]),
            _: 1
          }))
        ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          __props.col.isTreeCell ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            __props.col.indent ? (openBlock(), createElementBlock("span", {
              key: 0,
              style: normalizeStyle({ paddingLeft: `${__props.col.indent * 16}px` }),
              class: "ele-print-tree-indent"
            }, null, 4)) : createCommentVNode("", true),
            createVNode(unref(ElIcon), {
              style: normalizeStyle({
                verticalAlign: "middle",
                marginRight: "2px",
                visibility: __props.col.isTreeLeaf ? "hidden" : void 0
              }),
              class: "ele-print-tree-icon"
            }, {
              default: withCtx(() => [
                createVNode(unref(ArrowDown))
              ]),
              _: 1
            }, 8, ["style"])
          ], 64)) : createCommentVNode("", true),
          createVNode(unref(CellRender), normalizeProps(guardReactiveProps(renderOpt.value)), null, 16)
        ], 64))
      ], 14, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, computed, openBlock, createElementBlock, Fragment, renderList, createBlock, createSlots, withCtx, renderSlot, mergeProps } from "vue";
import BodyCell from "./body-cell";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BodyRow" },
  __name: "body-row",
  props: {
    /** 主体列配置 */
    bodyCols: {
      type: Array,
      required: true
    },
    /** 表格主体列宽 */
    colSizes: {
      type: Array,
      required: true
    },
    /** 当前行索引 */
    rowIndex: {
      type: Number,
      required: true
    },
    /** 当前行对象 */
    rowItem: {
      type: Object,
      required: true
    },
    /** 当前行数据唯一值 */
    rowId: [String, Number],
    /** 表格多选选中的值 */
    checkedRowKeys: Set,
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
    /** 表格尺寸 */
    tableSize: String,
    /** 树表格展开图标的列 */
    expandColumnKey: String,
    /** 表格展开行的值 */
    expandedRowKeys: Array,
    /** 树表格是否懒加载子级 */
    lazy: Boolean,
    /** 树表格懒加载方法 */
    load: Function,
    /** 树表格行数据缩进级别 */
    level: Number,
    /** 树表格每一级行缩进大小 */
    indent: Number,
    /** 是否需要固定单元格高度 */
    fixedCellHeight: Boolean,
    /** 表格是否是自适应行高 */
    autoRowHeight: Boolean
  },
  emits: {
    /** 多选框选中改变事件 */
    cellCheckedChange: (_row, _checked) => true,
    /** 展开状态改变事件 */
    cellExpandChange: (_row, _expanded, _children) => true,
    /** 单元格点击事件 */
    cellClick: (_row, _col, _e) => true,
    /** 单元格双击事件 */
    cellDblclick: (_row, _col, _e) => true,
    /** 单元格右键事件 */
    cellContextmenu: (_row, _col, _e) => true,
    /** 单元格鼠标移入事件 */
    cellMouseenter: (_row, _col, _e) => true,
    /** 单元格鼠标移出事件 */
    cellMouseleave: (_row, _col, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const loading = ref(false);
    const isChecked = computed(() => {
      if (!props.checkedRowKeys || props.rowId == null) {
        return false;
      }
      return props.checkedRowKeys.has(props.rowId);
    });
    const hasChildren = computed(() => {
      if (props.rowItem) {
        if (props.rowItem.children) {
          return !!props.rowItem.children.length;
        }
        if (props.lazy && props.rowItem.hasChildren) {
          return true;
        }
      }
      return false;
    });
    const rowIndent = computed(() => {
      if (!props.level || !props.indent) {
        return;
      }
      return props.level * props.indent + "px";
    });
    const isCollapse = computed(() => {
      if (!props.expandedRowKeys || props.rowId == null) {
        return true;
      }
      return !props.expandedRowKeys.includes(props.rowId);
    });
    const handleCellCheckedChange = (checked) => {
      emit("cellCheckedChange", props.rowItem, checked);
    };
    const handleCellExpandChange = (expanded) => {
      if (expanded && props.lazy && !props.rowItem.children) {
        if (props.load) {
          loading.value = true;
          props.load(props.rowItem.rowData, null, (data) => {
            loading.value = false;
            emit("cellExpandChange", props.rowItem, expanded, data);
          });
        }
        return;
      }
      emit("cellExpandChange", props.rowItem, expanded);
    };
    const handleCellClick = (col, e) => {
      emit("cellClick", props.rowItem, col, e);
    };
    const handleCellDblclick = (col, e) => {
      emit("cellDblclick", props.rowItem, col, e);
    };
    const handleCellContextmenu = (col, e) => {
      emit("cellContextmenu", props.rowItem, col, e);
    };
    const handleCellMouseenter = (col, e) => {
      emit("cellMouseenter", props.rowItem, col, e);
    };
    const handleCellMouseleave = (col, e) => {
      emit("cellMouseleave", props.rowItem, col, e);
    };
    return (_ctx, _cache) => {
      return openBlock(true), createElementBlock(Fragment, null, renderList(__props.bodyCols, (column, columnIndex) => {
        return openBlock(), createBlock(BodyCell, {
          key: `${__props.rowId ?? __props.rowIndex}-${column.key ?? columnIndex}`,
          column,
          columnIndex,
          rowIndex: __props.rowIndex,
          rowData: __props.rowItem.rowData,
          colSizes: __props.colSizes,
          bodyCellClass: __props.bodyCellClass,
          bodyCellStyle: __props.bodyCellStyle,
          spanMethod: __props.spanMethod,
          tableTooltipProps: __props.tableTooltipProps,
          pageIndex: __props.pageIndex,
          rowHeight: __props.rowHeight,
          isChecked: isChecked.value,
          isDisabled: __props.rowItem.isDisabled,
          tableSize: __props.tableSize,
          expandColumnKey: __props.expandColumnKey,
          hasChildren: hasChildren.value,
          rowIndent: rowIndent.value,
          isCollapse: isCollapse.value,
          loading: loading.value,
          fixedCellHeight: __props.fixedCellHeight,
          autoRowHeight: __props.autoRowHeight,
          onCheckedChange: handleCellCheckedChange,
          onExpandChange: handleCellExpandChange,
          onClick: handleCellClick,
          onDblclick: handleCellDblclick,
          onContextmenu: handleCellContextmenu,
          onMouseenter: handleCellMouseenter,
          onMouseleave: handleCellMouseleave
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
              ])
            };
          })
        ]), 1032, ["column", "columnIndex", "rowIndex", "rowData", "colSizes", "bodyCellClass", "bodyCellStyle", "spanMethod", "tableTooltipProps", "pageIndex", "rowHeight", "isChecked", "isDisabled", "tableSize", "expandColumnKey", "hasChildren", "rowIndent", "isCollapse", "loading", "fixedCellHeight", "autoRowHeight"]);
      }), 128);
    };
  }
});
export {
  _sfc_main as default
};

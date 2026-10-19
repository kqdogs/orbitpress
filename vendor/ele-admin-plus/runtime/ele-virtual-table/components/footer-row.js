import { defineComponent, computed, openBlock, createElementBlock, normalizeStyle, Fragment, renderList, normalizeClass, createElementVNode, createVNode, unref } from "vue";
import { getUserSums, getSumValue, CellRender } from "../util";
const _hoisted_1 = { class: "ele-table-cell" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FooterRow" },
  __name: "footer-row",
  props: {
    /** 表格主体列配置 */
    bodyCols: {
      type: Array,
      required: true
    },
    /** 表格数据 */
    tableData: {
      type: Array,
      required: true
    },
    /** 表格主体列宽 */
    colSizes: {
      type: Array,
      required: true
    },
    /** 表格主体所有列合计宽度 */
    sumWidth: Number,
    /** 表格行高 */
    rowHeight: Number,
    /** 合计行文本 */
    sumText: String,
    /** 合计行自定义方法 */
    summaryMethod: Function
  },
  emits: {
    /** 单元格鼠标移入事件 */
    mouseenter: (_e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const data = computed(() => {
      return props.tableData.map((row) => row.rowData);
    });
    const userSums = computed(() => {
      return getUserSums(props.summaryMethod, props.bodyCols, data.value);
    });
    const sumCols = computed(() => {
      const sums = userSums.value;
      return props.bodyCols.map((column, i) => {
        const colSize = props.colSizes[i];
        const sumValue = getSumValue(data.value, column.dataKey);
        const col = column.originalCol;
        return {
          key: `${i}-${column.key}`,
          width: colSize && colSize.width || 0,
          fixedLeft: colSize ? colSize.fixedLeft : void 0,
          fixedRight: colSize ? colSize.fixedRight : void 0,
          text: sums == null ? i === 0 ? props.sumText : sumValue : sums[i],
          align: col ? col.align : void 0,
          fixed: col ? col.fixed : void 0,
          isFixedLeftLast: column.isFixedLeftLast,
          isFixedRightFirst: column.isFixedRightFirst
        };
      });
    });
    const handleMouseenter = (e) => {
      emit("mouseenter", e);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-table-foot-tr",
        style: normalizeStyle({ width: (__props.sumWidth || 0) + "px", height: (__props.rowHeight || 0) + "px" })
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(sumCols.value, (col) => {
          return openBlock(), createElementBlock("div", {
            key: col.key,
            class: normalizeClass(["ele-table-td is-ellipsis", [
              { "is-align-left": col.align === "left" },
              { "is-align-center": col.align === "center" },
              { "is-align-right": col.align === "right" },
              { "is-fixed-left": col.fixed === "left" || col.fixed === true },
              { "is-fixed-right": col.fixed === "right" },
              { "is-fixed-left-last": col.isFixedLeftLast },
              { "is-fixed-right-first": col.isFixedRightFirst }
            ]]),
            style: normalizeStyle({
              width: col.width + "px",
              left: col.fixedLeft,
              right: col.fixedRight
            }),
            onMouseenter: handleMouseenter
          }, [
            createElementVNode("div", _hoisted_1, [
              createVNode(unref(CellRender), {
                render: () => col.text,
                params: []
              }, null, 8, ["render"])
            ])
          ], 38);
        }), 128))
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};

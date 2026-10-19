import { defineComponent, resolveComponent, openBlock, createElementBlock, Fragment, renderList, createBlock, withCtx, createSlots, renderSlot, mergeProps, createCommentVNode, normalizeClass, normalizeStyle, createTextVNode, toDisplayString } from "vue";
import TableRow from "./table-row";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TableBody" },
  __name: "table-body",
  props: {
    /** 数据 */
    data: {
      type: Array,
      required: true
    },
    /** 列配置 */
    columns: {
      type: Array,
      required: true
    },
    /** 序号列宽度 */
    indexColWidth: {
      type: Number,
      required: true
    },
    /** 所处深度 */
    level: {
      type: Number,
      required: true
    },
    /** 最大深度 */
    depth: {
      type: Number,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_TableBody = resolveComponent("TableBody", true);
      return openBlock(), createElementBlock("div", null, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.data, (row, rowIndex) => {
          return openBlock(), createBlock(TableRow, {
            key: row.key ?? rowIndex,
            rowIndex,
            hasChildren: !!(row.children && row.children.length),
            indexColWidth: __props.indexColWidth,
            level: __props.level,
            depth: __props.depth
          }, {
            cells: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.columns, (col) => {
                return openBlock(), createElementBlock("div", {
                  key: col.key ?? col.prop,
                  style: normalizeStyle(col.style),
                  class: normalizeClass([col.class, "ele-tree-table-cell"])
                }, [
                  renderSlot(_ctx.$slots, "bodyCell", {
                    row,
                    rowIndex,
                    column: col,
                    treeLevel: __props.level
                  }, () => [
                    createTextVNode(toDisplayString(col.prop != null ? row[col.prop] : void 0), 1)
                  ])
                ], 6);
              }), 128))
            ]),
            default: withCtx(() => [
              row.children && row.children.length ? (openBlock(), createBlock(_component_TableBody, {
                key: 0,
                data: row.children,
                columns: __props.columns,
                level: __props.level + 1,
                depth: __props.depth,
                indexColWidth: __props.indexColWidth,
                class: "ele-tree-table-children"
              }, createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                    ])
                  };
                })
              ]), 1032, ["data", "columns", "level", "depth", "indexColWidth"])) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1032, ["rowIndex", "hasChildren", "indexColWidth", "level", "depth"]);
        }), 128))
      ]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, watch, nextTick, onMounted, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, Fragment, renderList, renderSlot, createTextVNode, toDisplayString, createBlock, createSlots, withCtx, normalizeProps, guardReactiveProps } from "vue";
import TableBody from "./components/table-body";
import { treeTableProps } from "./props";
const _hoisted_1 = { class: "ele-tree-table-row" };
const _hoisted_2 = {
  key: 1,
  class: "ele-tree-table-empty"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTreeTable" },
  __name: "index",
  props: treeTableProps,
  setup(__props) {
    const props = __props;
    const tableRef = ref(null);
    const depth = ref(1);
    const isPingLeft = ref(false);
    const isPingRight = ref(false);
    const checkTableScrollPing = (el) => {
      if (el) {
        const scrollLeft = el.scrollLeft;
        isPingLeft.value = scrollLeft > 1;
        const scrollWidth = el.scrollWidth - el.offsetWidth - 1;
        isPingRight.value = scrollWidth > 1 && scrollLeft < scrollWidth;
      }
    };
    const handleTableScroll = (e) => {
      checkTableScrollPing(e.currentTarget);
    };
    const getTreeDepth = (data, level = 0) => {
      let maxDepth = 0;
      if (data) {
        data.forEach((row) => {
          if (row.children && row.children.length) {
            const depth2 = getTreeDepth(row.children, level + 1);
            maxDepth = Math.max(maxDepth, depth2);
          }
        });
      }
      return maxDepth + 1;
    };
    watch(
      () => props.data,
      (data) => {
        depth.value = getTreeDepth(data);
      },
      {
        immediate: true,
        deep: true
      }
    );
    watch(
      () => props.columns,
      () => {
        nextTick(() => {
          checkTableScrollPing(tableRef.value);
        });
      },
      { deep: true }
    );
    onMounted(() => {
      checkTableScrollPing(tableRef.value);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-tree-table-wrapper", [{ "is-ping-left": isPingLeft.value }, { "is-ping-right": isPingRight.value }]])
      }, [
        createElementVNode("div", {
          ref_key: "tableRef",
          ref: tableRef,
          class: "ele-tree-table",
          style: normalizeStyle({ height: _ctx.height }),
          onScroll: handleTableScroll
        }, [
          createElementVNode("div", {
            class: "ele-tree-table-main",
            style: normalizeStyle(_ctx.tableStyle)
          }, [
            createElementVNode("div", {
              class: "ele-tree-table-header",
              style: normalizeStyle(_ctx.headerStyle)
            }, [
              createElementVNode("div", _hoisted_1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(depth.value, (num) => {
                  return openBlock(), createElementBlock("div", {
                    key: num,
                    style: normalizeStyle({
                      width: `${_ctx.indexColWidth}px`,
                      left: `${(num - 1) * _ctx.indexColWidth}px`
                    }),
                    class: normalizeClass(["ele-tree-table-cell is-tree-index is-fixed-left", [
                      { "is-placeholder": num !== 1 },
                      { "is-fixed-left-last": num === depth.value }
                    ]])
                  }, null, 6);
                }), 128)),
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columns || [], (col) => {
                  return openBlock(), createElementBlock("div", {
                    key: col.key ?? col.prop,
                    style: normalizeStyle(col.style),
                    class: normalizeClass(["ele-tree-table-cell", col.class])
                  }, [
                    renderSlot(_ctx.$slots, "headerCell", { column: col }, () => [
                      createTextVNode(toDisplayString(col.label), 1)
                    ])
                  ], 6);
                }), 128))
              ])
            ], 4),
            _ctx.data && _ctx.data.length ? (openBlock(), createBlock(TableBody, {
              key: 0,
              data: _ctx.data,
              columns: _ctx.columns || [],
              level: 1,
              depth: depth.value,
              indexColWidth: _ctx.indexColWidth,
              class: "ele-tree-table-body"
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["data", "columns", "depth", "indexColWidth"])) : (openBlock(), createElementBlock("div", _hoisted_2, "无数据"))
          ], 4)
        ], 36)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

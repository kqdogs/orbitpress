import { defineComponent, ref, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, toDisplayString, Fragment, renderList, createVNode, unref, withCtx, createCommentVNode, renderSlot } from "vue";
import { ElIcon } from "element-plus";
import { ArrowDown } from "../../icons/index";
const _hoisted_1 = { class: "ele-tree-table-row-body" };
const _hoisted_2 = { class: "ele-tree-table-cells" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TableRow" },
  __name: "table-row",
  props: {
    /** 行索引 */
    rowIndex: {
      type: Number,
      required: true
    },
    /** 是否有子级 */
    hasChildren: Boolean,
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
    const isCollapse = ref(false);
    const handleExpandClick = () => {
      isCollapse.value = !isCollapse.value;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-tree-table-row", { "is-collapse": isCollapse.value }])
      }, [
        createElementVNode("div", {
          style: normalizeStyle({
            width: `${__props.indexColWidth}px`,
            left: `${(__props.level - 1) * __props.indexColWidth}px`
          }),
          class: normalizeClass(["ele-tree-table-cell is-tree-index is-fixed-left", { "is-fixed-left-last": __props.depth === __props.level }])
        }, toDisplayString(__props.rowIndex + 1), 7),
        createElementVNode("div", _hoisted_1, [
          createElementVNode("div", _hoisted_2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.depth - __props.level, (num) => {
              return openBlock(), createElementBlock("div", {
                key: num,
                style: normalizeStyle({
                  width: `${__props.indexColWidth}px`,
                  left: `${(__props.level - 1 + num) * __props.indexColWidth}px`,
                  textAlign: __props.hasChildren && num === 1 ? "left" : void 0
                }),
                class: normalizeClass(["ele-tree-table-cell is-tree-index is-placeholder is-fixed-left", { "is-fixed-left-last": num === __props.depth - __props.level }])
              }, [
                __props.hasChildren && num === 1 ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: normalizeClass(["ele-tree-table-expand", { "is-collapse": isCollapse.value }]),
                  onClick: handleExpandClick
                }, [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowDown))
                    ]),
                    _: 1
                  })
                ], 2)) : createCommentVNode("", true)
              ], 6);
            }), 128)),
            renderSlot(_ctx.$slots, "cells")
          ]),
          renderSlot(_ctx.$slots, "default")
        ])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

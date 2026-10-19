import { defineComponent, ref, computed, onMounted, onBeforeUnmount, openBlock, createElementBlock, Fragment, renderList, normalizeClass, createElementVNode, createVNode, unref, mergeProps, withCtx, renderSlot, createBlock, resolveDynamicComponent, normalizeStyle, createCommentVNode, toDisplayString } from "vue";
import { ElIcon } from "element-plus";
import { CloseCircleFilled, CheckCircleFilled } from "../icons/index";
import { timelineEmits, timelineProps } from "./props";
const _hoisted_1 = ["onClick"];
const _hoisted_2 = { class: "ele-time-line-item-icon" };
const _hoisted_3 = { class: "ele-time-line-item-body" };
const _hoisted_4 = { class: "ele-time-line-item-title" };
const _hoisted_5 = { class: "ele-time-line-item-description" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTimeline" },
  __name: "index",
  props: timelineProps,
  emits: timelineEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const listRef = ref(null);
    const listWidth = ref(0);
    const listColNum = computed(() => {
      return Math.floor(listWidth.value / props.itemWidth) || 1;
    });
    const lineRows = computed(() => {
      const rows = [];
      const data = props.data || [];
      const colNum = listColNum.value;
      const rowNum = colNum ? Math.ceil(data.length / colNum) : 1;
      for (let i = 0; i < rowNum; i++) {
        const cells = [];
        for (let j = 0; j < colNum; j++) {
          const index = i * colNum + j;
          const itemData = data[index];
          cells.push({
            key: itemData?.key ?? `${i}_${j}`,
            data: itemData,
            dataIndex: index,
            nextDataType: data[index + 1]?.type,
            isFirst: itemData && index === 0,
            isLast: itemData && index === data.length - 1
          });
        }
        const key = `${i}_${cells.map((d) => d?.key ?? "").join()}`;
        rows.push({
          key,
          items: cells,
          isEvenRow: (i + 1) % 2 === 0
        });
      }
      return rows;
    });
    const handleItemClick = (item, e) => {
      if (item) {
        emit("itemClick", item, e);
      }
    };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
      requestAnimationFrame(() => {
        const listEl = listRef.value;
        listWidth.value = listEl?.clientWidth || 0;
      });
    }) : void 0;
    onMounted(() => {
      const listEl = listRef.value;
      if (listEl && observer) {
        observer.observe(listEl);
      }
    });
    onBeforeUnmount(() => {
      const listEl = listRef.value;
      if (listEl && observer) {
        observer.unobserve(listEl);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "listRef",
        ref: listRef,
        class: "ele-time-line-list"
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(lineRows.value, (row) => {
          return openBlock(), createElementBlock("div", {
            key: row.key,
            class: normalizeClass(["ele-time-line-row", { "is-even-row": row.isEvenRow }])
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(row.items, (col) => {
              return openBlock(), createElementBlock("div", {
                key: col.key,
                class: normalizeClass(["ele-time-line-item", [
                  { "is-first": col.isFirst },
                  { "is-last": col.isLast },
                  { "is-primary": col.data && col.data.type === "primary" },
                  { "is-danger": col.data && col.data.type === "danger" },
                  { "is-placeholder": !col.data }
                ]]),
                onClick: (e) => handleItemClick(col.data, e)
              }, [
                col.data ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createElementVNode("div", _hoisted_2, [
                    createElementVNode("div", {
                      class: normalizeClass(["ele-time-line-item-line is-start", [
                        { "is-primary-line": col.data.type === "primary" },
                        { "is-danger-line": col.data.type === "danger" }
                      ]])
                    }, null, 2),
                    createVNode(unref(ElIcon), mergeProps({ class: "ele-time-line-item-icon-status" }, { ref_for: true }, col.data.iconProps || {}), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "itemIcon", {
                          item: col.data
                        }, () => [
                          col.data.icon ? (openBlock(), createBlock(resolveDynamicComponent(col.data.icon), {
                            key: 0,
                            style: normalizeStyle(col.data.iconStyle)
                          }, null, 8, ["style"])) : col.data.type === "danger" ? (openBlock(), createBlock(unref(CloseCircleFilled), {
                            key: 1,
                            style: normalizeStyle(col.data.iconStyle)
                          }, null, 8, ["style"])) : (openBlock(), createBlock(unref(CheckCircleFilled), {
                            key: 2,
                            style: normalizeStyle(col.data.iconStyle)
                          }, null, 8, ["style"]))
                        ])
                      ]),
                      _: 2
                    }, 1040),
                    createElementVNode("div", {
                      class: normalizeClass(["ele-time-line-item-line is-end", [
                        { "is-primary-line": col.nextDataType === "primary" },
                        { "is-danger-line": col.nextDataType === "danger" }
                      ]])
                    }, null, 2)
                  ]),
                  !col.isLast ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    class: normalizeClass(["ele-time-line-item-line-turn", [
                      { "is-primary-line": col.nextDataType === "primary" },
                      { "is-danger-line": col.nextDataType === "danger" }
                    ]])
                  }, null, 2)) : createCommentVNode("", true),
                  createElementVNode("div", _hoisted_3, [
                    renderSlot(_ctx.$slots, "itemTitle", {
                      item: col.data
                    }, () => [
                      createElementVNode("div", _hoisted_4, toDisplayString(col.data.title), 1)
                    ]),
                    renderSlot(_ctx.$slots, "itemDescription", {
                      item: col.data
                    }, () => [
                      createElementVNode("div", _hoisted_5, toDisplayString(col.data.description), 1)
                    ])
                  ])
                ], 64)) : createCommentVNode("", true)
              ], 10, _hoisted_1);
            }), 128))
          ], 2);
        }), 128))
      ], 512);
    };
  }
});
export {
  _sfc_main as default
};

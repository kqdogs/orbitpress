import { defineComponent, computed, openBlock, createBlock, withCtx, createElementVNode, createElementBlock, withModifiers, normalizeClass, createCommentVNode, toDisplayString, Fragment, renderList, normalizeStyle, renderSlot, createTextVNode, createSlots, mergeProps } from "vue";
import MainContent from "../../ele-loading/components/main-content";
import FileTableItem from "./file-table-item";
import FileSort from "./file-sort";
const _hoisted_1 = { class: "ele-file-list-header" };
const _hoisted_2 = { class: "ele-file-list-item" };
const _hoisted_3 = { class: "ele-file-list-item-body" };
const _hoisted_4 = {
  key: 0,
  class: "ele-file-list-item-checkbox"
};
const _hoisted_5 = ["onClick"];
const _hoisted_6 = { class: "ele-file-list-body" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FileTable" },
  __name: "file-table",
  props: {
    /** 文件数据 */
    data: Array,
    /** 后缀对应的图标 */
    icons: Array,
    /** 选择框类型 */
    selectionType: String,
    /** 选中数据 */
    selections: Array,
    /** 单选选中数据 */
    current: Object,
    /** 是否是全选 */
    isCheckAll: Boolean,
    /** 是否是半选 */
    isIndeterminate: Boolean,
    /** 文件名文字 */
    nameText: String,
    /** 文件大小文字 */
    sizeText: String,
    /** 修改时间文字 */
    timeText: String,
    /** 默认的列是否可以排序 */
    sortable: Boolean,
    /** 排序字段 */
    sort: String,
    /** 排序方式 */
    order: String,
    /** 自定义列配置 */
    columns: Array,
    /** 文件右键菜单是否打开 */
    ctxMenuDropdownVisible: Boolean,
    /** 当前打开的右键菜单对应的文件数据 */
    contextMenuFileItem: Object
  },
  emits: {
    checkAllChange: () => true,
    itemClick: (_item) => true,
    itemCheckChange: (_item) => true,
    itemContextOpen: (_option) => true,
    sortChange: (_sort) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const tableCols = computed(() => {
      if (props.columns) {
        return props.columns;
      }
      const cols = [
        {
          title: props.sizeText,
          prop: "length",
          style: {
            width: "120px",
            flexShrink: 0
          },
          sortable: props.sortable
        },
        {
          title: props.timeText,
          prop: "updateTime",
          style: {
            width: "180px",
            flexShrink: 0
          },
          sortable: props.sortable
        }
      ];
      return cols;
    });
    const handleCheckAllChange = () => {
      emit("checkAllChange");
    };
    const handleItemClick = (item) => {
      emit("itemClick", item);
    };
    const handleItemCheckChange = (item) => {
      emit("itemCheckChange", item);
    };
    const handleSortChange = (sort, col) => {
      if (!col) {
        if (props.sortable) {
          emit("sortChange", sort);
        }
      } else if (col.sortable) {
        emit("sortChange", sort);
      }
    };
    const handleItemContextOpen = (option) => {
      emit("itemContextOpen", option);
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(MainContent, { class: "ele-file-list-table" }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createElementVNode("div", _hoisted_2, [
              createElementVNode("div", _hoisted_3, [
                __props.selectionType === "checkbox" || __props.selectionType === "radio" ? (openBlock(), createElementBlock("div", _hoisted_4, [
                  __props.selectionType === "checkbox" ? (openBlock(), createElementBlock("i", {
                    key: 0,
                    class: normalizeClass(["ele-file-list-checkbox", [
                      { "is-checked": __props.isCheckAll },
                      { "is-indeterminate": __props.isIndeterminate }
                    ]]),
                    onClick: withModifiers(handleCheckAllChange, ["stop"])
                  }, null, 2)) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                createElementVNode("div", {
                  class: normalizeClass(["ele-file-list-item-name", { "is-sortable": __props.sortable }]),
                  onClick: _cache[0] || (_cache[0] = ($event) => handleSortChange("name"))
                }, [
                  createElementVNode("span", null, toDisplayString(__props.nameText), 1),
                  __props.sortable ? (openBlock(), createBlock(FileSort, {
                    key: 0,
                    sort: __props.sort,
                    order: __props.order,
                    name: "name"
                  }, null, 8, ["sort", "order"])) : createCommentVNode("", true)
                ], 2),
                (openBlock(true), createElementBlock(Fragment, null, renderList(tableCols.value, (col) => {
                  return openBlock(), createElementBlock("div", {
                    key: col.prop,
                    style: normalizeStyle(col.headerStyle || col.style),
                    class: normalizeClass(["ele-file-list-item-cell", { "is-sortable": col.sortable }]),
                    onClick: ($event) => handleSortChange(col.prop, col)
                  }, [
                    createElementVNode("span", null, [
                      col.headerSlot && !["icon", "title", "tool", "contextMenu"].includes(
                        col.headerSlot
                      ) && _ctx.$slots[col.headerSlot] ? renderSlot(_ctx.$slots, col.headerSlot, {
                        key: 0,
                        col
                      }) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                        createTextVNode(toDisplayString(col.title), 1)
                      ], 64))
                    ]),
                    col.sortable ? (openBlock(), createBlock(FileSort, {
                      key: 0,
                      sort: __props.sort,
                      order: __props.order,
                      name: col.prop
                    }, null, 8, ["sort", "order", "name"])) : createCommentVNode("", true)
                  ], 14, _hoisted_5);
                }), 128))
              ])
            ])
          ]),
          createElementVNode("div", _hoisted_6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.data, (item) => {
              return openBlock(), createBlock(FileTableItem, {
                key: item.key,
                item,
                selectionType: __props.selectionType,
                selections: __props.selections,
                current: __props.current,
                icons: __props.icons,
                columns: tableCols.value,
                ctxMenuDropdownVisible: __props.ctxMenuDropdownVisible && __props.contextMenuFileItem === item,
                onClick: handleItemClick,
                onCheckChange: handleItemCheckChange,
                onContextOpen: handleItemContextOpen
              }, createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                    ])
                  };
                })
              ]), 1032, ["item", "selectionType", "selections", "current", "icons", "columns", "ctxMenuDropdownVisible"]);
            }), 128))
          ])
        ]),
        _: 3
      });
    };
  }
});
export {
  _sfc_main as default
};

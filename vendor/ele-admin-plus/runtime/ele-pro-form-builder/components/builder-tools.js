import { defineComponent, openBlock, createElementBlock, Fragment, createBlock, unref, createCommentVNode } from "vue";
import { InsertRowOutlined, InsertColumnOutlined, PlusSquareDashOutlined, CopyOutlined, DeleteOutlined, AppstoreAddOutlined } from "../../icons/index";
import ToolButton from "./tool-button";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BuilderTools" },
  __name: "builder-tools",
  props: {
    itemType: {}
  },
  emits: ["delete", "copy", "add", "addTableRow", "addTableCol", "openTableTool"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleDelete = (e) => {
      emit("delete", e);
    };
    const handleCopy = (e) => {
      emit("copy", e);
    };
    const handleAdd = (e) => {
      emit("add", e);
    };
    const handleAddTableRow = (e) => {
      emit("addTableRow", e);
    };
    const handleAddTableCol = (e) => {
      emit("addTableCol", e);
    };
    const handleOpenTableTool = (e) => {
      emit("openTableTool", e);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.itemType && ["table", "tableCell"].includes(__props.itemType) ? (openBlock(), createBlock(ToolButton, {
          key: 0,
          buttonProps: {
            size: "small",
            type: "primary",
            icon: unref(InsertRowOutlined)
          },
          tooltip: __props.itemType === "tableCell" ? "插入行" : "新增行",
          onClick: handleAddTableRow
        }, null, 8, ["buttonProps", "tooltip"])) : createCommentVNode("", true),
        __props.itemType && ["table", "tableCell"].includes(__props.itemType) ? (openBlock(), createBlock(ToolButton, {
          key: 1,
          buttonProps: {
            size: "small",
            type: "primary",
            icon: unref(InsertColumnOutlined)
          },
          tooltip: __props.itemType === "tableCell" ? "插入列" : "新增列",
          onClick: handleAddTableCol
        }, null, 8, ["buttonProps", "tooltip"])) : createCommentVNode("", true),
        __props.itemType && [
          "tabs",
          "tabPane",
          "collapse",
          "collapseItem",
          "row",
          "col",
          "carousel",
          "carouselItem",
          "descriptions",
          "descriptionsItem"
        ].includes(__props.itemType) ? (openBlock(), createBlock(ToolButton, {
          key: 2,
          buttonProps: {
            size: "small",
            type: "primary",
            icon: unref(PlusSquareDashOutlined)
          },
          tooltip: {
            tabs: "添加选项卡",
            tabPane: "插入选项卡",
            collapse: "添加折叠面板",
            collapseItem: "插入折叠面板",
            row: "添加栅格列",
            col: "插入栅格列",
            carousel: "添加走马灯",
            carouselItem: "插入走马灯",
            descriptions: "添加描述列表",
            descriptionsItem: "插入描述列表"
          }[__props.itemType],
          onClick: handleAdd
        }, null, 8, ["buttonProps", "tooltip"])) : createCommentVNode("", true),
        __props.itemType !== "tableCell" ? (openBlock(), createBlock(ToolButton, {
          key: 3,
          buttonProps: {
            size: "small",
            type: "primary",
            icon: unref(CopyOutlined)
          },
          tooltip: "复制",
          onClick: handleCopy
        }, null, 8, ["buttonProps"])) : createCommentVNode("", true),
        __props.itemType !== "tableCell" ? (openBlock(), createBlock(ToolButton, {
          key: 4,
          buttonProps: {
            size: "small",
            type: "danger",
            icon: unref(DeleteOutlined)
          },
          tooltip: "删除",
          onClick: handleDelete
        }, null, 8, ["buttonProps"])) : createCommentVNode("", true),
        __props.itemType === "tableCell" ? (openBlock(), createBlock(ToolButton, {
          key: 5,
          buttonProps: {
            size: "small",
            type: "primary",
            icon: unref(AppstoreAddOutlined),
            style: { fontSize: "14px" }
          },
          tooltip: "更多",
          onClick: handleOpenTableTool
        }, null, 8, ["buttonProps"])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

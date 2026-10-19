import { defineComponent, ref, watch, openBlock, createElementBlock, Fragment, createBlock, createCommentVNode, unref } from "vue";
import { ElEmpty } from "element-plus";
import { findTree } from "../../utils/common";
import { fixedChildTypes } from "./build-core";
import { generateCopyItemData, generateAddChildData } from "./build-util";
import OutlineList from "./outline-list";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "OutlineTree" },
  __name: "outline-tree",
  props: {
    formItems: {},
    currentFormItemId: {},
    componentData: {},
    itemTypeData: {}
  },
  emits: ["update:currentFormItemId", "updateItems", "updateItemChildren", "openTableTool", "openComponentPicker"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const collapseItemIds = ref([]);
    const handleUpdateCurrentFormItemId = (itemId) => {
      emit("update:currentFormItemId", itemId);
    };
    const handleUpdateItems = (result) => {
      emit("updateItems", result);
    };
    const handleDeleteItem = (formItemId) => {
      handleUpdateItems({
        deleteItemIds: [formItemId],
        addItems: [],
        updateItems: []
      });
    };
    const handleCopyItem = (formItemId) => {
      handleUpdateItems(generateCopyItemData(formItemId, props.formItems));
    };
    const handleAddChildren = (triggerItem, action) => {
      if (triggerItem.type && fixedChildTypes.some((d) => d.type === triggerItem.type)) {
        const result = generateAddChildData(
          triggerItem,
          void 0,
          void 0,
          action,
          props.formItems,
          void 0,
          props.componentData
        );
        handleUpdateItems(result);
      } else {
        emit("openComponentPicker", triggerItem.key);
      }
    };
    const handleOpenTableTool = (item, e) => {
      const el = e.currentTarget;
      const triggerEl = el?.parentElement?.querySelector?.(
        ".ele-pro-form-builder-outline-item-table-tool-trigger"
      );
      emit("openTableTool", item.key, triggerEl);
    };
    const handleUpdateItemChildren = (children, parentKey) => {
      emit("updateItemChildren", children, parentKey);
    };
    const handleToggleItemCollapse = (formItemId) => {
      const index = collapseItemIds.value.indexOf(formItemId);
      if (index !== -1) {
        collapseItemIds.value.splice(index, 1);
      } else {
        collapseItemIds.value.push(formItemId);
      }
    };
    watch(
      () => props.formItems,
      (items) => {
        for (let i = collapseItemIds.value.length - 1; i >= 0; i--) {
          if (!findTree(items, (item) => collapseItemIds.value[i] === item.key)) {
            collapseItemIds.value.splice(i, 1);
          }
        }
      },
      { deep: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.formItems ? (openBlock(), createBlock(OutlineList, {
          key: 0,
          items: __props.formItems,
          currentFormItemId: __props.currentFormItemId,
          collapseItemIds: collapseItemIds.value,
          componentData: __props.componentData,
          itemTypeData: __props.itemTypeData,
          "onUpdate:currentFormItemId": handleUpdateCurrentFormItemId,
          onToggleItemCollapse: handleToggleItemCollapse,
          onDeleteItem: handleDeleteItem,
          onCopyItem: handleCopyItem,
          onAddChildren: handleAddChildren,
          onOpenTableTool: handleOpenTableTool,
          onUpdateItemChildren: handleUpdateItemChildren
        }, null, 8, ["items", "currentFormItemId", "collapseItemIds", "componentData", "itemTypeData"])) : createCommentVNode("", true),
        !__props.formItems || !__props.formItems.length ? (openBlock(), createBlock(unref(ElEmpty), {
          key: 1,
          imageSize: 58,
          class: "ele-pro-form-builder-form-empty"
        })) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

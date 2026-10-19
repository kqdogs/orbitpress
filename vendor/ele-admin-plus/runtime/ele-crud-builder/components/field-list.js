import { defineComponent, resolveComponent, openBlock, createBlock, unref, withCtx, createElementVNode, normalizeClass, createVNode, withModifiers, createCommentVNode, toDisplayString, createElementBlock } from "vue";
import VueDraggable from "vuedraggable";
import { ElIcon } from "element-plus";
import { ArrowDown, DeleteOutlined, CopyOutlined, EditOutlined, PlusOutlined, DragOutlined } from "../../icons/index";
const _hoisted_1 = ["title"];
const _hoisted_2 = { class: "ele-crud-builder-field-item-content" };
const _hoisted_3 = { class: "ele-crud-builder-field-item-prop" };
const _hoisted_4 = {
  key: 0,
  class: "ele-crud-builder-field-item-label"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FieldList" },
  __name: "field-list",
  props: {
    items: {},
    collapseItemIds: {},
    parent: {}
  },
  emits: ["toggleItemCollapse", "deleteItem", "copyItem", "editItem", "addChildren", "updateItemChildren"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleToggleItemCollapse = (key) => {
      emit("toggleItemCollapse", key);
    };
    const handleDeleteItem = (key) => {
      emit("deleteItem", key);
    };
    const handleCopyItem = (key) => {
      emit("copyItem", key);
    };
    const handleEditItem = (item) => {
      emit("editItem", item);
    };
    const handleAddChildren = (parentKey) => {
      emit("addChildren", parentKey);
    };
    const handleUpdateItemChildren = (data, parentKey) => {
      emit("updateItemChildren", data, parentKey);
    };
    const handleUpdateModelValue = (data) => {
      if (props.parent != null && props.parent.key == null) {
        return;
      }
      handleUpdateItemChildren(data, props.parent?.key);
    };
    return (_ctx, _cache) => {
      const _component_FieldList = resolveComponent("FieldList", true);
      return openBlock(), createBlock(unref(VueDraggable), {
        itemKey: "key",
        modelValue: __props.items,
        forceFallback: true,
        fallbackOnBody: true,
        setData: () => void 0,
        group: "CrudBuilderFieldSortGroup",
        handle: ".ele-crud-builder-field-item-handle",
        class: "ele-crud-builder-field",
        "onUpdate:modelValue": handleUpdateModelValue
      }, {
        item: withCtx(({ element }) => [
          createElementVNode("div", {
            class: normalizeClass(["ele-crud-builder-field-item", {
              "is-collapse": element.key != null && __props.collapseItemIds && __props.collapseItemIds.includes(element.key)
            }])
          }, [
            createVNode(_component_FieldList, {
              items: element.children || [],
              collapseItemIds: __props.collapseItemIds,
              parent: element,
              onToggleItemCollapse: handleToggleItemCollapse,
              onDeleteItem: handleDeleteItem,
              onCopyItem: handleCopyItem,
              onEditItem: handleEditItem,
              onAddChildren: handleAddChildren,
              onUpdateItemChildren: handleUpdateItemChildren
            }, null, 8, ["items", "collapseItemIds", "parent"]),
            createElementVNode("div", {
              class: "ele-crud-builder-field-item-body",
              title: `${element.prop ?? ""} ${element.label ?? ""}`
            }, [
              element.children && element.children.length ? (openBlock(), createBlock(unref(ElIcon), {
                key: 0,
                class: "ele-crud-builder-field-item-arrow",
                onClick: withModifiers(($event) => handleToggleItemCollapse(element.key), ["stop"])
              }, {
                default: withCtx(() => [
                  createVNode(unref(ArrowDown))
                ]),
                _: 1
              }, 8, ["onClick"])) : createCommentVNode("", true),
              createElementVNode("div", _hoisted_2, [
                createElementVNode("span", _hoisted_3, toDisplayString(element.prop), 1),
                element.label ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(element.label), 1)) : createCommentVNode("", true)
              ]),
              createVNode(unref(ElIcon), {
                class: "ele-crud-builder-field-item-tool is-danger",
                title: "删除",
                onClick: withModifiers(($event) => handleDeleteItem(element.key), ["stop"])
              }, {
                default: withCtx(() => [
                  createVNode(unref(DeleteOutlined))
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(unref(ElIcon), {
                class: "ele-crud-builder-field-item-tool",
                title: "复制",
                onClick: withModifiers(($event) => handleCopyItem(element.key), ["stop"])
              }, {
                default: withCtx(() => [
                  createVNode(unref(CopyOutlined), { style: { transform: "scale(0.96)" } })
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(unref(ElIcon), {
                class: "ele-crud-builder-field-item-tool",
                title: "修改",
                onClick: withModifiers(($event) => handleEditItem(element), ["stop"])
              }, {
                default: withCtx(() => [
                  createVNode(unref(EditOutlined))
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(unref(ElIcon), {
                class: "ele-crud-builder-field-item-tool",
                title: "添加子级",
                onClick: withModifiers(($event) => handleAddChildren(element.key), ["stop"])
              }, {
                default: withCtx(() => [
                  createVNode(unref(PlusOutlined), { style: { transform: "scale(1.1)" } })
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(unref(ElIcon), {
                title: "",
                class: "ele-crud-builder-field-item-handle",
                onClick: _cache[0] || (_cache[0] = withModifiers(() => {
                }, ["stop"]))
              }, {
                default: withCtx(() => [
                  createVNode(unref(DragOutlined), { style: { transform: "scale(1.1)" } })
                ]),
                _: 1
              })
            ], 8, _hoisted_1),
            _cache[1] || (_cache[1] = createElementVNode("div", { class: "ele-crud-builder-field-item-border" }, null, -1))
          ], 2)
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

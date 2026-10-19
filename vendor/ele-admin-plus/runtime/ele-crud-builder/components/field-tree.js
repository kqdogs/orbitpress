import { defineComponent, ref, reactive, watch, openBlock, createElementBlock, Fragment, createElementVNode, createVNode, unref, withCtx, createTextVNode, createBlock, Transition, toDisplayString, resolveDynamicComponent, createSlots, mergeProps, renderList, renderSlot, normalizeProps, guardReactiveProps, createCommentVNode } from "vue";
import { ElButton, ElEmpty, ElSwitch } from "element-plus";
import { PlusOutlined, CloseOutlined, CheckOutlined } from "../../icons/index";
import { findTree, eachTree, omit } from "../../utils/common";
import EleProForm from "../../ele-pro-form/index";
import { setValue, mergeValue, getFormInitValue } from "../../ele-pro-form/util";
import { deepCloneObject } from "../../ele-pro-form-builder/components/build-core";
import SourceEdit from "../../ele-pro-form-builder/components/source-edit";
import StyleEdit from "../../ele-pro-form-builder/components/style-edit";
import { itemsGenerateNewKey } from "../util";
import FieldList from "./field-list";
const _hoisted_1 = { class: "ele-crud-builder-field-header" };
const _hoisted_2 = {
  key: 0,
  class: "ele-crud-builder-field-edit-wrapper"
};
const _hoisted_3 = { class: "ele-crud-builder-field-edit-card" };
const _hoisted_4 = { class: "ele-crud-builder-field-edit-header" };
const _hoisted_5 = { class: "ele-crud-builder-field-edit-title" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FieldTree" },
  __name: "field-tree",
  props: {
    /** 全部字段 */
    fields: Array,
    /** 字段编辑的表单项配置 */
    fieldEditFormItems: Array,
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function],
    /** JSON 编辑器组件 */
    jsonEditerComponent: [String, Object, Function],
    /** 高级表单组件类型数据 */
    itemTypeData: Array,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function]
  },
  emits: ["deleteField", "addField", "updateField", "updateFieldChildren"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const collapseItemIds = ref([]);
    const fieldEditData = reactive({});
    const fieldEditOption = reactive({});
    const handleDeleteItem = (key) => {
      emit("deleteField", key);
    };
    const handleCopyItem = (key) => {
      if (key == null) {
        return;
      }
      eachTree(props.fields, (item, index, parent) => {
        if (item.key === key) {
          const newItem = deepCloneObject(item);
          itemsGenerateNewKey(newItem, props.fields, true);
          emit("addField", newItem, parent?.key, index + 1);
          return false;
        }
      });
    };
    const handleEditItem = (item) => {
      handleOpenEdit(item);
    };
    const handleAddChildren = (parentKey) => {
      handleOpenEdit(void 0, parentKey);
    };
    const handleUpdateItemChildren = (data, parentKey) => {
      emit("updateFieldChildren", data, parentKey);
    };
    const handleToggleItemCollapse = (key) => {
      if (key == null) {
        return;
      }
      const index = collapseItemIds.value.indexOf(key);
      if (index !== -1) {
        collapseItemIds.value.splice(index, 1);
      } else {
        collapseItemIds.value.push(key);
      }
    };
    const handleUpdateEditFieldData = (field, value) => {
      if (!field) {
        const excludeFields = ["key", "children"];
        const temp = omit(value, excludeFields);
        Object.assign(fieldEditData, temp);
        const valueKeys = Object.keys(temp);
        Object.keys(fieldEditData).forEach((key) => {
          if (fieldEditData && !excludeFields.includes(key) && !valueKeys.includes(key) && typeof fieldEditData[key] !== "undefined") {
            fieldEditData[key] = void 0;
          }
        });
      } else {
        setValue(fieldEditData, field, value);
      }
    };
    const resetFieldEditData = (item) => {
      Object.keys(fieldEditData).forEach((key) => {
        fieldEditData[key] = void 0;
      });
      mergeValue(
        fieldEditData,
        getFormInitValue(props.fieldEditFormItems, props.itemTypeData, true),
        item
      );
    };
    const handleOpenEdit = (item, parentKey) => {
      resetFieldEditData(item);
      if (item == null) {
        fieldEditOption.isEdit = false;
        fieldEditOption.parentKey = parentKey;
      } else {
        fieldEditOption.isEdit = true;
        fieldEditOption.parentKey = void 0;
      }
      fieldEditOption.index = void 0;
      fieldEditOption.visible = true;
    };
    const handleCancelEdit = () => {
      fieldEditOption.visible = false;
    };
    const handleSaveEdit = () => {
      handleCancelEdit();
      const field = deepCloneObject(fieldEditData);
      if (fieldEditOption.isEdit) {
        emit("updateField", field);
      } else {
        itemsGenerateNewKey(field, props.fields);
        emit("addField", field, fieldEditOption.parentKey, fieldEditOption.index);
      }
    };
    watch(
      () => props.fields,
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
        createElementVNode("div", _hoisted_1, [
          createVNode(unref(ElButton), {
            icon: unref(PlusOutlined),
            type: "primary",
            onClick: _cache[0] || (_cache[0] = ($event) => handleOpenEdit())
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" 添加 ", -1)
            ])]),
            _: 1
          }, 8, ["icon"])
        ]),
        __props.fields && __props.fields.length ? (openBlock(), createBlock(FieldList, {
          key: 0,
          items: __props.fields,
          collapseItemIds: collapseItemIds.value,
          onToggleItemCollapse: handleToggleItemCollapse,
          onDeleteItem: handleDeleteItem,
          onCopyItem: handleCopyItem,
          onEditItem: handleEditItem,
          onAddChildren: handleAddChildren,
          onUpdateItemChildren: handleUpdateItemChildren
        }, null, 8, ["items", "collapseItemIds"])) : (openBlock(), createBlock(unref(ElEmpty), {
          key: 1,
          imageSize: 58,
          class: "ele-crud-builder-form-empty"
        })),
        createVNode(Transition, { name: "anim" }, {
          default: withCtx(() => [
            fieldEditOption.visible ? (openBlock(), createElementBlock("div", _hoisted_2, [
              createElementVNode("div", _hoisted_3, [
                createElementVNode("div", _hoisted_4, [
                  createElementVNode("div", _hoisted_5, toDisplayString(fieldEditOption.isEdit ? "修改" : "添加"), 1),
                  createVNode(unref(ElButton), {
                    text: true,
                    icon: unref(CloseOutlined),
                    onClick: handleCancelEdit
                  }, {
                    default: withCtx(() => [..._cache[2] || (_cache[2] = [
                      createTextVNode(" 取消 ", -1)
                    ])]),
                    _: 1
                  }, 8, ["icon"]),
                  createVNode(unref(ElButton), {
                    icon: unref(CheckOutlined),
                    type: "primary",
                    onClick: handleSaveEdit
                  }, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createTextVNode(" 保存 ", -1)
                    ])]),
                    _: 1
                  }, 8, ["icon"])
                ]),
                (openBlock(), createBlock(resolveDynamicComponent(__props.proFormComponent || EleProForm), {
                  itemTypeData: __props.itemTypeData,
                  httpRequest: __props.httpRequest,
                  size: "small",
                  labelPosition: "top",
                  model: fieldEditData,
                  items: __props.fieldEditFormItems,
                  class: "ele-crud-builder-field-edit-form",
                  onUpdateValue: handleUpdateEditFieldData
                }, createSlots({ _: 2 }, [
                  !_ctx.$slots.crudBuilderSwitch ? {
                    name: "crudBuilderSwitch",
                    fn: withCtx(({ item, modelValue, updateValue }) => [
                      createVNode(unref(ElSwitch), {
                        modelValue: (modelValue ?? item.props?.defaultValue) !== false,
                        "onUpdate:modelValue": (val) => updateValue(val ? {} : false)
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    key: "0"
                  } : void 0,
                  !_ctx.$slots.proFormBuilderSourceEdit ? {
                    name: "proFormBuilderSourceEdit",
                    fn: withCtx(({ item, model, updatePropValue }) => [
                      createVNode(SourceEdit, mergeProps({ jsonEditerComponent: __props.jsonEditerComponent }, item.props || {}, {
                        modelValue: model,
                        "onUpdate:modelValue": (val) => updatePropValue("", val)
                      }), null, 16, ["jsonEditerComponent", "modelValue", "onUpdate:modelValue"])
                    ]),
                    key: "1"
                  } : void 0,
                  !_ctx.$slots.proFormBuilderStyleEdit ? {
                    name: "proFormBuilderStyleEdit",
                    fn: withCtx(({ item, modelValue, updateValue }) => [
                      createVNode(StyleEdit, mergeProps(item.props || {}, {
                        modelValue,
                        "onUpdate:modelValue": updateValue
                      }), null, 16, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    key: "2"
                  } : void 0,
                  renderList(Object.keys(_ctx.$slots), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                      ])
                    };
                  })
                ]), 1064, ["itemTypeData", "httpRequest", "model", "items"]))
              ])
            ])) : createCommentVNode("", true)
          ]),
          _: 3
        })
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

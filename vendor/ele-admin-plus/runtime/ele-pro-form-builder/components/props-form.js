import { defineComponent, ref, reactive, watch, openBlock, createElementBlock, Fragment, createBlock, resolveDynamicComponent, createSlots, withCtx, createVNode, mergeProps, unref, renderList, renderSlot, normalizeProps, guardReactiveProps, createCommentVNode } from "vue";
import { ElInput, ElEmpty } from "element-plus";
import { findTree } from "../../utils/common";
import EleProForm from "../../ele-pro-form/index";
import { getFormDataAndItems, fixedChildTypes } from "./build-core";
import { generateAddChildData } from "./build-util";
import OptionsEdit from "./options-edit";
import EventEdit from "./event-edit";
import HtmlEdit from "./html-edit";
import IfEdit from "./if-edit";
import SourceEdit from "./source-edit";
import TypeEdit from "./type-edit";
import ChildrenEdit from "./children-edit";
import StyleEdit from "./style-edit";
import JsonInput from "./json-input";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PropsForm" },
  __name: "props-form",
  props: {
    currentFormItemId: {},
    formProps: {},
    configFormPresetProps: {},
    componentData: {},
    proFormComponent: {},
    codeEditerComponent: {},
    jsonEditerComponent: {},
    htmlEditerComponent: {},
    itemTypeData: {},
    httpRequest: {}
  },
  emits: ["update:currentFormItemId", "updateItem", "updateItems", "sortItemChildren", "openComponentPicker"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const propsProFormRef = ref(null);
    const currentFormItem = ref();
    const propsFormData = reactive({});
    const propsFormItems = ref([]);
    const handleUpdateItem = (field, value) => {
      if (props.currentFormItemId != null) {
        emit("updateItem", props.currentFormItemId, field, value);
      }
    };
    const handleUpdateChildLabel = (label, child, field) => {
      emit("updateItem", child.key, field, label);
    };
    const handleSortChildren = (children) => {
      if (props.currentFormItemId != null) {
        emit(
          "sortItemChildren",
          children.map((c) => c.key),
          props.currentFormItemId
        );
      }
    };
    const handleDeleteChildren = (child) => {
      emit("updateItems", {
        addItems: [],
        updateItems: [],
        deleteItemIds: [child.key]
      });
    };
    const handleOpenComponentPicker = (item, isAdd) => {
      emit("openComponentPicker", item.key, isAdd ? void 0 : item.type);
    };
    const handleAddChildren = (parent) => {
      if (parent.type && fixedChildTypes.some((d) => d.type === parent.type)) {
        const result = generateAddChildData(
          parent,
          void 0,
          void 0,
          void 0,
          props.formProps?.items,
          void 0,
          props.componentData
        );
        emit("updateItems", result);
      } else {
        handleOpenComponentPicker(parent, true);
      }
    };
    const handleUpdateCurrentFormItemId = (formItemId) => {
      emit("update:currentFormItemId", formItemId);
    };
    const resetPropsFormData = (data) => {
      Object.keys(propsFormData).forEach((k) => {
        propsFormData[k] = void 0;
      });
      if (data) {
        Object.assign(propsFormData, data);
      }
    };
    watch(
      [() => props.formProps, () => props.currentFormItemId],
      () => {
        if (props.currentFormItemId == null) {
          resetPropsFormData();
          propsFormItems.value = [];
          currentFormItem.value = void 0;
          return;
        }
        const temp = findTree(
          props.formProps?.items,
          (item) => item.key === props.currentFormItemId
        );
        const { data, items } = getFormDataAndItems(temp, props.componentData);
        resetPropsFormData(
          Object.assign({}, data, {
            itemProps: Object.assign(
              {
                labelWidth: props.formProps?.labelWidth ?? props.configFormPresetProps?.labelWidth,
                labelPosition: props.formProps?.labelPosition ?? props.configFormPresetProps?.labelPosition
              },
              data.itemProps
            )
          })
        );
        if (JSON.stringify(propsFormItems.value) !== JSON.stringify(items)) {
          propsFormItems.value = items;
        }
        if (currentFormItem.value !== temp) {
          currentFormItem.value = temp;
          if (propsProFormRef.value) {
            propsProFormRef.value.$el.scrollTop = 0;
          }
        }
      },
      {
        immediate: true,
        deep: true
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        (openBlock(), createBlock(resolveDynamicComponent(__props.proFormComponent || EleProForm), {
          ref_key: "propsProFormRef",
          ref: propsProFormRef,
          size: "small",
          labelPosition: "top",
          model: propsFormData,
          items: propsFormItems.value,
          itemTypeData: __props.itemTypeData,
          httpRequest: __props.httpRequest,
          class: "ele-pro-form-builder-props-form",
          onUpdateValue: handleUpdateItem
        }, createSlots({ _: 2 }, [
          !_ctx.$slots.proFormBuilderOptionsEdit ? {
            name: "proFormBuilderOptionsEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(OptionsEdit, mergeProps({ codeEditerComponent: __props.codeEditerComponent }, item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["codeEditerComponent", "modelValue", "onUpdate:modelValue"])
            ]),
            key: "0"
          } : void 0,
          !_ctx.$slots.proFormBuilderEventEdit ? {
            name: "proFormBuilderEventEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(EventEdit, mergeProps({ codeEditerComponent: __props.codeEditerComponent }, item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["codeEditerComponent", "modelValue", "onUpdate:modelValue"])
            ]),
            key: "1"
          } : void 0,
          !_ctx.$slots.proFormBuilderHtmlEdit ? {
            name: "proFormBuilderHtmlEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(HtmlEdit, mergeProps({ htmlEditerComponent: __props.htmlEditerComponent }, item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["htmlEditerComponent", "modelValue", "onUpdate:modelValue"])
            ]),
            key: "2"
          } : void 0,
          !_ctx.$slots.proFormBuilderIfEdit ? {
            name: "proFormBuilderIfEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(IfEdit, mergeProps({ codeEditerComponent: __props.codeEditerComponent }, item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["codeEditerComponent", "modelValue", "onUpdate:modelValue"])
            ]),
            key: "3"
          } : void 0,
          !_ctx.$slots.proFormBuilderSourceEdit ? {
            name: "proFormBuilderSourceEdit",
            fn: withCtx(({ item, model, updatePropValue }) => [
              createVNode(SourceEdit, mergeProps({ jsonEditerComponent: __props.jsonEditerComponent }, item.props || {}, {
                modelValue: model,
                "onUpdate:modelValue": (val) => updatePropValue("", val)
              }), null, 16, ["jsonEditerComponent", "modelValue", "onUpdate:modelValue"])
            ]),
            key: "4"
          } : void 0,
          !_ctx.$slots.proFormBuilderTypeEdit ? {
            name: "proFormBuilderTypeEdit",
            fn: withCtx(() => [
              (openBlock(), createBlock(TypeEdit, {
                key: __props.currentFormItemId,
                formItem: currentFormItem.value,
                componentData: __props.componentData,
                onOpenComponentPicker: handleOpenComponentPicker
              }, null, 8, ["formItem", "componentData"]))
            ]),
            key: "5"
          } : void 0,
          !_ctx.$slots.proFormBuilderChildrenEdit ? {
            name: "proFormBuilderChildrenEdit",
            fn: withCtx(({ item }) => [
              (openBlock(), createBlock(ChildrenEdit, mergeProps({ key: __props.currentFormItemId }, item.props || {}, {
                formItem: currentFormItem.value,
                componentData: __props.componentData,
                onUpdateChildLabel: handleUpdateChildLabel,
                onSortChildren: handleSortChildren,
                onDeleteChildren: handleDeleteChildren,
                onAddChildren: handleAddChildren,
                "onUpdate:currentFormItemId": handleUpdateCurrentFormItemId
              }), null, 16, ["formItem", "componentData"]))
            ]),
            key: "6"
          } : void 0,
          !_ctx.$slots.proFormBuilderStyleEdit ? {
            name: "proFormBuilderStyleEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              (openBlock(), createBlock(StyleEdit, mergeProps({ key: __props.currentFormItemId }, item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["modelValue", "onUpdate:modelValue"]))
            ]),
            key: "7"
          } : void 0,
          !_ctx.$slots.proFormBuilderJsonInput ? {
            name: "proFormBuilderJsonInput",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              (openBlock(), createBlock(JsonInput, mergeProps({ key: __props.currentFormItemId }, item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["modelValue", "onUpdate:modelValue"]))
            ]),
            key: "8"
          } : void 0,
          !_ctx.$slots.proFormBuilderIconInput ? {
            name: "proFormBuilderIconInput",
            fn: withCtx(({ modelValue, updateValue }) => [
              createVNode(unref(ElInput), {
                size: "small",
                clearable: true,
                modelValue,
                "onUpdate:modelValue": updateValue
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ]),
            key: "9"
          } : void 0,
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1064, ["model", "items", "itemTypeData", "httpRequest"])),
        !currentFormItem.value ? (openBlock(), createBlock(unref(ElEmpty), {
          key: 0,
          imageSize: 58,
          description: "选中组件配置属性",
          class: "ele-pro-form-builder-form-empty"
        })) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

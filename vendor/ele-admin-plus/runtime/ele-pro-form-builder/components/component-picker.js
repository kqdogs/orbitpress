import { defineComponent, openBlock, createBlock, withCtx, createVNode } from "vue";
import EleModal from "../../ele-modal/index";
import ComponentList from "./component-list";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ComponentPicker" },
  __name: "component-picker",
  props: {
    modelValue: { type: Boolean },
    addParentFormItemId: {},
    editFormItemId: {},
    editFormItemType: {},
    formItems: {},
    componentData: {},
    itemTypeData: {}
  },
  emits: ["update:modelValue", "updateItems"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleUpdateModelValue = (visible) => {
      emit("update:modelValue", visible);
    };
    const handleUpdateItems = (result) => {
      emit("updateItems", result);
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, {
        width: 808,
        maxable: true,
        position: "center",
        title: "组件库",
        modelValue: __props.modelValue,
        closeOnClickModal: false,
        destroyOnClose: true,
        bodyStyle: {
          height: "568px",
          minHeight: "100%",
          maxHeight: "100%",
          overflow: "auto",
          padding: 0
        },
        modalBodyClass: "ele-pro-form-builder-component-picker",
        style: { overflow: "hidden" },
        "onUpdate:modelValue": handleUpdateModelValue
      }, {
        default: withCtx(() => [
          createVNode(ComponentList, {
            parentFormItemId: __props.addParentFormItemId,
            formItems: __props.formItems,
            componentData: __props.componentData,
            itemTypeData: __props.itemTypeData,
            selectedType: __props.editFormItemType,
            selectedFormItemId: __props.editFormItemId,
            onUpdateItems: handleUpdateItems
          }, null, 8, ["parentFormItemId", "formItems", "componentData", "itemTypeData", "selectedType", "selectedFormItemId"])
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

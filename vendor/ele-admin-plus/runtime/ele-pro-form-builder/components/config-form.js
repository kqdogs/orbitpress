import { defineComponent, reactive, watch, openBlock, createBlock, resolveDynamicComponent, createSlots, withCtx, createVNode, mergeProps, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import EleProForm from "../../ele-pro-form/index";
import { deepCloneObject } from "./build-core";
import SourceEdit from "./source-edit";
import StyleEdit from "./style-edit";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ConfigForm" },
  __name: "config-form",
  props: {
    formProps: {},
    configFormItems: {},
    configFormPresetProps: {},
    proFormComponent: {},
    jsonEditerComponent: {},
    itemTypeData: {},
    httpRequest: {}
  },
  emits: ["updateFormProp"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const configFormData = reactive({});
    const handleUpdateFormProp = (field, value) => {
      emit("updateFormProp", field, value);
    };
    watch(
      () => props.formProps,
      (formProps) => {
        const data = Object.assign(
          {},
          configFormData,
          props.configFormPresetProps || {},
          deepCloneObject(formProps),
          { items: void 0 }
        );
        Object.assign(configFormData, data, {
          items: void 0,
          footerProps: Object.assign(
            { labelWidth: data.footerProps?.labelWidth ?? data.labelWidth },
            data.footerProps
          )
        });
      },
      {
        immediate: true,
        deep: true
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(__props.proFormComponent || EleProForm), {
        size: "small",
        labelPosition: "top",
        model: configFormData,
        items: __props.configFormItems || [],
        itemTypeData: __props.itemTypeData,
        httpRequest: __props.httpRequest,
        class: "ele-pro-form-builder-props-form",
        onUpdateValue: handleUpdateFormProp
      }, createSlots({ _: 2 }, [
        !_ctx.$slots.proFormBuilderSourceEdit ? {
          name: "proFormBuilderSourceEdit",
          fn: withCtx(({ item, model, updatePropValue }) => [
            createVNode(SourceEdit, mergeProps({ jsonEditerComponent: __props.jsonEditerComponent }, item.props || {}, {
              modelValue: model,
              "onUpdate:modelValue": (val) => updatePropValue("", val)
            }), null, 16, ["jsonEditerComponent", "modelValue", "onUpdate:modelValue"])
          ]),
          key: "0"
        } : void 0,
        !_ctx.$slots.proFormBuilderStyleEdit ? {
          name: "proFormBuilderStyleEdit",
          fn: withCtx(({ item, modelValue, updateValue }) => [
            createVNode(StyleEdit, mergeProps(item.props || {}, {
              modelValue,
              "onUpdate:modelValue": updateValue
            }), null, 16, ["modelValue", "onUpdate:modelValue"])
          ]),
          key: "1"
        } : void 0,
        renderList(Object.keys(_ctx.$slots), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1064, ["model", "items", "itemTypeData", "httpRequest"]);
    };
  }
});
export {
  _sfc_main as default
};

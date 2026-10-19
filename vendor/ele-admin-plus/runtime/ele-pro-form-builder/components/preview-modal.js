import { defineComponent, ref, reactive, watch, nextTick, openBlock, createBlock, withCtx, resolveDynamicComponent, mergeProps, createSlots, renderList, renderSlot, normalizeProps, guardReactiveProps, createElementVNode, createElementBlock, Fragment, unref, normalizeClass, normalizeStyle } from "vue";
import { ElIcon } from "element-plus";
import EleModal from "../../ele-modal/index";
import { setValue, mergeValue, getFormInitValue } from "../../ele-pro-form/util";
import EleProForm from "../../ele-pro-form/index";
import { screenItems } from "../util";
import { deepCloneObject } from "./build-core";
const _hoisted_1 = { class: "ele-pro-form-builder-screen-radio" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PreviewModal" },
  __name: "preview-modal",
  props: {
    modelValue: { type: Boolean },
    formProps: {},
    proFormComponent: {},
    itemTypeData: {},
    httpRequest: {}
  },
  emits: ["update:modelValue", "previewFormSubmit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const previewFormRef = ref(null);
    const previewFormProps = ref({ items: [] });
    const formData = reactive({});
    const previewScreen = ref("pc");
    const handleUpdateModelValue = (visible) => {
      emit("update:modelValue", visible);
    };
    const setPreviewFormDataFieldValue = (field, value) => {
      setValue(formData, field, value);
    };
    const handlePreviewFormSubmit = () => {
      emit("previewFormSubmit", formData);
    };
    const handlePreviewFormReset = () => {
      Object.keys(formData).forEach((k) => {
        formData[k] = void 0;
      });
      mergeValue(
        formData,
        getFormInitValue(previewFormProps.value?.items, props.itemTypeData, true)
      );
    };
    const handleUpdatePreviewScreen = (size) => {
      previewScreen.value = size;
    };
    watch(
      () => props.modelValue,
      (visible) => {
        if (visible) {
          previewFormProps.value = deepCloneObject(
            props.formProps || { items: [] }
          );
          handlePreviewFormReset();
          nextTick(() => {
            previewFormRef.value?.clearValidate?.();
            nextTick(() => {
              previewFormRef.value?.clearValidate?.();
            });
          });
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, {
        width: 980,
        maxable: true,
        draggable: false,
        position: "center",
        closeOnClickModal: false,
        destroyOnClose: true,
        modalBodyClass: [
          "ele-pro-form-builder-preview",
          previewScreen.value === "pad" ? "is-pad" : previewScreen.value === "phone" ? "is-phone" : "is-pc"
        ].join(" "),
        modelValue: __props.modelValue,
        "onUpdate:modelValue": handleUpdateModelValue
      }, {
        header: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(screenItems), (item) => {
              return openBlock(), createBlock(unref(ElIcon), {
                key: item.value,
                class: normalizeClass(["ele-pro-form-builder-header-tool ele-pro-form-builder-screen-icon", { "is-active": item.value === previewScreen.value }]),
                onClick: ($event) => handleUpdatePreviewScreen(item.value)
              }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                    style: normalizeStyle(item.iconStyle)
                  }, null, 8, ["style"]))
                ]),
                _: 2
              }, 1032, ["class", "onClick"]);
            }), 128))
          ])
        ]),
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(__props.proFormComponent || EleProForm), mergeProps({ validateOnRuleChange: false }, previewFormProps.value, {
            ref_key: "previewFormRef",
            ref: previewFormRef,
            model: formData,
            editable: false,
            screenSize: previewScreen.value,
            itemTypeData: __props.itemTypeData,
            httpRequest: __props.httpRequest,
            class: "ele-pro-form-builder-preview-form",
            onUpdateValue: setPreviewFormDataFieldValue,
            onSubmit: handlePreviewFormSubmit,
            onReset: handlePreviewFormReset
          }), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040, ["model", "screenSize", "itemTypeData", "httpRequest"]))
        ]),
        _: 3
      }, 8, ["modalBodyClass", "modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, computed, ref, reactive, openBlock, createElementBlock, Fragment, renderList, normalizeClass, toDisplayString, createCommentVNode, createBlock, resolveDynamicComponent, createSlots, withCtx, createVNode, unref, createTextVNode, mergeProps, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElButton, ElSwitch } from "element-plus";
import { FormOutlined } from "../../icons/index";
import EleProForm from "../../ele-pro-form/index";
import { mergeValue, getFormInitValue } from "../../ele-pro-form/util";
import OptionsEdit from "../../ele-pro-form-builder/components/options-edit";
import EventEdit from "../../ele-pro-form-builder/components/event-edit";
import SourceEdit from "../../ele-pro-form-builder/components/source-edit";
import StyleEdit from "../../ele-pro-form-builder/components/style-edit";
import FormDesignModal from "./form-design-modal";
const _hoisted_1 = {
  key: 0,
  class: "ele-crud-builder-page-config-group-list"
};
const _hoisted_2 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PageConfig" },
  __name: "page-config",
  props: {
    /** 配置数据 */
    config: Object,
    /** 页面设置的表单项配置 */
    pageConfigFormItems: Array,
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function],
    /** 表单构建组件 */
    proFormBuilderComponent: [
      String,
      Object,
      Function
    ],
    /** 表单构建组件属性 */
    proFormBuilderProps: Object,
    /** 代码编辑器组件 */
    codeEditerComponent: [String, Object, Function],
    /** JSON 编辑器组件 */
    jsonEditerComponent: [String, Object, Function],
    /** 高级表单组件类型数据 */
    itemTypeData: Array,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function]
  },
  emits: ["updateConfigValue", "updateFormConfig"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const configFormData = computed(() => {
      const data = {};
      mergeValue(
        data,
        getFormInitValue(props.pageConfigFormItems, props.itemTypeData, true),
        props.config
      );
      return data;
    });
    const pageConfigGroups = computed(() => {
      return (props.pageConfigFormItems || []).filter((item) => !!(item.children && item.label)).map((item) => ({
        key: item.key ?? item.prop,
        label: item.label ?? item.children?.[0]?.label ?? item.prop ?? item.key
      }));
    });
    const groupActive = ref(pageConfigGroups.value?.[0]?.key);
    const activePageConfigFormItems = computed(() => {
      if (!props.pageConfigFormItems) {
        return [];
      }
      if (groupActive.value == null) {
        return props.pageConfigFormItems;
      }
      const items = [];
      props.pageConfigFormItems.forEach((item) => {
        if (!item.children || !item.label) {
          items.push(item);
        } else if (groupActive.value === (item.key ?? item.prop)) {
          items.push({ ...item, label: void 0 });
        }
      });
      return items;
    });
    const formDesignOption = reactive({});
    const handlePageConfigGroupClick = (item) => {
      groupActive.value = item.key;
    };
    const handleUpdateConfigField = (field, value) => {
      emit("updateConfigValue", field, value);
    };
    const handleFormDesignBtnClick = (type, title) => {
      formDesignOption.type = type;
      formDesignOption.title = title;
      formDesignOption.visible = true;
    };
    const handleUpdateFormConfig = (data, type) => {
      emit("updateFormConfig", data, type);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        pageConfigGroups.value.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(pageConfigGroups.value, (item) => {
            return openBlock(), createElementBlock("div", {
              key: item.key,
              class: normalizeClass(["ele-crud-builder-page-config-group-list-item", { "is-active": item.key === groupActive.value }]),
              onClick: ($event) => handlePageConfigGroupClick(item)
            }, toDisplayString(item.label), 11, _hoisted_2);
          }), 128))
        ])) : createCommentVNode("", true),
        (openBlock(), createBlock(resolveDynamicComponent(__props.proFormComponent || EleProForm), {
          itemTypeData: __props.itemTypeData,
          httpRequest: __props.httpRequest,
          size: "small",
          labelPosition: "top",
          model: configFormData.value,
          items: activePageConfigFormItems.value,
          class: "ele-crud-builder-page-config-form",
          onUpdateValue: handleUpdateConfigField
        }, createSlots({ _: 2 }, [
          !_ctx.$slots.crudBuilderFormDesign ? {
            name: "crudBuilderFormDesign",
            fn: withCtx(({ item }) => [
              createVNode(unref(ElButton), {
                icon: unref(FormOutlined),
                class: "ele-pro-form-builder-props-fluid-btn",
                onClick: ($event) => handleFormDesignBtnClick(item.props?.type, item.label)
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(item.label), 1)
                ]),
                _: 2
              }, 1032, ["icon", "onClick"])
            ]),
            key: "0"
          } : void 0,
          !_ctx.$slots.crudBuilderSwitch ? {
            name: "crudBuilderSwitch",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(unref(ElSwitch), {
                modelValue: (modelValue ?? item.props?.defaultValue) !== false,
                "onUpdate:modelValue": (val) => updateValue(val ? {} : false)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ]),
            key: "1"
          } : void 0,
          !_ctx.$slots.proFormBuilderOptionsEdit ? {
            name: "proFormBuilderOptionsEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(OptionsEdit, mergeProps({ codeEditerComponent: __props.codeEditerComponent }, item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["codeEditerComponent", "modelValue", "onUpdate:modelValue"])
            ]),
            key: "2"
          } : void 0,
          !_ctx.$slots.proFormBuilderEventEdit ? {
            name: "proFormBuilderEventEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(EventEdit, mergeProps({ codeEditerComponent: __props.codeEditerComponent }, item.props || {}, {
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
          !_ctx.$slots.proFormBuilderStyleEdit ? {
            name: "proFormBuilderStyleEdit",
            fn: withCtx(({ item, modelValue, updateValue }) => [
              createVNode(StyleEdit, mergeProps(item.props || {}, {
                modelValue,
                "onUpdate:modelValue": updateValue
              }), null, 16, ["modelValue", "onUpdate:modelValue"])
            ]),
            key: "5"
          } : void 0,
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1064, ["itemTypeData", "httpRequest", "model", "items"])),
        createVNode(FormDesignModal, {
          modelValue: formDesignOption.visible,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => formDesignOption.visible = $event),
          title: formDesignOption.title,
          type: formDesignOption.type,
          config: __props.config,
          proFormComponent: __props.proFormComponent,
          proFormBuilderComponent: __props.proFormBuilderComponent,
          proFormBuilderProps: __props.proFormBuilderProps,
          jsonEditerComponent: __props.jsonEditerComponent,
          itemTypeData: __props.itemTypeData,
          httpRequest: __props.httpRequest,
          onUpdateFormConfig: handleUpdateFormConfig
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1032, ["modelValue", "title", "type", "config", "proFormComponent", "proFormBuilderComponent", "proFormBuilderProps", "jsonEditerComponent", "itemTypeData", "httpRequest"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, watch, openBlock, createBlock, withCtx, resolveDynamicComponent, mergeProps, unref, createSlots, createVNode, createTextVNode, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElButton } from "element-plus";
import { CheckOutlined } from "../../icons/index";
import EleModal from "../../ele-modal/index";
import EleProFormBuilder from "../../ele-pro-form-builder/index";
import { defaultHeaderRightTools } from "../../ele-pro-form-builder/util";
import { getFieldsSearchFormItems, getDefaultSearchFormProps, getFieldsAddFormItems, getFieldsEditFormItems } from "../../ele-crud/util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "FormDesignModal" },
  __name: "form-design-modal",
  props: {
    /** 弹窗是否打开 */
    modelValue: Boolean,
    /** 弹窗标题 */
    title: String,
    /** 类型 */
    type: String,
    /** 配置数据 */
    config: Object,
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
    /** JSON 编辑器组件 */
    jsonEditerComponent: [String, Object, Function],
    /** 高级表单组件类型数据 */
    itemTypeData: Array,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function]
  },
  emits: ["update:modelValue", "updateFormConfig"],
  setup(__props, { emit: __emit }) {
    const ownSlots = ["default", "headerTools"];
    const props = __props;
    const emit = __emit;
    const formConfig = ref();
    const handleUpdateModelValue = (visible) => {
      emit("update:modelValue", visible);
    };
    const handleSave = () => {
      handleCloseModal();
      emit("updateFormConfig", formConfig.value, props.type);
    };
    const handleCloseModal = () => {
      handleUpdateModelValue(false);
    };
    const handleUpdateFormConfig = (config) => {
      formConfig.value = config;
    };
    watch(
      () => props.modelValue,
      (visible) => {
        if (!visible) {
          return;
        }
        const config = props.config || {};
        const fields = config.fields;
        if (props.type === "search") {
          const searchConfig = config.searchConfig;
          const formProps = (searchConfig === false || searchConfig === true ? void 0 : searchConfig)?.formProps || {};
          const items = formProps.items?.length ? formProps.items : getFieldsSearchFormItems(fields);
          formConfig.value = {
            ...getDefaultSearchFormProps() || {},
            ...formProps,
            items
          };
          return;
        }
        if (props.type === "add") {
          const addConfig = config.addConfig;
          const formProps = (addConfig === false || addConfig === true ? void 0 : addConfig)?.formProps || {};
          const items = formProps.items?.length ? formProps.items : getFieldsAddFormItems(fields);
          formConfig.value = { ...formProps, items };
          return;
        }
        if (props.type === "edit") {
          const editConfig = config.editConfig;
          const formProps = (editConfig === false || editConfig === true ? void 0 : editConfig)?.formProps || {};
          const items = formProps.items?.length ? formProps.items : getFieldsEditFormItems(fields);
          formConfig.value = { ...formProps, items };
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, {
        width: 1260,
        maxable: true,
        position: "center",
        title: __props.title,
        modelValue: __props.modelValue,
        closeOnClickModal: false,
        destroyOnClose: true,
        class: "ele-crud-builder-form-design-modal",
        "onUpdate:modelValue": handleUpdateModelValue
      }, {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(__props.proFormBuilderComponent || EleProFormBuilder), mergeProps({
            proFormComponent: __props.proFormComponent,
            itemTypeData: __props.itemTypeData,
            httpRequest: __props.httpRequest,
            headerTools: unref(defaultHeaderRightTools)
          }, __props.proFormBuilderProps || {}, {
            modelValue: formConfig.value,
            "onUpdate:modelValue": handleUpdateFormConfig
          }), createSlots({
            headerTools: withCtx(() => [
              createVNode(unref(ElButton), {
                type: "primary",
                icon: unref(CheckOutlined),
                onClick: handleSave
              }, {
                default: withCtx(() => [..._cache[0] || (_cache[0] = [
                  createTextVNode(" 保存 ", -1)
                ])]),
                _: 1
              }, 8, ["icon"])
            ]),
            _: 2
          }, [
            renderList(Object.keys(_ctx.$slots).filter((k) => !ownSlots.includes(k)), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040, ["proFormComponent", "itemTypeData", "httpRequest", "headerTools", "modelValue"]))
        ]),
        _: 3
      }, 8, ["title", "modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

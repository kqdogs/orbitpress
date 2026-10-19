import { defineComponent, ref, reactive, computed, watch, openBlock, createBlock, mergeProps, createSlots, withCtx, resolveDynamicComponent, renderList, unref, renderSlot, normalizeProps, guardReactiveProps, createVNode } from "vue";
import { getSlotsMap } from "../../utils/common";
import { getValue } from "../../ele-data-table/util";
import EleModal from "../../ele-modal/index";
import EleProForm from "../../ele-pro-form/index";
import { setValue, mergeValue, getFormInitValue } from "../../ele-pro-form/util";
import EleButtons from "../../ele-buttons/index";
import { codeStringPrefix } from "../util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EditModal" },
  __name: "edit-modal",
  props: {
    /** 弹窗是否打开 */
    modelValue: Boolean,
    /** 编辑弹窗数据 */
    data: Object,
    /** 弹窗标题 */
    title: String,
    /** 编辑配置 */
    editConfig: Object,
    /** 列表配置 */
    listConfig: Object,
    /** 字段数据 */
    fields: Array,
    /** 获取字段数据对应的表单项的方法 */
    getFieldsEditFormItems: Function,
    /** 获取字段数据对应的表单项的方法 */
    getAndCacheCode: {
      type: Function,
      required: true
    },
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function],
    /** 修改数据接口 */
    editApi: [Function, String],
    /** 详情接口 */
    detailApi: [Function, String],
    /** 高级表单组件类型数据 */
    itemTypeData: Array,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function],
    /** 屏幕尺寸 */
    screenSize: String
  },
  emits: {
    /** 更新弹窗打开状态事件 */
    "update:modelValue": (_visible) => true,
    /** 编辑保存失败事件 */
    editError: (_e) => true,
    /** 编辑保存成功事件 */
    editDone: (_msg) => true,
    /** 详情查询失败事件 */
    detailError: (_e) => true,
    /** 详情查询成功事件 */
    detailDone: (_data) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const loading = ref(false);
    const editFormRef = ref(null);
    const editForm = reactive({});
    const editFormProps = computed(() => {
      const formProps = props.editConfig?.formProps || {};
      return {
        ...formProps,
        items: formProps.items?.length ? formProps.items : props.getFieldsEditFormItems?.(props.fields)
      };
    });
    const handleUpdateVisible = (visible) => {
      emit("update:modelValue", visible);
    };
    const handleSave = () => {
      editFormRef.value?.validate?.((valid) => {
        if (valid) {
          handleSubmitEditForm(editForm);
        }
      });
    };
    const handleCancel = () => {
      handleUpdateVisible(false);
      loading.value = false;
    };
    const handleUpdateEditForm = (field, value) => {
      setValue(editForm, field, value);
    };
    const handleResetEditForm = (item) => {
      Object.keys(editForm).forEach((key) => {
        editForm[key] = void 0;
      });
      mergeValue(
        editForm,
        getFormInitValue(
          editFormProps.value.items,
          editFormProps.value.itemTypeData || props.itemTypeData,
          true
        ),
        item
      );
    };
    const handleSubmitEditForm = (form) => {
      if (!props.editApi) {
        return;
      }
      const editApiFunc = typeof props.editApi === "function" ? props.editApi : props.editApi.startsWith(codeStringPrefix) ? props.getAndCacheCode(props.editApi) : void 0;
      if (!editApiFunc) {
        return;
      }
      loading.value = true;
      editApiFunc(form).then((msg) => {
        handleCancel();
        emit("editDone", msg);
      }).catch((e) => {
        loading.value = false;
        emit("editError", e);
      });
    };
    const btnItems = computed(() => {
      const items = [];
      if (props.editConfig?.cancelBtnProps !== false) {
        items.push({
          preset: "cancel",
          props: props.editConfig?.cancelBtnProps === true ? void 0 : props.editConfig?.cancelBtnProps,
          onClick: handleCancel
        });
      }
      if (props.editConfig?.saveBtnProps !== false) {
        items.push({
          preset: "save",
          props: {
            loading: loading.value,
            ...(props.editConfig?.saveBtnProps === true ? void 0 : props.editConfig?.saveBtnProps) || {}
          },
          onClick: handleSave
        });
      }
      return items;
    });
    const queryDetailData = () => {
      if (!props.detailApi) {
        return;
      }
      const detailApiFunc = typeof props.detailApi === "function" ? props.detailApi : props.detailApi.startsWith(codeStringPrefix) ? props.getAndCacheCode(props.detailApi) : void 0;
      if (!detailApiFunc) {
        return;
      }
      loading.value = true;
      const rowKey = props.listConfig?.tableProps?.rowKey;
      const dataKey = rowKey ? getValue(props.data, rowKey) : void 0;
      detailApiFunc(dataKey, props.data).then((data) => {
        loading.value = false;
        handleResetEditForm(data);
        emit("detailDone", data);
      }).catch((e) => {
        loading.value = false;
        emit("detailError", e);
      });
    };
    watch(
      () => props.modelValue,
      (visible) => {
        if (visible) {
          if (!props.detailApi) {
            handleResetEditForm(props.data);
          } else {
            handleResetEditForm();
            queryDetailData();
          }
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, mergeProps({
        width: 460,
        form: true,
        title: __props.title,
        destroyOnClose: true,
        loading: loading.value
      }, __props.editConfig?.modalProps || {}, {
        modelValue: __props.modelValue,
        "onUpdate:modelValue": handleUpdateVisible
      }), createSlots({
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(__props.proFormComponent || EleProForm), mergeProps({
            itemTypeData: __props.itemTypeData,
            httpRequest: __props.httpRequest,
            screenSize: __props.screenSize
          }, editFormProps.value, {
            ref_key: "editFormRef",
            ref: editFormRef,
            model: editForm,
            onUpdateValue: handleUpdateEditForm,
            onSubmit: handleSubmitEditForm,
            onReset: _cache[0] || (_cache[0] = ($event) => handleResetEditForm())
          }), createSlots({ _: 2 }, [
            renderList(unref(getSlotsMap)(
              _ctx.$slots,
              __props.editConfig?.formSlots,
              [],
              [],
              true
            ), (slotName, compSlotName) => {
              return {
                name: compSlotName,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040, ["itemTypeData", "httpRequest", "screenSize", "model"]))
        ]),
        _: 2
      }, [
        btnItems.value.length ? {
          name: "footer",
          fn: withCtx(() => [
            createVNode(unref(EleButtons), { items: btnItems.value }, null, 8, ["items"])
          ]),
          key: "0"
        } : void 0,
        renderList(unref(getSlotsMap)(
          _ctx.$slots,
          __props.editConfig?.modalSlots,
          ["default", "footer"]
        ), (slotName, compSlotName) => {
          return {
            name: compSlotName,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["title", "loading", "modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

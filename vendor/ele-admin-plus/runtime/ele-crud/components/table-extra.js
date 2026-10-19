import { defineComponent, openBlock, createElementBlock, Fragment, createBlock, unref, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps, createCommentVNode } from "vue";
import { getFieldsAddFormItems, getFieldsEditFormItems } from "../util";
import EditModal from "./edit-modal";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TableExtra" },
  __name: "table-extra",
  props: {
    /** 添加弹窗是否打开 */
    addVisible: Boolean,
    /** 添加弹窗数据 */
    addData: Object,
    /** 修改弹窗是否打开 */
    editVisible: Boolean,
    /** 修改弹窗数据 */
    editData: Object,
    /** 添加配置 */
    addConfig: [Object, Boolean],
    /** 修改配置 */
    editConfig: [Object, Boolean],
    /** 列表配置 */
    listConfig: Object,
    /** 字段数据 */
    fields: Array,
    /** 获取字段数据对应的表单项的方法 */
    getAndCacheCode: {
      type: Function,
      required: true
    },
    /** 高级表单组件 */
    proFormComponent: [String, Object, Function],
    /** 添加数据接口 */
    addApi: [Function, String],
    /** 修改数据接口 */
    editApi: [Function, String],
    /** 详情接口 */
    detailApi: [Function, String],
    /** 高级表单组件类型数据 */
    itemTypeData: Array,
    /** 远程数据源请求工具 */
    httpRequest: [Object, Function],
    /** 屏幕尺寸 */
    screenSize: String,
    /** 国际化 */
    lang: {
      type: Object,
      required: true
    }
  },
  emits: {
    /** 更新添加弹窗打开状态事件 */
    "update:addVisible": (_visible) => true,
    /** 更新修改弹窗打开状态事件 */
    "update:editVisible": (_visible) => true,
    /** 操作按钮点击事件 */
    btnClick: (_action, _e, _item) => true,
    /** 添加保存失败事件 */
    addError: (_e) => true,
    /** 添加保存成功事件 */
    addDone: (_msg) => true,
    /** 修改保存失败事件 */
    editError: (_e) => true,
    /** 修改保存成功事件 */
    editDone: (_msg) => true,
    /** 详情查询失败事件 */
    detailError: (_e) => true,
    /** 详情查询成功事件 */
    detailDone: (_data) => true
  },
  setup(__props, { emit: __emit }) {
    const slotExcludes = ["default"];
    const emit = __emit;
    const handleAddError = (e) => {
      emit("addError", e);
    };
    const handleAddDone = (msg) => {
      emit("addDone", msg);
    };
    const handleEditError = (e) => {
      emit("editError", e);
    };
    const handleEditDone = (msg) => {
      emit("editDone", msg);
    };
    const handleDetailError = (e) => {
      emit("detailError", e);
    };
    const handleDetailDone = (data) => {
      emit("detailDone", data);
    };
    const handleUpdateAddVisible = (visible) => {
      emit("update:addVisible", visible);
    };
    const handleUpdateEditVisible = (visible) => {
      emit("update:editVisible", visible);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.addConfig !== false ? (openBlock(), createBlock(EditModal, {
          key: 0,
          data: __props.addData,
          modelValue: __props.addVisible,
          title: __props.lang.add,
          editConfig: __props.addConfig === true ? {} : __props.addConfig,
          listConfig: __props.listConfig,
          fields: __props.fields,
          getFieldsEditFormItems: unref(getFieldsAddFormItems),
          getAndCacheCode: __props.getAndCacheCode,
          proFormComponent: __props.proFormComponent,
          editApi: __props.addApi,
          itemTypeData: __props.itemTypeData,
          httpRequest: __props.httpRequest,
          screenSize: __props.screenSize,
          onEditError: handleAddError,
          onEditDone: handleAddDone,
          "onUpdate:modelValue": handleUpdateAddVisible
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots).filter(
            (k) => !slotExcludes.includes(k)
          ), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || void 0)))
              ])
            };
          })
        ]), 1032, ["data", "modelValue", "title", "editConfig", "listConfig", "fields", "getFieldsEditFormItems", "getAndCacheCode", "proFormComponent", "editApi", "itemTypeData", "httpRequest", "screenSize"])) : createCommentVNode("", true),
        __props.editConfig !== false ? (openBlock(), createBlock(EditModal, {
          key: 1,
          data: __props.editData,
          modelValue: __props.editVisible,
          title: __props.lang.edit,
          editConfig: __props.editConfig === true ? {} : __props.editConfig,
          listConfig: __props.listConfig,
          fields: __props.fields,
          getFieldsEditFormItems: unref(getFieldsEditFormItems),
          getAndCacheCode: __props.getAndCacheCode,
          proFormComponent: __props.proFormComponent,
          editApi: __props.editApi,
          detailApi: __props.detailApi,
          itemTypeData: __props.itemTypeData,
          httpRequest: __props.httpRequest,
          screenSize: __props.screenSize,
          onEditError: handleEditError,
          onEditDone: handleEditDone,
          onDetailError: handleDetailError,
          onDetailDone: handleDetailDone,
          "onUpdate:modelValue": handleUpdateEditVisible
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots).filter(
            (k) => !slotExcludes.includes(k)
          ), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1032, ["data", "modelValue", "title", "editConfig", "listConfig", "fields", "getFieldsEditFormItems", "getAndCacheCode", "proFormComponent", "editApi", "detailApi", "itemTypeData", "httpRequest", "screenSize"])) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default")
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

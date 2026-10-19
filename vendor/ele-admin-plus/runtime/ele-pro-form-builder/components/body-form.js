import { defineComponent, ref, reactive, watch, openBlock, createElementBlock, normalizeClass, createBlock, resolveDynamicComponent, mergeProps, createSlots, withCtx, createVNode, renderList, renderSlot, normalizeProps, guardReactiveProps, unref, createCommentVNode } from "vue";
import { ElEmpty } from "element-plus";
import { eachTree } from "../../utils/common";
import { mergeValue, getFormInitValue, setValue } from "../../ele-pro-form/util";
import EleProForm from "../../ele-pro-form/index";
import { generateAddChildData, generateCopyItemData } from "./build-util";
import ComponentName from "./component-name";
import BuilderTools from "./builder-tools";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BodyForm" },
  __name: "body-form",
  props: {
    formProps: {},
    currentFormItemId: {},
    currentScreen: {},
    componentData: {},
    proFormComponent: {},
    itemTypeData: {},
    httpRequest: {}
  },
  emits: ["update:currentFormItemId", "updateItems", "openTableTool", "updateFormItems"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const ownSlots = ["builderItemHandleContent", "builderItemTools"];
    const props = __props;
    const emit = __emit;
    const proFormRef = ref(null);
    const formData = reactive({});
    const cachebuilderFormData = reactive({});
    const handleUpdateItems = (result) => {
      emit("updateItems", result);
    };
    const handleUpdateCurrentFormItemId = (formItemId) => {
      emit("update:currentFormItemId", formItemId);
    };
    const handleDeleteItem = (item) => {
      if (item.key != null) {
        handleUpdateItems({
          deleteItemIds: [item.key],
          addItems: [],
          updateItems: []
        });
      }
    };
    const handleAddChildrenItem = (formItem, action) => {
      if (formItem.key != null) {
        eachTree(props.formProps?.items, (item, cIndex, parent) => {
          if (item.key === formItem.key) {
            const result = generateAddChildData(
              item,
              parent,
              cIndex,
              action,
              props.formProps?.items,
              void 0,
              props.componentData
            );
            handleUpdateItems(result);
            return false;
          }
        });
      }
    };
    const handleCopyItem = (item) => {
      if (item.key != null) {
        handleUpdateItems(
          generateCopyItemData(item.key, props.formProps?.items)
        );
      }
    };
    const handleOpenTableTool = (item, e) => {
      if (item.key != null) {
        emit("openTableTool", item.key, e.currentTarget);
      }
    };
    const setBuilderFormDataFieldValue = (field, value) => {
      setValue(formData, field, value);
      setValue(cachebuilderFormData, field, value);
    };
    const handleUpdateFormItems = (items) => {
      emit("updateFormItems", items);
    };
    watch(
      () => props.currentFormItemId,
      (currentFormItemId) => {
        eachTree(props.formProps?.items, (item, _cIndex, parent) => {
          if (item.key === currentFormItemId) {
            if (item.type && ["tabPane", "collapseItem"].includes(item.type) && parent && parent.prop) {
              setBuilderFormDataFieldValue(parent.prop, item.prop);
            }
            return false;
          }
        });
      }
    );
    watch(
      () => props.formProps,
      () => {
        Object.keys(formData).forEach((k) => {
          formData[k] = void 0;
        });
        mergeValue(
          formData,
          getFormInitValue(props.formProps?.items, props.itemTypeData, true),
          cachebuilderFormData
        );
      },
      {
        deep: true,
        immediate: true
      }
    );
    __expose({ proFormRef });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-pro-form-builder-body", [
          { "is-pc": __props.currentScreen === "pc" },
          { "is-pad": __props.currentScreen === "pad" },
          { "is-phone": __props.currentScreen === "phone" }
        ]])
      }, [
        (openBlock(), createBlock(resolveDynamicComponent(__props.proFormComponent || EleProForm), mergeProps(__props.formProps || {}, {
          ref_key: "proFormRef",
          ref: proFormRef,
          model: formData,
          activeItemKey: __props.currentFormItemId,
          editable: true,
          screenSize: __props.currentScreen,
          footer: false,
          validateOnRuleChange: false,
          scrollToError: false,
          showMessage: false,
          itemTypeData: __props.itemTypeData,
          httpRequest: __props.httpRequest,
          class: "ele-pro-form-builder-body-form",
          onUpdateValue: setBuilderFormDataFieldValue,
          "onUpdate:items": handleUpdateFormItems,
          "onUpdate:activeItemKey": handleUpdateCurrentFormItemId
        }), createSlots({
          builderItemHandleContent: withCtx(({ item }) => [
            createVNode(ComponentName, {
              itemType: item.type,
              componentData: __props.componentData
            }, null, 8, ["itemType", "componentData"])
          ]),
          builderItemTools: withCtx(({ item }) => [
            createVNode(BuilderTools, {
              itemType: item.type,
              onDelete: ($event) => handleDeleteItem(item),
              onCopy: ($event) => handleCopyItem(item),
              onAdd: ($event) => handleAddChildrenItem(item),
              onAddTableRow: ($event) => handleAddChildrenItem(item, "addTableRow"),
              onAddTableCol: ($event) => handleAddChildrenItem(item, "addTableCol"),
              onOpenTableTool: (e) => handleOpenTableTool(item, e)
            }, null, 8, ["itemType", "onDelete", "onCopy", "onAdd", "onAddTableRow", "onAddTableCol", "onOpenTableTool"])
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
        ]), 1040, ["model", "activeItemKey", "screenSize", "itemTypeData", "httpRequest"])),
        !__props.formProps || !__props.formProps.items || !__props.formProps.items.length ? (openBlock(), createBlock(unref(ElEmpty), {
          key: 0,
          imageSize: 80,
          description: "拖拽左侧组件到此",
          class: "ele-pro-form-builder-form-empty"
        })) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

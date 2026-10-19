import { defineComponent, useModel, ref, reactive, watch, onBeforeUnmount, openBlock, createBlock, mergeProps, withCtx, createVNode, createElementVNode, unref, createSlots, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { findTree, eachTree, omit } from "../utils/common";
import { useMobile, useMobileDevice } from "../utils/hook";
import { setValue } from "../ele-pro-form/util";
import EleSplitPanel from "../ele-split-panel/index";
import EleTabBar from "../ele-tab-bar/index";
import ComponentList from "./components/component-list";
import TemplateList from "./components/template-list";
import OutlineTree from "./components/outline-tree";
import BodyHeader from "./components/body-header";
import BodyForm from "./components/body-form";
import PropsForm from "./components/props-form";
import ConfigForm from "./components/config-form";
import TableToolMenu from "./components/table-tool-menu";
import ComponentPicker from "./components/component-picker";
import { deepCloneObject } from "./components/build-core";
import { proFormBuilderEmits, proFormBuilderProps } from "./props";
const _hoisted_1 = { class: "ele-pro-form-builder-tab-body" };
const _hoisted_2 = { class: "ele-pro-form-builder-body-wrapper" };
const _hoisted_3 = { class: "ele-pro-form-builder-tab-body" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleProFormBuilder" },
  __name: "index",
  props: proFormBuilderProps,
  emits: proFormBuilderEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formProps = useModel(props, "modelValue");
    const leftSideCollapse = ref(false);
    const rightSideCollapse = ref(false);
    const [isMobile] = useMobile((mobile) => {
      leftSideCollapse.value = mobile;
      rightSideCollapse.value = mobile;
    });
    const [isMobileDevice] = useMobileDevice();
    const leftTabActive = ref(
      "components"
    );
    const rightTabActive = ref("formProps");
    const currentFormItemId = ref();
    const currentScreen = ref("pc");
    const historyDataList = ref([]);
    const redoDataList = ref([]);
    const tableToolMenuRef = ref(null);
    const componentPickerOption = reactive({
      visible: false,
      addParentFormItemId: void 0,
      editFormItemId: void 0,
      editFormItemType: void 0
    });
    let storeHistoryTimer = null;
    const stopStoreHistoryTimer = () => {
      if (storeHistoryTimer != null) {
        clearTimeout(storeHistoryTimer);
        storeHistoryTimer = null;
      }
    };
    const getFormItems = () => {
      return formProps.value?.items || [];
    };
    const setFormItems = (items) => {
      if (!formProps.value) {
        formProps.value = Object.assign({}, props.proFormInitialProps || {}, {
          items: items || []
        });
        return;
      }
      const data = formProps.value;
      if (!data.items && props.proFormInitialProps) {
        const keys = Object.keys(data).filter(
          (k) => typeof data[k] !== "undefined"
        );
        Object.assign(formProps.value, omit(props.proFormInitialProps, keys), {
          items: items || []
        });
        return;
      }
      formProps.value.items = items || [];
    };
    const setFormPropValue = (field, value, store) => {
      {
        storeHistory(!!field);
      }
      if (!formProps.value) {
        formProps.value = { items: [] };
      }
      if (!field) {
        const excludeFields = ["items"];
        const temp = omit(value, excludeFields);
        Object.assign(formProps.value, temp);
        const valueKeys = Object.keys(temp);
        Object.keys(formProps.value).forEach((key) => {
          if (formProps.value && !excludeFields.includes(key) && !valueKeys.includes(key) && typeof formProps.value[key] !== "undefined") {
            formProps.value[key] = void 0;
          }
        });
      } else {
        setValue(formProps.value, field, value);
      }
    };
    const updateFormItemProp = (formItemId, field, value, store) => {
      const item = findTree(getFormItems(), (item2) => item2.key === formItemId);
      if (item) {
        if (store) {
          storeHistory(!!field);
        }
        if (!field) {
          const excludeFields = ["key", "children"];
          const temp = omit(value, excludeFields);
          Object.assign(item, temp);
          const valueKeys = Object.keys(temp);
          Object.keys(item).forEach((key) => {
            if (item && !excludeFields.includes(key) && !valueKeys.includes(key) && typeof item[key] !== "undefined") {
              item[key] = void 0;
            }
          });
        } else {
          setValue(item, field, value);
        }
      }
    };
    const deleteFormItem = (formItemId) => {
      if (currentFormItemId.value != null && currentFormItemId.value === formItemId) {
        currentFormItemId.value = void 0;
      }
      const formItemsData = getFormItems();
      eachTree(formItemsData, (item, index, parent) => {
        if (item.key === formItemId) {
          if (parent) {
            if (parent.children) {
              parent.children.splice(index, 1);
            }
          } else {
            formItemsData.splice(index, 1);
          }
          return false;
        }
      });
    };
    const handleUpdateFormProp = (field, value) => {
      setFormPropValue(field, value);
    };
    const handleUpdateFormItemProp = (formItemId, field, value) => {
      updateFormItemProp(formItemId, field, value, true);
    };
    const handleUpdateItems = ({
      addItems,
      updateItems,
      deleteItemIds
    }) => {
      hideTableTool();
      componentPickerOption.visible = false;
      componentPickerOption.addParentFormItemId = void 0;
      componentPickerOption.editFormItemId = void 0;
      componentPickerOption.editFormItemType = void 0;
      if (addItems.length || deleteItemIds.length || updateItems.length) {
        storeHistory();
      }
      updateItems.forEach((effect) => {
        updateFormItemProp(effect.itemId, effect.field, effect.value);
      });
      addItems.forEach(({ item, parentItemId, index }) => {
        if (!item) {
          return;
        }
        if (parentItemId == null) {
          if (index != null) {
            const items = getFormItems();
            setFormItems([...items.slice(0, index), item, ...items.slice(index)]);
          } else {
            setFormItems([...getFormItems(), item]);
          }
          return;
        }
        const parent = findTree(
          getFormItems(),
          (item2) => item2.key === parentItemId
        );
        if (parent) {
          if (parent.children) {
            if (index != null) {
              parent.children.splice(index, 0, item);
            } else {
              parent.children.push(item);
            }
          } else {
            parent.children = [item];
          }
        }
      });
      deleteItemIds.forEach((formItemId) => {
        deleteFormItem(formItemId);
      });
      if (addItems.length && isMobile.value) {
        leftSideCollapse.value = true;
      }
    };
    const handleSortItemChildren = (childIds, formItemId) => {
      const item = findTree(getFormItems(), (item2) => item2.key === formItemId);
      if (item && item.children) {
        storeHistory();
        item.children.sort((a, b) => {
          const aIndex = a.key == null ? -1 : childIds.indexOf(a.key);
          const bIndex = b.key == null ? -1 : childIds.indexOf(b.key);
          return aIndex - bIndex;
        });
      }
    };
    const handleUpdateItemChildren = (data, parentKey) => {
      hideTableTool();
      storeHistory(true);
      if (parentKey == null) {
        setFormItems(data);
        return;
      }
      eachTree(getFormItems(), (item) => {
        if (item.key === parentKey) {
          item.children = data;
          return false;
        }
      });
    };
    const handleUpdateFormItems = (items) => {
      handleUpdateItemChildren(items);
    };
    const getStoreConfigData = () => {
      return deepCloneObject(formProps.value);
    };
    const setStoreConfigData = (data) => {
      formProps.value = data;
    };
    const storeHistory = (delay) => {
      stopStoreHistoryTimer();
      const undoData = getStoreConfigData();
      if (!delay) {
        historyDataList.value.push(undoData);
        redoDataList.value = [];
        return;
      }
      storeHistoryTimer = setTimeout(() => {
        historyDataList.value.push(undoData);
        redoDataList.value = [];
      }, 600);
    };
    const handleUndo = () => {
      const data = historyDataList.value.pop();
      if (!data) {
        return;
      }
      const redoData = getStoreConfigData();
      redoDataList.value.unshift(redoData);
      setStoreConfigData(data);
      currentFormItemId.value = void 0;
    };
    const handleRedo = () => {
      const data = redoDataList.value.shift();
      if (!data) {
        return;
      }
      const undoData = getStoreConfigData();
      historyDataList.value.push(undoData);
      setStoreConfigData(data);
      currentFormItemId.value = void 0;
    };
    const handleClear = () => {
      if (getFormItems().length) {
        storeHistory();
        setFormItems([]);
        currentFormItemId.value = void 0;
      }
    };
    const handleImport = (data) => {
      storeHistory();
      formProps.value = { ...data, items: data.items || [] };
      currentFormItemId.value = void 0;
      if (isMobile.value) {
        leftSideCollapse.value = true;
        rightSideCollapse.value = true;
      }
    };
    const handleOpenTableTool = (formItemId, el) => {
      tableToolMenuRef.value && tableToolMenuRef.value.openMenu(formItemId, el);
    };
    const hideTableTool = () => {
      tableToolMenuRef.value && tableToolMenuRef.value.hideMenu();
    };
    const handleOpenComponentPicker = (formItemId, formItemType) => {
      if (formItemType != null) {
        componentPickerOption.addParentFormItemId = void 0;
        componentPickerOption.editFormItemId = formItemId;
        componentPickerOption.editFormItemType = formItemType;
      } else {
        componentPickerOption.addParentFormItemId = formItemId;
        componentPickerOption.editFormItemId = void 0;
        componentPickerOption.editFormItemType = void 0;
      }
      componentPickerOption.visible = true;
    };
    const handlePreviewFormSubmit = (data) => {
      emit("previewFormSubmit", data);
    };
    watch(currentFormItemId, (formItemId) => {
      if (formItemId != null) {
        if (rightTabActive.value !== "itemProps") {
          rightTabActive.value = "itemProps";
        }
      } else if (!getFormItems().length && rightTabActive.value !== "formProps") {
        rightTabActive.value = "formProps";
      }
    });
    onBeforeUnmount(() => {
      stopStoreHistoryTimer();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleSplitPanel, mergeProps({
        space: 0,
        size: 280,
        allowCollapse: true,
        collapseBtnOffset: 2
      }, _ctx.splitPanelProps || {}, {
        collapse: leftSideCollapse.value,
        "onUpdate:collapse": _cache[8] || (_cache[8] = ($event) => leftSideCollapse.value = $event),
        class: "ele-pro-form-builder-wrapper"
      }), {
        body: withCtx(() => [
          createVNode(EleSplitPanel, mergeProps({
            space: 0,
            size: 220,
            reverse: true,
            allowCollapse: true,
            collapseBtnOffset: 2
          }, _ctx.rightSplitPanelProps || {}, {
            collapse: rightSideCollapse.value,
            "onUpdate:collapse": _cache[6] || (_cache[6] = ($event) => rightSideCollapse.value = $event),
            class: "ele-pro-form-builder-main-wrapper"
          }), {
            body: withCtx(() => [
              createElementVNode("div", _hoisted_2, [
                createVNode(BodyHeader, {
                  currentScreen: currentScreen.value,
                  "onUpdate:currentScreen": _cache[2] || (_cache[2] = ($event) => currentScreen.value = $event),
                  undoDisabled: !historyDataList.value.length,
                  redoDisabled: !redoDataList.value.length,
                  formProps: unref(formProps),
                  headerTools: _ctx.headerTools,
                  proFormComponent: _ctx.proFormComponent,
                  jsonEditerComponent: _ctx.jsonEditerComponent,
                  codeViewerComponent: _ctx.codeViewerComponent,
                  itemTypeData: _ctx.itemTypeData,
                  componentData: _ctx.componentData,
                  httpRequest: _ctx.httpRequest,
                  onUndo: handleUndo,
                  onRedo: handleRedo,
                  onClear: handleClear,
                  onPreviewFormSubmit: handlePreviewFormSubmit,
                  onImportData: handleImport
                }, createSlots({ _: 2 }, [
                  renderList(Object.keys(_ctx.$slots), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                      ])
                    };
                  })
                ]), 1032, ["currentScreen", "undoDisabled", "redoDisabled", "formProps", "headerTools", "proFormComponent", "jsonEditerComponent", "codeViewerComponent", "itemTypeData", "componentData", "httpRequest"]),
                createVNode(BodyForm, {
                  formProps: unref(formProps),
                  componentData: _ctx.componentData,
                  currentFormItemId: currentFormItemId.value,
                  "onUpdate:currentFormItemId": _cache[3] || (_cache[3] = ($event) => currentFormItemId.value = $event),
                  currentScreen: currentScreen.value,
                  proFormComponent: _ctx.proFormComponent,
                  itemTypeData: _ctx.itemTypeData,
                  httpRequest: _ctx.httpRequest,
                  onUpdateItems: handleUpdateItems,
                  onOpenTableTool: handleOpenTableTool,
                  onUpdateFormItems: handleUpdateFormItems
                }, createSlots({ _: 2 }, [
                  renderList(Object.keys(_ctx.$slots), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                      ])
                    };
                  })
                ]), 1032, ["formProps", "componentData", "currentFormItemId", "currentScreen", "proFormComponent", "itemTypeData", "httpRequest"])
              ])
            ]),
            default: withCtx(() => [
              createVNode(EleTabBar, {
                modelValue: rightTabActive.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => rightTabActive.value = $event),
                items: [
                  { value: "itemProps", label: "属性设置" },
                  { value: "formProps", label: "表单设置" }
                ]
              }, null, 8, ["modelValue"]),
              createElementVNode("div", _hoisted_3, [
                rightTabActive.value === "itemProps" ? (openBlock(), createBlock(PropsForm, {
                  key: 0,
                  formProps: unref(formProps),
                  currentFormItemId: currentFormItemId.value,
                  "onUpdate:currentFormItemId": _cache[5] || (_cache[5] = ($event) => currentFormItemId.value = $event),
                  configFormPresetProps: _ctx.configFormPresetProps,
                  componentData: _ctx.componentData,
                  proFormComponent: _ctx.proFormComponent,
                  codeEditerComponent: _ctx.codeEditerComponent,
                  jsonEditerComponent: _ctx.jsonEditerComponent,
                  htmlEditerComponent: _ctx.htmlEditerComponent,
                  itemTypeData: _ctx.itemTypeData,
                  httpRequest: _ctx.httpRequest,
                  onUpdateItem: handleUpdateFormItemProp,
                  onUpdateItems: handleUpdateItems,
                  onSortItemChildren: handleSortItemChildren,
                  onOpenComponentPicker: handleOpenComponentPicker
                }, createSlots({ _: 2 }, [
                  renderList(Object.keys(_ctx.$slots), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                      ])
                    };
                  })
                ]), 1032, ["formProps", "currentFormItemId", "configFormPresetProps", "componentData", "proFormComponent", "codeEditerComponent", "jsonEditerComponent", "htmlEditerComponent", "itemTypeData", "httpRequest"])) : (openBlock(), createBlock(ConfigForm, {
                  key: 1,
                  formProps: unref(formProps),
                  configFormItems: _ctx.configFormItems,
                  configFormPresetProps: _ctx.configFormPresetProps,
                  proFormComponent: _ctx.proFormComponent,
                  jsonEditerComponent: _ctx.jsonEditerComponent,
                  itemTypeData: _ctx.itemTypeData,
                  httpRequest: _ctx.httpRequest,
                  onUpdateFormProp: handleUpdateFormProp
                }, createSlots({ _: 2 }, [
                  renderList(Object.keys(_ctx.$slots), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                      ])
                    };
                  })
                ]), 1032, ["formProps", "configFormItems", "configFormPresetProps", "proFormComponent", "jsonEditerComponent", "itemTypeData", "httpRequest"]))
              ])
            ]),
            _: 3
          }, 16, ["collapse"])
        ]),
        default: withCtx(() => [
          createVNode(EleTabBar, {
            modelValue: leftTabActive.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => leftTabActive.value = $event),
            items: [
              { value: "components", label: "组件库" },
              { value: "templates", label: "模板库" },
              { value: "outlines", label: "大纲" }
            ]
          }, null, 8, ["modelValue"]),
          createElementVNode("div", _hoisted_1, [
            leftTabActive.value === "outlines" ? (openBlock(), createBlock(OutlineTree, {
              key: 0,
              formItems: unref(formProps)?.items,
              currentFormItemId: currentFormItemId.value,
              "onUpdate:currentFormItemId": _cache[1] || (_cache[1] = ($event) => currentFormItemId.value = $event),
              componentData: _ctx.componentData,
              itemTypeData: _ctx.itemTypeData,
              onUpdateItems: handleUpdateItems,
              onUpdateItemChildren: handleUpdateItemChildren,
              onOpenTableTool: handleOpenTableTool,
              onOpenComponentPicker: handleOpenComponentPicker
            }, null, 8, ["formItems", "currentFormItemId", "componentData", "itemTypeData"])) : leftTabActive.value === "templates" ? (openBlock(), createBlock(TemplateList, {
              key: 1,
              templateData: _ctx.templateData,
              onImportData: handleImport
            }, null, 8, ["templateData"])) : (openBlock(), createBlock(ComponentList, {
              key: 2,
              formItems: unref(formProps)?.items,
              draggable: !unref(isMobileDevice) && !unref(isMobile),
              componentData: _ctx.componentData,
              itemTypeData: _ctx.itemTypeData,
              onUpdateItems: handleUpdateItems
            }, null, 8, ["formItems", "draggable", "componentData", "itemTypeData"]))
          ]),
          createVNode(TableToolMenu, {
            ref_key: "tableToolMenuRef",
            ref: tableToolMenuRef,
            formItems: unref(formProps)?.items,
            componentData: _ctx.componentData,
            onUpdateItems: handleUpdateItems
          }, null, 8, ["formItems", "componentData"]),
          createVNode(ComponentPicker, {
            modelValue: componentPickerOption.visible,
            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => componentPickerOption.visible = $event),
            addParentFormItemId: componentPickerOption.addParentFormItemId,
            editFormItemId: componentPickerOption.editFormItemId,
            editFormItemType: componentPickerOption.editFormItemType,
            formItems: unref(formProps)?.items,
            componentData: _ctx.componentData,
            itemTypeData: _ctx.itemTypeData,
            onUpdateItems: handleUpdateItems
          }, null, 8, ["modelValue", "addParentFormItemId", "editFormItemId", "editFormItemType", "formItems", "componentData", "itemTypeData"])
        ]),
        _: 3
      }, 16, ["collapse"]);
    };
  }
});
export {
  _sfc_main as default
};

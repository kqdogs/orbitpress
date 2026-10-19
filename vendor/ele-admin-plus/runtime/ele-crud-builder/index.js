import { defineComponent, useModel, ref, onBeforeUnmount, openBlock, createBlock, mergeProps, withCtx, createVNode, createElementVNode, unref, createSlots, renderList, renderSlot, normalizeProps, guardReactiveProps, createCommentVNode, normalizeClass, resolveDynamicComponent } from "vue";
import { ElEmpty } from "element-plus";
import { useMobile } from "../utils/hook";
import { eachTree, findTree, omit } from "../utils/common";
import EleSplitPanel from "../ele-split-panel/index";
import EleTabBar from "../ele-tab-bar/index";
import { getValue, setValue } from "../ele-pro-form/util";
import { deepCloneObject } from "../ele-pro-form-builder/components/build-core";
import EleCrud from "../ele-crud/index";
import { getFieldsSearchFormItems, getFieldsAddFormItems, getFieldsEditFormItems } from "../ele-crud/util";
import FieldTree from "./components/field-tree";
import PageConfig from "./components/page-config";
import TemplateList from "./components/template-list";
import BodyHeader from "./components/body-header";
import { crudBuilderEmits, crudBuilderProps } from "./props";
const _hoisted_1 = { class: "ele-crud-builder-tab-body" };
const _hoisted_2 = { class: "ele-crud-builder-body-wrapper" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCrudBuilder" },
  __name: "index",
  props: crudBuilderProps,
  emits: crudBuilderEmits,
  setup(__props) {
    const ownSlots = ["default", "headerTools"];
    const props = __props;
    const crudConfig = useModel(props, "modelValue");
    const leftSideCollapse = ref(false);
    const [isMobile] = useMobile((mobile) => {
      leftSideCollapse.value = mobile;
    });
    const leftTabActive = ref("fields");
    const currentScreen = ref("pc");
    const historyDataList = ref([]);
    const redoDataList = ref([]);
    let storeHistoryTimer = null;
    const stopStoreHistoryTimer = () => {
      if (storeHistoryTimer != null) {
        clearTimeout(storeHistoryTimer);
        storeHistoryTimer = null;
      }
    };
    const getCrudFields = () => {
      return crudConfig.value?.fields || [];
    };
    const setCrudFields = (fields) => {
      if (!crudConfig.value) {
        crudConfig.value = { fields: fields || [] };
        return;
      }
      crudConfig.value.fields = fields || [];
    };
    const getStoreConfigData = () => {
      return deepCloneObject(crudConfig.value);
    };
    const setStoreConfigData = (data) => {
      crudConfig.value = data;
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
    const handleDeleteField = (key) => {
      if (key == null) {
        return;
      }
      storeHistory();
      const fieldsData = getCrudFields();
      eachTree(fieldsData, (item, index, parent) => {
        if (item.key === key) {
          if (parent) {
            if (parent.children) {
              parent.children.splice(index, 1);
            }
          } else {
            fieldsData.splice(index, 1);
          }
          return false;
        }
      });
    };
    const handleAddField = (field, parentKey, index) => {
      if (!field) {
        return;
      }
      storeHistory();
      if (parentKey == null) {
        if (index != null) {
          const items = getCrudFields();
          setCrudFields([...items.slice(0, index), field, ...items.slice(index)]);
        } else {
          setCrudFields([...getCrudFields(), field]);
          if (crudConfig.value != null) {
            if (field.hideInSearch !== true) {
              const items = getValue(
                crudConfig.value,
                "searchConfig.formProps.items"
              );
              if (items != null && Array.isArray(items) && items.length) {
                setValue(crudConfig.value, "searchConfig.formProps.items", [
                  ...items,
                  ...getFieldsSearchFormItems([field])
                ]);
              }
            }
            if (field.hideInAdd !== true) {
              const items = getValue(
                crudConfig.value,
                "addConfig.formProps.items"
              );
              if (items != null && Array.isArray(items) && items.length) {
                setValue(crudConfig.value, "addConfig.formProps.items", [
                  ...items,
                  ...getFieldsAddFormItems([field])
                ]);
              }
            }
            if (field.hideInEdit !== true) {
              const items = getValue(
                crudConfig.value,
                "editConfig.formProps.items"
              );
              if (items != null && Array.isArray(items) && items.length) {
                setValue(crudConfig.value, "editConfig.formProps.items", [
                  ...items,
                  ...getFieldsEditFormItems([field])
                ]);
              }
            }
          }
        }
        return;
      }
      const parent = findTree(getCrudFields(), (item) => item.key === parentKey);
      if (parent) {
        if (parent.children) {
          if (index != null) {
            parent.children.splice(index, 0, field);
          } else {
            parent.children.push(field);
          }
        } else {
          parent.children = [field];
        }
      }
    };
    const handleUpdateField = (field) => {
      if (field == null || field.key == null) {
        return;
      }
      storeHistory();
      eachTree(getCrudFields(), (item) => {
        if (item.key === field.key) {
          Object.assign(item, field);
          return false;
        }
      });
    };
    const handleUpdateFieldChildren = (data, parentKey) => {
      storeHistory(true);
      if (parentKey == null) {
        setCrudFields(data);
        return;
      }
      eachTree(getCrudFields(), (item) => {
        if (item.key === parentKey) {
          item.children = data;
          return false;
        }
      });
    };
    const handleUpdateConfigField = (field, value, delayStoreHistory) => {
      storeHistory(delayStoreHistory ?? !!field);
      if (!field) {
        const excludeFields = ["fields"];
        const temp = omit(value, excludeFields);
        if (!crudConfig.value) {
          const config = {};
          Object.assign(config, temp);
          crudConfig.value = config;
        } else {
          Object.assign(crudConfig.value, temp);
          const valueKeys = Object.keys(temp);
          Object.keys(crudConfig.value).forEach((key) => {
            if (crudConfig.value && !excludeFields.includes(key) && !valueKeys.includes(key) && typeof crudConfig.value[key] !== "undefined") {
              crudConfig.value[key] = void 0;
            }
          });
        }
      } else if (!crudConfig.value) {
        const config = {};
        setValue(config, field, value);
        crudConfig.value = config;
      } else {
        setValue(crudConfig.value, field, value);
      }
    };
    const handleUpdateFormConfig = (data, type) => {
      if (type === "search") {
        handleUpdateConfigField("searchConfig.formProps", data, false);
      } else if (type === "add") {
        handleUpdateConfigField("addConfig.formProps", data, false);
      } else if (type === "edit") {
        handleUpdateConfigField("editConfig.formProps", data, false);
      }
    };
    const handleUndo = () => {
      const data = historyDataList.value.pop();
      if (!data) {
        return;
      }
      const redoData = getStoreConfigData();
      redoDataList.value.unshift(redoData);
      setStoreConfigData(data);
    };
    const handleRedo = () => {
      const data = redoDataList.value.shift();
      if (!data) {
        return;
      }
      const undoData = getStoreConfigData();
      historyDataList.value.push(undoData);
      setStoreConfigData(data);
    };
    const handleClear = () => {
      if (getCrudFields().length) {
        storeHistory();
        setCrudFields([]);
      }
    };
    const handleImportData = (data) => {
      storeHistory();
      crudConfig.value = { ...data, fields: data.fields || [] };
      if (isMobile.value) {
        leftSideCollapse.value = true;
      }
    };
    onBeforeUnmount(() => {
      stopStoreHistoryTimer();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleSplitPanel, mergeProps({
        space: 0,
        size: 240,
        allowCollapse: true,
        collapseBtnOffset: 2
      }, _ctx.splitPanelProps || {}, {
        collapse: leftSideCollapse.value,
        "onUpdate:collapse": _cache[2] || (_cache[2] = ($event) => leftSideCollapse.value = $event),
        class: "ele-crud-builder-wrapper"
      }), {
        body: withCtx(() => [
          createElementVNode("div", _hoisted_2, [
            createVNode(BodyHeader, {
              currentScreen: currentScreen.value,
              "onUpdate:currentScreen": _cache[1] || (_cache[1] = ($event) => currentScreen.value = $event),
              undoDisabled: !historyDataList.value.length,
              redoDisabled: !redoDataList.value.length,
              config: unref(crudConfig),
              headerTools: _ctx.headerTools,
              proFormComponent: _ctx.proFormComponent,
              jsonEditerComponent: _ctx.jsonEditerComponent,
              codeViewerComponent: _ctx.codeViewerComponent,
              itemTypeData: _ctx.itemTypeData,
              httpRequest: _ctx.httpRequest,
              onUndo: handleUndo,
              onRedo: handleRedo,
              onClear: handleClear,
              onImportData: handleImportData
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["currentScreen", "undoDisabled", "redoDisabled", "config", "headerTools", "proFormComponent", "jsonEditerComponent", "codeViewerComponent", "itemTypeData", "httpRequest"]),
            createElementVNode("div", {
              class: normalizeClass(["ele-crud-builder-body", [
                { "is-pc": currentScreen.value === "pc" },
                { "is-pad": currentScreen.value === "pad" },
                { "is-phone": currentScreen.value === "phone" },
                {
                  "is-show-page-card": !!(unref(crudConfig)?.pageConfig?.pageProps || unref(crudConfig)?.pageConfig?.cardProps || unref(crudConfig)?.listConfig?.cardProps || unref(crudConfig)?.searchConfig && unref(crudConfig).searchConfig !== true && unref(crudConfig).searchConfig.cardProps)
                }
              ]])
            }, [
              !unref(crudConfig) || !unref(crudConfig).fields || !unref(crudConfig).fields.length ? (openBlock(), createBlock(unref(ElEmpty), {
                key: 0,
                imageSize: 80,
                class: "ele-crud-builder-form-empty"
              })) : (openBlock(), createBlock(resolveDynamicComponent(_ctx.crudComponent || unref(EleCrud)), mergeProps({
                key: 1,
                proFormComponent: _ctx.proFormComponent,
                itemTypeData: _ctx.itemTypeData,
                httpRequest: _ctx.httpRequest,
                screenSize: currentScreen.value
              }, unref(crudConfig) || {}), createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots).filter(
                  (k) => !ownSlots.includes(k)
                ), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                    ])
                  };
                })
              ]), 1040, ["proFormComponent", "itemTypeData", "httpRequest", "screenSize"]))
            ], 2)
          ])
        ]),
        default: withCtx(() => [
          createVNode(EleTabBar, {
            modelValue: leftTabActive.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => leftTabActive.value = $event),
            items: [
              { value: "fields", label: "字段列表" },
              { value: "config", label: "页面设置" },
              { value: "templates", label: "模板库" }
            ]
          }, null, 8, ["modelValue"]),
          createElementVNode("div", _hoisted_1, [
            leftTabActive.value === "fields" ? (openBlock(), createBlock(FieldTree, {
              key: 0,
              fields: unref(crudConfig)?.fields,
              fieldEditFormItems: _ctx.fieldEditFormItems,
              proFormComponent: _ctx.proFormComponent,
              jsonEditerComponent: _ctx.jsonEditerComponent,
              itemTypeData: _ctx.itemTypeData,
              httpRequest: _ctx.httpRequest,
              onDeleteField: handleDeleteField,
              onAddField: handleAddField,
              onUpdateField: handleUpdateField,
              onUpdateFieldChildren: handleUpdateFieldChildren
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter(
                (k) => !ownSlots.includes(k)
              ), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["fields", "fieldEditFormItems", "proFormComponent", "jsonEditerComponent", "itemTypeData", "httpRequest"])) : leftTabActive.value === "config" ? (openBlock(), createBlock(PageConfig, {
              key: 1,
              config: unref(crudConfig),
              pageConfigFormItems: _ctx.pageConfigFormItems,
              proFormComponent: _ctx.proFormComponent,
              proFormBuilderComponent: _ctx.proFormBuilderComponent,
              proFormBuilderProps: _ctx.proFormBuilderProps,
              codeEditerComponent: _ctx.codeEditerComponent,
              jsonEditerComponent: _ctx.jsonEditerComponent,
              itemTypeData: _ctx.itemTypeData,
              httpRequest: _ctx.httpRequest,
              onUpdateConfigValue: handleUpdateConfigField,
              onUpdateFormConfig: handleUpdateFormConfig
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots).filter(
                (k) => !ownSlots.includes(k)
              ), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["config", "pageConfigFormItems", "proFormComponent", "proFormBuilderComponent", "proFormBuilderProps", "codeEditerComponent", "jsonEditerComponent", "itemTypeData", "httpRequest"])) : leftTabActive.value === "templates" ? (openBlock(), createBlock(TemplateList, {
              key: 2,
              templateData: _ctx.templateData,
              onImportData: handleImportData
            }, null, 8, ["templateData"])) : createCommentVNode("", true)
          ])
        ]),
        _: 3
      }, 16, ["collapse"]);
    };
  }
});
export {
  _sfc_main as default
};

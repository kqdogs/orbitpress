import { defineComponent, ref, computed, reactive, watch, onBeforeUnmount, createVNode, mergeProps, h, isVNode } from "vue";
import { ElInput } from "element-plus";
import { SearchOutlined } from "../icons/index";
import { useLocale } from "../ele-config-provider/receiver";
import { omit, mapTree, getMappedSlots } from "../utils/common";
import { useMobile } from "../utils/hook";
import { useMessage } from "../utils/message";
import { useMessageBox } from "../utils/message-box";
import ElePage from "../ele-page/index";
import EleCard from "../ele-card/index";
import EleProTable from "../ele-pro-table/index";
import EleProForm from "../ele-pro-form/index";
import { getFormInitValue, cloneDeep, setValue, mergeValue } from "../ele-pro-form/util";
import EleSplitPanel from "../ele-split-panel/index";
import { getValue } from "../ele-data-table/util";
import EleButtons from "../ele-buttons/index";
import TableExtra from "./components/table-extra";
import PageSide from "./components/page-side";
import { getDefaultSearchFormProps, getFieldsSearchFormItems, codeStringPrefix, getCodeResult, getTreeValueField } from "./util";
import { crudEmits, crudProps } from "./props";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
const index = /* @__PURE__ */ defineComponent({
  name: "EleCrud",
  props: crudProps,
  emits: crudEmits,
  setup(props, {
    emit,
    slots,
    expose
  }) {
    const {
      lang
    } = useLocale("crud", props);
    const message = useMessage({
      plain: true
    });
    const messageBox = useMessageBox();
    const defaultSearchFormProps = getDefaultSearchFormProps();
    const tableRef = ref(null);
    const selections = ref([]);
    const addVisible = ref(false);
    const addData = ref();
    const editVisible = ref(false);
    const editData = ref();
    const toolbarBtnItems = computed(() => {
      const listConfig = props.listConfig || {};
      const addBtnProps = listConfig.addBtnProps;
      const delBtnProps = listConfig.delBtnProps;
      const items = [];
      if (addBtnProps !== false) {
        items.push({
          preset: "add",
          props: addBtnProps === true ? void 0 : addBtnProps,
          onClick: () => handleBtnClick("add")
        });
      }
      if (delBtnProps !== false) {
        items.push({
          preset: "delBatch",
          props: delBtnProps === true ? void 0 : delBtnProps,
          onClick: () => handleBtnClick("delSelections")
        });
      }
      return items;
    });
    const actionBtnItems = computed(() => {
      const listConfig = props.listConfig || {};
      const editLinkProps = listConfig.editLinkProps;
      const delLinkProps = listConfig.delLinkProps;
      const delPopConfirmProps = listConfig.delPopConfirmProps;
      const items = [];
      if (editLinkProps !== false) {
        items.push({
          preset: "edit",
          props: editLinkProps === true ? void 0 : editLinkProps,
          command: "edit"
        });
      }
      if (delLinkProps !== false) {
        const item = {
          preset: "del",
          props: delLinkProps === true ? void 0 : delLinkProps,
          command: "del"
        };
        if (delPopConfirmProps != null && typeof delPopConfirmProps === "object" && delPopConfirmProps.isPopConfirm) {
          item.popconfirmProps = {
            content: lang.value.deleteConfirm,
            popperOptions: {
              strategy: "fixed",
              modifiers: [{
                name: "offset",
                options: {
                  offset: [12, 6]
                }
              }]
            },
            ...omit(delPopConfirmProps, ["isPopConfirm"])
          };
          item.command = "delConfirm";
        }
        items.push(item);
      }
      return items;
    });
    const tableColumns = computed(() => {
      const listConfig = props.listConfig || {};
      const userColumns = listConfig.tableProps?.columns;
      if (userColumns?.length) {
        return userColumns;
      }
      const fields = props.fields;
      const {
        selectionColumnProps,
        indexColumnProps,
        actionColumnProps
      } = listConfig;
      const columns = [];
      if (selectionColumnProps !== false) {
        columns.push({
          type: "selection",
          columnKey: "selection",
          width: 50,
          align: "center",
          fixed: "left",
          ...(selectionColumnProps === true ? void 0 : selectionColumnProps) || {}
        });
      }
      if (indexColumnProps !== false) {
        columns.push({
          type: "index",
          columnKey: "index",
          width: 50,
          align: "center",
          fixed: "left",
          ...(indexColumnProps === true ? void 0 : indexColumnProps) || {}
        });
      }
      mapTree(fields || [], (field) => {
        if (field.hideInList === "flat") {
          return "flatChildren";
        } else if (!field.hideInList) {
          return {
            columnKey: field.key,
            prop: field.prop,
            label: field.label,
            ...field.columnProps || {}
          };
        }
      }).forEach((column) => {
        columns.push(column);
      });
      if (actionColumnProps !== false) {
        columns.push({
          columnKey: "action",
          label: lang.value.action,
          width: 156,
          align: "center",
          fixed: "right",
          slot: "action",
          hideInPrint: true,
          hideInExport: true,
          ...(actionColumnProps === true ? void 0 : actionColumnProps) || {}
        });
      }
      return columns;
    });
    const searchFormProps = computed(() => {
      const searchConfig = (props.searchConfig === true ? void 0 : props.searchConfig) || {};
      return searchConfig.formProps || {};
    });
    const searchFormItems = computed(() => {
      const items = searchFormProps.value.items;
      return items?.length ? items : getFieldsSearchFormItems(props.fields);
    });
    const searchFormData = reactive(getFormInitValue(searchFormItems.value, searchFormProps.value.itemTypeData || props.itemTypeData, true));
    const searchWhere = ref(cloneDeep(searchFormData));
    const treeSelectedValue = ref();
    const treeData = ref([]);
    const treeLoading = ref(false);
    const treeErrorMessage = ref();
    const treeSearchkeywords = ref("");
    const splitPanelCollapse = ref(false);
    const [isMobile] = useMobile((mobile) => {
      splitPanelCollapse.value = mobile;
    });
    const codeCache = /* @__PURE__ */ new Map();
    const getAndCacheCode = (code, codeResult) => {
      const cacheResult = codeCache.get(code);
      if (cacheResult) {
        return cacheResult;
      }
      const result = codeResult ?? getCodeResult(code, props.httpRequest);
      codeCache.set(code, result);
      return result;
    };
    const tableDatasource = (params) => {
      const datasource = props.listConfig?.tableProps?.datasource || props.listApi;
      if (datasource && Array.isArray(datasource)) {
        return Promise.resolve(datasource);
      }
      const func = typeof datasource === "function" ? datasource : typeof datasource === "string" && datasource.startsWith(codeStringPrefix) ? getAndCacheCode(datasource) : void 0;
      const showSide = !!props.pageConfig?.splitPanelProps;
      if (!func || showSide && treeSelectedValue.value == null) {
        return Promise.resolve([]);
      }
      const where = {};
      if (showSide && treeSelectedValue.value != null) {
        const filterField = props.pageConfig?.tableFilterField;
        if (filterField) {
          setValue(where, filterField, treeSelectedValue.value);
        }
      }
      mergeValue(where, searchWhere.value, params.where);
      return func({
        ...params,
        where
      });
    };
    const getTableSelections = () => {
      return selections.value;
    };
    const handleUpdateSelections = (data) => {
      selections.value = data;
      emit("tableSelectionsChange", data);
    };
    const reloadTable = (page) => {
      tableRef.value?.reload?.({
        page
      });
    };
    const handleUpdateSearchForm = (field, value) => {
      setValue(searchFormData, field, value);
    };
    const handleSubmitSearchForm = () => {
      selections.value = [];
      searchWhere.value = cloneDeep(searchFormData);
      reloadTable(1);
    };
    const handleResetSearchForm = () => {
      Object.keys(searchFormData).forEach((key) => {
        searchFormData[key] = void 0;
      });
      mergeValue(searchFormData, getFormInitValue(searchFormItems.value, searchFormProps.value.itemTypeData || props.itemTypeData, true));
      handleSubmitSearchForm();
    };
    const handleBtnClick = (action, item) => {
      if (action === "delConfirm") {
        handleDelete(item ? [item] : void 0);
      } else if (action === "del") {
        const delPopConfirmProps = props.listConfig?.delPopConfirmProps;
        if (delPopConfirmProps === false) {
          handleDelete(item ? [item] : void 0);
        } else {
          messageBox.confirm(lang.value.deleteConfirm, lang.value.deleteConfirmTitle, {
            type: "warning",
            draggable: true,
            ...omit(delPopConfirmProps === true ? void 0 : delPopConfirmProps, ["isPopConfirm"])
          }).then(() => {
            handleDelete(item ? [item] : void 0);
          }).catch(() => {
          });
        }
      } else if (action === "edit") {
        editData.value = item;
        editVisible.value = true;
      } else if (action === "add") {
        const filterField = props.pageConfig?.tableFilterField;
        if (props.pageConfig?.splitPanelProps && treeSelectedValue.value != null && filterField) {
          const data = {};
          setValue(data, filterField, treeSelectedValue.value);
          addData.value = data;
        } else {
          addData.value = void 0;
        }
        addVisible.value = true;
      } else if (action === "delSelections") {
        const data = selections.value;
        if (!data.length) {
          message.error({
            ...props.messageOptions || {},
            message: lang.value.deleteBatchTip
          });
          return;
        }
        const delConfirmProps = props.listConfig?.delConfirmProps;
        if (delConfirmProps === false) {
          handleDelete(data);
        } else {
          messageBox.confirm(lang.value.deleteBatchConfirm, lang.value.deleteBatchConfirmTitle, {
            type: "warning",
            draggable: true,
            ...(delConfirmProps === true ? void 0 : delConfirmProps) || {}
          }).then(() => {
            handleDelete(data);
          }).catch(() => {
          });
        }
      }
    };
    const handleDelete = (data) => {
      if (!data || !props.deleteApi) {
        return;
      }
      const deleteApiFunc = typeof props.deleteApi === "function" ? props.deleteApi : props.deleteApi.startsWith(codeStringPrefix) ? getAndCacheCode(props.deleteApi) : void 0;
      if (!deleteApiFunc) {
        return;
      }
      const loading = message.loading({
        ...props.messageOptions || {},
        message: lang.value.deleteLoading
      });
      const rowKey = props.listConfig?.tableProps?.rowKey;
      const dataKeys = rowKey ? data.map((row) => getValue(row, rowKey)) : [];
      deleteApiFunc(dataKeys, data).then((msg) => {
        loading.close();
        message.success({
          ...props.messageOptions || {},
          message: msg ?? lang.value.deleteSuccess
        });
        reloadTable(1);
      }).catch((e) => {
        loading.close();
        if (e != null && typeof e === "string") {
          message.error({
            ...props.messageOptions || {},
            message: e
          });
        } else {
          message.error({
            ...props.messageOptions || {},
            message: e?.message ?? lang.value.deleteError
          });
        }
      });
    };
    const handleAddError = (e) => {
      if (e != null && typeof e === "string") {
        message.error({
          ...props.messageOptions || {},
          message: e
        });
      } else {
        message.error({
          ...props.messageOptions || {},
          message: e?.message ?? lang.value.addError
        });
      }
    };
    const handleEditError = (e) => {
      if (e != null && typeof e === "string") {
        message.error({
          ...props.messageOptions || {},
          message: e
        });
      } else {
        message.error({
          ...props.messageOptions || {},
          message: e?.message ?? lang.value.editError
        });
      }
    };
    const handleAddDone = (msg) => {
      message.success({
        ...props.messageOptions || {},
        message: msg ?? lang.value.editSuccess
      });
      reloadTable(1);
    };
    const handleEditDone = (msg) => {
      message.success({
        ...props.messageOptions || {},
        message: msg ?? lang.value.addSuccess
      });
      reloadTable();
    };
    const handleDetailError = (e) => {
      const msg = e?.message;
      if (!msg) {
        console.error(e);
      } else {
        message.error({
          ...props.messageOptions || {},
          message: msg
        });
      }
    };
    const handleUpdateAddVisible = (visible) => {
      addVisible.value = visible;
    };
    const handleUpdateEditVisible = (visible) => {
      editVisible.value = visible;
    };
    const handleTreeNodeClick = (nodeValue) => {
      if (isMobile.value) {
        splitPanelCollapse.value = true;
      }
      if (treeSelectedValue.value !== nodeValue) {
        treeSelectedValue.value = nodeValue;
        reloadTable();
      }
    };
    const setTreeData = (data) => {
      treeLoading.value = false;
      treeData.value = data || [];
      if (treeData.value.length) {
        const field = getTreeValueField(props.pageConfig?.sideConfig);
        treeSelectedValue.value = treeData.value[0][field];
        reloadTable();
      } else {
        treeSelectedValue.value = void 0;
      }
    };
    const reloadTree = () => {
      if (!props.treeListApi || !props.pageConfig?.splitPanelProps) {
        setTreeData([]);
        return;
      }
      if (Array.isArray(props.treeListApi)) {
        setTreeData(props.treeListApi);
        return;
      }
      const treeListApiFunc = typeof props.treeListApi === "function" ? props.treeListApi : props.treeListApi.startsWith(codeStringPrefix) ? getAndCacheCode(props.treeListApi) : void 0;
      if (!treeListApiFunc) {
        return;
      }
      treeLoading.value = true;
      treeListApiFunc().then((data) => {
        setTreeData(data);
      }).catch((e) => {
        treeLoading.value = false;
        if (e != null && typeof e === "string") {
          treeErrorMessage.value = e;
        } else {
          treeErrorMessage.value = e?.message;
        }
      });
    };
    const handleUpdateTreeSearchKeywords = (value) => {
      treeSearchkeywords.value = value;
    };
    const handleUpdateSplitPanelCollapse = (collapse) => {
      splitPanelCollapse.value = collapse;
    };
    const clearCodeCache = () => {
      codeCache.clear();
    };
    const renderSearch = () => {
      if (props.searchConfig === false) {
        return;
      }
      const searchConfig = (props.searchConfig === true ? void 0 : props.searchConfig) || {};
      const cardProps = searchConfig.cardProps;
      const renderForm = () => {
        return h(props.proFormComponent || EleProForm, {
          ...defaultSearchFormProps,
          itemTypeData: props.itemTypeData,
          httpRequest: props.httpRequest,
          screenSize: props.screenSize,
          ...searchFormProps.value,
          model: searchFormData,
          items: searchFormItems.value,
          onUpdateValue: handleUpdateSearchForm,
          onSubmit: handleSubmitSearchForm,
          onReset: handleResetSearchForm
        }, {
          footer: ({
            submitForm,
            resetForm
          }) => createVNode(EleButtons, {
            "items": [{
              preset: "search",
              props: searchFormProps.value.submitButtonProps,
              onClick: () => submitForm()
            }, {
              preset: "reset",
              props: searchFormProps.value.resetButtonProps,
              onClick: () => resetForm()
            }]
          }, null),
          ...getMappedSlots(slots, searchConfig.formSlots, [], [], true)
        });
      };
      if (!cardProps) {
        return renderForm();
      }
      return createVNode(EleCard, mergeProps({
        "searchForm": true
      }, (cardProps === true ? void 0 : cardProps) || {}), {
        ...getMappedSlots(slots, searchConfig.cardSlots),
        default: renderForm
      });
    };
    const renderTable = () => {
      const listConfig = props.listConfig || {};
      const cardProps = listConfig.cardProps;
      const tableProps = listConfig.tableProps || {};
      const renderTb = () => {
        const tSlots = getMappedSlots(slots, listConfig.tableSlots, [], ["default"], true);
        const toolbarSlot = tSlots.toolbar;
        tSlots.toolbar = (slotProps) => createVNode(EleButtons, {
          "items": toolbarBtnItems.value
        }, {
          default: toolbarSlot ? toolbarSlot(slotProps) : void 0
        });
        const actionSlot = tSlots.action;
        tSlots.action = (slotProps) => createVNode(EleButtons, {
          "type": "link",
          "divider": true,
          "items": actionBtnItems.value,
          "onItemClick": (command) => handleBtnClick(command, slotProps?.row)
        }, {
          default: actionSlot ? actionSlot(slotProps) : void 0
        });
        const bottomExtraSlot = tSlots.bottomExtra;
        tSlots.bottomExtra = (slotProps) => createVNode(TableExtra, {
          "addVisible": addVisible.value,
          "addData": addData.value,
          "editVisible": editVisible.value,
          "editData": editData.value,
          "addConfig": props.addConfig,
          "editConfig": props.editConfig,
          "listConfig": props.listConfig,
          "fields": props.fields,
          "getAndCacheCode": getAndCacheCode,
          "proFormComponent": props.proFormComponent,
          "addApi": props.addApi,
          "editApi": props.editApi,
          "detailApi": props.detailApi,
          "itemTypeData": props.itemTypeData,
          "httpRequest": props.httpRequest,
          "screenSize": props.screenSize,
          "lang": lang.value,
          "onBtnClick": handleBtnClick,
          "onAddError": handleAddError,
          "onAddDone": handleAddDone,
          "onEditError": handleEditError,
          "onEditDone": handleEditDone,
          "onDetailError": handleDetailError,
          "onUpdate:addVisible": handleUpdateAddVisible,
          "onUpdate:editVisible": handleUpdateEditVisible
        }, {
          ...omit(slots, ["default"]),
          default: bottomExtraSlot ? bottomExtraSlot(slotProps) : void 0
        });
        const arrayDatasource = tableProps?.datasource == null ? props.listApi && Array.isArray(props.listApi) ? props.listApi : void 0 : Array.isArray(tableProps.datasource) ? tableProps.datasource : void 0;
        return createVNode(EleProTable, mergeProps(tableProps, {
          "ref": tableRef,
          "columns": tableColumns.value,
          "datasource": arrayDatasource || tableDatasource,
          "selections": selections.value,
          "onUpdate:selections": handleUpdateSelections
        }), _isSlot(tSlots) ? tSlots : {
          default: () => [tSlots]
        });
      };
      if (!cardProps) {
        return renderTb();
      }
      return createVNode(EleCard, (cardProps === true ? void 0 : cardProps) || {}, {
        ...getMappedSlots(slots, listConfig.cardSlots),
        default: renderTb
      });
    };
    const renderContent = () => {
      const nodes = [];
      const sNodes = renderSearch();
      const tbNodes = renderTable();
      const pageConfig = props.pageConfig || {};
      const splitPanelProps = pageConfig.splitPanelProps;
      if (!splitPanelProps) {
        if (sNodes) {
          (Array.isArray(sNodes) ? sNodes : [sNodes]).forEach((node) => {
            nodes.push(node);
          });
        }
        if (tbNodes) {
          (Array.isArray(tbNodes) ? tbNodes : [tbNodes]).forEach((node) => {
            nodes.push(node);
          });
        }
      } else {
        const bodyNodes = [];
        if (!pageConfig.splitSearchForm && sNodes) {
          (Array.isArray(sNodes) ? sNodes : [sNodes]).forEach((node) => {
            bodyNodes.push(node);
          });
        }
        if (tbNodes) {
          (Array.isArray(tbNodes) ? tbNodes : [tbNodes]).forEach((node) => {
            bodyNodes.push(node);
          });
        }
        nodes.push(createVNode(EleSplitPanel, mergeProps({
          "size": 258,
          "space": 0,
          "allowCollapse": true,
          "collapseBtnOffset": 2,
          "collapse": splitPanelCollapse.value,
          "class": "ele-crud-split-panel",
          "onUpdate:collapse": handleUpdateSplitPanelCollapse
        }, (splitPanelProps === true ? void 0 : splitPanelProps) || {}), {
          ...getMappedSlots(slots, pageConfig.splitPanelSlots),
          default: () => createVNode(PageSide, {
            "sideConfig": pageConfig.sideConfig,
            "data": treeData.value,
            "loading": treeLoading.value,
            "selectedValue": treeSelectedValue.value,
            "errorMessage": treeErrorMessage.value,
            "keywords": treeSearchkeywords.value,
            "lang": lang.value,
            "onTreeNodeClick": handleTreeNodeClick
          }, {
            ...slots
          }),
          sideHeader: pageConfig.sideConfig?.searchProps !== false ? () => {
            let _slot;
            return createVNode(ElInput, mergeProps({
              "placeholder": lang.value.searchPlaceholder,
              "clearable": true,
              "prefixIcon": SearchOutlined,
              "modelValue": treeSearchkeywords.value,
              "onUpdate:modelValue": handleUpdateTreeSearchKeywords,
              "class": "ele-crud-tree-search"
            }, pageConfig.sideConfig?.searchInputProps || {}), _isSlot(_slot = getMappedSlots(slots, pageConfig.sideConfig?.searchInputSlots)) ? _slot : {
              default: () => [_slot]
            });
          } : void 0,
          bodyHeader: pageConfig.splitSearchForm && sNodes ? () => sNodes : void 0,
          body: () => bodyNodes
        }));
      }
      const cardProps = pageConfig.cardProps;
      if (!cardProps) {
        return nodes;
      }
      return createVNode(EleCard, (cardProps === true ? void 0 : cardProps) || {}, {
        ...getMappedSlots(slots, pageConfig.cardSlots),
        default: () => nodes
      });
    };
    watch(() => props.listApi, () => {
      tableRef.value?.setData?.([]);
      handleSubmitSearchForm();
    }, {
      deep: true
    });
    watch(() => props.treeListApi, () => {
      reloadTree();
    }, {
      deep: true,
      immediate: true
    });
    onBeforeUnmount(() => {
      clearCodeCache();
    });
    const exposeValue = {
      tableRef,
      getTableSelections,
      reloadTree
    };
    expose(exposeValue);
    return () => {
      const pageProps = props.pageConfig?.pageProps;
      if (!pageProps) {
        return renderContent();
      }
      return createVNode(ElePage, (pageProps === true ? void 0 : pageProps) || {}, {
        default: () => renderContent()
      });
    };
  }
});
export {
  index as default
};

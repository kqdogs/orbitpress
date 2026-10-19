import { defineComponent, ref, openBlock, createBlock, nextTick } from "vue";
import EleDropdown from "../../ele-dropdown/index";
import { getTableFormItemByTd, generateAddTableColData, generateAddTableRowData, getTableMergeBelowEffects, getTableMergeRightEffects, getTableSplitEffects, getTableDeleteRowEffects, getTableDeleteColEffects } from "./table-util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TableToolMenu" },
  __name: "table-tool-menu",
  props: {
    formItems: {},
    componentData: {}
  },
  emits: ["updateItems"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const dropdownRef = ref();
    const dropdownVirtualRef = ref();
    let tdFormItemId = null;
    const handleUpdateItems = (result) => {
      emit("updateItems", result);
    };
    const handleAddChildren = (formItemId, actionType, position) => {
      const { tableFormItem, tdFormItem } = getTableFormItemByTd(
        formItemId,
        props.formItems
      );
      if (!tableFormItem || !tdFormItem) {
        return;
      }
      const result = (actionType === "addTableCol" ? generateAddTableColData : generateAddTableRowData)(
        tableFormItem,
        props.formItems,
        tdFormItem,
        position,
        props.componentData
      );
      handleUpdateItems(result);
    };
    const handleSplitCell = (formItemId) => {
      const { tableFormItem, tdFormItem } = getTableFormItemByTd(
        formItemId,
        props.formItems
      );
      if (!tableFormItem || !tdFormItem) {
        return;
      }
      const result = getTableSplitEffects(
        tableFormItem,
        props.formItems,
        tdFormItem,
        props.componentData
      );
      handleUpdateItems(result);
    };
    const handleDeleteRow = (formItemId) => {
      const { tableFormItem, trItemIndex } = getTableFormItemByTd(
        formItemId,
        props.formItems
      );
      if (!tableFormItem || trItemIndex == null) {
        return;
      }
      const result = getTableDeleteRowEffects(
        tableFormItem,
        props.formItems,
        trItemIndex,
        props.componentData
      );
      handleUpdateItems(result);
    };
    const handleDeleteCol = (formItemId) => {
      const { tableFormItem, tdFormItem } = getTableFormItemByTd(
        formItemId,
        props.formItems
      );
      if (!tableFormItem || !tdFormItem) {
        return;
      }
      const result = getTableDeleteColEffects(
        tableFormItem,
        props.formItems,
        tdFormItem,
        props.componentData
      );
      handleUpdateItems(result);
    };
    const handleMergeCell = (formItemId, actionType) => {
      const { tableFormItem, tdFormItem } = getTableFormItemByTd(
        formItemId,
        props.formItems
      );
      if (!tableFormItem || !tdFormItem) {
        return;
      }
      const result = (actionType === "mergeBelowCell" ? getTableMergeBelowEffects : getTableMergeRightEffects)(tableFormItem, props.formItems, tdFormItem, props.componentData);
      handleUpdateItems(result);
    };
    const hideTableToolDropdown = () => {
      dropdownRef.value && dropdownRef.value.handleClose();
    };
    const handleTableToolDropdownCommand = (command) => {
      if (tdFormItemId != null) {
        if (command === "insertAboveRow") {
          handleAddChildren(tdFormItemId, "addTableRow", -1);
        } else if (command === "insertBelowRow") {
          handleAddChildren(tdFormItemId, "addTableRow");
        } else if (command === "insertLeftCol") {
          handleAddChildren(tdFormItemId, "addTableCol", -1);
        } else if (command === "insertRightCol") {
          handleAddChildren(tdFormItemId, "addTableCol");
        } else if (command === "mergeRightCell") {
          handleMergeCell(tdFormItemId, "mergeRightCell");
        } else if (command === "mergeBelowCell") {
          handleMergeCell(tdFormItemId, "mergeBelowCell");
        } else if (command === "splitCell") {
          handleSplitCell(tdFormItemId);
        } else if (command === "deleteRow") {
          handleDeleteRow(tdFormItemId);
        } else if (command === "deleteCol") {
          handleDeleteCol(tdFormItemId);
        }
      }
    };
    const openMenu = (formItemId, triggerEl) => {
      hideTableToolDropdown();
      if (!triggerEl) {
        return;
      }
      nextTick(() => {
        tdFormItemId = formItemId;
        dropdownVirtualRef.value = triggerEl;
        nextTick(() => {
          dropdownRef.value && dropdownRef.value.handleOpen();
        });
      });
    };
    const hideMenu = () => {
      hideTableToolDropdown();
    };
    __expose({
      openMenu,
      hideMenu
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleDropdown, {
        triggerKeys: [],
        persistent: false,
        validateEvent: false,
        placement: "bottom-end",
        popperOptions: {
          strategy: "fixed",
          modifiers: [{ name: "offset", options: { offset: [6, 8] } }]
        },
        popperClass: "ele-pro-form-builder-table-tool-dropdown",
        ref_key: "dropdownRef",
        ref: dropdownRef,
        trigger: "click",
        componentType: "pro",
        virtualTriggering: true,
        virtualRef: dropdownVirtualRef.value,
        items: [
          { title: "上方插入行", command: "insertAboveRow" },
          { title: "下方插入行", command: "insertBelowRow" },
          { title: "左侧插入列", command: "insertLeftCol" },
          { title: "右侧插入列", command: "insertRightCol" },
          { title: "合并右侧单元格", command: "mergeRightCell", divided: true },
          { title: "合并下方单元格", command: "mergeBelowCell" },
          { title: "拆分单元格合并", command: "splitCell" },
          {
            title: "删除整行",
            command: "deleteRow",
            divided: true,
            danger: true
          },
          { title: "删除整列", command: "deleteCol", danger: true }
        ],
        onCommand: handleTableToolDropdownCommand
      }, null, 8, ["virtualRef"]);
    };
  }
});
export {
  _sfc_main as default
};

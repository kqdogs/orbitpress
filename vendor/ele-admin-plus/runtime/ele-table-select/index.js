import { defineComponent, ref, computed, watch, onMounted, provide, openBlock, createBlock, createSlots, withCtx, resolveDynamicComponent, normalizeProps, mergeProps, renderSlot, createVNode, renderList, unref, guardReactiveProps, createElementBlock, Fragment, nextTick } from "vue";
import { getSlotsMap, getValue } from "../utils/common";
import { useResponsive } from "../ele-pro-layout/util";
import EleBasicSelect from "../ele-basic-select/index";
import { useFormValidate, isEmptyValue, SELECT_DATA_KEY, valueIsChanged } from "../ele-basic-select/util";
import EleButtons from "../ele-buttons/index";
import EleProTable from "../ele-pro-table/index";
import { tableSelectEmits, tableSelectProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTableSelect" },
  __name: "index",
  props: tableSelectProps,
  emits: tableSelectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const ownSlots = ["popperTopExtra", "popperBottomExtra"];
    const props = __props;
    const emit = __emit;
    const { validateChange } = useFormValidate();
    const isResponsive = useResponsive(props);
    const selectRef = ref(null);
    const proTableRef = ref(null);
    const selectVisible = ref(!props.disabled && props.visible);
    const selectedItems = ref([]);
    const tempSelectedItems = ref([]);
    const tempSelectValue = ref();
    const isModalType = computed(() => {
      return props.popperType === "modal" || props.popperType === "drawer";
    });
    const selectPopperClass = computed(() => {
      const classes = ["ele-table-select-popper"];
      if (isResponsive.value && !isModalType.value) {
        classes.push("is-responsive");
      }
      if (props.popperClass) {
        classes.push(props.popperClass);
      }
      return classes.join(" ");
    });
    const selectedLabel = computed(() => {
      const selected = selectedItems.value;
      return !props.multiple && selected.length ? selected[0].label : "";
    });
    const tableCurrentRowKey = computed(() => {
      if (isModalType.value) {
        if (props.multiple || isEmptyValue(tempSelectValue.value)) {
          return;
        }
        return tempSelectValue.value;
      }
      if (props.multiple || isEmptyValue(props.modelValue)) {
        return;
      }
      return props.modelValue;
    });
    const tableSelectedRowKeys = computed(() => {
      if (isModalType.value) {
        if (!props.multiple || isEmptyValue(tempSelectValue.value)) {
          return;
        }
        return tempSelectValue.value;
      }
      if (!props.multiple || isEmptyValue(props.modelValue)) {
        return;
      }
      return props.modelValue;
    });
    const updatePopover = () => {
      selectRef.value && selectRef.value.updatePopper();
    };
    const focusSearchInput = () => {
      selectRef.value && selectRef.value.focusSearchInput();
    };
    const updateModelValue = (modelValue) => {
      if (valueIsChanged(modelValue, props.modelValue, props.multiple)) {
        emit("update:modelValue", modelValue);
        if (props.validateEvent) {
          validateChange();
        }
        emit("change", modelValue);
      }
    };
    const updateVisible = (visible) => {
      if (selectVisible.value !== visible) {
        selectVisible.value = visible;
        if (visible) {
          if (isModalType.value) {
            if (isEmptyValue(props.modelValue)) {
              tempSelectedItems.value = [];
              tempSelectValue.value = void 0;
            } else {
              tempSelectedItems.value = [...selectedItems.value];
              tempSelectValue.value = props.multiple ? [...props.modelValue] : props.modelValue;
            }
          }
          if (props.tableProps?.virtual && proTableRef.value) {
            const virtualTableRef = proTableRef.value.getTableRef();
            if (virtualTableRef && !virtualTableRef.wrapWidth) {
              nextTick(() => {
                virtualTableRef.updateWrapSize();
                nextTick(() => {
                  updatePopover();
                });
              });
            }
          }
        }
        if (props.visible !== visible) {
          emit("update:visible", visible);
        }
        emit("visibleChange", visible);
      }
    };
    const getChangedSelectedItems = (selectValue, selectedItems2, force) => {
      const tableData = [
        ...props.cacheData || [],
        ...(props.multiple ? props.initValue : props.initValue ? [props.initValue] : void 0) || [],
        // 已废弃属性兼容
        ...(props.multiple && proTableRef.value ? proTableRef.value.getSelectionRows() : void 0) || []
      ];
      if (!props.multiple) {
        const temp = proTableRef.value ? proTableRef.value.getCurrentRow() : null;
        if (temp) {
          tableData.push(temp);
        }
      }
      if (!props.multiple) {
        const value = selectValue;
        const d = selectedItems2.length ? selectedItems2[0] : null;
        if (isEmptyValue(value)) {
          if (d != null) {
            return [];
          }
          return;
        }
        if (force || !d || d.value !== value) {
          const item = tableData ? tableData.find((d2) => getValue(d2, props.valueKey) === value) : void 0;
          let label = getValue(item, props.labelKey);
          if (label == null && (!item || item._isMock)) {
            label = String(value);
          }
          return [{ value, label, data: item }];
        }
        return;
      }
      if (isEmptyValue(selectValue, true)) {
        if (selectedItems2.length) {
          return [];
        }
        return;
      }
      if (!force && !valueIsChanged(
        selectValue,
        selectedItems2.map((d) => d.value),
        true
      )) {
        return;
      }
      const selected = [];
      const dataKeys = tableData ? tableData.map((d) => getValue(d, props.valueKey)) : [];
      selectValue.forEach((value, index) => {
        const dataIndex = dataKeys.indexOf(value);
        const item = dataIndex === -1 ? void 0 : tableData[dataIndex];
        let label = getValue(item, props.labelKey);
        if (label == null && (!item || item._isMock)) {
          label = String(value);
        }
        selected.push({ value, label, index, data: item });
      });
      return selected;
    };
    const checkUpdateSelectedItems = (force) => {
      const items = getChangedSelectedItems(
        props.modelValue,
        selectedItems.value,
        force
      );
      if (items) {
        selectedItems.value = items;
        nextTick(() => {
          updatePopover();
        });
      }
    };
    const checkUpdateTempSelectedItems = (force) => {
      const items = getChangedSelectedItems(
        tempSelectValue.value,
        tempSelectedItems.value,
        force
      );
      if (items) {
        tempSelectedItems.value = items;
      }
    };
    const handleSelectRemove = (item) => {
      const values = props.modelValue || [];
      updateModelValue(values.filter((v) => v !== item.value));
      emit("removeTag", item.value);
    };
    const handleSelectClear = () => {
      updateModelValue(props.multiple ? [] : null);
      updateVisible(false);
      emit("clear");
    };
    const handleSelectFocus = (e) => {
      emit("focus", e);
    };
    const handleSelectBlur = (e) => {
      emit("blur", e);
    };
    const handleSelectFilter = (keywords) => {
      emit("filterChange", keywords);
    };
    const handleUpdateModelValue = (modelValue) => {
      if (isModalType.value) {
        tempSelectValue.value = modelValue;
      } else {
        updateModelValue(modelValue);
      }
    };
    const handleCheckUpdateSelectedItems = (force) => {
      if (isModalType.value) {
        checkUpdateTempSelectedItems(force);
      } else {
        checkUpdateSelectedItems(force);
      }
    };
    const handleDataSelect = (data) => {
      if (!isModalType.value) {
        if (!props.multiple) {
          updateVisible(false);
        }
        emit("select", data);
      }
    };
    const handleUpdateTableSelectedRowKeys = (rowKeys) => {
      if (props.multiple) {
        const oldValues = props.modelValue || [];
        const values = [...rowKeys];
        values.sort((a, b) => {
          const aOldIndex = oldValues.indexOf(a);
          const bOldIndex = oldValues.indexOf(b);
          const aIndex = aOldIndex === -1 ? values.length : aOldIndex;
          const bIndex = bOldIndex === -1 ? values.length : bOldIndex;
          return aIndex - bIndex;
        });
        handleUpdateModelValue(values);
      }
    };
    const handleUpdateTableCurrentRowKey = (rowKey) => {
      if (!props.multiple) {
        handleUpdateModelValue(rowKey);
      }
    };
    const handleTableSelectionChange = () => {
      if (props.multiple) {
        handleCheckUpdateSelectedItems(true);
      }
    };
    const handleTableCurrentChange = (row) => {
      if (!props.multiple && row != null) {
        handleCheckUpdateSelectedItems(true);
      }
    };
    const handleTableRowClick = (row, _column, _e, disabled, selection) => {
      if (!props.multiple) {
        handleDataSelect(row);
      } else if (props.tableProps?.rowClickChecked && !disabled) {
        handleDataSelect(selection || []);
      }
    };
    const handleTableSelect = (selection) => {
      handleDataSelect(selection);
    };
    const handleTableSelectAll = (selection) => {
      handleDataSelect(selection);
    };
    const handleTableDone = () => {
      nextTick(() => {
        updatePopover();
      });
    };
    const handleConfirm = () => {
      const selected = tempSelectedItems.value.map((item) => item.data);
      const selectedData = props.multiple ? selected : selected[0];
      if (props.beforeConfirm && props.beforeConfirm(selectedData) === false) {
        return;
      }
      const values = tempSelectedItems.value.map((item) => item.value);
      if (!props.multiple) {
        updateModelValue(values[0]);
        emit("select", selectedData);
        updateVisible(false);
        return;
      }
      updateModelValue(values);
      emit("select", selectedData);
      updateVisible(false);
    };
    const handleInitValueChange = (initValue) => {
      if (!props.multiple) {
        const value = getValue(initValue, props.valueKey);
        if (value === props.modelValue) {
          checkUpdateSelectedItems();
        } else {
          updateModelValue(value);
        }
        return;
      }
      const values = initValue.map(
        (d) => getValue(d, props.valueKey)
      );
      if (!valueIsChanged(props.modelValue, values, true)) {
        checkUpdateSelectedItems();
      } else {
        updateModelValue(values);
      }
    };
    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled) {
          updateVisible(false);
        }
      }
    );
    watch(
      () => props.visible,
      (visible) => {
        updateVisible(visible);
      }
    );
    watch(
      () => props.cacheData,
      () => {
        checkUpdateSelectedItems(true);
        if (isModalType.value && selectVisible.value) {
          checkUpdateTempSelectedItems(true);
        }
      }
    );
    watch(
      () => props.modelValue,
      () => {
        checkUpdateSelectedItems();
      },
      { deep: true }
    );
    watch(
      tempSelectValue,
      () => {
        if (isModalType.value && selectVisible.value) {
          checkUpdateTempSelectedItems();
        }
      },
      { deep: true }
    );
    watch(
      () => props.initValue,
      (initValue) => {
        if (!isEmptyValue(initValue)) {
          handleInitValueChange(initValue);
        }
      },
      { deep: true }
    );
    onMounted(() => {
      if (!isEmptyValue(props.initValue, props.multiple)) {
        handleInitValueChange(props.initValue);
      } else if (!isEmptyValue(props.modelValue, props.multiple)) {
        checkUpdateSelectedItems();
      }
    });
    const provideMethods = {
      clearSelectedItems: handleSelectClear,
      removeSelectedItem: (item) => {
        if (props.multiple) {
          handleSelectRemove(item);
        } else if (props.modelValue === item.value) {
          handleSelectClear();
        }
      },
      updateSelectedItems: (items) => {
        const values = items.map((item) => item.value);
        updateModelValue(props.multiple ? values : values[0]);
      },
      clearTempSelectedItems: () => {
        tempSelectedItems.value = [];
        tempSelectValue.value = null;
      },
      removeTempSelectedItem: (item) => {
        const index = tempSelectedItems.value.indexOf(item);
        tempSelectedItems.value.splice(index, 1);
        const values = tempSelectedItems.value.map((item2) => item2.value);
        tempSelectValue.value = props.multiple ? values : values[0];
      },
      updateTempSelectedItems: (items) => {
        tempSelectedItems.value = items;
        const values = tempSelectedItems.value.map((item) => item.value);
        tempSelectValue.value = props.multiple ? values : values[0];
      }
    };
    provide(SELECT_DATA_KEY, {
      selectedItems,
      tempSelectedItems,
      ...provideMethods
    });
    __expose({
      selectRef,
      tableRef: proTableRef,
      updatePopover,
      updateVisible,
      focusSearchInput,
      ...provideMethods
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleBasicSelect, {
        ref_key: "selectRef",
        ref: selectRef,
        value: _ctx.modelValue,
        selectedLabel: selectedLabel.value,
        selected: selectedItems.value,
        visible: selectVisible.value,
        multiple: _ctx.multiple,
        disabled: _ctx.disabled,
        size: _ctx.size,
        clearable: _ctx.clearable,
        placeholder: _ctx.placeholder,
        maxTagCount: _ctx.maxTagCount,
        maxTagTextLength: _ctx.maxTagTextLength,
        tagType: _ctx.tagType,
        automaticDropdown: _ctx.automaticDropdown,
        filterable: _ctx.filterable,
        selectClass: _ctx.selectClass,
        selectStyle: _ctx.selectStyle,
        inputStyle: _ctx.inputStyle,
        selectTagsStyle: _ctx.selectTagsStyle,
        popperClass: selectPopperClass.value,
        popperWidth: _ctx.popperWidth,
        popperHeight: _ctx.popperHeight,
        popperType: _ctx.popperType,
        popperProps: _ctx.popperProps,
        popperSlots: { footer: "modalFooter", ..._ctx.popperSlots || {} },
        popperTitle: _ctx.popperTitle,
        teleported: _ctx.teleported,
        persistent: _ctx.persistent,
        placement: _ctx.placement,
        transition: _ctx.transition,
        popperOptions: _ctx.popperOptions,
        "onUpdate:visible": updateVisible,
        onFilterChange: handleSelectFilter,
        onRemoveTag: handleSelectRemove,
        onClear: handleSelectClear,
        onFocus: handleSelectFocus,
        onBlur: handleSelectBlur
      }, createSlots({
        default: withCtx(() => [
          _ctx.wrapperComponent ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.wrapperComponent), normalizeProps(mergeProps({ key: 0 }, _ctx.wrapperComponentProps || {})), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "popperTopExtra"),
              createVNode(EleProTable, mergeProps({
                "onUpdate:selectedRowKeys": handleUpdateTableSelectedRowKeys,
                "onUpdate:currentRowKey": handleUpdateTableCurrentRowKey,
                onSelectionChange: handleTableSelectionChange,
                onCurrentChange: handleTableCurrentChange,
                onRowClick: handleTableRowClick,
                onSelect: handleTableSelect,
                onSelectAll: handleTableSelectAll,
                onDone: handleTableDone
              }, _ctx.tableProps || {}, {
                ref_key: "proTableRef",
                ref: proTableRef,
                rowKey: _ctx.valueKey,
                reserveCurrent: true,
                highlightCurrentRow: !_ctx.multiple,
                currentRowKey: tableCurrentRowKey.value,
                selectedRowKeys: tableSelectedRowKeys.value
              }), createSlots({ _: 2 }, [
                renderList(unref(getSlotsMap)(
                  _ctx.$slots,
                  _ctx.tableSlots,
                  [],
                  ownSlots,
                  !_ctx.tableSlots
                ), (slotName, compSlotName) => {
                  return {
                    name: compSlotName,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
                    ])
                  };
                })
              ]), 1040, ["rowKey", "highlightCurrentRow", "currentRowKey", "selectedRowKeys"]),
              renderSlot(_ctx.$slots, "popperBottomExtra")
            ]),
            _: 3
          }, 16)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            renderSlot(_ctx.$slots, "popperTopExtra"),
            createVNode(EleProTable, mergeProps({
              "onUpdate:selectedRowKeys": handleUpdateTableSelectedRowKeys,
              "onUpdate:currentRowKey": handleUpdateTableCurrentRowKey,
              onSelectionChange: handleTableSelectionChange,
              onCurrentChange: handleTableCurrentChange,
              onRowClick: handleTableRowClick,
              onSelect: handleTableSelect,
              onSelectAll: handleTableSelectAll,
              onDone: handleTableDone
            }, _ctx.tableProps || {}, {
              ref_key: "proTableRef",
              ref: proTableRef,
              rowKey: _ctx.valueKey,
              reserveCurrent: true,
              highlightCurrentRow: !_ctx.multiple,
              currentRowKey: tableCurrentRowKey.value,
              selectedRowKeys: tableSelectedRowKeys.value
            }), createSlots({ _: 2 }, [
              renderList(unref(getSlotsMap)(
                _ctx.$slots,
                _ctx.tableSlots,
                [],
                ownSlots,
                !_ctx.tableSlots
              ), (slotName, compSlotName) => {
                return {
                  name: compSlotName,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1040, ["rowKey", "highlightCurrentRow", "currentRowKey", "selectedRowKeys"]),
            renderSlot(_ctx.$slots, "popperBottomExtra")
          ], 64))
        ]),
        _: 2
      }, [
        renderList(Object.keys(_ctx.$slots).filter(
          (k) => k !== "default" && !ownSlots.includes(k)
        ), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        }),
        isModalType.value && !_ctx.$slots.modalFooter ? {
          name: "modalFooter",
          fn: withCtx(() => [
            createVNode(unref(EleButtons), {
              items: [
                { preset: "cancel", onClick: () => updateVisible(false) },
                { preset: "confirm", onClick: () => handleConfirm() }
              ]
            }, null, 8, ["items"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["value", "selectedLabel", "selected", "visible", "multiple", "disabled", "size", "clearable", "placeholder", "maxTagCount", "maxTagTextLength", "tagType", "automaticDropdown", "filterable", "selectClass", "selectStyle", "inputStyle", "selectTagsStyle", "popperClass", "popperWidth", "popperHeight", "popperType", "popperProps", "popperSlots", "popperTitle", "teleported", "persistent", "placement", "transition", "popperOptions"]);
    };
  }
});
export {
  _sfc_main as default
};

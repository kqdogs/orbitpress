import { defineComponent, ref, computed, watch, nextTick, onMounted, provide, openBlock, createBlock, createSlots, withCtx, resolveDynamicComponent, normalizeProps, mergeProps, createVNode, unref, createElementVNode, normalizeClass, renderSlot, guardReactiveProps, createTextVNode, toDisplayString, renderList } from "vue";
import { ElTreeV2 } from "element-plus";
import { omit, getValue, eachTree } from "../utils/common";
import { useProOptions } from "../utils/hook";
import { useFormValidate, isEmptyValue, SELECT_DATA_KEY, valueIsChanged } from "../ele-basic-select/util";
import EleBasicSelect from "../ele-basic-select/index";
import EleButtons from "../ele-buttons/index";
import { treeSelectEmits, treeSelectProps } from "./props";
const _hoisted_1 = ["title"];
const _hoisted_2 = ["title"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTreeSelect" },
  __name: "index",
  props: treeSelectProps,
  emits: treeSelectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const ownSlots = ["default", "empty"];
    const props = __props;
    const emit = __emit;
    const { validateChange } = useFormValidate();
    const { optionData, reloadOptions } = useProOptions(props, "treeProps.data");
    const selectRef = ref(null);
    const treeRef = ref(null);
    const selectVisible = ref(!props.disabled && props.visible);
    const selectedItems = ref([]);
    const tempSelectedItems = ref([]);
    const tempSelectValue = ref();
    const isModalType = computed(() => {
      return props.popperType === "modal" || props.popperType === "drawer";
    });
    const selectPopperClass = computed(() => {
      const classes = ["ele-tree-select-popper"];
      if (props.popperClass) {
        classes.push(props.popperClass);
      }
      return classes.join(" ");
    });
    const selectedLabel = computed(() => {
      const selected = selectedItems.value;
      return !props.multiple && selected.length ? selected[0].label : "";
    });
    const treeOptions = computed(() => {
      return Object.assign(
        {
          value: "id",
          label: "label",
          children: "children",
          disabled: "disabled"
        },
        props.treeProps?.props
      );
    });
    const updateTreeChecked = (value) => {
      if (treeRef.value) {
        if (props.multiple) {
          if (isEmptyValue(value, true)) {
            treeRef.value.setCheckedKeys([]);
          } else {
            treeRef.value.setCheckedKeys(value);
          }
        } else {
          if (isEmptyValue(value)) {
            treeRef.value.setCurrentKey(null);
          } else {
            treeRef.value.setCurrentKey(value);
          }
        }
      }
    };
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
      if (visible) {
        handleSelectFilter("");
      }
      if (selectVisible.value !== visible) {
        selectVisible.value = visible;
        if (visible && isModalType.value) {
          if (isEmptyValue(props.modelValue)) {
            tempSelectedItems.value = [];
            tempSelectValue.value = void 0;
          } else {
            tempSelectedItems.value = [...selectedItems.value];
            tempSelectValue.value = props.multiple ? [...props.modelValue] : props.modelValue;
          }
          if (!treeRef.value) {
            nextTick(() => {
              updateTreeChecked(tempSelectValue.value);
            });
          }
        }
        if (props.visible !== visible) {
          emit("update:visible", visible);
        }
        emit("visibleChange", visible);
      }
    };
    const nodeIsCheckAll = (child, values) => {
      if (!child || !child.length || !values || !values.length) {
        return false;
      }
      const valueKey = treeOptions.value.value;
      const childKey = treeOptions.value.children;
      const disabledKey = treeOptions.value.disabled;
      return child.every((d) => {
        if (getValue(d, disabledKey) || values.includes(getValue(d, valueKey))) {
          return true;
        }
        const cChild = getValue(d, childKey);
        if (cChild && cChild.length) {
          return nodeIsCheckAll(cChild, values);
        }
        return false;
      });
    };
    const nodeIsCheckAllSimple = (child, items) => {
      const valueKey = treeOptions.value.value;
      const disabledKey = treeOptions.value.disabled;
      const values = items.map((item) => item.value);
      return child.every((d) => {
        if (getValue(d, disabledKey) || values.includes(getValue(d, valueKey))) {
          return true;
        }
        return false;
      });
    };
    const getSelectedItemsPro = (values, data, leaf, hide, parentChecked) => {
      const items = [];
      if (!data) {
        return items;
      }
      const valueKey = treeOptions.value.value;
      const labelKey = treeOptions.value.label;
      const childKey = treeOptions.value.children;
      data.forEach((d) => {
        const value = getValue(d, valueKey);
        const child = getValue(d, childKey);
        const checked = values.includes(value);
        if (leaf) {
          const hasChild = !!(child && child.length);
          const cItems = hasChild ? getSelectedItemsPro(values, child, leaf) : [];
          if (checked || hasChild && nodeIsCheckAllSimple(child, cItems)) {
            const label = getValue(d, labelKey);
            items.push({ value, label, hide: hasChild, data: d });
          }
          cItems.forEach((t) => {
            items.push(t);
          });
          return;
        }
        if (checked || parentChecked) {
          const label = getValue(d, labelKey);
          items.push({ value, label, hide, data: d });
        }
        const cHide = checked || hide;
        getSelectedItemsPro(values, child, leaf, cHide, checked).forEach((t) => {
          items.push(t);
        });
      });
      return items;
    };
    const getSelectedItems = (checkedKeys) => {
      if (isEmptyValue(checkedKeys, true)) {
        return [];
      }
      const values = checkedKeys;
      const valueKey = treeOptions.value.value;
      const labelKey = treeOptions.value.label;
      const childKey = treeOptions.value.children;
      const cacheData = props.cacheData;
      const scs = props.showCheckedStrategy;
      if (props.multiple && !(props.treeProps?.checkStrictly || scs === "all")) {
        const leaf = scs === "child";
        const items2 = getSelectedItemsPro(values, optionData.value, leaf);
        const selectedValues = items2.map((t) => t.value);
        const ids2 = (cacheData || []).map((d) => getValue(d, valueKey));
        values.forEach((value) => {
          if (!selectedValues.includes(value)) {
            const i = ids2.indexOf(value);
            const d = cacheData && i !== -1 ? cacheData[i] : void 0;
            const label = d ? getValue(d, labelKey) : String(value);
            items2.push({ value, label, data: d });
          }
        });
        items2.sort((a, b) => {
          const aOldIndex = values.indexOf(a.value);
          const bOldIndex = values.indexOf(b.value);
          const aIndex = aOldIndex === -1 ? items2.length : aOldIndex;
          const bIndex = bOldIndex === -1 ? items2.length : bOldIndex;
          return aIndex - bIndex;
        });
        return items2;
      }
      const ids = [];
      const data = [];
      if (cacheData) {
        cacheData.forEach((d) => {
          const value = getValue(d, valueKey);
          ids.push(value);
          data.push(d);
        });
      }
      eachTree(
        optionData.value,
        (d) => {
          ids.push(getValue(d, valueKey));
          data.push(d);
        },
        childKey
      );
      const items = [];
      values.forEach((value) => {
        const i = ids.indexOf(value);
        const d = i === -1 ? void 0 : data[i];
        const label = d ? getValue(d, labelKey) : String(value);
        items.push({ value, label, data: d });
      });
      return items;
    };
    const getSelectedValues = (checkedKeys, items) => {
      if (!props.multiple) {
        return checkedKeys ? checkedKeys[0] : void 0;
      }
      if (!props.checkedValueStrategy) {
        return checkedKeys || [];
      }
      const values = [];
      items.forEach((d) => {
        if (!d.hide) {
          values.push(d.value);
        }
      });
      return values;
    };
    const updateSelectedItems = (value, t) => {
      if (t) {
        selectedItems.value = t;
      } else if (isEmptyValue(value, props.multiple)) {
        selectedItems.value = [];
      } else {
        const items = getSelectedItems(props.multiple ? value : [value]);
        selectedItems.value = items;
      }
      nextTick(() => {
        updatePopover();
      });
    };
    const updateTempSelectedItems = (value, t) => {
      if (t) {
        tempSelectedItems.value = t;
      } else if (isEmptyValue(value, props.multiple)) {
        tempSelectedItems.value = [];
      } else {
        const items = getSelectedItems(props.multiple ? value : [value]);
        tempSelectedItems.value = items;
      }
    };
    const updateSelectedItemsAndValue = (checkedKeys, itemsData, modalType) => {
      const items = itemsData || getSelectedItems(checkedKeys);
      const values = getSelectedValues(checkedKeys, items);
      if (modalType ?? isModalType.value) {
        updateTempSelectedItems(void 0, items);
        tempSelectValue.value = values;
      } else {
        updateSelectedItems(void 0, items);
        updateModelValue(values);
      }
    };
    const getSortedCheckedKeys = (modalType) => {
      const oldValues = (modalType ?? isModalType.value ? tempSelectedItems.value : selectedItems.value).map((item) => item.value);
      const checkedKeys = treeRef.value ? treeRef.value.getCheckedKeys() : null;
      const keys = [...checkedKeys || []];
      keys.sort((a, b) => {
        const aOldIndex = oldValues.indexOf(a);
        const bOldIndex = oldValues.indexOf(b);
        const aIndex = aOldIndex === -1 ? keys.length : aOldIndex;
        const bIndex = bOldIndex === -1 ? keys.length : bOldIndex;
        return aIndex - bIndex;
      });
      return keys;
    };
    const handleSelectRemove = (item) => {
      if (treeRef.value && !(isModalType.value && selectVisible.value)) {
        treeRef.value.setChecked(item.value, false);
        const keys = getSortedCheckedKeys(false);
        updateSelectedItemsAndValue(keys, null, false);
        emit("removeTag", item.value);
      }
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
      treeRef.value && treeRef.value.filter(keywords);
    };
    const treeFilter = (keywords, item) => {
      const label = getValue(item, treeOptions.value.label);
      return label != null && label.includes(keywords);
    };
    const handleTreeClick = (item, _node, e) => {
      e.stopPropagation();
      const valueKey = treeOptions.value.value;
      const childrenKey = treeOptions.value.children;
      const disabledKey = treeOptions.value.disabled;
      const disabled = getValue(item, disabledKey);
      if (disabled) {
        const target = e.target;
        if (target && target.classList.contains("is-disabled")) {
          const el = target.parentNode?.parentNode;
          el && el.blur();
        }
      }
      focusSearchInput();
      const value = getValue(item, valueKey);
      const isChild = !getValue(item, childrenKey)?.length;
      const expandOnClick = props.treeProps?.expandOnClickNode !== false;
      if (!props.multiple) {
        const selectedItem = selectedItems.value[0];
        if (selectedItem && selectedItem.value === value) {
          if ((!expandOnClick || isChild) && !isModalType.value) {
            updateVisible(false);
          }
          return;
        }
        if (!disabled && (!expandOnClick || isChild)) {
          const label = getValue(item, treeOptions.value.label);
          updateSelectedItemsAndValue([value], [{ label, value, data: item }]);
          if (!isModalType.value) {
            updateVisible(false);
          }
          return;
        }
        nextTick(() => {
          const id = isModalType.value ? tempSelectValue.value : props.modelValue;
          const key = isEmptyValue(id) ? null : id;
          treeRef.value && treeRef.value.setCurrentKey(key);
        });
        return;
      }
      if (!disabled && (!expandOnClick || isChild) && !isChild && treeRef.value) {
        const values = treeRef.value.getCheckedKeys() || [];
        const checked = values.includes(value);
        if (checked) {
          treeRef.value.setChecked(value, false);
        } else if (isChild) {
          treeRef.value.setChecked(value, !checked);
        } else {
          const child = getValue(item, childrenKey);
          const isCheckAll = nodeIsCheckAll(child, values);
          treeRef.value.setChecked(value, !isCheckAll);
        }
        updateSelectedItemsAndValue(getSortedCheckedKeys());
      }
    };
    const handleTreeCheck = () => {
      updateSelectedItemsAndValue(getSortedCheckedKeys());
      focusSearchInput();
    };
    const handleTreeExpand = () => {
      focusSearchInput();
    };
    const handleTreeCollapse = () => {
      focusSearchInput();
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
      optionData,
      () => {
        nextTick(() => {
          updateTreeChecked(props.modelValue);
        });
      },
      { deep: true }
    );
    watch(
      [() => props.cacheData, optionData],
      () => {
        const value = props.multiple ? selectedItems.value.map((item) => item.value) : props.modelValue;
        updateSelectedItems(value);
        if (isModalType.value && selectVisible.value) {
          const value2 = props.multiple ? tempSelectedItems.value.map((item) => item.value) : tempSelectValue.value;
          updateTempSelectedItems(value2);
        }
      },
      { deep: true }
    );
    watch(
      () => props.modelValue,
      (value) => {
        updateSelectedItems(value);
        if (!(isModalType.value && selectVisible.value)) {
          updateTreeChecked(value);
        }
      },
      { deep: true }
    );
    watch(
      tempSelectValue,
      (value) => {
        if (isModalType.value && selectVisible.value) {
          updateTempSelectedItems(value);
          updateTreeChecked(value);
        }
      },
      { deep: true }
    );
    watch(
      [() => props.showCheckedStrategy, () => props.treeProps?.checkStrictly],
      () => {
        if (props.multiple) {
          if (isEmptyValue(props.modelValue, true)) {
            updateSelectedItems(void 0, []);
          } else {
            const keys = selectedItems.value.map((item) => item.value);
            updateSelectedItemsAndValue(keys, null, false);
          }
          if (isModalType.value && selectVisible.value) {
            if (isEmptyValue(tempSelectValue.value, true)) {
              updateTempSelectedItems(void 0, []);
            } else {
              const keys = tempSelectedItems.value.map((item) => item.value);
              updateSelectedItemsAndValue(keys, null, true);
            }
          }
        }
      }
    );
    watch(
      () => props.checkedValueStrategy,
      () => {
        if (props.multiple) {
          if (!isEmptyValue(props.modelValue, true)) {
            const keys = selectedItems.value.map((item) => item.value);
            updateModelValue(getSelectedValues(keys, selectedItems.value));
          }
          if (isModalType.value && selectVisible.value && !isEmptyValue(tempSelectValue.value, true)) {
            const k = tempSelectedItems.value.map((item) => item.value);
            tempSelectValue.value = getSelectedValues(k, tempSelectedItems.value);
          }
        }
      }
    );
    onMounted(() => {
      if (!isEmptyValue(props.modelValue, props.multiple)) {
        updateSelectedItems(props.modelValue);
        if (isModalType.value && selectVisible.value) {
          tempSelectedItems.value = [...selectedItems.value];
          tempSelectValue.value = props.multiple ? [...props.modelValue] : props.modelValue;
        }
        updateTreeChecked(props.modelValue);
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
        const keys = items.map((item) => item.value);
        updateSelectedItemsAndValue(keys, items, false);
      },
      clearTempSelectedItems: () => {
        tempSelectedItems.value = [];
        tempSelectValue.value = null;
      },
      removeTempSelectedItem: (item) => {
        if (props.multiple) {
          if (treeRef.value && isModalType.value && selectVisible.value) {
            treeRef.value.setChecked(item.value, false);
            const keys = getSortedCheckedKeys(true);
            updateSelectedItemsAndValue(keys, null, true);
          }
        } else if (tempSelectValue.value === item.value) {
          tempSelectedItems.value = [];
          tempSelectValue.value = null;
        }
      },
      updateTempSelectedItems: (items) => {
        const keys = items.map((item) => item.value);
        updateSelectedItemsAndValue(keys, items, true);
      }
    };
    provide(SELECT_DATA_KEY, {
      selectedItems,
      tempSelectedItems,
      ...provideMethods
    });
    __expose({
      selectRef,
      treeRef,
      updatePopover,
      updateVisible,
      focusSearchInput,
      reloadOptions,
      ...provideMethods,
      selectedItems,
      selectedLabel
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleBasicSelect, {
        ref_key: "selectRef",
        ref: selectRef,
        value: _ctx.modelValue,
        selectedLabel: selectedLabel.value,
        selected: selectedItems.value.filter((d) => !d.hide),
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
              createVNode(unref(ElTreeV2), mergeProps({
                itemSize: 32,
                filterMethod: treeFilter
              }, unref(omit)(_ctx.treeProps, ["data"]), {
                ref_key: "treeRef",
                ref: treeRef,
                data: unref(optionData),
                props: treeOptions.value,
                highlightCurrent: _ctx.multiple ? false : true,
                showCheckbox: !!_ctx.multiple,
                checkOnClickNode: false,
                onCheck: handleTreeCheck,
                onNodeClick: handleTreeClick,
                onNodeExpand: handleTreeExpand,
                onNodeCollapse: handleTreeCollapse
              }), createSlots({
                default: withCtx((slotProps) => [
                  createElementVNode("span", {
                    class: normalizeClass(["el-tree-node__label", { "is-disabled": slotProps.node.disabled }]),
                    title: slotProps.node.label
                  }, [
                    renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps || {})), () => [
                      createTextVNode(toDisplayString(slotProps.node.label), 1)
                    ])
                  ], 10, _hoisted_1)
                ]),
                _: 2
              }, [
                _ctx.$slots.empty ? {
                  name: "empty",
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, "empty", normalizeProps(guardReactiveProps(slotProps || {})))
                  ]),
                  key: "0"
                } : void 0
              ]), 1040, ["data", "props", "highlightCurrent", "showCheckbox"])
            ]),
            _: 3
          }, 16)) : (openBlock(), createBlock(unref(ElTreeV2), mergeProps({
            key: 1,
            itemSize: 32,
            filterMethod: treeFilter
          }, unref(omit)(_ctx.treeProps, ["data"]), {
            ref_key: "treeRef",
            ref: treeRef,
            data: unref(optionData),
            props: treeOptions.value,
            highlightCurrent: _ctx.multiple ? false : true,
            showCheckbox: !!_ctx.multiple,
            checkOnClickNode: false,
            onCheck: handleTreeCheck,
            onNodeClick: handleTreeClick,
            onNodeExpand: handleTreeExpand,
            onNodeCollapse: handleTreeCollapse
          }), createSlots({
            default: withCtx((slotProps) => [
              createElementVNode("span", {
                class: normalizeClass(["el-tree-node__label", { "is-disabled": slotProps.node.disabled }]),
                title: slotProps.node.label
              }, [
                renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(slotProps || {})), () => [
                  createTextVNode(toDisplayString(slotProps.node.label), 1)
                ])
              ], 10, _hoisted_2)
            ]),
            _: 2
          }, [
            _ctx.$slots.empty ? {
              name: "empty",
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, "empty", normalizeProps(guardReactiveProps(slotProps || {})))
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["data", "props", "highlightCurrent", "showCheckbox"]))
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

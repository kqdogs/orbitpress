<!-- 表格下拉选择 -->
<template>
  <EleBasicSelect
    ref="selectRef"
    :value="modelValue"
    :selectedLabel="selectedLabel"
    :selected="selectedItems"
    :visible="selectVisible"
    :multiple="multiple"
    :disabled="disabled"
    :size="size"
    :clearable="clearable"
    :placeholder="placeholder"
    :maxTagCount="maxTagCount"
    :maxTagTextLength="maxTagTextLength"
    :tagType="tagType"
    :automaticDropdown="automaticDropdown"
    :filterable="filterable"
    :selectClass="selectClass"
    :selectStyle="selectStyle"
    :inputStyle="inputStyle"
    :selectTagsStyle="selectTagsStyle"
    :popperClass="selectPopperClass"
    :popperWidth="popperWidth"
    :popperHeight="popperHeight"
    :popperType="popperType"
    :popperProps="popperProps"
    :popperSlots="{ footer: 'modalFooter', ...(popperSlots || {}) }"
    :popperTitle="popperTitle"
    :teleported="teleported"
    :persistent="persistent"
    :placement="placement"
    :transition="transition"
    :popperOptions="popperOptions"
    @update:visible="updateVisible"
    @filterChange="handleSelectFilter"
    @removeTag="handleSelectRemove"
    @clear="handleSelectClear"
    @focus="handleSelectFocus"
    @blur="handleSelectBlur"
  >
    <template
      v-for="name in Object.keys($slots).filter(
        (k) => k !== 'default' && !ownSlots.includes(k)
      )"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
    <component
      v-if="wrapperComponent"
      :is="wrapperComponent"
      v-bind="wrapperComponentProps || {}"
    >
      <slot name="popperTopExtra"></slot>
      <EleProTable
        @update:selectedRowKeys="handleUpdateTableSelectedRowKeys"
        @update:currentRowKey="handleUpdateTableCurrentRowKey"
        @selectionChange="handleTableSelectionChange"
        @currentChange="handleTableCurrentChange"
        @rowClick="handleTableRowClick"
        @select="handleTableSelect"
        @selectAll="handleTableSelectAll"
        @done="handleTableDone"
        v-bind="tableProps || {}"
        ref="proTableRef"
        :rowKey="valueKey"
        :reserveCurrent="true"
        :highlightCurrentRow="!multiple"
        :currentRowKey="tableCurrentRowKey"
        :selectedRowKeys="tableSelectedRowKeys"
      >
        <template
          v-for="(slotName, compSlotName) in getSlotsMap(
            $slots,
            tableSlots,
            [],
            ownSlots,
            !tableSlots
          )"
          #[compSlotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps || {}"></slot>
        </template>
      </EleProTable>
      <slot name="popperBottomExtra"></slot>
    </component>
    <template v-else>
      <slot name="popperTopExtra"></slot>
      <EleProTable
        @update:selectedRowKeys="handleUpdateTableSelectedRowKeys"
        @update:currentRowKey="handleUpdateTableCurrentRowKey"
        @selectionChange="handleTableSelectionChange"
        @currentChange="handleTableCurrentChange"
        @rowClick="handleTableRowClick"
        @select="handleTableSelect"
        @selectAll="handleTableSelectAll"
        @done="handleTableDone"
        v-bind="tableProps || {}"
        ref="proTableRef"
        :rowKey="valueKey"
        :reserveCurrent="true"
        :highlightCurrentRow="!multiple"
        :currentRowKey="tableCurrentRowKey"
        :selectedRowKeys="tableSelectedRowKeys"
      >
        <template
          v-for="(slotName, compSlotName) in getSlotsMap(
            $slots,
            tableSlots,
            [],
            ownSlots,
            !tableSlots
          )"
          #[compSlotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps || {}"></slot>
        </template>
      </EleProTable>
      <slot name="popperBottomExtra"></slot>
    </template>
    <template v-if="isModalType && !$slots.modalFooter" #modalFooter>
      <EleButtons
        :items="[
          { preset: 'cancel', onClick: () => updateVisible(false) },
          { preset: 'confirm', onClick: () => handleConfirm() }
        ]"
      />
    </template>
  </EleBasicSelect>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick, onMounted, provide } from 'vue';
  import { getValue, getSlotsMap } from '../utils/common';
  import type {
    EleBasicSelectInstance,
    EleProTableInstance
  } from '../ele-app/plus';
  import { useResponsive } from '../ele-pro-layout/util';
  import EleBasicSelect from '../ele-basic-select/index.vue';
  import type {
    SelectValue,
    SingleValue,
    MultipleValue,
    SelectedItem
  } from '../ele-basic-select/types';
  import {
    SELECT_DATA_KEY,
    isEmptyValue,
    valueIsChanged,
    useFormValidate
  } from '../ele-basic-select/util';
  import type { DataItem, DataKey, Column } from '../ele-data-table/types';
  import EleButtons from '../ele-buttons/index';
  import EleProTable from '../ele-pro-table/index.vue';
  import { tableSelectProps, tableSelectEmits } from './props';
  const ownSlots = ['popperTopExtra', 'popperBottomExtra'];

  defineOptions({ name: 'EleTableSelect' });

  const props = defineProps(tableSelectProps);

  const emit = defineEmits(tableSelectEmits);

  const { validateChange } = useFormValidate();

  const isResponsive = useResponsive(props);

  /** 下拉选择组件 */
  const selectRef = ref<EleBasicSelectInstance>(null);

  /** 高级表格组件 */
  const proTableRef = ref<EleProTableInstance>(null);

  /** 下拉框是否显示 */
  const selectVisible = ref<boolean>(!props.disabled && props.visible);

  /** 选中的标签数据 */
  const selectedItems = ref<SelectedItem[]>([]);

  /** 弹窗模式临时选中的标签数据 */
  const tempSelectedItems = ref<SelectedItem[]>([]);

  /** 弹窗模式临时选中值 */
  const tempSelectValue = ref<SelectValue>();

  /** 是否是弹窗模式 */
  const isModalType = computed<boolean>(() => {
    return props.popperType === 'modal' || props.popperType === 'drawer';
  });

  /** 下拉框类名 */
  const selectPopperClass = computed<string>(() => {
    const classes: string[] = ['ele-table-select-popper'];
    if (isResponsive.value && !isModalType.value) {
      classes.push('is-responsive');
    }
    if (props.popperClass) {
      classes.push(props.popperClass);
    }
    return classes.join(' ');
  });

  /** 单选选中显示文本 */
  const selectedLabel = computed<string>(() => {
    const selected = selectedItems.value;
    return !props.multiple && selected.length ? selected[0].label : '';
  });

  /** 表格单选选中值 */
  const tableCurrentRowKey = computed<DataKey | undefined>(() => {
    if (isModalType.value) {
      if (props.multiple || isEmptyValue(tempSelectValue.value)) {
        return;
      }
      return tempSelectValue.value as DataKey;
    }
    if (props.multiple || isEmptyValue(props.modelValue)) {
      return;
    }
    return props.modelValue as DataKey;
  });

  /** 表格多选选中值 */
  const tableSelectedRowKeys = computed<DataKey[] | undefined>(() => {
    if (isModalType.value) {
      if (!props.multiple || isEmptyValue(tempSelectValue.value)) {
        return;
      }
      return tempSelectValue.value as DataKey[];
    }
    if (!props.multiple || isEmptyValue(props.modelValue)) {
      return;
    }
    return props.modelValue as DataKey[];
  });

  /** 更新气泡位置 */
  const updatePopover = () => {
    selectRef.value && selectRef.value.updatePopper();
  };

  /** 让多选搜索框获取焦点 */
  const focusSearchInput = () => {
    selectRef.value && selectRef.value.focusSearchInput();
  };

  /** 更新选中值 */
  const updateModelValue = (modelValue: SelectValue) => {
    if (valueIsChanged(modelValue, props.modelValue, props.multiple)) {
      emit('update:modelValue', modelValue);
      if (props.validateEvent) {
        validateChange();
      }
      emit('change', modelValue);
    }
  };

  /** 更新下拉框显示状态 */
  const updateVisible = (visible: boolean) => {
    if (selectVisible.value !== visible) {
      selectVisible.value = visible;
      if (visible) {
        // 弹窗模式同步数据到临时数据
        if (isModalType.value) {
          if (isEmptyValue(props.modelValue)) {
            tempSelectedItems.value = [];
            tempSelectValue.value = void 0;
          } else {
            tempSelectedItems.value = [...selectedItems.value];
            tempSelectValue.value = props.multiple
              ? [...(props.modelValue as MultipleValue)]
              : props.modelValue;
          }
        }
        // 虚拟表格更新容器尺寸
        if (props.tableProps?.virtual && proTableRef.value) {
          const virtualTableRef = proTableRef.value.getTableRef() as any;
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
        emit('update:visible', visible);
      }
      emit('visibleChange', visible);
    }
  };

  /** 更新选中值对应的标签数据 */
  const getChangedSelectedItems = (
    selectValue: SelectValue | undefined,
    selectedItems: SelectedItem[],
    force?: boolean
  ): SelectedItem[] | undefined => {
    const tableData = [
      ...(props.cacheData || []),
      ...((props.multiple
        ? (props.initValue as any)
        : props.initValue
          ? [props.initValue]
          : void 0) || []), // 已废弃属性兼容
      ...((props.multiple && proTableRef.value
        ? proTableRef.value.getSelectionRows()
        : void 0) || [])
    ];
    if (!props.multiple) {
      const temp = proTableRef.value ? proTableRef.value.getCurrentRow() : null;
      if (temp) {
        tableData.push(temp);
      }
    }
    // 单选模式
    if (!props.multiple) {
      const value = selectValue as SingleValue;
      const d = selectedItems.length ? selectedItems[0] : null;
      if (isEmptyValue(value)) {
        if (d != null) {
          return [];
        }
        return;
      }
      if (force || !d || d.value !== value) {
        const item = tableData
          ? tableData.find((d) => getValue(d, props.valueKey) === value)
          : void 0;
        let label = getValue<any, DataItem>(item, props.labelKey);
        if (label == null && (!item || item._isMock)) {
          label = String(value);
        }
        return [{ value, label, data: item }];
      }
      return;
    }
    // 多选模式
    if (isEmptyValue(selectValue, true)) {
      if (selectedItems.length) {
        return [];
      }
      return;
    }
    if (
      !force &&
      !valueIsChanged(
        selectValue,
        selectedItems.map((d) => d.value),
        true
      )
    ) {
      return;
    }
    const selected: SelectedItem[] = [];
    const dataKeys = tableData
      ? tableData.map((d) => getValue<any, DataItem>(d, props.valueKey))
      : [];
    (selectValue as MultipleValue).forEach((value, index) => {
      const dataIndex = dataKeys.indexOf(value as DataKey);
      const item = dataIndex === -1 ? void 0 : tableData[dataIndex];
      let label = getValue<any, DataItem>(item, props.labelKey);
      if (label == null && (!item || item._isMock)) {
        label = String(value);
      }
      selected.push({ value, label, index, data: item });
    });
    return selected;
  };

  /** 检查更新选中标签数据 */
  const checkUpdateSelectedItems = (force?: boolean) => {
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

  /** 检查更新弹窗模式临时选中标签数据 */
  const checkUpdateTempSelectedItems = (force?: boolean) => {
    const items = getChangedSelectedItems(
      tempSelectValue.value,
      tempSelectedItems.value,
      force
    );
    if (items) {
      tempSelectedItems.value = items;
    }
  };

  /** 删除多选标签事件 */
  const handleSelectRemove = (item: SelectedItem) => {
    const values = (props.modelValue || []) as MultipleValue;
    updateModelValue(values.filter((v) => v !== item.value));
    emit('removeTag', item.value);
  };

  /** 清空事件 */
  const handleSelectClear = () => {
    updateModelValue(props.multiple ? [] : null);
    updateVisible(false);
    emit('clear');
  };

  /** 获取焦点事件 */
  const handleSelectFocus = (e: FocusEvent) => {
    emit('focus', e);
  };

  /** 失去焦点事件 */
  const handleSelectBlur = (e: FocusEvent) => {
    emit('blur', e);
  };

  /** 筛选关键字改变事件 */
  const handleSelectFilter = (keywords: string) => {
    emit('filterChange', keywords);
  };

  /** 更新选中值事件 */
  const handleUpdateModelValue = (modelValue: SelectValue) => {
    if (isModalType.value) {
      tempSelectValue.value = modelValue;
    } else {
      updateModelValue(modelValue);
    }
  };

  /** 检查更新选中标签数据事件 */
  const handleCheckUpdateSelectedItems = (force?: boolean) => {
    if (isModalType.value) {
      checkUpdateTempSelectedItems(force);
    } else {
      checkUpdateSelectedItems(force);
    }
  };

  /** 表格数据选择事件 */
  const handleDataSelect = (data: DataItem | DataItem[]) => {
    if (!isModalType.value) {
      if (!props.multiple) {
        updateVisible(false);
      }
      emit('select', data);
    }
  };

  /** 表格多选选中值改变事件 */
  const handleUpdateTableSelectedRowKeys = (rowKeys: DataKey[]) => {
    if (props.multiple) {
      const oldValues = (props.modelValue || []) as MultipleValue;
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

  /** 表格单选选中值改变事件 */
  const handleUpdateTableCurrentRowKey = (rowKey?: DataKey) => {
    if (!props.multiple) {
      handleUpdateModelValue(rowKey);
    }
  };

  /** 表格多选选中数据改变事件 */
  const handleTableSelectionChange = () => {
    if (props.multiple) {
      handleCheckUpdateSelectedItems(true);
    }
  };

  /** 表格单选选中数据改变事件 */
  const handleTableCurrentChange = (row?: DataItem | null) => {
    if (!props.multiple && row != null) {
      handleCheckUpdateSelectedItems(true);
    }
  };

  /** 表格行点击事件 */
  const handleTableRowClick = (
    row: DataItem,
    _column: Column,
    _e: MouseEvent,
    disabled: boolean,
    selection?: DataItem[]
  ) => {
    if (!props.multiple) {
      handleDataSelect(row);
    } else if (props.tableProps?.rowClickChecked && !disabled) {
      handleDataSelect(selection || []);
    }
  };

  /** 表格多选复选框勾选事件 */
  const handleTableSelect = (selection: DataItem[]) => {
    handleDataSelect(selection);
  };

  /** 表格多选全选复选框勾选事件 */
  const handleTableSelectAll = (selection: DataItem[]) => {
    handleDataSelect(selection);
  };

  /** 表格渲染完成事件 */
  const handleTableDone = () => {
    nextTick(() => {
      updatePopover();
    });
  };

  /** 弹窗模式确定按钮点击事件 */
  const handleConfirm = () => {
    const selected = tempSelectedItems.value.map((item) => item.data);
    const selectedData = props.multiple ? selected : selected[0];
    if (props.beforeConfirm && props.beforeConfirm(selectedData) === false) {
      return;
    }
    const values = tempSelectedItems.value.map((item) => item.value);
    if (!props.multiple) {
      updateModelValue(values[0]);
      emit('select', selectedData);
      updateVisible(false);
      return;
    }
    updateModelValue(values);
    emit('select', selectedData);
    updateVisible(false);
  };

  /** 处理初始值更新(已废弃属性兼容) */
  const handleInitValueChange = (initValue: DataItem | DataItem[]) => {
    if (!props.multiple) {
      const value = getValue<any, DataItem>(initValue, props.valueKey);
      if (value === props.modelValue) {
        checkUpdateSelectedItems();
      } else {
        updateModelValue(value);
      }
      return;
    }
    const values = (initValue as DataItem[]).map((d) =>
      getValue<any, DataItem>(d, props.valueKey)
    );
    if (!valueIsChanged(props.modelValue, values, true)) {
      checkUpdateSelectedItems();
    } else {
      updateModelValue(values);
    }
  };

  /** 禁用时自动关闭下拉框 */
  watch(
    () => props.disabled,
    (disabled) => {
      if (disabled) {
        updateVisible(false);
      }
    }
  );

  /** 同步下拉框显示状态 */
  watch(
    () => props.visible,
    (visible) => {
      updateVisible(visible);
    }
  );

  /** 更新选中标签数据 */
  watch(
    () => props.cacheData,
    () => {
      checkUpdateSelectedItems(true);
      if (isModalType.value && selectVisible.value) {
        checkUpdateTempSelectedItems(true);
      }
    }
  );

  /** 同步选中值更新 */
  watch(
    () => props.modelValue,
    () => {
      checkUpdateSelectedItems();
    },
    { deep: true }
  );

  /** 同步弹窗模式临时选中值更新 */
  watch(
    tempSelectValue,
    () => {
      if (isModalType.value && selectVisible.value) {
        checkUpdateTempSelectedItems();
      }
    },
    { deep: true }
  );

  /** 同步初始值更新(已废弃属性兼容) */
  watch(
    () => props.initValue,
    (initValue) => {
      if (!isEmptyValue(initValue as any)) {
        handleInitValueChange(initValue as DataItem | DataItem[]);
      }
    },
    { deep: true }
  );

  /** 回显默认值 */
  onMounted(() => {
    if (!isEmptyValue(props.initValue as any, props.multiple)) {
      handleInitValueChange(props.initValue as DataItem | DataItem[]);
    } else if (!isEmptyValue(props.modelValue, props.multiple)) {
      checkUpdateSelectedItems();
    }
  });

  /** 操作选中标签数据方法 */
  const provideMethods = {
    clearSelectedItems: handleSelectClear,
    removeSelectedItem: (item: SelectedItem) => {
      if (props.multiple) {
        handleSelectRemove(item);
      } else if (props.modelValue === item.value) {
        handleSelectClear();
      }
    },
    updateSelectedItems: (items: SelectedItem[]) => {
      const values = items.map((item) => item.value);
      updateModelValue(props.multiple ? values : values[0]);
    },
    clearTempSelectedItems: () => {
      tempSelectedItems.value = [];
      tempSelectValue.value = null;
    },
    removeTempSelectedItem: (item: SelectedItem) => {
      const index = tempSelectedItems.value.indexOf(item);
      tempSelectedItems.value.splice(index, 1);
      const values = tempSelectedItems.value.map((item) => item.value);
      tempSelectValue.value = props.multiple ? values : values[0];
    },
    updateTempSelectedItems: (items: SelectedItem[]) => {
      tempSelectedItems.value = items;
      const values = tempSelectedItems.value.map((item) => item.value);
      tempSelectValue.value = props.multiple ? values : values[0];
    }
  };

  /** 下拉组件数据注入 */
  provide(SELECT_DATA_KEY, {
    selectedItems,
    tempSelectedItems,
    ...provideMethods
  });

  defineExpose({
    selectRef,
    tableRef: proTableRef,
    updatePopover,
    updateVisible,
    focusSearchInput,
    ...provideMethods
  });
</script>

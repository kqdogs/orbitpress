<!-- 虚拟滚动树下拉选择 -->
<template>
  <EleBasicSelect
    ref="selectRef"
    :value="modelValue"
    :selectedLabel="selectedLabel"
    :selected="selectedItems.filter((d) => !d.hide)"
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
      v-for="name in Object.keys($slots).filter((k) => !ownSlots.includes(k))"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
    <component
      v-if="wrapperComponent"
      :is="wrapperComponent"
      v-bind="wrapperComponentProps || {}"
    >
      <ElTreeV2
        :itemSize="32"
        :filterMethod="treeFilter"
        v-bind="omit(treeProps, ['data'])"
        ref="treeRef"
        :data="optionData"
        :props="treeOptions"
        :highlightCurrent="multiple ? false : true"
        :showCheckbox="!!multiple"
        :checkOnClickNode="false"
        @check="handleTreeCheck"
        @node-click="handleTreeClick"
        @node-expand="handleTreeExpand"
        @node-collapse="handleTreeCollapse"
      >
        <template #default="slotProps">
          <span
            class="el-tree-node__label"
            :class="{ 'is-disabled': slotProps.node.disabled }"
            :title="slotProps.node.label"
          >
            <slot v-bind="slotProps || {}">{{ slotProps.node.label }}</slot>
          </span>
        </template>
        <template v-if="$slots.empty" #empty="slotProps">
          <slot name="empty" v-bind="slotProps || {}"></slot>
        </template>
      </ElTreeV2>
    </component>
    <ElTreeV2
      v-else
      :itemSize="32"
      :filterMethod="treeFilter"
      v-bind="omit(treeProps, ['data'])"
      ref="treeRef"
      :data="optionData"
      :props="treeOptions"
      :highlightCurrent="multiple ? false : true"
      :showCheckbox="!!multiple"
      :checkOnClickNode="false"
      @check="handleTreeCheck"
      @node-click="handleTreeClick"
      @node-expand="handleTreeExpand"
      @node-collapse="handleTreeCollapse"
    >
      <template #default="slotProps">
        <span
          class="el-tree-node__label"
          :class="{ 'is-disabled': slotProps.node.disabled }"
          :title="slotProps.node.label"
        >
          <slot v-bind="slotProps || {}">{{ slotProps.node.label }}</slot>
        </span>
      </template>
      <template v-if="$slots.empty" #empty="slotProps">
        <slot name="empty" v-bind="slotProps || {}"></slot>
      </template>
    </ElTreeV2>
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
  import { ElTreeV2 } from 'element-plus';
  import { omit, getValue, eachTree } from '../utils/common';
  import { useProOptions } from '../utils/hook';
  import type { ElTreeV2Instance } from '../ele-app/el';
  import type { EleBasicSelectInstance } from '../ele-app/plus';
  import type {
    SelectValue,
    MultipleValue,
    SelectedItem
  } from '../ele-basic-select/types';
  import {
    SELECT_DATA_KEY,
    isEmptyValue,
    valueIsChanged,
    useFormValidate
  } from '../ele-basic-select/util';
  import EleBasicSelect from '../ele-basic-select/index.vue';
  import EleButtons from '../ele-buttons/index';
  import type { TreeOption, DataItem } from './types';
  import { treeSelectProps, treeSelectEmits } from './props';
  const ownSlots = ['default', 'empty'];

  defineOptions({ name: 'EleTreeSelect' });

  const props = defineProps(treeSelectProps);

  const emit = defineEmits(treeSelectEmits);

  const { validateChange } = useFormValidate();

  const { optionData, reloadOptions } = useProOptions(props, 'treeProps.data');

  /** 下拉选择组件 */
  const selectRef = ref<EleBasicSelectInstance>(null);

  /** 树组件 */
  const treeRef = ref<ElTreeV2Instance>(null);

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
    const classes: string[] = ['ele-tree-select-popper'];
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

  /** 树配置选项 */
  const treeOptions = computed<TreeOption>(() => {
    return Object.assign(
      {
        value: 'id',
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      props.treeProps?.props
    ) as any;
  });

  /** 更新树选中状态 */
  const updateTreeChecked = (value: SelectValue) => {
    if (treeRef.value) {
      if (props.multiple) {
        if (isEmptyValue(value, true)) {
          treeRef.value.setCheckedKeys([]);
        } else {
          treeRef.value.setCheckedKeys(value as any);
        }
      } else {
        if (isEmptyValue(value)) {
          treeRef.value.setCurrentKey(null as any);
        } else {
          treeRef.value.setCurrentKey(value as any);
        }
      }
    }
  };

  /** 更新气泡框位置 */
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
    if (visible) {
      handleSelectFilter('');
    }
    if (selectVisible.value !== visible) {
      selectVisible.value = visible;
      // 弹窗模式同步数据到临时数据
      if (visible && isModalType.value) {
        if (isEmptyValue(props.modelValue)) {
          tempSelectedItems.value = [];
          tempSelectValue.value = void 0;
        } else {
          tempSelectedItems.value = [...selectedItems.value];
          tempSelectValue.value = props.multiple
            ? [...(props.modelValue as MultipleValue)]
            : props.modelValue;
        }
        if (!treeRef.value) {
          nextTick(() => {
            updateTreeChecked(tempSelectValue.value);
          });
        }
      }
      if (props.visible !== visible) {
        emit('update:visible', visible);
      }
      emit('visibleChange', visible);
    }
  };

  /** 判断父节点是否是全选状态 */
  const nodeIsCheckAll = (child?: DataItem[], values?: MultipleValue) => {
    if (!child || !child.length || !values || !values.length) {
      return false;
    }
    const valueKey = treeOptions.value.value;
    const childKey = treeOptions.value.children;
    const disabledKey = treeOptions.value.disabled;
    return child.every((d) => {
      if (
        getValue<boolean, DataItem>(d, disabledKey) ||
        values.includes(getValue<any, DataItem>(d, valueKey))
      ) {
        return true;
      }
      const cChild = getValue<DataItem[], DataItem>(d, childKey);
      if (cChild && cChild.length) {
        return nodeIsCheckAll(cChild, values);
      }
      return false;
    });
  };

  /** 判断父节点是否是全选状态简易模式 */
  const nodeIsCheckAllSimple = (child: DataItem[], items: SelectedItem[]) => {
    const valueKey = treeOptions.value.value;
    const disabledKey = treeOptions.value.disabled;
    const values = items.map((item) => item.value);
    return child.every((d) => {
      if (
        getValue<boolean, DataItem>(d, disabledKey) ||
        values.includes(getValue<any, DataItem>(d, valueKey))
      ) {
        return true;
      }
      return false;
    });
  };

  /** 获取选中值对应的标签数据含显示策略处理 */
  const getSelectedItemsPro = (
    values: MultipleValue,
    data?: DataItem[],
    leaf?: boolean,
    hide?: boolean,
    parentChecked?: boolean
  ) => {
    const items: SelectedItem[] = [];
    if (!data) {
      return items;
    }
    const valueKey = treeOptions.value.value;
    const labelKey = treeOptions.value.label;
    const childKey = treeOptions.value.children;
    data.forEach((d) => {
      const value = getValue<any, DataItem>(d, valueKey);
      const child = getValue<DataItem[], DataItem>(d, childKey);
      const checked = values.includes(value);
      // 只显示叶子节点标签模式
      if (leaf) {
        const hasChild = !!(child && child.length);
        const cItems = hasChild ? getSelectedItemsPro(values, child, leaf) : [];
        if (checked || (hasChild && nodeIsCheckAllSimple(child, cItems))) {
          const label = getValue<any, DataItem>(d, labelKey);
          items.push({ value, label, hide: hasChild, data: d });
        }
        cItems.forEach((t) => {
          items.push(t);
        });
        return;
      }
      // 父级选中时不显示子级标签模式
      if (checked || parentChecked) {
        const label = getValue<any, DataItem>(d, labelKey);
        items.push({ value, label, hide, data: d });
      }
      const cHide = checked || hide;
      getSelectedItemsPro(values, child, leaf, cHide, checked).forEach((t) => {
        items.push(t);
      });
    });
    return items;
  };

  /** 获取选中值对应的标签数据 */
  const getSelectedItems = (checkedKeys?: MultipleValue): SelectedItem[] => {
    if (isEmptyValue(checkedKeys, true)) {
      return [];
    }
    const values = checkedKeys as MultipleValue;
    const valueKey = treeOptions.value.value;
    const labelKey = treeOptions.value.label;
    const childKey = treeOptions.value.children;
    const cacheData = props.cacheData;
    // 标签显示策略处理
    const scs = props.showCheckedStrategy;
    if (props.multiple && !(props.treeProps?.checkStrictly || scs === 'all')) {
      const leaf = scs === 'child';
      const items = getSelectedItemsPro(values, optionData.value, leaf);
      const selectedValues = items.map((t) => t.value);
      const ids = (cacheData || []).map((d) => getValue<any, any>(d, valueKey));
      values.forEach((value) => {
        if (!selectedValues.includes(value)) {
          const i = ids.indexOf(value);
          const d = cacheData && i !== -1 ? cacheData[i] : void 0;
          const label = d ? getValue<any, any>(d, labelKey) : String(value);
          items.push({ value, label, data: d });
        }
      });
      items.sort((a, b) => {
        const aOldIndex = values.indexOf(a.value);
        const bOldIndex = values.indexOf(b.value);
        const aIndex = aOldIndex === -1 ? items.length : aOldIndex;
        const bIndex = bOldIndex === -1 ? items.length : bOldIndex;
        return aIndex - bIndex;
      });
      return items;
    }
    // 处理数据优化查找
    const ids: MultipleValue = [];
    const data: DataItem[] = [];
    if (cacheData) {
      cacheData.forEach((d) => {
        const value = getValue<any, DataItem>(d, valueKey);
        ids.push(value);
        data.push(d);
      });
    }
    eachTree(
      optionData.value,
      (d) => {
        ids.push(getValue<any, DataItem>(d, valueKey));
        data.push(d);
      },
      childKey
    );
    // 显示全部选中标签
    const items: SelectedItem[] = [];
    values.forEach((value) => {
      const i = ids.indexOf(value);
      const d = i === -1 ? void 0 : data[i];
      const label = d ? getValue<any, DataItem>(d, labelKey) : String(value);
      items.push({ value, label, data: d });
    });
    return items;
  };

  /** 获取值策略处理后的选中值 */
  const getSelectedValues = (
    checkedKeys: MultipleValue | undefined,
    items: SelectedItem[]
  ): SelectValue => {
    if (!props.multiple) {
      return checkedKeys ? checkedKeys[0] : void 0;
    }
    if (!props.checkedValueStrategy) {
      return checkedKeys || [];
    }
    const values: SelectValue = [];
    items.forEach((d) => {
      if (!d.hide) {
        (values as MultipleValue).push(d.value);
      }
    });
    return values;
  };

  /** 更新选中标签数据 */
  const updateSelectedItems = (value: SelectValue, t?: SelectedItem[]) => {
    if (t) {
      selectedItems.value = t;
    } else if (isEmptyValue(value, props.multiple)) {
      selectedItems.value = [];
    } else {
      const items = getSelectedItems((props.multiple ? value : [value]) as any);
      selectedItems.value = items;
    }
    nextTick(() => {
      updatePopover();
    });
  };

  /** 更新弹窗模式临时选中标签数据 */
  const updateTempSelectedItems = (value: SelectValue, t?: SelectedItem[]) => {
    if (t) {
      tempSelectedItems.value = t;
    } else if (isEmptyValue(value, props.multiple)) {
      tempSelectedItems.value = [];
    } else {
      const items = getSelectedItems((props.multiple ? value : [value]) as any);
      tempSelectedItems.value = items;
    }
  };

  /** 更新选中值及选中标签数据 */
  const updateSelectedItemsAndValue = (
    checkedKeys: MultipleValue,
    itemsData?: SelectedItem[] | null,
    modalType?: boolean
  ) => {
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

  /** 获取含排序的树选中值 */
  const getSortedCheckedKeys = (modalType?: boolean) => {
    const oldValues = (
      (modalType ?? isModalType.value)
        ? tempSelectedItems.value
        : selectedItems.value
    ).map((item) => item.value);
    const checkedKeys = treeRef.value ? treeRef.value.getCheckedKeys() : null;
    const keys = [...(checkedKeys || [])];
    keys.sort((a, b) => {
      const aOldIndex = oldValues.indexOf(a);
      const bOldIndex = oldValues.indexOf(b);
      const aIndex = aOldIndex === -1 ? keys.length : aOldIndex;
      const bIndex = bOldIndex === -1 ? keys.length : bOldIndex;
      return aIndex - bIndex;
    });
    return keys;
  };

  /** 选择框删除多选标签事件 */
  const handleSelectRemove = (item: SelectedItem) => {
    if (treeRef.value && !(isModalType.value && selectVisible.value)) {
      treeRef.value.setChecked(item.value as any, false);
      const keys = getSortedCheckedKeys(false);
      updateSelectedItemsAndValue(keys, null, false);
      emit('removeTag', item.value);
    }
  };

  /** 选择框清空事件 */
  const handleSelectClear = () => {
    updateModelValue(props.multiple ? [] : null);
    updateVisible(false);
    emit('clear');
  };

  /** 选择框获取焦点事件 */
  const handleSelectFocus = (e: FocusEvent) => {
    emit('focus', e);
  };

  /** 选择框失去焦点事件 */
  const handleSelectBlur = (e: FocusEvent) => {
    emit('blur', e);
  };

  /** 筛选关键字改变事件 */
  const handleSelectFilter = (keywords: string) => {
    treeRef.value && treeRef.value.filter(keywords);
  };

  /** 树筛选 */
  const treeFilter = (keywords: string, item: DataItem) => {
    const label = getValue<string, DataItem>(item, treeOptions.value.label);
    return label != null && label.includes(keywords);
  };

  /** 树节点点击事件 */
  const handleTreeClick = (item: DataItem, _node: any, e: MouseEvent) => {
    e.stopPropagation();
    const valueKey = treeOptions.value.value;
    const childrenKey = treeOptions.value.children;
    const disabledKey = treeOptions.value.disabled;
    const disabled = getValue<boolean, DataItem>(item, disabledKey);
    if (disabled) {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('is-disabled')) {
        const el = target.parentNode?.parentNode as HTMLElement;
        el && el.blur();
      }
    }
    focusSearchInput();
    const value = getValue<any, DataItem>(item, valueKey);
    const isChild = !getValue<DataItem[], DataItem>(item, childrenKey)?.length;
    const expandOnClick = props.treeProps?.expandOnClickNode !== false;
    // 单选模式
    if (!props.multiple) {
      const selectedItem = selectedItems.value[0];
      if (selectedItem && selectedItem.value === value) {
        if ((!expandOnClick || isChild) && !isModalType.value) {
          updateVisible(false);
        }
        return;
      }
      if (!disabled && (!expandOnClick || isChild)) {
        const label = getValue<any, DataItem>(item, treeOptions.value.label);
        updateSelectedItemsAndValue([value], [{ label, value, data: item }]);
        if (!isModalType.value) {
          updateVisible(false);
        }
        return;
      }
      nextTick(() => {
        const id = isModalType.value ? tempSelectValue.value : props.modelValue;
        const key: any = isEmptyValue(id) ? null : id;
        treeRef.value && treeRef.value.setCurrentKey(key);
      });
      return;
    }
    // 多选模式
    if (!disabled && (!expandOnClick || isChild) && !isChild && treeRef.value) {
      const values = treeRef.value.getCheckedKeys() || [];
      const checked = values.includes(value);
      if (checked) {
        treeRef.value.setChecked(value, false);
      } else if (isChild) {
        treeRef.value.setChecked(value, !checked);
      } else {
        const child = getValue<DataItem[], DataItem>(item, childrenKey);
        const isCheckAll = nodeIsCheckAll(child, values);
        treeRef.value.setChecked(value, !isCheckAll);
      }
      updateSelectedItemsAndValue(getSortedCheckedKeys());
    }
  };

  /** 树复选框点击事件 */
  const handleTreeCheck = () => {
    updateSelectedItemsAndValue(getSortedCheckedKeys());
    focusSearchInput();
  };

  /** 树节点展开事件 */
  const handleTreeExpand = () => {
    focusSearchInput();
  };

  /** 树节点收起事件 */
  const handleTreeCollapse = () => {
    focusSearchInput();
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

  /** 更新树选中状态 */
  watch(
    optionData,
    () => {
      nextTick(() => {
        updateTreeChecked(props.modelValue);
      });
    },
    { deep: true }
  );

  /** 更新选中标签数据 */
  watch(
    [() => props.cacheData, optionData],
    () => {
      const value = props.multiple
        ? selectedItems.value.map((item) => item.value)
        : props.modelValue;
      updateSelectedItems(value);
      if (isModalType.value && selectVisible.value) {
        const value = props.multiple
          ? tempSelectedItems.value.map((item) => item.value)
          : tempSelectValue.value;
        updateTempSelectedItems(value);
      }
    },
    { deep: true }
  );

  /** 同步选中值更新 */
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

  /** 同步弹窗模式临时选中值更新 */
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

  /** 同步标签显示策略改变 */
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

  /** 同步值显示策略改变 */
  watch(
    () => props.checkedValueStrategy,
    () => {
      if (props.multiple) {
        if (!isEmptyValue(props.modelValue, true)) {
          const keys = selectedItems.value.map((item) => item.value);
          updateModelValue(getSelectedValues(keys, selectedItems.value));
        }
        if (
          isModalType.value &&
          selectVisible.value &&
          !isEmptyValue(tempSelectValue.value, true)
        ) {
          const k = tempSelectedItems.value.map((item) => item.value);
          tempSelectValue.value = getSelectedValues(k, tempSelectedItems.value);
        }
      }
    }
  );

  /** 回显默认值 */
  onMounted(() => {
    if (!isEmptyValue(props.modelValue, props.multiple)) {
      updateSelectedItems(props.modelValue);
      if (isModalType.value && selectVisible.value) {
        tempSelectedItems.value = [...selectedItems.value];
        tempSelectValue.value = props.multiple
          ? [...(props.modelValue as MultipleValue)]
          : props.modelValue;
      }
      updateTreeChecked(props.modelValue);
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
      const keys = items.map((item) => item.value);
      updateSelectedItemsAndValue(keys, items, false);
    },
    clearTempSelectedItems: () => {
      tempSelectedItems.value = [];
      tempSelectValue.value = null;
    },
    removeTempSelectedItem: (item: SelectedItem) => {
      if (props.multiple) {
        if (treeRef.value && isModalType.value && selectVisible.value) {
          treeRef.value.setChecked(item.value as any, false);
          const keys = getSortedCheckedKeys(true);
          updateSelectedItemsAndValue(keys, null, true);
        }
      } else if (tempSelectValue.value === item.value) {
        tempSelectedItems.value = [];
        tempSelectValue.value = null;
      }
    },
    updateTempSelectedItems: (items: SelectedItem[]) => {
      const keys = items.map((item) => item.value);
      updateSelectedItemsAndValue(keys, items, true);
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
    treeRef,
    updatePopover,
    updateVisible,
    focusSearchInput,
    reloadOptions,
    ...provideMethods,
    selectedItems,
    selectedLabel
  });
</script>

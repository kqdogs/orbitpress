<!-- 表格操作下拉菜单 -->
<template>
  <EleDropdown
    :triggerKeys="[]"
    :persistent="false"
    :validateEvent="false"
    placement="bottom-end"
    :popperOptions="{
      strategy: 'fixed',
      modifiers: [{ name: 'offset', options: { offset: [6, 8] } }]
    }"
    popperClass="ele-pro-form-builder-table-tool-dropdown"
    ref="dropdownRef"
    trigger="click"
    componentType="pro"
    :virtualTriggering="true"
    :virtualRef="dropdownVirtualRef"
    :items="[
      { title: '上方插入行', command: 'insertAboveRow' },
      { title: '下方插入行', command: 'insertBelowRow' },
      { title: '左侧插入列', command: 'insertLeftCol' },
      { title: '右侧插入列', command: 'insertRightCol' },
      { title: '合并右侧单元格', command: 'mergeRightCell', divided: true },
      { title: '合并下方单元格', command: 'mergeBelowCell' },
      { title: '拆分单元格合并', command: 'splitCell' },
      {
        title: '删除整行',
        command: 'deleteRow',
        divided: true,
        danger: true
      },
      { title: '删除整列', command: 'deleteCol', danger: true }
    ]"
    @command="handleTableToolDropdownCommand"
  />
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import type { EleDropdownInstance } from '../../ele-app/plus';
  import EleDropdown from '../../ele-dropdown/index.vue';
  import type { ProFormItemProps } from '../../ele-pro-form/types';
  import type { ComponentGroup, UpdateItemsResult } from '../types';
  import {
    getTableFormItemByTd,
    generateAddTableColData,
    generateAddTableRowData,
    getTableSplitEffects,
    getTableDeleteRowEffects,
    getTableDeleteColEffects,
    getTableMergeRightEffects,
    getTableMergeBelowEffects
  } from './table-util';

  defineOptions({ name: 'TableToolMenu' });

  const props = defineProps<{
    /** 全部表单项 */
    formItems?: ProFormItemProps[];
    /** 组件库数据 */
    componentData?: ComponentGroup[];
  }>();

  const emit = defineEmits<{
    (e: 'updateItems', result: UpdateItemsResult): void;
  }>();

  /** 表格操作下拉菜单组件 */
  const dropdownRef = ref<EleDropdownInstance>();

  /** 表格操作下拉菜单虚拟触发节点 */
  const dropdownVirtualRef = ref<any>();

  /** 当前打开的表格操作下拉菜单对应的表单项 */
  let tdFormItemId: string | null = null;

  /** 更新表单项数据 */
  const handleUpdateItems = (result: UpdateItemsResult) => {
    emit('updateItems', result);
  };

  /** 插入行或列 */
  const handleAddChildren = (
    formItemId: string,
    actionType?: 'addTableRow' | 'addTableCol',
    position?: -1
  ) => {
    const { tableFormItem, tdFormItem } = getTableFormItemByTd(
      formItemId,
      props.formItems
    );
    if (!tableFormItem || !tdFormItem) {
      return;
    }
    const result = (
      actionType === 'addTableCol'
        ? generateAddTableColData
        : generateAddTableRowData
    )(
      tableFormItem,
      props.formItems,
      tdFormItem,
      position,
      props.componentData
    );
    handleUpdateItems(result);
  };

  /** 拆分单元格 */
  const handleSplitCell = (formItemId: string) => {
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

  /** 删除整行 */
  const handleDeleteRow = (formItemId: string) => {
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

  /** 删除整列 */
  const handleDeleteCol = (formItemId: string) => {
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

  /** 合并单元格 */
  const handleMergeCell = (
    formItemId: string,
    actionType?: 'mergeRightCell' | 'mergeBelowCell'
  ) => {
    const { tableFormItem, tdFormItem } = getTableFormItemByTd(
      formItemId,
      props.formItems
    );
    if (!tableFormItem || !tdFormItem) {
      return;
    }
    const result = (
      actionType === 'mergeBelowCell'
        ? getTableMergeBelowEffects
        : getTableMergeRightEffects
    )(tableFormItem, props.formItems, tdFormItem, props.componentData);
    handleUpdateItems(result);
  };

  /** 关闭表格操作下拉菜单 */
  const hideTableToolDropdown = () => {
    dropdownRef.value && dropdownRef.value.handleClose();
  };

  /** 表格操作下拉菜单项点击事件 */
  const handleTableToolDropdownCommand = (command: any) => {
    if (tdFormItemId != null) {
      if (command === 'insertAboveRow') {
        // 上方插入行
        handleAddChildren(tdFormItemId, 'addTableRow', -1);
      } else if (command === 'insertBelowRow') {
        // 下方插入行
        handleAddChildren(tdFormItemId, 'addTableRow');
      } else if (command === 'insertLeftCol') {
        // 左侧插入列
        handleAddChildren(tdFormItemId, 'addTableCol', -1);
      } else if (command === 'insertRightCol') {
        // 右侧插入列
        handleAddChildren(tdFormItemId, 'addTableCol');
      } else if (command === 'mergeRightCell') {
        // 合并右侧单元格
        handleMergeCell(tdFormItemId, 'mergeRightCell');
      } else if (command === 'mergeBelowCell') {
        // 合并下方单元格
        handleMergeCell(tdFormItemId, 'mergeBelowCell');
      } else if (command === 'splitCell') {
        // 拆分单元格
        handleSplitCell(tdFormItemId);
      } else if (command === 'deleteRow') {
        // 删除整行
        handleDeleteRow(tdFormItemId);
      } else if (command === 'deleteCol') {
        // 删除整列
        handleDeleteCol(tdFormItemId);
      }
    }
  };

  /** 打开表格更多操作下拉菜单 */
  const openMenu = (formItemId: string, triggerEl?: HTMLElement) => {
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

  /** 关闭表格操作下拉菜单 */
  const hideMenu = () => {
    hideTableToolDropdown();
  };

  defineExpose({
    openMenu,
    hideMenu
  });
</script>

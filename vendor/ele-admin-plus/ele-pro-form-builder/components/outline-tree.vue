<!-- 大纲树列表 -->
<template>
  <OutlineList
    v-if="formItems"
    :items="formItems"
    :currentFormItemId="currentFormItemId"
    :collapseItemIds="collapseItemIds"
    :componentData="componentData"
    :itemTypeData="itemTypeData"
    @update:currentFormItemId="handleUpdateCurrentFormItemId"
    @toggleItemCollapse="handleToggleItemCollapse"
    @deleteItem="handleDeleteItem"
    @copyItem="handleCopyItem"
    @addChildren="handleAddChildren"
    @openTableTool="handleOpenTableTool"
    @updateItemChildren="handleUpdateItemChildren"
  />
  <ElEmpty
    v-if="!formItems || !formItems.length"
    :imageSize="58"
    class="ele-pro-form-builder-form-empty"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElEmpty } from 'element-plus';
  import { findTree } from '../../utils/common';
  import type {
    ProFormItemKey,
    ProFormItemProps,
    ProFormItemTypeData
  } from '../../ele-pro-form/types';
  import type {
    ComponentGroup,
    UpdateItemsResult,
    AddChildrenItemAction
  } from '../types';
  import { fixedChildTypes } from './build-core';
  import { generateCopyItemData, generateAddChildData } from './build-util';
  import OutlineList from './outline-list.vue';

  defineOptions({ name: 'OutlineTree' });

  const props = defineProps<{
    /** 全部表单项 */
    formItems?: ProFormItemProps[];
    /** 选中的表单项 */
    currentFormItemId?: ProFormItemKey;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
    /** 高级表单组件类型数据 */
    itemTypeData?: ProFormItemTypeData[];
  }>();

  const emit = defineEmits<{
    /** 更新选中的表单项事件 */
    (e: 'update:currentFormItemId', formItemId?: ProFormItemKey): void;
    /** 更新表单项数据事件 */
    (e: 'updateItems', result: UpdateItemsResult): void;
    /** 更新表单项排序事件 */
    (
      e: 'updateItemChildren',
      children: ProFormItemProps[],
      parentKey?: ProFormItemKey
    ): void;
    /** 打开表格更多操作事件 */
    (e: 'openTableTool', formItemId: string, el: HTMLElement): void;
    /** 打开子组件选择器事件 */
    (e: 'openComponentPicker', formItemId: string): void;
  }>();

  /** 折叠的表单项 */
  const collapseItemIds = ref<ProFormItemKey[]>([]);

  /** 更新选中的表单项 */
  const handleUpdateCurrentFormItemId = (itemId: ProFormItemKey) => {
    emit('update:currentFormItemId', itemId);
  };

  /** 更新表单项数据 */
  const handleUpdateItems = (result: UpdateItemsResult) => {
    emit('updateItems', result);
  };

  /** 删除表单项 */
  const handleDeleteItem = (formItemId: ProFormItemKey) => {
    handleUpdateItems({
      deleteItemIds: [formItemId],
      addItems: [],
      updateItems: []
    });
  };

  /** 复制表单项 */
  const handleCopyItem = (formItemId: ProFormItemKey) => {
    handleUpdateItems(generateCopyItemData(formItemId, props.formItems));
  };

  /** 添加子级表单项 */
  const handleAddChildren = (
    triggerItem: ProFormItemProps,
    action?: AddChildrenItemAction
  ) => {
    if (
      triggerItem.type &&
      fixedChildTypes.some((d) => d.type === triggerItem.type)
    ) {
      const result = generateAddChildData(
        triggerItem,
        void 0,
        void 0,
        action,
        props.formItems,
        void 0,
        props.componentData
      );
      handleUpdateItems(result);
    } else {
      emit('openComponentPicker', triggerItem.key as string);
    }
  };

  /** 打开表格更多操作 */
  const handleOpenTableTool = (item: ProFormItemProps, e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const triggerEl = el?.parentElement?.querySelector?.(
      '.ele-pro-form-builder-outline-item-table-tool-trigger'
    );
    emit('openTableTool', item.key as string, triggerEl as HTMLElement);
  };

  /** 更新表单项排序 */
  const handleUpdateItemChildren = (
    children: ProFormItemProps[],
    parentKey?: ProFormItemKey
  ) => {
    emit('updateItemChildren', children, parentKey);
  };

  /** 表单项折叠切换 */
  const handleToggleItemCollapse = (formItemId: string) => {
    const index = collapseItemIds.value.indexOf(formItemId);
    if (index !== -1) {
      collapseItemIds.value.splice(index, 1);
    } else {
      collapseItemIds.value.push(formItemId);
    }
  };

  /** 表单项数据更新后移除不存在的折叠数据 */
  watch(
    () => props.formItems,
    (items) => {
      for (let i = collapseItemIds.value.length - 1; i >= 0; i--) {
        if (!findTree(items, (item) => collapseItemIds.value[i] === item.key)) {
          collapseItemIds.value.splice(i, 1);
        }
      }
    },
    { deep: true }
  );
</script>

<!-- 组件库列表 -->
<template>
  <div class="ele-pro-form-builder-component-wrapper">
    <div
      v-for="(groupItem, index) in groupData"
      :key="`${index}_${groupItem.name}`"
      class="ele-pro-form-builder-component-group"
    >
      <div
        class="ele-pro-form-builder-component-group-label"
        @click="handleLabelClick"
      >
        {{ groupItem.name }}
      </div>
      <VueDraggable
        itemKey="key"
        :sort="false"
        :delay="150"
        :delayOnTouchOnly="true"
        :fallbackOnBody="true"
        :group="sortableGroup"
        :disabled="!draggable"
        :setData="() => void 0"
        :clone="handleCloneItem"
        :modelValue="groupItem.items"
        class="ele-pro-form-builder-component-list"
      >
        <template #item="{ element }">
          <div
            class="ele-pro-form-builder-component-item"
            :class="{ 'is-selected': element.type === selectedType }"
            @click="handleItemClick(element)"
          >
            <div class="ele-pro-form-builder-component-item-body">
              <div class="ele-pro-form-builder-component-item-cover">
                <component v-if="element.cover" :is="element.cover" />
              </div>
            </div>
            <div class="ele-pro-form-builder-component-item-label">
              {{ element.name }}
            </div>
          </div>
        </template>
      </VueDraggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import VueDraggable from 'vuedraggable';
  import { findTree } from '../../utils/common';
  import { sortableGroupName } from '../../ele-pro-form/util';
  import type {
    ProFormItemKey,
    ProFormItemProps,
    ProFormItemTypeData
  } from '../../ele-pro-form/types';
  import type {
    ComponentItem,
    ComponentGroup,
    UpdateItemsResult
  } from '../types';
  import { generateBuildFormItem, fixedChildTypes } from './build-core';
  /** 拖拽排序配置 */
  const sortableGroup = { name: sortableGroupName, pull: 'clone', put: false };

  defineOptions({ name: 'ComponentList' });

  const props = defineProps<{
    /** 全部表单项 */
    formItems?: ProFormItemProps[];
    /** 要添加子级的父级表单项 id */
    parentFormItemId?: ProFormItemKey;
    /** 是否可拖拽 */
    draggable?: boolean;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
    /** 高级表单组件类型数据 */
    itemTypeData?: ProFormItemTypeData[];
    /** 选中的组件类型 */
    selectedType?: string;
    /** 选中的表单项 id */
    selectedFormItemId?: ProFormItemKey;
  }>();

  const emit = defineEmits<{
    (e: 'updateItems', result: UpdateItemsResult): void;
    (e: 'itemClick', componentType: string): void;
  }>();

  /** 组件库列表数据 */
  const groupData = computed<ComponentGroup[]>(() => {
    return (props.componentData || []).map((groupItem) => {
      return {
        ...groupItem,
        items: groupItem.items
          .filter((item) => !item.hide)
          .map((d) => ({
            ...d,
            key: `proFormBuilderComponent_${d.type}`
          }))
      };
    });
  });

  /** 拖拽时生成表单项数据 */
  const handleCloneItem = (original: ComponentItem) => {
    const item = generateBuildFormItem(
      original.type,
      props.formItems,
      props.componentData,
      props.itemTypeData
    );
    return item ?? original;
  };

  /** 点击添加表单项事件 */
  const handleItemClick = (componentItem: ComponentItem) => {
    const item = generateBuildFormItem(
      componentItem.type,
      props.formItems,
      props.componentData,
      props.itemTypeData
    );
    // 添加子级
    if (props.selectedFormItemId == null) {
      const result: UpdateItemsResult = {
        addItems: [{ item, parentItemId: props.parentFormItemId }],
        updateItems: [],
        deleteItemIds: []
      };
      emit('updateItems', result);
      return;
    }
    // 修改组件类型
    const updateItems = [
      { itemId: props.selectedFormItemId, field: 'type', value: item?.type },
      { itemId: props.selectedFormItemId, field: 'props', value: item?.props },
      { itemId: props.selectedFormItemId, field: 'slots', value: item?.slots }
    ];
    const oldItem = findTree(
      props.formItems,
      (d) => d.key === props.selectedFormItemId
    );
    if (
      oldItem &&
      (fixedChildTypes.some((d) => d.type === oldItem.type) ||
        fixedChildTypes.some((d) => d.type === item?.type)) &&
      oldItem.type !== item?.type
    ) {
      updateItems.push({
        itemId: props.selectedFormItemId,
        field: 'children',
        value: item?.children
      });
    }
    emit('updateItems', { addItems: [], updateItems, deleteItemIds: [] });
  };

  /** 点击分组标题事件 */
  const handleLabelClick = (e: MouseEvent) => {
    const el = (e.currentTarget as any)?.parentElement;
    el && el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
</script>

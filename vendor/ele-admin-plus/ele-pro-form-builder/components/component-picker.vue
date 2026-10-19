<!-- 添加子级的组件选择弹窗 -->
<template>
  <EleModal
    :width="808"
    :maxable="true"
    position="center"
    title="组件库"
    :modelValue="modelValue"
    :closeOnClickModal="false"
    :destroyOnClose="true"
    :bodyStyle="{
      height: '568px',
      minHeight: '100%',
      maxHeight: '100%',
      overflow: 'auto',
      padding: 0
    }"
    modalBodyClass="ele-pro-form-builder-component-picker"
    :style="{ overflow: 'hidden' }"
    @update:modelValue="handleUpdateModelValue"
  >
    <ComponentList
      :parentFormItemId="addParentFormItemId"
      :formItems="formItems"
      :componentData="componentData"
      :itemTypeData="itemTypeData"
      :selectedType="editFormItemType"
      :selectedFormItemId="editFormItemId"
      @updateItems="handleUpdateItems"
    />
  </EleModal>
</template>

<script lang="ts" setup>
  import type {
    ProFormItemKey,
    ProFormItemProps,
    ProFormItemTypeData
  } from '../../ele-pro-form/types';
  import EleModal from '../../ele-modal/index.vue';
  import type { ComponentGroup, UpdateItemsResult } from '../types';
  import ComponentList from './component-list.vue';

  defineOptions({ name: 'ComponentPicker' });

  defineProps<{
    /** 弹窗是否打开 */
    modelValue?: boolean;
    /** 要添加子级的父级表单项 key */
    addParentFormItemId?: ProFormItemKey;
    /** 要修改组件类型的表单项 key */
    editFormItemId?: ProFormItemKey;
    /** 要修改组件类型的表单项组件类型 */
    editFormItemType?: string;
    /** 全部表单项 */
    formItems?: ProFormItemProps[];
    /** 组件库数据 */
    componentData?: ComponentGroup[];
    /** 高级表单组件类型数据 */
    itemTypeData?: ProFormItemTypeData[];
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', visible?: boolean): void;
    (e: 'updateItems', result: UpdateItemsResult): void;
  }>();

  /** 更新弹窗打开状态 */
  const handleUpdateModelValue = (visible?: boolean) => {
    emit('update:modelValue', visible);
  };

  /** 更新表单项数据 */
  const handleUpdateItems = (result: UpdateItemsResult) => {
    emit('updateItems', result);
  };
</script>

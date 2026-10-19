<!-- 字段列表 -->
<template>
  <VueDraggable
    itemKey="key"
    :modelValue="items"
    :forceFallback="true"
    :fallbackOnBody="true"
    :setData="() => void 0"
    group="CrudBuilderFieldSortGroup"
    handle=".ele-crud-builder-field-item-handle"
    class="ele-crud-builder-field"
    @update:modelValue="handleUpdateModelValue"
  >
    <template #item="{ element }">
      <div
        class="ele-crud-builder-field-item"
        :class="{
          'is-collapse':
            element.key != null &&
            collapseItemIds &&
            collapseItemIds.includes(element.key)
        }"
      >
        <FieldList
          :items="element.children || []"
          :collapseItemIds="collapseItemIds"
          :parent="element"
          @toggleItemCollapse="handleToggleItemCollapse"
          @deleteItem="handleDeleteItem"
          @copyItem="handleCopyItem"
          @editItem="handleEditItem"
          @addChildren="handleAddChildren"
          @updateItemChildren="handleUpdateItemChildren"
        />
        <div
          class="ele-crud-builder-field-item-body"
          :title="`${element.prop ?? ''} ${element.label ?? ''}`"
        >
          <ElIcon
            v-if="element.children && element.children.length"
            class="ele-crud-builder-field-item-arrow"
            @click.stop="handleToggleItemCollapse(element.key)"
          >
            <ArrowDown />
          </ElIcon>
          <div class="ele-crud-builder-field-item-content">
            <span class="ele-crud-builder-field-item-prop">
              {{ element.prop }}
            </span>
            <span
              v-if="element.label"
              class="ele-crud-builder-field-item-label"
            >
              {{ element.label }}
            </span>
          </div>
          <ElIcon
            class="ele-crud-builder-field-item-tool is-danger"
            title="删除"
            @click.stop="handleDeleteItem(element.key)"
          >
            <DeleteOutlined />
          </ElIcon>
          <ElIcon
            class="ele-crud-builder-field-item-tool"
            title="复制"
            @click.stop="handleCopyItem(element.key)"
          >
            <CopyOutlined :style="{ transform: 'scale(0.96)' }" />
          </ElIcon>
          <ElIcon
            class="ele-crud-builder-field-item-tool"
            title="修改"
            @click.stop="handleEditItem(element)"
          >
            <EditOutlined />
          </ElIcon>
          <ElIcon
            class="ele-crud-builder-field-item-tool"
            title="添加子级"
            @click.stop="handleAddChildren(element.key)"
          >
            <PlusOutlined :style="{ transform: 'scale(1.1)' }" />
          </ElIcon>
          <ElIcon
            title=""
            class="ele-crud-builder-field-item-handle"
            @click.stop=""
          >
            <DragOutlined :style="{ transform: 'scale(1.1)' }" />
          </ElIcon>
        </div>
        <div class="ele-crud-builder-field-item-border"></div>
      </div>
    </template>
  </VueDraggable>
</template>

<script lang="ts" setup>
  import VueDraggable from 'vuedraggable';
  import { ElIcon } from 'element-plus';
  import {
    ArrowDown,
    DeleteOutlined,
    CopyOutlined,
    PlusOutlined,
    DragOutlined,
    EditOutlined
  } from '../../icons/index';
  import type { CrudField } from '../../ele-crud/types';

  defineOptions({ name: 'FieldList' });

  const props = defineProps<{
    /** 字段 */
    items: CrudField[];
    /** 折叠的字段 */
    collapseItemIds?: string[];
    /** 父级数据 */
    parent?: CrudField;
  }>();

  const emit = defineEmits<{
    /** 折叠按钮点击事件 */
    (e: 'toggleItemCollapse', key: string): void;
    /** 删除按钮点击事件 */
    (e: 'deleteItem', key: string): void;
    /** 复制按钮点击事件 */
    (e: 'copyItem', key: string): void;
    /** 修改按钮点击事件 */
    (e: 'editItem', item: CrudField): void;
    /** 添加子级按钮点击事件 */
    (e: 'addChildren', parentKey: string): void;
    /** 更新字段排序事件 */
    (e: 'updateItemChildren', data: CrudField[], parentKey?: string): void;
  }>();

  /** 折叠切换 */
  const handleToggleItemCollapse = (key: string) => {
    emit('toggleItemCollapse', key);
  };

  /** 删除字段 */
  const handleDeleteItem = (key: string) => {
    emit('deleteItem', key);
  };

  /** 复制字段 */
  const handleCopyItem = (key: string) => {
    emit('copyItem', key);
  };

  /** 修改字段 */
  const handleEditItem = (item: CrudField) => {
    emit('editItem', item);
  };

  /** 添加子级字段 */
  const handleAddChildren = (parentKey: string) => {
    emit('addChildren', parentKey);
  };

  /** 更新数据排序事件 */
  const handleUpdateItemChildren = (data: CrudField[], parentKey?: string) => {
    emit('updateItemChildren', data, parentKey);
  };

  /** 更新数据排序 */
  const handleUpdateModelValue = (data: CrudField[]) => {
    if (props.parent != null && props.parent.key == null) {
      return;
    }
    handleUpdateItemChildren(data, props.parent?.key);
  };
</script>

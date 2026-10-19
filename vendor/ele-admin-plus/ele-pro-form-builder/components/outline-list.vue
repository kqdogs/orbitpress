<!-- 大纲列表 -->
<template>
  <VueDraggable
    itemKey="key"
    :modelValue="items"
    :forceFallback="true"
    :fallbackOnBody="true"
    :setData="() => void 0"
    group="ProFormBuilderOutlineSortGroup"
    handle=".ele-pro-form-builder-outline-item-handle"
    class="ele-pro-form-builder-outline"
    @update:modelValue="handleUpdateModelValue"
  >
    <template #item="{ element }">
      <div
        class="ele-pro-form-builder-outline-item"
        :class="[
          {
            'is-active':
              element.key != null &&
              currentFormItemId != null &&
              currentFormItemId === element.key
          },
          {
            'is-collapse':
              element.key != null &&
              collapseItemIds &&
              collapseItemIds.includes(element.key)
          },
          { 'is-form-item': !itemIsContainerType(element) }
        ]"
      >
        <OutlineList
          v-if="itemIsContainerType(element)"
          :items="element.children || []"
          :currentFormItemId="currentFormItemId"
          :collapseItemIds="collapseItemIds"
          :parent="element"
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
        <div
          class="ele-pro-form-builder-outline-item-body"
          :title="`${element.prop ?? ''} ${element.label ?? ''}`"
          @click="handleUpdateCurrentFormItemId(element.key)"
        >
          <ElIcon
            v-if="element.children && element.children.length"
            class="ele-pro-form-builder-outline-item-arrow"
            @click.stop="handleToggleItemCollapse(element.key)"
          >
            <ArrowDown />
          </ElIcon>
          <div class="ele-pro-form-builder-outline-item-content">
            <ComponentName
              :itemType="element.type"
              :componentData="componentData"
              class="ele-pro-form-builder-outline-item-type-tag"
            />
            <span class="ele-pro-form-builder-outline-item-prop">
              {{ element.prop }}
            </span>
            <span
              v-if="element.label"
              class="ele-pro-form-builder-outline-item-label"
            >
              {{ element.label }}
            </span>
          </div>
          <ElIcon
            v-if="!isTableChildType(element)"
            class="ele-pro-form-builder-outline-item-tool is-danger"
            title="删除"
            @click.stop="handleDeleteItem(element.key)"
          >
            <DeleteOutlined />
          </ElIcon>
          <ElIcon
            v-if="!isTableChildType(element)"
            class="ele-pro-form-builder-outline-item-tool"
            title="复制"
            @click.stop="handleCopyItem(element.key)"
          >
            <CopyOutlined />
          </ElIcon>
          <ElIcon
            v-if="element.type === 'table'"
            class="ele-pro-form-builder-outline-item-tool"
            title="新增行"
            @click.stop="handleAddChildren(element, 'addTableRow')"
          >
            <InsertRowOutlined />
          </ElIcon>
          <ElIcon
            v-if="element.type === 'table'"
            class="ele-pro-form-builder-outline-item-tool"
            title="新增列"
            @click.stop="handleAddChildren(element, 'addTableCol')"
          >
            <InsertColumnOutlined />
          </ElIcon>
          <ElIcon
            v-if="element.type === 'tableCell'"
            class="ele-pro-form-builder-outline-item-tool"
            title="更多"
            @click.stop="(e) => handleOpenTableTool(element, e)"
          >
            <AppstoreAddOutlined :style="{ transform: 'scale(1.1)' }" />
          </ElIcon>
          <ElIcon
            v-if="
              itemIsContainerType(element) &&
              element.type !== 'table' &&
              element.type !== 'tableRow'
            "
            class="ele-pro-form-builder-outline-item-tool"
            :title="
              {
                tabs: '添加选项卡',
                tabPane: '插入选项卡',
                collapse: '添加折叠面板',
                collapseItem: '插入折叠面板',
                row: '添加栅格列',
                col: '插入栅格列',
                carousel: '添加走马灯',
                carouselItem: '插入走马灯',
                descriptions: '添加描述列表',
                descriptionsItem: '插入描述列表'
              }[element.type] || '添加子级'
            "
            @click.stop="handleAddChildren(element)"
          >
            <PlusSquareDashOutlined
              v-if="
                element.type &&
                fixedChildTypes.some((d) => d.type === element.type)
              "
            />
            <PlusOutlined v-else :style="{ transform: 'scale(1.1)' }" />
          </ElIcon>
          <ElIcon
            title=""
            class="ele-pro-form-builder-outline-item-handle"
            @click.stop=""
          >
            <DragOutlined :style="{ transform: 'scale(1.1)' }" />
          </ElIcon>
          <div
            class="ele-pro-form-builder-outline-item-table-tool-trigger"
          ></div>
        </div>
        <div class="ele-pro-form-builder-outline-item-border"></div>
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
    PlusSquareDashOutlined,
    PlusOutlined,
    InsertRowOutlined,
    InsertColumnOutlined,
    AppstoreAddOutlined,
    DragOutlined
  } from '../../icons/index';
  import type {
    ProFormItemKey,
    ProFormItemProps,
    ProFormItemTypeData
  } from '../../ele-pro-form/types';
  import { isContainerType } from '../../ele-pro-form/util';
  import type { AddChildrenItemAction, ComponentGroup } from '../types';
  import { fixedChildTypes } from './build-core';
  import ComponentName from './component-name.vue';

  defineOptions({ name: 'OutlineList' });

  const props = defineProps<{
    /** 表单项 */
    items: ProFormItemProps[];
    /** 选中的表单项 */
    currentFormItemId?: ProFormItemKey;
    /** 折叠的表单项 */
    collapseItemIds?: ProFormItemKey[];
    /** 父级数据 */
    parent?: ProFormItemProps;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
    /** 高级表单组件类型数据 */
    itemTypeData?: ProFormItemTypeData[];
  }>();

  const emit = defineEmits<{
    (e: 'update:currentFormItemId', formItemId?: ProFormItemKey): void;
    /** 折叠按钮点击事件 */
    (e: 'toggleItemCollapse', formItemId: ProFormItemKey): void;
    /** 删除按钮点击事件 */
    (e: 'deleteItem', formItemId: ProFormItemKey): void;
    /** 复制按钮点击事件 */
    (e: 'copyItem', formItemId: ProFormItemKey): void;
    /** 添加子级按钮点击事件 */
    (
      e: 'addChildren',
      triggerItem: ProFormItemProps,
      action?: AddChildrenItemAction
    ): void;
    /** 更新表单项排序事件 */
    (
      e: 'updateItemChildren',
      children: ProFormItemProps[],
      parentKey?: ProFormItemKey
    ): void;
    /** 表格更多操作按钮点击事件 */
    (e: 'openTableTool', item: ProFormItemProps, event: MouseEvent): void;
  }>();

  /** 打开表格更多操作 */
  const handleOpenTableTool = (item: ProFormItemProps, e: MouseEvent) => {
    emit('openTableTool', item, e);
  };

  /** 更新选中的表单项 */
  const handleUpdateCurrentFormItemId = (itemId: ProFormItemKey) => {
    emit('update:currentFormItemId', itemId);
  };

  /** 折叠切换 */
  const handleToggleItemCollapse = (formItemId: ProFormItemKey) => {
    emit('toggleItemCollapse', formItemId);
  };

  /** 删除表单项 */
  const handleDeleteItem = (formItemId: ProFormItemKey) => {
    emit('deleteItem', formItemId);
  };

  /** 复制表单项 */
  const handleCopyItem = (formItemId: ProFormItemKey) => {
    emit('copyItem', formItemId);
  };

  /** 添加子级表单项 */
  const handleAddChildren = (
    triggerItem: ProFormItemProps,
    action?: AddChildrenItemAction
  ) => {
    emit('addChildren', triggerItem, action);
  };

  /** 更新数据排序事件 */
  const handleUpdateItemChildren = (
    children: ProFormItemProps[],
    parentKey?: ProFormItemKey
  ) => {
    emit('updateItemChildren', children, parentKey);
  };

  /** 更新数据排序 */
  const handleUpdateModelValue = (data: ProFormItemProps[]) => {
    if (props.parent != null && props.parent.key == null) {
      return;
    }
    handleUpdateItemChildren(data, props.parent?.key);
  };

  /** 判断是否是容器类型 */
  const itemIsContainerType = (item: ProFormItemProps) => {
    return isContainerType(item, props.itemTypeData);
  };

  /** 判断是否是表格子级类型 */
  const isTableChildType = (item: ProFormItemProps) => {
    if (!item.type) {
      return false;
    }
    return ['tableRow', 'tableCell'].includes(item.type);
  };
</script>

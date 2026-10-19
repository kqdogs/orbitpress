<!-- 构建容器的操作按钮 -->
<template>
  <ToolButton
    v-if="itemType && ['table', 'tableCell'].includes(itemType)"
    :buttonProps="{
      size: 'small',
      type: 'primary',
      icon: InsertRowOutlined
    }"
    :tooltip="itemType === 'tableCell' ? '插入行' : '新增行'"
    @click="handleAddTableRow"
  />
  <ToolButton
    v-if="itemType && ['table', 'tableCell'].includes(itemType)"
    :buttonProps="{
      size: 'small',
      type: 'primary',
      icon: InsertColumnOutlined
    }"
    :tooltip="itemType === 'tableCell' ? '插入列' : '新增列'"
    @click="handleAddTableCol"
  />
  <ToolButton
    v-if="
      itemType &&
      [
        'tabs',
        'tabPane',
        'collapse',
        'collapseItem',
        'row',
        'col',
        'carousel',
        'carouselItem',
        'descriptions',
        'descriptionsItem'
      ].includes(itemType)
    "
    :buttonProps="{
      size: 'small',
      type: 'primary',
      icon: PlusSquareDashOutlined
    }"
    :tooltip="
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
      }[itemType]
    "
    @click="handleAdd"
  />
  <ToolButton
    v-if="itemType !== 'tableCell'"
    :buttonProps="{
      size: 'small',
      type: 'primary',
      icon: CopyOutlined
    }"
    tooltip="复制"
    @click="handleCopy"
  />
  <ToolButton
    v-if="itemType !== 'tableCell'"
    :buttonProps="{
      size: 'small',
      type: 'danger',
      icon: DeleteOutlined
    }"
    tooltip="删除"
    @click="handleDelete"
  />
  <ToolButton
    v-if="itemType === 'tableCell'"
    :buttonProps="{
      size: 'small',
      type: 'primary',
      icon: AppstoreAddOutlined,
      style: { fontSize: '14px' }
    }"
    tooltip="更多"
    @click="handleOpenTableTool"
  />
</template>

<script lang="ts" setup>
  import {
    CopyOutlined,
    DeleteOutlined,
    PlusSquareDashOutlined,
    InsertRowOutlined,
    InsertColumnOutlined,
    AppstoreAddOutlined
  } from '../../icons/index';
  import ToolButton from './tool-button.vue';

  defineOptions({ name: 'BuilderTools' });

  defineProps<{
    /** 对应的表单项类型 */
    itemType?: string;
  }>();

  const emit = defineEmits<{
    (e: 'delete', event: MouseEvent): void;
    (e: 'copy', event: MouseEvent): void;
    (e: 'add', event: MouseEvent): void;
    (e: 'addTableRow', event: MouseEvent): void;
    (e: 'addTableCol', event: MouseEvent): void;
    (e: 'openTableTool', event: MouseEvent): void;
  }>();

  /** 删除 */
  const handleDelete = (e: MouseEvent) => {
    emit('delete', e);
  };

  /** 复制 */
  const handleCopy = (e: MouseEvent) => {
    emit('copy', e);
  };

  /** 添加 */
  const handleAdd = (e: MouseEvent) => {
    emit('add', e);
  };

  /** 表格添加行 */
  const handleAddTableRow = (e: MouseEvent) => {
    emit('addTableRow', e);
  };

  /** 表格添加列 */
  const handleAddTableCol = (e: MouseEvent) => {
    emit('addTableCol', e);
  };

  /** 打开表格更多操作 */
  const handleOpenTableTool = (e: MouseEvent) => {
    emit('openTableTool', e);
  };
</script>

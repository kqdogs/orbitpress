<!-- 网格布局 -->
<template>
  <MainContent class="ele-file-list">
    <div v-if="selectionType === 'checkbox'" class="ele-file-list-header">
      <div class="ele-file-list-selection" @click.stop="handleCheckAllChange">
        <i
          class="ele-file-list-checkbox"
          :class="[
            { 'is-checked': isCheckAll },
            { 'is-indeterminate': isIndeterminate }
          ]"
        ></i>
        <div>{{ headerText }}</div>
      </div>
    </div>
    <div class="ele-file-list-body">
      <FileGridItem
        v-for="item in data"
        :key="item.key"
        :item="item"
        :selectionType="selectionType"
        :selections="selections"
        :current="current"
        :icons="icons"
        :ctxMenuDropdownVisible="
          ctxMenuDropdownVisible && contextMenuFileItem === item
        "
        @click="handleItemClick"
        @checkChange="handleItemCheckChange"
        @contextOpen="handleItemContextOpen"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </FileGridItem>
    </div>
  </MainContent>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed } from 'vue';
  import MainContent from '../../ele-loading/components/main-content.vue';
  import FileGridItem from './file-grid-item.vue';
  import type {
    IconItem,
    FileItem,
    SelectionType,
    ContextOpenOption
  } from '../types';

  defineOptions({ name: 'FileGrid' });

  const props = defineProps({
    /** 文件数据 */
    data: Array as PropType<FileItem[]>,
    /** 后缀对应的图标 */
    icons: Array as PropType<IconItem[]>,
    /** 选择框类型 */
    selectionType: String as PropType<SelectionType>,
    /** 已选中的数据 */
    selections: Array as PropType<FileItem[]>,
    /** 单选选中数据 */
    current: Object as PropType<FileItem>,
    /** 是否是全选 */
    isCheckAll: Boolean,
    /** 是否是半选 */
    isIndeterminate: Boolean,
    /** 全选按钮文字 */
    checkAllText: String,
    /** 选中后的文字 */
    selectedText: String,
    /** 文件右键菜单是否打开 */
    ctxMenuDropdownVisible: Boolean,
    /** 当前打开的右键菜单对应的文件数据 */
    contextMenuFileItem: Object as PropType<FileItem | null>
  });

  const emit = defineEmits({
    checkAllChange: () => true,
    itemClick: (_item: FileItem) => true,
    itemCheckChange: (_item: FileItem) => true,
    itemContextOpen: (_option: ContextOpenOption) => true
  });

  /** 顶栏文本 */
  const headerText = computed<string | undefined>(() => {
    if (!props.selections || !props.selections.length) {
      return props.checkAllText;
    }
    if (!props.selectedText) {
      return '';
    }
    return props.selectedText.replace(
      /\{\s*total\s*\}/g,
      String(props.selections.length)
    );
  });

  /** 全选框点击事件 */
  const handleCheckAllChange = () => {
    emit('checkAllChange');
  };

  /** 文件点击事件 */
  const handleItemClick = (item: FileItem) => {
    emit('itemClick', item);
  };

  /** 文件复选框点击事件 */
  const handleItemCheckChange = (item: FileItem) => {
    emit('itemCheckChange', item);
  };

  /** 文件右键菜单展开事件 */
  const handleItemContextOpen = (option: ContextOpenOption) => {
    emit('itemContextOpen', option);
  };
</script>

<!-- 表格布局 -->
<template>
  <MainContent class="ele-file-list-table">
    <!-- 表头 -->
    <div class="ele-file-list-header">
      <div class="ele-file-list-item">
        <div class="ele-file-list-item-body">
          <!-- 复选框 -->
          <div
            v-if="selectionType === 'checkbox' || selectionType === 'radio'"
            class="ele-file-list-item-checkbox"
          >
            <i
              v-if="selectionType === 'checkbox'"
              class="ele-file-list-checkbox"
              :class="[
                { 'is-checked': isCheckAll },
                { 'is-indeterminate': isIndeterminate }
              ]"
              @click.stop="handleCheckAllChange"
            ></i>
          </div>
          <!-- 文件名 -->
          <div
            class="ele-file-list-item-name"
            :class="{ 'is-sortable': sortable }"
            @click="handleSortChange('name')"
          >
            <span>{{ nameText }}</span>
            <FileSort v-if="sortable" :sort="sort" :order="order" name="name" />
          </div>
          <!-- 自定义列 -->
          <div
            v-for="col in tableCols"
            :key="col.prop"
            :style="col.headerStyle || col.style"
            class="ele-file-list-item-cell"
            :class="{ 'is-sortable': col.sortable }"
            @click="handleSortChange(col.prop, col)"
          >
            <span>
              <template
                v-if="
                  col.headerSlot &&
                  !['icon', 'title', 'tool', 'contextMenu'].includes(
                    col.headerSlot
                  ) &&
                  $slots[col.headerSlot]
                "
              >
                <slot :name="col.headerSlot" :col="col"></slot>
              </template>
              <template v-else>{{ col.title }}</template>
            </span>
            <FileSort
              v-if="col.sortable"
              :sort="sort"
              :order="order"
              :name="col.prop"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="ele-file-list-body">
      <FileTableItem
        v-for="item in data"
        :key="item.key"
        :item="item"
        :selectionType="selectionType"
        :selections="selections"
        :current="current"
        :icons="icons"
        :columns="tableCols"
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
      </FileTableItem>
    </div>
  </MainContent>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { computed } from 'vue';
  import MainContent from '../../ele-loading/components/main-content.vue';
  import FileTableItem from './file-table-item.vue';
  import FileSort from './file-sort.vue';
  import type {
    IconItem,
    FileItem,
    ColumnItem,
    SelectionType,
    ContextOpenOption
  } from '../types';

  defineOptions({ name: 'FileTable' });

  const props = defineProps({
    /** 文件数据 */
    data: Array as PropType<FileItem[]>,
    /** 后缀对应的图标 */
    icons: Array as PropType<IconItem[]>,
    /** 选择框类型 */
    selectionType: String as PropType<SelectionType>,
    /** 选中数据 */
    selections: Array as PropType<FileItem[]>,
    /** 单选选中数据 */
    current: Object as PropType<FileItem>,
    /** 是否是全选 */
    isCheckAll: Boolean,
    /** 是否是半选 */
    isIndeterminate: Boolean,
    /** 文件名文字 */
    nameText: String,
    /** 文件大小文字 */
    sizeText: String,
    /** 修改时间文字 */
    timeText: String,
    /** 默认的列是否可以排序 */
    sortable: Boolean,
    /** 排序字段 */
    sort: String,
    /** 排序方式 */
    order: String,
    /** 自定义列配置 */
    columns: Array as PropType<ColumnItem[]>,
    /** 文件右键菜单是否打开 */
    ctxMenuDropdownVisible: Boolean,
    /** 当前打开的右键菜单对应的文件数据 */
    contextMenuFileItem: Object as PropType<FileItem | null>
  });

  const emit = defineEmits({
    checkAllChange: () => true,
    itemClick: (_item: FileItem) => true,
    itemCheckChange: (_item: FileItem) => true,
    itemContextOpen: (_option: ContextOpenOption) => true,
    sortChange: (_sort: string) => true
  });

  /** 列配置 */
  const tableCols = computed<ColumnItem[]>(() => {
    if (props.columns) {
      return props.columns;
    }
    const cols: ColumnItem[] = [
      {
        title: props.sizeText,
        prop: 'length',
        style: {
          width: '120px',
          flexShrink: 0
        },
        sortable: props.sortable
      },
      {
        title: props.timeText,
        prop: 'updateTime',
        style: {
          width: '180px',
          flexShrink: 0
        },
        sortable: props.sortable
      }
    ];
    return cols;
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

  /** 排序改变事件 */
  const handleSortChange = (sort: string, col?: ColumnItem) => {
    if (!col) {
      if (props.sortable) {
        emit('sortChange', sort);
      }
    } else if (col.sortable) {
      emit('sortChange', sort);
    }
  };

  /** 文件右键菜单展开事件 */
  const handleItemContextOpen = (option: ContextOpenOption) => {
    emit('itemContextOpen', option);
  };
</script>

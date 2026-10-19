<!-- 列设置 -->
<template>
  <EleTool
    ref="toolRef"
    :title="locale.columns"
    :placement="placement"
    :clickHideTooltip="true"
  >
    <EleTooltip
      trigger="click"
      placement="bottom-end"
      popperClass="ele-tool-column-popover"
      transition="el-zoom-in-top"
      :gpuAcceleration="false"
      effect="light"
      :isPopover="true"
      :popperOptions="{
        strategy: 'fixed',
        modifiers: [{ name: 'offset', options: { offset: [20, 10] } }]
      }"
    >
      <ElIcon>
        <SettingOutlined />
      </ElIcon>
      <template #body>
        <div
          class="ele-popover-body ele-tool-column"
          :class="[{ 'is-sortable': sortable }, { 'is-dragging': isDragging }]"
        >
          <div class="ele-tool-column-header">
            <div class="ele-tool-column-label">
              <ElCheckbox
                :label="locale.columnTitle"
                :modelValue="isCheckAll"
                :indeterminate="isIndeterminate"
                @update:modelValue="handleCheckAllChange"
              />
            </div>
            <div class="ele-tool-column-link" @click="handleReset">
              {{ locale.columnReset }}
            </div>
          </div>
          <ToolColumnList
            v-if="colItems.length"
            :data="colItems"
            :sortable="sortable"
            :allowFixed="allowFixed"
            @sortChange="handleSortChange"
            @checkedChange="handleCheckedChange"
            @fixedLeft="handleFixedLeft"
            @fixedRight="handleFixedRight"
            @fixedLeftTooltip="handleFixedLeftTooltip"
            @fixedRightTooltip="handleFixedRightTooltip"
            @sortStart="handleSortStart"
            @sortEnd="handleSortEnd"
          />
        </div>
      </template>
    </EleTooltip>
  </EleTool>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch } from 'vue';
  import { ElCheckbox, ElIcon } from 'element-plus';
  import { SettingOutlined } from '../../icons/index';
  import { eachTree } from '../../utils/common';
  import type { EleToolInstance, EleTooltipProps } from '../../ele-app/plus';
  import type { Columns } from '../../ele-data-table/types';
  import EleTooltip from '../../ele-tooltip/index.vue';
  import EleTool from '../../ele-tool/index.vue';
  import type { ColItem, TableLocale } from '../types';
  import {
    getCheckedColumns,
    getColsCacheKey,
    getColItems,
    getCacheCols,
    columnsSettingFilter,
    getCacheColsWidth
  } from '../util';
  import ToolColumnList from './tool-column-list.vue';

  defineOptions({ name: 'ToolColumn' });

  const props = defineProps({
    /** 提示位置 */
    placement: String as PropType<EleTooltipProps['placement']>,
    /** 表格国际化 */
    locale: {
      type: Object as PropType<TableLocale>,
      required: true
    },
    /** 列数据 */
    columns: Array as PropType<Columns>,
    /** 是否开启列拖拽排序 */
    sortable: Boolean,
    /** 是否开启开关固定列 */
    allowFixed: Boolean,
    /** 列配置缓存本地的名称 */
    cacheKey: String
  });

  const emit = defineEmits({
    'update:columns': (
      _columns: Columns,
      _tableColumns: Columns,
      _isReset: boolean
    ) => true
  });

  /** 工具按钮 */
  const toolRef = ref<EleToolInstance>(null);

  /** 列配置 */
  const colItems = ref<ColItem[]>([]);

  /** 是否全选 */
  const isCheckAll = ref<boolean>(false);

  /** 是否半选 */
  const isIndeterminate = ref<boolean>(false);

  /** 是否是拖拽排序中 */
  const isDragging = ref(false);

  /** 初始化数据 */
  const initColItems = () => {
    const { cols, checkAll, indeterminate } = getColItems(
      props.columns,
      props.locale,
      columnsSettingFilter,
      getCacheCols(getColsCacheKey(props.cacheKey))
    );
    colItems.value = cols;
    isCheckAll.value = checkAll;
    isIndeterminate.value = indeterminate;
  };

  /** 更新表格列配置 */
  const updateColumns = (isReset?: boolean) => {
    const colsWidth = getCacheColsWidth(props.cacheKey);
    const columns = getCheckedColumns(
      props.columns,
      colItems.value,
      props.sortable,
      (item) => item.hideInSetting,
      void 0,
      false,
      colsWidth
    );
    const tableColumns = getCheckedColumns(
      props.columns,
      colItems.value,
      props.sortable,
      (item) => item.hideInSetting,
      void 0,
      true,
      colsWidth
    );
    emit('update:columns', columns, tableColumns, !!isReset);
  };

  /** 缓存配置 */
  const cacheSettingCols = () => {
    if (props.cacheKey) {
      localStorage.setItem(
        getColsCacheKey(props.cacheKey),
        JSON.stringify(colItems.value)
      );
    }
  };

  /** 清除缓存配置 */
  const cleanSettingCols = () => {
    if (props.cacheKey) {
      localStorage.removeItem(getColsCacheKey(props.cacheKey));
    }
  };

  /** 选中改变 */
  const handleCheckedChange = (item: ColItem, checked: boolean) => {
    let checkAll = true;
    let indeterminate = false;
    eachTree(colItems.value, (d) => {
      if (d.uid === item.uid) {
        d.checked = checked;
      }
      if (!d.checked && checkAll) {
        checkAll = false;
      }
      if (d.checked && !indeterminate) {
        indeterminate = true;
      }
      if (d.uid === item.uid && !checkAll && indeterminate) {
        return false;
      }
    });
    isCheckAll.value = colItems.value.length > 0 && checkAll;
    isIndeterminate.value = !checkAll && indeterminate;
    cacheSettingCols();
    updateColumns();
  };

  /** 全选或取消全选 */
  const handleCheckAllChange = (checked: boolean) => {
    isCheckAll.value = checked;
    isIndeterminate.value = false;
    eachTree(colItems.value, (d) => {
      if (d.checked !== checked) {
        d.checked = checked;
      }
    });
    cacheSettingCols();
    updateColumns();
  };

  /** 拖动顺序改变 */
  const handleSortChange = (items: ColItem[], parent?: ColItem) => {
    if (!parent) {
      colItems.value = items;
    } else {
      eachTree(colItems.value, (d) => {
        if (d.uid === parent.uid) {
          d.children = items;
          return false;
        }
      });
    }
    cacheSettingCols();
    updateColumns();
  };

  /** 固定左侧 */
  const handleFixedLeft = (colItem: ColItem) => {
    eachTree(colItems.value, (d) => {
      if (d.uid === colItem.uid) {
        d.fixed = d.fixed === true || d.fixed === 'left' ? false : 'left';
        return false;
      }
    });
    cacheSettingCols();
    updateColumns();
  };

  /** 固定右侧 */
  const handleFixedRight = (colItem: ColItem) => {
    eachTree(colItems.value, (d) => {
      if (d.uid === colItem.uid) {
        d.fixed = d.fixed === 'right' ? false : 'right';
        return false;
      }
    });
    cacheSettingCols();
    updateColumns();
  };

  /** 固定左侧提示 */
  const handleFixedLeftTooltip = (el: HTMLElement) => {
    toolRef.value &&
      toolRef.value.showTooltip(props.locale.columnFixedLeft ?? '', el);
  };

  /** 固定右侧提示 */
  const handleFixedRightTooltip = (el: HTMLElement) => {
    toolRef.value &&
      toolRef.value.showTooltip(props.locale.columnFixedRight ?? '', el);
  };

  /** 重置 */
  const handleReset = () => {
    cleanSettingCols();
    initColItems();
    updateColumns(true);
  };

  /** 拖拽排序开始事件 */
  const handleSortStart = () => {
    isDragging.value = true;
  };

  /** 拖拽排序结束事件 */
  const handleSortEnd = () => {
    isDragging.value = false;
  };

  watch(
    [() => props.columns, () => props.locale],
    () => {
      initColItems();
    },
    { immediate: true, deep: true }
  );
</script>

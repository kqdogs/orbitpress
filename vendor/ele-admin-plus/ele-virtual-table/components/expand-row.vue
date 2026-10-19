<!-- 展开行 -->
<template>
  <div class="el-table-v2__row-cell ele-table-td">
    <template v-if="column && column.slot">
      <slot
        :name="column.slot"
        v-bind="{ row: rowData, column: column, $index: rowIndex }"
      ></slot>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type { DataItem, Column } from '../../ele-data-table/types';

  defineOptions({ name: 'ExpandRow' });

  defineProps({
    /** 列配置(原始配置) */
    column: Object as PropType<Column>,
    /** 行索引 */
    rowIndex: Number,
    /** 行数据(原始数据) */
    rowData: Object as PropType<DataItem>
  });
</script>

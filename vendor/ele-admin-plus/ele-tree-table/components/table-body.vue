<!-- 树表格主体 -->
<template>
  <div>
    <TableRow
      v-for="(row, rowIndex) in data"
      :key="row.key ?? rowIndex"
      :rowIndex="rowIndex"
      :hasChildren="!!(row.children && row.children.length)"
      :indexColWidth="indexColWidth"
      :level="level"
      :depth="depth"
    >
      <template #cells>
        <div
          v-for="col in columns"
          :key="col.key ?? col.prop"
          :style="col.style"
          :class="col.class"
          class="ele-tree-table-cell"
        >
          <slot
            name="bodyCell"
            :row="row"
            :rowIndex="rowIndex"
            :column="col"
            :treeLevel="level"
          >
            {{ col.prop != null ? row[col.prop] : void 0 }}
          </slot>
        </div>
      </template>
      <TableBody
        v-if="row.children && row.children.length"
        :data="row.children"
        :columns="columns"
        :level="level + 1"
        :depth="depth"
        :indexColWidth="indexColWidth"
        class="ele-tree-table-children"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </TableBody>
    </TableRow>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type { TreeTableDataItem, TreeTableColumn } from '../types';
  import TableRow from './table-row.vue';

  defineOptions({ name: 'TableBody' });

  defineProps({
    /** 数据 */
    data: {
      type: Array as PropType<TreeTableDataItem[]>,
      required: true
    },
    /** 列配置 */
    columns: {
      type: Array as PropType<TreeTableColumn[]>,
      required: true
    },
    /** 序号列宽度 */
    indexColWidth: {
      type: Number,
      required: true
    },
    /** 所处深度 */
    level: {
      type: Number,
      required: true
    },
    /** 最大深度 */
    depth: {
      type: Number,
      required: true
    }
  });
</script>

<!-- 树表格行 -->
<template>
  <div class="ele-tree-table-row" :class="{ 'is-collapse': isCollapse }">
    <div
      :style="{
        width: `${indexColWidth}px`,
        left: `${(level - 1) * indexColWidth}px`
      }"
      class="ele-tree-table-cell is-tree-index is-fixed-left"
      :class="{ 'is-fixed-left-last': depth === level }"
    >
      {{ rowIndex + 1 }}
    </div>
    <div class="ele-tree-table-row-body">
      <div class="ele-tree-table-cells">
        <div
          v-for="num in depth - level"
          :key="num"
          :style="{
            width: `${indexColWidth}px`,
            left: `${(level - 1 + num) * indexColWidth}px`,
            textAlign: hasChildren && num === 1 ? 'left' : void 0
          }"
          class="ele-tree-table-cell is-tree-index is-placeholder is-fixed-left"
          :class="{ 'is-fixed-left-last': num === depth - level }"
        >
          <div
            v-if="hasChildren && num === 1"
            class="ele-tree-table-expand"
            :class="{ 'is-collapse': isCollapse }"
            @click="handleExpandClick"
          >
            <ElIcon>
              <ArrowDown />
            </ElIcon>
          </div>
        </div>
        <slot name="cells"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowDown } from '../../icons/index';

  defineOptions({ name: 'TableRow' });

  defineProps({
    /** 行索引 */
    rowIndex: {
      type: Number,
      required: true
    },
    /** 是否有子级 */
    hasChildren: Boolean,
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

  /** 是否折叠 */
  const isCollapse = ref(false);

  /** 折叠状态切换 */
  const handleExpandClick = () => {
    isCollapse.value = !isCollapse.value;
  };
</script>

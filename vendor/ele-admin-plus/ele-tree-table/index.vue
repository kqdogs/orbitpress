<!-- 树表格 -->
<template>
  <div
    class="ele-tree-table-wrapper"
    :class="[{ 'is-ping-left': isPingLeft }, { 'is-ping-right': isPingRight }]"
  >
    <div
      ref="tableRef"
      class="ele-tree-table"
      :style="{ height }"
      @scroll="handleTableScroll"
    >
      <div class="ele-tree-table-main" :style="tableStyle">
        <div class="ele-tree-table-header" :style="headerStyle">
          <div class="ele-tree-table-row">
            <div
              v-for="num in depth"
              :key="num"
              :style="{
                width: `${indexColWidth}px`,
                left: `${(num - 1) * indexColWidth}px`
              }"
              class="ele-tree-table-cell is-tree-index is-fixed-left"
              :class="[
                { 'is-placeholder': num !== 1 },
                { 'is-fixed-left-last': num === depth }
              ]"
            >
            </div>
            <div
              v-for="col in columns || []"
              :key="col.key ?? col.prop"
              :style="col.style"
              class="ele-tree-table-cell"
              :class="col.class"
            >
              <slot name="headerCell" :column="col">{{ col.label }}</slot>
            </div>
          </div>
        </div>
        <TableBody
          v-if="data && data.length"
          :data="data"
          :columns="columns || []"
          :level="1"
          :depth="depth"
          :indexColWidth="indexColWidth"
          class="ele-tree-table-body"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </TableBody>
        <div v-else class="ele-tree-table-empty">无数据</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, nextTick, onMounted } from 'vue';
  import TableBody from './components/table-body.vue';
  import { treeTableProps } from './props';

  defineOptions({ name: 'EleTreeTable' });

  const props = defineProps(treeTableProps);

  /** 表格节点 */
  const tableRef = ref<HTMLElement | null>(null);

  /** 最大深度 */
  const depth = ref(1);

  /** 左侧列是否固定状态 */
  const isPingLeft = ref(false);

  /** 右侧列是否固定状态 */
  const isPingRight = ref(false);

  /** 检查固定列状态 */
  const checkTableScrollPing = (el?: HTMLElement | null) => {
    if (el) {
      const scrollLeft = el.scrollLeft;
      isPingLeft.value = scrollLeft > 1;
      const scrollWidth = el.scrollWidth - el.offsetWidth - 1;
      isPingRight.value = scrollWidth > 1 && scrollLeft < scrollWidth;
    }
  };

  /** 表格滚动事件 */
  const handleTableScroll = (e: MouseEvent) => {
    checkTableScrollPing(e.currentTarget as HTMLElement);
  };

  /** 获取树最大深度 */
  const getTreeDepth = (data?: Array<any>, level = 0) => {
    let maxDepth = 0;
    if (data) {
      data.forEach((row) => {
        if (row.children && row.children.length) {
          const depth = getTreeDepth(row.children, level + 1);
          maxDepth = Math.max(maxDepth, depth);
        }
      });
    }
    return maxDepth + 1;
  };

  watch(
    () => props.data,
    (data) => {
      depth.value = getTreeDepth(data);
    },
    {
      immediate: true,
      deep: true
    }
  );

  /** 更新固定列状态 */
  watch(
    () => props.columns,
    () => {
      nextTick(() => {
        checkTableScrollPing(tableRef.value);
      });
    },
    { deep: true }
  );

  onMounted(() => {
    checkTableScrollPing(tableRef.value);
  });
</script>

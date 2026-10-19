<!-- 分页 -->
<template>
  <ElPagination
    ref="paginationRef"
    :small="small"
    :size="size"
    :background="type === 'circle' ? false : background"
    :pageSize="pageSize"
    :defaultPageSize="defaultPageSize"
    :total="pageTotal"
    :pageCount="pageCount"
    :pagerCount="pagerCount"
    :currentPage="currentPage"
    :defaultCurrentPage="defaultCurrentPage"
    :layout="layout"
    :pageSizes="pageSizes"
    :popperClass="sizesPopperClass"
    :prevText="prevText"
    :prevIcon="prevIcon"
    :nextText="nextText"
    :nextIcon="nextIcon"
    :disabled="disabled"
    :teleported="teleported"
    :hideOnSinglePage="hideOnSinglePage"
    class="ele-pagination"
    :class="[{ 'is-circle': type === 'circle' }, { 'is-infinite': isInfinite }]"
    @update:currentPage="handleUpdateCurrentPage"
    @update:pageSize="handleUpdatePageSize"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElPagination>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { ElPagination } from 'element-plus';
  import type { ElPaginationInstance } from '../ele-app/el';
  import { paginationProps, paginationEmits } from './props';

  defineOptions({ name: 'ElePagination' });

  const props = defineProps(paginationProps);

  const emit = defineEmits(paginationEmits);

  /** 组件引用 */
  const paginationRef = ref<ElPaginationInstance>(null);

  /** 是否无限页数 */
  const isInfinite = computed<boolean>(() => '*' === props.total);

  /** 总条目数 */
  const pageTotal = computed<number | undefined>(() => {
    if (isInfinite.value) {
      if (props.hasNext) {
        return Number.MAX_SAFE_INTEGER;
      }
      return (props.currentPage || 1) * (props.pageSize || 10);
    }
    const num = props.total == null ? void 0 : Number(props.total);
    return num == null || isNaN(num) ? void 0 : num;
  });

  /** 每页数量选择下拉类名 */
  const sizesPopperClass = computed<string>(() => {
    const classes: string[] = ['ele-pagination-popper'];
    if (props.isFixedPopper) {
      classes.push('is-fixed');
    }
    if (typeof props.popperClass === 'string' && props.popperClass) {
      classes.push(props.popperClass);
    }
    return classes.join(' ');
  });

  /** 更新页码 */
  const handleUpdateCurrentPage = (currentPage: number) => {
    emit('update:currentPage', currentPage);
  };

  /** 更新每页数量 */
  const handleUpdatePageSize = (pageSize: number) => {
    emit('update:pageSize', pageSize);
  };

  defineExpose({
    paginationRef
  });
</script>

<!-- 排序图标 -->
<template>
  <i
    class="ele-file-list-item-sort"
    :class="[
      { 'is-asc': name === sort && 'asc' === order },
      { 'is-desc': name === sort && 'desc' === order }
    ]"
  ></i>
</template>

<script lang="ts" setup>
  defineOptions({ name: 'FileSort' });

  defineProps({
    /** 当前排序字段 */
    sort: String,
    /** 当前排序方式 */
    order: String,
    /** 排序字段名称 */
    name: {
      type: String,
      required: true
    }
  });
</script>

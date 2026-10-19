<!-- 主题设置抽屉 -->
<template>
  <div class="ele-setting-item">
    <div class="ele-setting-item-title">{{ title }}</div>
    <div class="ele-setting-item-control">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: String
  });
</script>

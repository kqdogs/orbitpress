<!-- 页面容器 -->
<template>
  <div
    class="ele-page"
    :class="[
      { 'is-plain': plain },
      { 'is-multi-card': multiCard },
      { 'is-flex-table': flexTable && flexTable !== 'auto' },
      { 'is-flex-auto-table': flexTable === 'auto' },
      { 'is-hide-footer': hideFooter }
    ]"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { pageProps } from './props';

  defineOptions({ name: 'ElePage' });

  defineProps(pageProps);
</script>

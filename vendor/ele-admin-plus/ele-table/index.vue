<!-- 静态表格 -->
<template>
  <table
    class="ele-table"
    :class="[
      { 'has-header': hasHeader },
      { 'has-footer': hasFooter },
      { 'is-stripe': stripe },
      { 'is-border': border },
      { 'is-large': size === 'large' },
      { 'is-small': size === 'small' },
      { 'is-print-skin': printSkin }
    ]"
  >
    <slot></slot>
  </table>
</template>

<script lang="ts" setup>
  import { tableProps } from './props';

  defineOptions({ name: 'EleTable' });

  defineProps(tableProps);
</script>

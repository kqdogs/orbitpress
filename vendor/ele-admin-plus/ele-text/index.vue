<!-- 文本 -->
<template>
  <component
    :is="tag || 'div'"
    class="ele-text"
    :class="[
      { 'is-heading': type === 'heading' },
      { 'is-regular': type === 'regular' },
      { 'is-secondary': type === 'secondary' },
      { 'is-placeholder': type === 'placeholder' },
      { 'is-primary': type === 'primary' },
      { 'is-success': type === 'success' },
      { 'is-warning': type === 'warning' },
      { 'is-danger': type === 'danger' },
      { 'is-info': type === 'info' },
      { 'is-xs': size === 'xs' },
      { 'is-sm': size === 'sm' },
      { 'is-base': size === 'base' },
      { 'is-md': size === 'md' },
      { 'is-lg': size === 'lg' },
      { 'is-xl': size === 'xl' },
      { 'is-xxl': size === 'xxl' },
      { 'is-xxxl': size === 'xxxl' },
      { 'is-delete': deleted },
      { 'is-underline': underline },
      { 'is-strong': strong },
      { 'is-italic': italic },
      { 'is-icon': !!icon }
    ]"
  >
    <ElIcon v-if="icon" v-bind="iconProps || {}">
      <component :is="icon" :style="iconStyle" />
    </ElIcon>
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
  import { ElIcon } from 'element-plus';
  import { textProps } from './props';

  defineOptions({ name: 'EleText' });

  defineProps(textProps);
</script>

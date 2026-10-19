<!-- 状态仪表盘 -->
<template>
  <div
    class="ele-dashboard"
    :class="[
      { 'is-success': type === 'success' },
      { 'is-warning': type === 'warning' },
      { 'is-danger': type === 'danger' }
    ]"
    :style="rootStyle"
  >
    <div class="ele-dashboard-inner">
      <slot></slot>
    </div>
    <div class="ele-dashboard-outer">
      <div class="ele-dashboard-bg"></div>
      <div class="ele-dashboard-bg"></div>
      <div class="ele-dashboard-bg"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type { StyleValue } from '../ele-app/types';
  import { dashboardProps } from './props';

  defineOptions({ name: 'EleDashboard' });

  const props = defineProps(dashboardProps);

  /** 样式 */
  const rootStyle = computed<StyleValue>(() => {
    const style: StyleValue = {};
    if (props.size != null) {
      if (typeof props.size === 'number') {
        style.width = `${props.size}px`;
        style.height = `${props.size}px`;
      } else {
        style.width = props.size;
        style.height = props.size;
      }
    }
    if (props.space != null) {
      style['--ele-dashboard-space'] =
        typeof props.space === 'number' ? `${props.space}px` : props.space;
    }
    if (props.color) {
      style['--ele-dashboard-color'] = props.color;
    }
    return style;
  });
</script>

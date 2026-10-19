<!-- 状态点 -->
<template>
  <span
    class="ele-dot"
    :class="[
      { 'is-success': 'success' === type },
      { 'is-warning': 'warning' === type },
      { 'is-danger': 'danger' === type },
      { 'is-info': 'info' === type },
      { 'is-ripple': ripple }
    ]"
  >
    <span
      class="ele-dot-status"
      :style="{ width: size, height: size, background: color }"
    >
      <span
        class="ele-dot-ripple"
        :style="{ width: size, height: size, background: color }"
      ></span>
    </span>
    <span v-if="text" class="ele-dot-text">{{ text }}</span>
  </span>
</template>

<script lang="ts" setup>
  import { dotProps } from './props';

  defineOptions({ name: 'EleDot' });

  defineProps(dotProps);
</script>

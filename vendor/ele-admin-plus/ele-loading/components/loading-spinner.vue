<template>
  <div
    :style="spinnerStyle"
    class="ele-loading-spinner"
    :class="[
      { 'ele-loading': plain },
      { 'ele-loading-blur': blur },
      { 'ele-loading-small': size === 'small' },
      { 'ele-loading-large': size === 'large' },
      { 'ele-loading-spinner-show': loading }
    ]"
  >
    <slot name="spinner">
      <div class="ele-loading-dot">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </slot>
    <div v-if="text" class="ele-loading-text" :style="textStyle">
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { loadingProps } from '../props';

  defineOptions({ name: 'LoadingSpinner' });

  defineProps({
    ...loadingProps,
    plain: {
      type: Boolean,
      default: true
    }
  });
</script>

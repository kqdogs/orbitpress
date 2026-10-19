<template>
  <div
    class="ele-icon-border-color-base"
    :style="{
      display: 'flex',
      alignItems: 'center',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      boxSizing: 'border-box',
      padding: size === 'sm' ? '0 8px 0 4px' : '0 12px 0 6px',
      height: size === 'sm' ? '9px' : '15px'
    }"
  >
    <IconCheckbox
      v-if="multiple"
      :size="size === 'sm' ? 'xs' : 'sm'"
      :checked="checkboxChecked"
      :style="{ margin: '0' }"
    />
    <slot>
      <IconSkeleton
        :size="size === 'sm' ? 'xs' : 'sm'"
        :style="{
          flex: 1,
          marginLeft: size === 'sm' ? '4px' : '6px',
          ...(skeletonStyle || {})
        }"
      />
      <IconSkeleton
        :size="size === 'sm' ? 'xs' : 'sm'"
        :style="{
          flex: 1,
          marginLeft: size === 'sm' ? '8px' : '12px',
          ...(skeletonStyle || {})
        }"
      />
      <IconSkeleton
        :size="size === 'sm' ? 'xs' : 'sm'"
        :style="{
          flex: 1,
          marginLeft: size === 'sm' ? '8px' : '12px',
          ...(skeletonStyle || {})
        }"
      />
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import { IconSkeleton, IconCheckbox } from './index';

  defineProps<{
    size?: 'sm' | 'md';
    multiple?: boolean;
    checkboxChecked?: boolean;
    skeletonStyle?: CSSProperties;
  }>();
</script>

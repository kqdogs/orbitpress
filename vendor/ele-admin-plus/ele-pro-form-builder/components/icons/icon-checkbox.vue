<template>
  <div
    class="ele-icon-border-color-base"
    :class="[
      { 'ele-icon-bg-primary': checked },
      { 'ele-icon-bg-fill-blank': !checked }
    ]"
    :style="{
      flexShrink: 0,
      width: { lg: '14px', md: '12px', sm: '8px', xs: '6px' }[size || 'md'],
      height: { lg: '14px', md: '12px', sm: '8px', xs: '6px' }[size || 'md'],
      borderRadius: size === 'sm' || size === 'xs' ? '2px' : '3px',
      borderStyle: checked ? void 0 : 'solid',
      borderWidth: checked ? void 0 : '1px',
      marginRight: { xs: '2px', sm: '4px', md: '8px', lg: '8px' }[size || 'md'],
      boxSizing: 'border-box'
    }"
  >
    <SvgIcon
      v-if="checked"
      name="CheckOutlined"
      :iconStyle="{
        'stroke-width': 8,
        transform: {
          lg: 'scale(0.88)',
          md: 'scale(0.76)',
          sm: 'scale(0.68)',
          xs: 'scale(0.68)'
        }[size || 'md']
      }"
      :style="{
        color: '#fff',
        fontSize: '12px',
        width: '100%',
        height: '100%'
      }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { SvgIcon } from './index';

  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg';
    checked?: boolean;
  }>();
</script>

<template>
  <div
    class="ele-icon-color-secondary"
    :class="[
      { 'ele-icon-border-color-primary': checked },
      { 'ele-icon-border-color-base': !checked },
      { 'ele-icon-bg-white': checked }
    ]"
    :style="{
      width: { xxl: '22px', xl: '18px', lg: '14px', md: '12px', sm: '8px' }[
        size || 'md'
      ],
      height: { xxl: '22px', xl: '18px', lg: '14px', md: '12px', sm: '8px' }[
        size || 'md'
      ],
      lineHeight: {
        xxl: '22px',
        xl: '18px',
        lg: '14px',
        md: '12px',
        sm: '8px'
      }[size || 'md'],
      borderRadius: '50%',
      textAlign: 'center',
      borderStyle: 'solid',
      borderWidth: checked ? (size === 'sm' ? '3px' : '4px') : '1px',
      fontSize: '12px',
      boxSizing: 'border-box',
      marginRight:
        size === 'lg' || size === 'xl' ? '8px' : size === 'sm' ? '4px' : '6px'
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    checked?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  }>();
</script>

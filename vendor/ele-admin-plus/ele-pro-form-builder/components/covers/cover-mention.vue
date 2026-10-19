<template>
  <div>
    <IconInput size="sm">
      <div
        class="ele-icon-color-primary"
        :style="{
          fontSize: '13px',
          fontWeight: 'bold',
          lineHeight: '13px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color emoji',
          margin: '0 2px 0 -2px',
          transform: 'translateY(-1px)'
        }"
      >
        @
      </div>
      <IconSkeleton size="sm" :style="{ width: '50%' }" />
      <IconCursor />
    </IconInput>
    <IconPanel size="sm">
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
    </IconPanel>
  </div>
</template>

<script lang="ts" setup>
  import {
    IconInput,
    IconSkeleton,
    IconCursor,
    IconPanel
  } from '../icons/index';
</script>

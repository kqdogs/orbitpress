<template>
  <div>
    <div :style="{ display: 'flex', paddingRight: '12px' }">
      <div
        v-for="index in 3"
        :key="index"
        class="ele-icon-border-color-base"
        :style="{
          flex: 1,
          height: '12px',
          borderTopLeftRadius: '3px',
          borderTopRightRadius: '3px',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderBottom: 'none',
          marginRight: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }"
      >
        <IconSkeleton size="xs" :style="{ width: '68%' }" />
      </div>
    </div>
    <div
      class="ele-icon-border-color-base"
      :style="{
        height: '42px',
        borderStyle: 'solid',
        borderWidth: '1px',
        padding: '8px 6px 0 6px',
        boxSizing: 'border-box'
      }"
    >
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '6px', width: '50%' }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton } from '../icons/index';
</script>

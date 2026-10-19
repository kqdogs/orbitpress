<template>
  <div
    class="ele-icon-border-color-base"
    :style="{
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: size === 'sm' ? '2px' : '4px'
    }"
  >
    <IconTableRow
      :size="size"
      :multiple="multiple"
      class="ele-icon-bg-fill"
      :style="{ borderRadius: size === 'sm' ? '2px 2px 0 0' : '4px 4px 0 0' }"
    >
      <div
        :style="{ flex: 1, marginLeft: size === 'sm' ? '4px' : '6px' }"
      ></div>
      <div
        class="ele-icon-border-color-base"
        :style="{
          flex: 1,
          height: size === 'sm' ? '4px' : '8px',
          borderLeftStyle: 'solid',
          borderLeftWidth: '1px',
          borderRightStyle: 'solid',
          borderRightWidth: '1px'
        }"
      ></div>
      <div :style="{ flex: 1 }"></div>
    </IconTableRow>
    <IconTableRow :size="size" :multiple="multiple" :checkboxChecked="true" />
    <IconTableRow :size="size" :multiple="multiple" />
    <IconTableRow
      :size="size"
      :multiple="multiple"
      :style="{ border: 'none' }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { IconTableRow } from './index';

  defineProps<{
    size?: 'sm' | 'md';
    multiple?: boolean;
  }>();
</script>

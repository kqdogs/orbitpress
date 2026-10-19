<template>
  <div
    :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }"
  >
    <div
      class="ele-icon-bg-fill-light"
      :style="{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }"
    >
      <div
        class="ele-icon-border-color-text-light"
        :style="{
          width: '8px',
          borderTopStyle: 'solid',
          borderTopWidth: '2px'
        }"
      ></div>
    </div>
    <div
      class="ele-icon-color-base"
      :style="{ padding: '0 8px', fontSize: '16px', lineHeight: 1 }"
    >
      999
    </div>
    <SvgIcon
      name="PlusOutlined"
      color="secondary"
      class="ele-icon-bg-fill-light"
      :style="{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        fontSize: '12px'
      }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { SvgIcon } from '../icons/index';
</script>

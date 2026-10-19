<template>
  <div :style="{ maxWidth: '92%', margin: '0 auto' }">
    <div
      class="ele-icon-border-color-base"
      :style="{
        display: 'flex',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '4px',
        padding: '4px 6px'
      }"
    >
      <SvgIcon name="ExclamationCircleFilled" size="sm" />
      <IconSkeleton size="sm" :style="{ flex: 1, margin: '0 2px 0 4px' }" />
      <SvgIcon
        name="CloseOutlined"
        size="sm"
        color="placeholder"
        :style="{ transform: 'scale(0.8)' }"
      />
    </div>
    <div
      class="ele-icon-border-color-base"
      :style="{
        display: 'flex',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '4px',
        padding: '4px 6px',
        marginTop: '8px'
      }"
    >
      <SvgIcon name="CheckCircleFilled" size="sm" color="success" />
      <IconSkeleton size="sm" :style="{ flex: 1, margin: '0 2px 0 4px' }" />
      <SvgIcon
        name="CloseOutlined"
        size="sm"
        color="placeholder"
        :style="{ transform: 'scale(0.8)' }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton, SvgIcon } from '../icons/index';
</script>

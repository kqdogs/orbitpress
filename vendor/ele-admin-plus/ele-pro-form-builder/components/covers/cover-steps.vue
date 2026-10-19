<template>
  <div>
    <div :style="{ display: 'flex', position: 'relative' }">
      <IconRadio
        size="xl"
        class="ele-icon-bg-primary9"
        :style="{
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }"
      >
        <SvgIcon name="CheckOutlined" size="sm" />
      </IconRadio>
      <div :style="{ flex: 1, paddingTop: '3px' }">
        <IconSkeleton size="sm" />
        <IconSkeleton size="xs" :style="{ marginTop: '4px', width: '60%' }" />
      </div>
      <div
        class="ele-icon-border-color-primary"
        :style="{
          borderLeftStyle: 'solid',
          borderLeftWidth: '1px',
          height: '6px',
          position: 'absolute',
          top: '19px',
          left: '9px'
        }"
      ></div>
    </div>
    <div :style="{ display: 'flex', marginTop: '8px', position: 'relative' }">
      <IconRadio
        size="xl"
        class="ele-icon-bg-primary"
        :style="{ color: '#fff', border: 'none' }"
      >
        2
      </IconRadio>
      <div :style="{ flex: 1, paddingTop: '3px' }">
        <IconSkeleton size="sm" />
        <IconSkeleton size="xs" :style="{ marginTop: '4px', width: '60%' }" />
      </div>
      <div
        class="ele-icon-border-color-base"
        :style="{
          borderLeftStyle: 'solid',
          borderLeftWidth: '1px',
          height: '6px',
          position: 'absolute',
          top: '19px',
          left: '9px'
        }"
      ></div>
    </div>
    <div :style="{ display: 'flex', marginTop: '8px' }">
      <IconRadio
        size="xl"
        class="ele-icon-bg-fill-lighter"
        :style="{ border: 'none' }"
      >
        3
      </IconRadio>
      <div :style="{ flex: 1, paddingTop: '3px' }">
        <IconSkeleton size="sm" />
        <IconSkeleton size="xs" :style="{ marginTop: '4px', width: '60%' }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton, IconRadio, SvgIcon } from '../icons/index';
</script>

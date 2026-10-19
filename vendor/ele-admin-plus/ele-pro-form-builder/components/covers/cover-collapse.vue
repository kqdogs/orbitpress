<template>
  <div :style="{ display: 'flex', flexDirection: 'column' }">
    <div
      v-for="index in 2"
      :key="index"
      class="ele-icon-border-color-base"
      :style="{
        marginTop: index === 1 ? void 0 : '6px',
        borderRadius: '3px',
        borderStyle: 'solid',
        borderWidth: '1px'
      }"
    >
      <div
        class="ele-icon-border-color-base"
        :style="{
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingLeft: '6px',
          paddingRight: '2px',
          borderBottomStyle: index === 1 ? 'solid' : void 0,
          borderBottomWidth: index === 1 ? '1px' : void 0
        }"
      >
        <IconSkeleton
          size="xs"
          :style="{ width: '50%', margin: '0 auto 0 0' }"
        />
        <SvgIcon
          v-if="index === 1"
          name="ArrowDown"
          size="sm"
          :style="{ transform: 'scale(0.8)' }"
        />
        <SvgIcon
          v-else
          name="ArrowRight"
          size="sm"
          color="placeholder"
          :style="{ transform: 'scale(0.8)' }"
        />
      </div>
      <div v-if="index === 1" :style="{ padding: '6px' }">
        <IconSkeleton size="xs" />
        <IconSkeleton size="xs" :style="{ marginTop: '4px', width: '50%' }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { SvgIcon, IconSkeleton } from '../icons/index';
</script>

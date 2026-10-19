<template>
  <div>
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <SvgIcon
        name="ArrowLeft"
        color="placeholder"
        class="ele-icon-border-color-base"
        :style="{
          width: '10px',
          height: '10px',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '50%',
          fontSize: '12px'
        }"
        :iconStyle="{ transform: 'scale(0.8)' }"
      />
      <div
        class="ele-icon-border-color-base"
        :style="{
          flex: 1,
          height: '40px',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '3px',
          margin: '0 3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }"
      >
        <IconImage size="sm" />
      </div>
      <SvgIcon
        name="ArrowRight"
        color="placeholder"
        class="ele-icon-border-color-base"
        :style="{
          width: '10px',
          height: '10px',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '50%',
          fontSize: '12px'
        }"
        :iconStyle="{ transform: 'scale(0.8)' }"
      />
    </div>
    <div
      :style="{ display: 'flex', justifyContent: 'center', marginTop: '4px' }"
    >
      <IconSkeleton
        v-for="index in 3"
        :key="index"
        :color="index === 1 ? 'primary' : void 0"
        :style="{ width: '8px', height: '2px', margin: '0 3px' }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { SvgIcon, IconSkeleton, IconImage } from '../icons/index';
</script>

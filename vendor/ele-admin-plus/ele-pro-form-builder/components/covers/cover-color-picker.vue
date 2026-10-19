<template>
  <IconInput
    :style="{
      height: 'auto',
      padding: '6px',
      maxWidth: '52px',
      margin: '0 auto'
    }"
  >
    <div
      :style="{
        width: '18px',
        height: '18px',
        borderRadius: '3px',
        background:
          'conic-gradient(from 90deg at 50% 50%, rgb(255, 0, 0) -19.41deg, rgb(255, 0, 0) 18.76deg, rgb(255, 138, 0) 59.32deg, rgb(255, 230, 0) 99.87deg, rgb(20, 255, 0) 141.65deg, rgb(0, 163, 255) 177.72deg, rgb(5, 0, 255) 220.23deg, rgb(173, 0, 255) 260.13deg, rgb(255, 0, 199) 300.69deg, rgb(255, 0, 0) 340.59deg, rgb(255, 0, 0) 378.76deg)'
      }"
    ></div>
    <SvgIcon name="ArrowDown" size="sm" :style="{ margin: '0 0 0 auto' }" />
  </IconInput>
</template>

<script lang="ts" setup>
  import { IconInput, SvgIcon } from '../icons/index';
</script>

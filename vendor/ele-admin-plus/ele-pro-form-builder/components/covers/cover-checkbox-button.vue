<template>
  <div
    :style="{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      width: '150px',
      maxWidth: '100%'
    }"
  >
    <IconRadioButton
      size="sm"
      :type="1"
      :checked="true"
      :style="{ borderRight: '1px solid #fff' }"
    />
    <IconRadioButton size="sm" :type="2" :checked="true" />
    <IconRadioButton size="sm" :type="3" />
  </div>
</template>

<script lang="ts" setup>
  import { IconRadioButton } from '../icons/index';
</script>

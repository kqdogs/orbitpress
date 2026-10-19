<template>
  <div :style="{ width: '62px', margin: '0 auto' }">
    <IconCard size="sm" :checked="true" />
    <IconCard size="sm" :checked="true" :style="{ marginTop: '4px' }" />
    <IconCard size="sm" :style="{ marginTop: '4px' }" />
  </div>
</template>

<script lang="ts" setup>
  import { IconCard } from '../icons/index';
</script>

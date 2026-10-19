<template>
  <slot></slot>
  <EleTooltip
    v-if="tooltipVirtualRef"
    :persistent="false"
    v-bind="tooltipProps"
    ref="tooltipRef"
    :virtualTriggering="true"
    :virtualRef="tooltipVirtualRef"
  />
</template>

<script lang="ts" setup>
  import EleTooltip from '../ele-tooltip/index.vue';
  import { useTooltipProvider } from './util';

  defineOptions({ name: 'EleTooltipProvider' });

  const {
    tooltipRef,
    tooltipVirtualRef,
    tooltipProps,
    showTooltip,
    removeTooltip
  } = useTooltipProvider();

  defineExpose({
    showTooltip,
    removeTooltip,
    tooltipRef
  });
</script>

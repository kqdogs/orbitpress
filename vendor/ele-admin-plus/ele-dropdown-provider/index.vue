<template>
  <slot></slot>
  <EleDropdown
    v-if="dropdownVirtualRef"
    :persistent="false"
    v-bind="dropdownProps"
    ref="dropdownRef"
    componentType="pro"
    :virtualTriggering="true"
    :virtualRef="dropdownVirtualRef"
    :disabled="!dropdownItems.length"
    :items="dropdownItems"
  />
</template>

<script lang="ts" setup>
  import EleDropdown from '../ele-dropdown/index.vue';
  import { useDropdownProvider } from './util';

  defineOptions({ name: 'EleDropdownProvider' });

  const {
    dropdownRef,
    dropdownVirtualRef,
    dropdownItems,
    dropdownProps,
    openDropdown
  } = useDropdownProvider();

  defineExpose({
    dropdownRef,
    openDropdown
  });
</script>

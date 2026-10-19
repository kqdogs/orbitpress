<template>
  <slot></slot>
  <ElePopconfirm
    v-if="popconfirmVirtualRef"
    :width="200"
    :persistent="false"
    placement="top-end"
    v-bind="popconfirmProps"
    ref="popconfirmRef"
    :virtualTriggering="true"
    :virtualRef="popconfirmVirtualRef"
  />
</template>

<script lang="ts" setup>
  import ElePopconfirm from '../ele-popconfirm/index.vue';
  import { usePopconfirmProvider } from './util';

  defineOptions({ name: 'ElePopconfirmProvider' });

  const {
    popconfirmRef,
    popconfirmVirtualRef,
    popconfirmProps,
    openPopconfirm
  } = usePopconfirmProvider();

  defineExpose({
    popconfirmRef,
    openPopconfirm
  });
</script>

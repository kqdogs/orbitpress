<template>
  <span>{{ typeName }}</span>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type { ComponentGroup } from '../types';
  import { getComponentItemByType } from './build-core';

  defineOptions({ name: 'ComponentName' });

  const props = defineProps<{
    /** 表单项组件类型 */
    itemType?: string;
    /** 组件库数据 */
    componentData?: ComponentGroup[];
  }>();

  /** 组件类型名称 */
  const typeName = computed<string | undefined>(() => {
    const type = props.itemType;
    return getComponentItemByType(type, props.componentData)?.name ?? type;
  });
</script>

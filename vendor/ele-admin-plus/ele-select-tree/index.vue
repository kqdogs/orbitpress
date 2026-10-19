<!-- 树下拉 -->
<template>
  <ElTreeSelect
    v-bind="omit($props, ['data'])"
    ref="treeSelectRef"
    :data="optionData"
    @update:modelValue="emitMethods['update:modelValue']"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElTreeSelect>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElTreeSelect } from 'element-plus';
  import type { ElTreeSelectInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents, useProOptions } from '../utils/hook';
  import type { SelectTreeDataItem } from './types';
  import { selectTreeProps, selectTreeEmits } from './props';

  defineOptions({ name: 'EleSelectTree' });

  const props = defineProps(selectTreeProps);

  const emit = defineEmits(selectTreeEmits);

  const { emitMethods } = useComponentEvents(selectTreeEmits, emit);
  const { optionData, reloadOptions } = useProOptions<SelectTreeDataItem>(
    props,
    'data'
  );

  /** 组件引用 */
  const treeSelectRef = ref<ElTreeSelectInstance>(null);

  defineExpose({
    reloadOptions,
    treeSelectRef
  });
</script>

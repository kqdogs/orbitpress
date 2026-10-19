<!-- 穿梭框 -->
<template>
  <ElTransfer
    v-bind="omit($props, ['data'])"
    ref="transferRef"
    :data="optionData"
    @change="emitMethods['change']"
    @update:modelValue="emitMethods['update:modelValue']"
    @left-check-change="emitMethods['left-check-change']"
    @right-check-change="emitMethods['right-check-change']"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElTransfer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElTransfer } from 'element-plus';
  import type { ElTransferInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents, useProOptions } from '../utils/hook';
  import type { TransferDataItem } from './types';
  import { transferProps, transferEmits } from './props';

  defineOptions({ name: 'EleTransfer' });

  const props = defineProps(transferProps);

  const emit = defineEmits(transferEmits);

  const { emitMethods } = useComponentEvents(transferEmits, emit);
  const { optionData, reloadOptions } = useProOptions<TransferDataItem>(
    props,
    'data'
  );

  /** 组件引用 */
  const transferRef = ref<ElTransferInstance>(null);

  defineExpose({
    reloadOptions,
    transferRef
  });
</script>

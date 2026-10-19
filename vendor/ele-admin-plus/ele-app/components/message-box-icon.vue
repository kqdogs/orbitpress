<template>
  <div class="ele-message-box-icon" v-show="type || icon">
    <component v-if="icon" :is="icon" />
    <CheckCircleFilled v-else-if="type === 'success'" />
    <ExclamationCircleFilled v-else-if="type === 'warning'" />
    <CloseCircleFilled v-else-if="type === 'error'" />
    <InfoCircleFilled v-else-if="type === 'info'" />
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { onBeforeUnmount, onMounted, getCurrentInstance } from 'vue';
  import {
    InfoCircleFilled,
    CheckCircleFilled,
    ExclamationCircleFilled,
    CloseCircleFilled
  } from '../../icons/index';
  import type { ElMessageBoxOptions } from '../el';

  defineOptions({ name: 'MessageBoxIcon' });

  const props = defineProps({
    /** 类型 */
    type: String as PropType<ElMessageBoxOptions['type']>,
    /** 图标 */
    icon: [String, Object, Function] as PropType<ElMessageBoxOptions['icon']>,
    /** 标识id */
    boxId: String
  });

  const emit = defineEmits({
    boxDestroy: (_boxId?: string) => true,
    boxMounted: (_: { boxId?: string; doClose?: () => void }) => true
  });

  const ins: any = getCurrentInstance?.();

  onBeforeUnmount(() => {
    emit('boxDestroy', props.boxId);
  });

  onMounted(() => {
    emit('boxMounted', {
      boxId: props.boxId,
      doClose: ins?.ctx?.$root?.doClose
    });
  });
</script>

<!-- 步骤条 -->
<template>
  <ElSteps
    v-bind="omit($props, ['items', 'type'])"
    ref="stepsRef"
    class="ele-steps"
    :class="{ 'is-inline': direction === 'horizontal' && type === 'inline' }"
  >
    <ElStep v-for="(item, index) in optionData" :key="index" v-bind="item">
      <template
        v-for="name in Object.keys($slots).filter((k) => 'default' !== k)"
        #[name]
      >
        <slot :name="name" :index="index" :item="item"></slot>
      </template>
    </ElStep>
  </ElSteps>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElSteps, ElStep } from 'element-plus';
  import type { ElStepInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useProOptions } from '../utils/hook';
  import type { StepItem } from './types';
  import { stepsProps } from './props';

  defineOptions({ name: 'EleSteps' });

  const props = defineProps(stepsProps);

  const { optionData, reloadOptions } = useProOptions<StepItem>(props, 'items');

  /** 组件引用 */
  const stepsRef = ref<ElStepInstance>(null);

  defineExpose({
    reloadOptions,
    stepsRef
  });
</script>

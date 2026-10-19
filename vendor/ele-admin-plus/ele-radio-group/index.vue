<!-- 单选 -->
<template>
  <ElRadioGroup
    v-bind="omit($props, ['type', 'options'])"
    ref="radioGroupRef"
    @update:modelValue="emitMethods['update:modelValue']"
    @change="emitMethods['change']"
  >
    <template v-for="option in optionData" :key="option.value">
      <ElRadioButton
        v-if="type === 'button'"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
        :name="option.name"
      />
      <ElRadio
        v-else
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
        :border="option.border"
        :name="option.name"
      />
    </template>
    <template
      v-for="name in Object.keys($slots).filter((k) => 'default' !== k)"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElRadioGroup>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElRadioGroup, ElRadio, ElRadioButton } from 'element-plus';
  import type { ElRadioGroupInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents, useProOptions } from '../utils/hook';
  import type { RadioOption } from './types';
  import { radioGroupProps, radioGroupEmits } from './props';

  defineOptions({ name: 'EleRadioGroup' });

  const props = defineProps(radioGroupProps);

  const emit = defineEmits(radioGroupEmits);

  const { emitMethods } = useComponentEvents(radioGroupEmits, emit);
  const { optionData, reloadOptions } = useProOptions<RadioOption>(props);

  /** 组件引用 */
  const radioGroupRef = ref<ElRadioGroupInstance>(null);

  defineExpose({
    reloadOptions,
    radioGroupRef
  });
</script>

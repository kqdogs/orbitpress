<!-- 多选 -->
<template>
  <ElCheckboxGroup
    v-bind="omit($props, ['type', 'options'])"
    ref="checkboxGroupRef"
    @update:modelValue="emitMethods['update:modelValue']"
    @change="emitMethods['change']"
  >
    <template v-for="option in optionData" :key="option.value">
      <ElCheckboxButton
        v-if="type === 'button'"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
        :name="option.name"
      />
      <ElCheckbox
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
  </ElCheckboxGroup>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElCheckboxGroup, ElCheckbox, ElCheckboxButton } from 'element-plus';
  import type { ElCheckboxGroupInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents, useProOptions } from '../utils/hook';
  import type { CheckboxOption } from './types';
  import { checkboxGroupProps, checkboxGroupEmits } from './props';

  defineOptions({ name: 'EleCheckboxGroup' });

  const props = defineProps(checkboxGroupProps);

  const emit = defineEmits(checkboxGroupEmits);

  const { emitMethods } = useComponentEvents(checkboxGroupEmits, emit);
  const { optionData, reloadOptions } = useProOptions<CheckboxOption>(props);

  /** 组件引用 */
  const checkboxGroupRef = ref<ElCheckboxGroupInstance>(null);

  defineExpose({
    reloadOptions,
    checkboxGroupRef
  });
</script>

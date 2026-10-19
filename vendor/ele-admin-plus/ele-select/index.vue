<!-- 下拉 -->
<template>
  <ElSelect
    v-bind="omit($props, ['options'])"
    ref="selectRef"
    @update:modelValue="emitMethods['update:modelValue']"
    @change="emitMethods['change']"
    @remove-tag="emitMethods['remove-tag']"
    @clear="emitMethods['clear']"
    @visible-change="emitMethods['visible-change']"
    @focus="emitMethods['focus']"
    @blur="emitMethods['blur']"
  >
    <template v-for="option in optionData" :key="option.value">
      <ElOptionGroup v-if="option.children" :label="option.label">
        <ElOption
          v-for="childOption in option.children"
          :key="childOption.value"
          :label="childOption.label"
          :value="childOption.value"
          :disabled="childOption.disabled"
        />
      </ElOptionGroup>
      <ElOption
        v-else
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </template>
    <template
      v-for="name in Object.keys($slots).filter((k) => 'default' !== k)"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </ElSelect>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ElSelect, ElOptionGroup, ElOption } from 'element-plus';
  import type { ElSelectInstance } from '../ele-app/el';
  import { omit } from '../utils/common';
  import { useComponentEvents, useProOptions } from '../utils/hook';
  import type { SelectOption } from './types';
  import { selectProps, selectEmits } from './props';

  defineOptions({ name: 'EleSelect' });

  const props = defineProps(selectProps);

  const emit = defineEmits(selectEmits);

  const { emitMethods } = useComponentEvents(selectEmits, emit);

  const { optionData, reloadOptions } = useProOptions<SelectOption>(props);

  /** 组件引用 */
  const selectRef = ref<ElSelectInstance>(null);

  defineExpose({
    reloadOptions,
    selectRef
  });
</script>

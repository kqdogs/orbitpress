<template>
  <div class="ele-cron-panel-content">
    <ElRadioGroup v-model="type">
      <ElRadio value="every" :label="lang.yearEvery" />
      <ElRadio value="range" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.yearRangeStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="start"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.yearRange }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="end"
              :min="endMin"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.yearRangeEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio value="interval" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.yearIntervalStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStart"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.yearInterval }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStep"
              :min="1"
              :max="intervalStepMax"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.yearIntervalEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio
        value="specified"
        class="ele-cron-panel-item-wrapper ele-cron-panel-options-wrapper"
      >
        <div>{{ lang.yearSpecified }}</div>
        <div class="ele-cron-panel-options">
          <ElCheckboxGroup v-model="selections">
            <template v-for="item in maxValue + 1" :key="item">
              <ElCheckbox
                v-if="item - 1 >= minValue"
                :value="item - 1"
                :label="item - 1"
              />
            </template>
          </ElCheckboxGroup>
        </div>
      </ElRadio>
      <ElRadio value="unset" :label="lang.yearUnset" />
    </ElRadioGroup>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { watch } from 'vue';
  import {
    ElRadioGroup,
    ElRadio,
    ElInputNumber,
    ElCheckboxGroup,
    ElCheckbox
  } from 'element-plus';
  import { useCron } from '../util';
  import type { CronPanelLocale } from '../types';
  const minValue = 2024;
  const maxValue = 2054;

  const props = defineProps({
    /** year */
    modelValue: String,
    /** 国际化 */
    lang: {
      type: Object as PropType<CronPanelLocale>,
      required: true
    }
  });

  const emit = defineEmits({
    'update:modelValue': (_year?: string) => true
  });

  const {
    type,
    start,
    end,
    endMin,
    intervalStart,
    intervalStep,
    intervalStepMax,
    selections,
    getValue,
    parseValue
  } = useCron(minValue, maxValue, 'unset');

  /** 更新值 */
  const updateModelValue = (day?: string) => {
    emit('update:modelValue', day);
  };

  /** 同步值 */
  watch(
    [type, start, end, intervalStart, intervalStep, selections],
    () => {
      if (type.value === 'unset') {
        updateModelValue('');
        return;
      }
      updateModelValue(getValue());
    },
    { deep: true, immediate: true }
  );

  watch(
    () => props.modelValue,
    (year) => {
      if (year == null || year === '' || year === '?') {
        type.value = 'unset';
        return;
      }
      parseValue(year);
    },
    { immediate: true }
  );
</script>

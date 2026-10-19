<template>
  <div class="ele-cron-panel-content">
    <ElRadioGroup v-model="type">
      <ElRadio value="every" :label="lang.monthEvery" />
      <ElRadio value="range" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.monthRangeStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="start"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.monthRange }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="end"
              :min="endMin"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.monthRangeEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio value="interval" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.monthIntervalStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStart"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.monthInterval }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStep"
              :min="1"
              :max="intervalStepMax"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.monthIntervalEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio
        value="specified"
        class="ele-cron-panel-item-wrapper ele-cron-panel-options-wrapper"
      >
        <div>{{ lang.monthSpecified }}</div>
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
  const minValue = 1;
  const maxValue = 12;

  const props = defineProps({
    /** month */
    modelValue: String,
    /** 国际化 */
    lang: {
      type: Object as PropType<CronPanelLocale>,
      required: true
    }
  });

  const emit = defineEmits({
    'update:modelValue': (_month?: string) => true
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
  } = useCron(minValue, maxValue);

  /** 更新值 */
  const updateModelValue = (day?: string) => {
    emit('update:modelValue', day);
  };

  /** 同步值 */
  watch(
    [type, start, end, intervalStart, intervalStep, selections],
    () => {
      updateModelValue(getValue());
    },
    { deep: true, immediate: true }
  );

  watch(
    () => props.modelValue,
    (month) => {
      parseValue(month);
    },
    { immediate: true }
  );
</script>

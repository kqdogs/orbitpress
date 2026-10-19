<template>
  <div class="ele-cron-panel-content">
    <ElRadioGroup v-model="type">
      <ElRadio value="every" :label="lang.secondEvery" />
      <ElRadio value="range" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.secondRangeStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="start"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.secondRange }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="end"
              :min="endMin"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.secondRangeEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio value="interval" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.secondIntervalStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStart"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.secondInterval }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStep"
              :min="1"
              :max="intervalStepMax"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.secondIntervalEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio
        value="specified"
        class="ele-cron-panel-item-wrapper ele-cron-panel-options-wrapper"
      >
        <div>{{ lang.secondSpecified }}</div>
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
  const minValue = 0;
  const maxValue = 59;

  const props = defineProps({
    /** second */
    modelValue: String,
    /** 国际化 */
    lang: {
      type: Object as PropType<CronPanelLocale>,
      required: true
    }
  });

  const emit = defineEmits({
    'update:modelValue': (_second?: string) => true
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
    (second) => {
      parseValue(second);
    },
    { immediate: true }
  );
</script>

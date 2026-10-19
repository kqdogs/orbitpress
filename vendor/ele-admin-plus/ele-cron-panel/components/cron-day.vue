<template>
  <div class="ele-cron-panel-content">
    <ElRadioGroup v-model="type">
      <ElRadio value="every" :label="lang.dayEvery" />
      <ElRadio value="range" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.dayRangeStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="start"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.dayRange }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="end"
              :min="endMin"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.dayRangeEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio value="interval" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.dayIntervalStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStart"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.dayInterval }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStep"
              :min="1"
              :max="intervalStepMax"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.dayIntervalEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio
        value="specified"
        class="ele-cron-panel-item-wrapper ele-cron-panel-options-wrapper"
      >
        <div>{{ lang.daySpecified }}</div>
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
      <ElRadio value="workday" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.dayWorkday }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="workday"
              :min="minValue"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.dayWorkdayText }}</div>
        </div>
      </ElRadio>
      <ElRadio value="last" :label="lang.dayLast" />
      <ElRadio value="unset" :label="lang.dayUnset" />
    </ElRadioGroup>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch } from 'vue';
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
  const maxValue = 31;

  const props = defineProps({
    /** day */
    modelValue: String,
    /** 国际化 */
    lang: {
      type: Object as PropType<CronPanelLocale>,
      required: true
    }
  });

  const emit = defineEmits({
    'update:modelValue': (_day?: string) => true
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

  /** 工作日 */
  const workday = ref(1);

  /** 更新值 */
  const updateModelValue = (day?: string) => {
    emit('update:modelValue', day);
  };

  /** 同步值 */
  watch(
    [type, start, end, intervalStart, intervalStep, selections, workday],
    () => {
      if (type.value === 'workday') {
        updateModelValue(`${workday.value}W`);
        return;
      }
      if (type.value === 'last') {
        updateModelValue('L');
        return;
      }
      if (type.value === 'unset') {
        updateModelValue('?');
        return;
      }
      updateModelValue(getValue());
    },
    { deep: true, immediate: true }
  );

  watch(
    () => props.modelValue,
    (day) => {
      if (day != null && day.endsWith('W')) {
        type.value = 'workday';
        workday.value = Number(day.slice(0, -1));
        return;
      }
      if (day === 'L') {
        type.value = 'last';
        return;
      }
      if (day === '?') {
        type.value = 'unset';
        return;
      }
      parseValue(day);
    },
    { immediate: true }
  );
</script>

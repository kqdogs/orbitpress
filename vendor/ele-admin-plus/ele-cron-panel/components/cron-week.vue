<template>
  <div class="ele-cron-panel-content">
    <ElRadioGroup v-model="type">
      <ElRadio value="every" :label="lang.weekEvery" />
      <ElRadio value="range" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.weekRangeStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="start"
              :min="minValue"
              :max="maxValue - 1"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.weekRange }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="end"
              :min="endMin"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
        </div>
      </ElRadio>
      <ElRadio value="interval" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.weekIntervalStart }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStart"
              :min="minValue"
              :max="4"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.weekInterval }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="intervalStep"
              :min="minValue"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
          <div>&emsp;{{ lang.weekIntervalEnd }}</div>
        </div>
      </ElRadio>
      <ElRadio
        value="specified"
        class="ele-cron-panel-item-wrapper ele-cron-panel-options-wrapper"
      >
        <div>{{ lang.weekSpecified }}</div>
        <div class="ele-cron-panel-options">
          <ElCheckboxGroup v-model="selections">
            <template v-for="item in maxValue + 1" :key="item">
              <ElCheckbox
                v-if="item - 1 >= minValue"
                :value="item - 1"
                :label="weekNames[item - 1 - 1]"
                class="ele-cron-panel-item-input"
              />
            </template>
          </ElCheckboxGroup>
        </div>
      </ElRadio>
      <ElRadio value="last" class="ele-cron-panel-item-wrapper">
        <div class="ele-cron-panel-item">
          <div>{{ lang.weekLast }}&emsp;</div>
          <div class="ele-cron-panel-item-input">
            <ElInputNumber
              v-model="lastWeek"
              :min="minValue"
              :max="maxValue"
              placeholder=""
              controlsPosition="right"
            />
          </div>
        </div>
      </ElRadio>
      <ElRadio value="unset" :label="lang.weekUnset" />
    </ElRadioGroup>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, computed, watch } from 'vue';
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
  const maxValue = 7;

  const props = defineProps({
    /** week */
    modelValue: String,
    /** 国际化 */
    lang: {
      type: Object as PropType<CronPanelLocale>,
      required: true
    }
  });

  const emit = defineEmits({
    'update:modelValue': (_week?: string) => true
  });

  const {
    type,
    start,
    end,
    endMin,
    intervalStart,
    intervalStep,
    selections,
    getValue,
    parseValue
  } = useCron(minValue, maxValue, 'unset');

  /** 最后一个星期几 */
  const lastWeek = ref(1);

  /** 星期名称 */
  const weekNames = computed(() => {
    return [
      props.lang.weekName1,
      props.lang.weekName2,
      props.lang.weekName3,
      props.lang.weekName4,
      props.lang.weekName5,
      props.lang.weekName6,
      props.lang.weekName7
    ];
  });

  /** 更新值 */
  const updateModelValue = (day?: string) => {
    emit('update:modelValue', day);
  };

  /** 同步值 */
  watch(
    [type, start, end, intervalStart, intervalStep, selections],
    () => {
      if (type.value === 'last') {
        updateModelValue(`${lastWeek.value}L`);
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
    (week) => {
      if (week != null && week.endsWith('L')) {
        type.value = 'last';
        lastWeek.value = Number(week.slice(0, -1));
        return;
      }
      if (week === '?') {
        type.value = 'unset';
        return;
      }
      parseValue(week);
    },
    { immediate: true }
  );
</script>

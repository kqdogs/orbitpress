<template>
  <div class="ele-cron-panel">
    <div class="ele-cron-panel-main">
      <EleTabs
        :addable="true"
        type="border-card"
        :items="tabItems"
        v-model="tabActive"
        @tab-add="openCronList"
      >
        <template #second>
          <CronSecond v-model="second" :lang="lang" />
        </template>
        <template #minute>
          <CronMinute v-model="minute" :lang="lang" />
        </template>
        <template #hour>
          <CronHour v-model="hour" :lang="lang" />
        </template>
        <template #day>
          <CronDay v-model="day" :lang="lang" />
        </template>
        <template #month>
          <CronMonth v-model="month" :lang="lang" />
        </template>
        <template #week>
          <CronWeek v-model="week" :lang="lang" />
        </template>
        <template #year>
          <CronYear v-model="year" :lang="lang" />
        </template>
        <template #add-icon>
          <div>{{ lang.common }}</div>
        </template>
      </EleTabs>
    </div>
    <div class="ele-cron-panel-extra">
      <div class="ele-cron-panel-extra-item">
        <div class="ele-cron-panel-extra-header">{{ lang.result }}</div>
        <div class="ele-cron-panel-extra-body">
          <div class="ele-cron-panel-result">
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultSecond }}
              </div>
              <div class="ele-cron-panel-result-text">{{ second }}</div>
            </div>
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultMinute }}
              </div>
              <div class="ele-cron-panel-result-text">{{ minute }}</div>
            </div>
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultHour }}
              </div>
              <div class="ele-cron-panel-result-text">{{ hour }}</div>
            </div>
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultDay }}
              </div>
              <div class="ele-cron-panel-result-text">{{ day }}</div>
            </div>
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultMonth }}
              </div>
              <div class="ele-cron-panel-result-text">{{ month }}</div>
            </div>
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultWeek }}
              </div>
              <div class="ele-cron-panel-result-text">{{ week }}</div>
            </div>
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultYear }}
              </div>
              <div class="ele-cron-panel-result-text">{{ year }}</div>
            </div>
          </div>
          <div class="ele-cron-panel-result">
            <div class="ele-cron-panel-result-item">
              <div class="ele-cron-panel-result-title">
                {{ lang.resultName }}
              </div>
              <div
                class="ele-cron-panel-result-text ele-cron-panel-result-value"
              >
                {{ modelValue }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ele-cron-panel-extra-item">
        <div class="ele-cron-panel-extra-header">{{ lang.resultTest }}</div>
        <div class="ele-cron-panel-extra-body">
          <ul class="ele-cron-panel-test">
            <li
              v-for="item in resultItems"
              :key="item"
              class="ele-cron-panel-test-item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 常用列表 -->
    <div
      class="ele-cron-panel-list-mask"
      :class="{ 'is-show': cronListVisible }"
      @click="hideCronList"
    >
      <div class="ele-cron-panel-list-wrapper" @click.stop="">
        <div
          v-for="item in cronList"
          :key="item.cron"
          class="ele-cron-panel-list-item"
          @click="handleItemClick(item)"
        >
          <div class="ele-cron-panel-list-item-value">{{ item.cron }}</div>
          <div class="ele-cron-panel-list-item-label">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useLocale } from '../ele-config-provider/receiver';
  import type { TabPaneItem } from '../ele-tabs/types';
  import EleTabs from '../ele-tabs/index.vue';
  import CronSecond from './components/cron-second.vue';
  import CronMinute from './components/cron-minute.vue';
  import CronHour from './components/cron-hour.vue';
  import CronDay from './components/cron-day.vue';
  import CronMonth from './components/cron-month.vue';
  import CronWeek from './components/cron-week.vue';
  import CronYear from './components/cron-year.vue';
  import { getResultItems } from './util';
  import { cronPanelProps, cronPanelEmits } from './props';

  defineOptions({ name: 'EleCronPanel' });

  const props = defineProps(cronPanelProps);

  const emit = defineEmits(cronPanelEmits);

  const { lang } = useLocale('cronPanel', props);

  /** 秒 */
  const second = ref('*');

  /** 分 */
  const minute = ref('*');

  /** 时 */
  const hour = ref('*');

  /** 日 */
  const day = ref('*');

  /** 月 */
  const month = ref('*');

  /** 星期 */
  const week = ref('?');

  /** 年 */
  const year = ref('');

  /** 最近 5 次运行时间 */
  const resultItems = ref<string[]>([]);

  /** 选项卡选中 */
  const tabActive = ref('second');

  /** 选项卡页签 */
  const tabItems = computed<TabPaneItem[]>(() => {
    return [
      { name: 'second', label: lang.value.second },
      { name: 'minute', label: lang.value.minute },
      { name: 'hour', label: lang.value.hour },
      { name: 'day', label: lang.value.day },
      { name: 'month', label: lang.value.month },
      { name: 'week', label: lang.value.week },
      { name: 'year', label: lang.value.year }
    ];
  });

  /** 更新绑定值 */
  const updateModelValue = (value?: string) => {
    if (props.modelValue !== value) {
      emit('update:modelValue', value);
    }
  };

  /** 更新计算 */
  const updateCron = () => {
    const values = [
      second.value,
      minute.value,
      hour.value,
      day.value,
      month.value,
      week.value
    ];
    if (year.value != null && year.value !== '') {
      values.push(year.value);
    }
    const cron = values.join(' ');
    updateModelValue(cron);
    return cron;
  };

  /** 更新同步值 */
  const updatePanel = (cron) => {
    if (!cron) {
      tabActive.value = 'second';
      second.value = '*';
      minute.value = '*';
      hour.value = '*';
      day.value = '*';
      month.value = '*';
      week.value = '?';
      year.value = '';
      const str = updateCron();
      resultItems.value = getResultItems(
        str,
        lang.value.resultNoData,
        lang.value.resultNoMore
      );
      return;
    }
    const [s, m, h, d, m2, w, y] = cron.split(' ');
    second.value = s;
    minute.value = m;
    hour.value = h;
    day.value = d;
    month.value = m2;
    week.value = w;
    year.value = y || '';
    resultItems.value = getResultItems(
      cron,
      lang.value.resultNoData,
      lang.value.resultNoMore
    );
  };

  /** 数据修正 */
  watch(hour, (h) => {
    if (h !== '*' && second.value === '*') {
      second.value = '0';
    }
    if (h !== '*' && minute.value === '*') {
      minute.value = '0';
    }
  });

  watch(day, (d) => {
    if (d !== '?' && week.value !== '?') {
      week.value = '?';
    }
  });

  watch(week, (w) => {
    if (w !== '?' && day.value !== '?') {
      day.value = '?';
    }
  });

  /** 拼接 cron 表达式 */
  watch([second, minute, hour, day, month, week, year], () => {
    updateCron();
  });

  /** 同步数据 */
  watch(
    () => props.modelValue,
    (cron) => {
      updatePanel(cron);
    }
  );

  watch(lang, () => {
    resultItems.value = getResultItems(
      props.modelValue,
      lang.value.resultNoData,
      lang.value.resultNoMore
    );
  });

  /** 是否显示常用列表 */
  const cronListVisible = ref(false);

  /** 常用列表数据 */
  const cronList = computed(() => {
    return [
      { cron: '0 * * * * ?', label: lang.value.common01 },
      { cron: '0 0 * * * ?', label: lang.value.common02 },
      { cron: '0 0/30 * * * ?', label: lang.value.common03 },
      { cron: '0 0/30 8-9 * * ?', label: lang.value.common04 },
      { cron: '0 0 0 * * ?', label: lang.value.common05 },
      { cron: '0 30 8 * * ?', label: lang.value.common06 },
      { cron: '0 0 8,14,19 * * ?', label: lang.value.common07 },
      { cron: '0 0 0 1 * ?', label: lang.value.common08 },
      { cron: '0 0 2 1 * ?', label: lang.value.common09 },
      { cron: '0 30 8 15 * ?', label: lang.value.common10 },
      { cron: '0 0 0 L * ?', label: lang.value.common11 },
      { cron: '0 30 8 L * ?', label: lang.value.common12 },
      { cron: '0 30 8 ? * 6L', label: lang.value.common13 },
      { cron: '0 0 0 ? * 1', label: lang.value.common14 },
      { cron: '0 0 8 ? * 2-4', label: lang.value.common15 },
      { cron: '0 0 0 1 10 ? 2025-2028', label: lang.value.common16 }
    ];
  });

  /** 常用选择 */
  const handleItemClick = (item: any) => {
    hideCronList();
    updateModelValue(item.cron);
  };

  /** 打开常用列表 */
  const openCronList = () => {
    cronListVisible.value = true;
  };

  /** 关闭常用列表 */
  const hideCronList = () => {
    cronListVisible.value = false;
  };

  defineExpose({ hideCronList });

  /** 初始化 */
  if (props.modelValue) {
    updatePanel(props.modelValue);
  } else {
    updateCron();
  }
</script>

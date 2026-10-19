<template>
  <div class="ele-admin-iframe-wrap">
    <template v-if="!transitionName">
      <template v-for="item in data" :key="item.id">
        <iframe
          v-if="!item.refresh"
          :data-id="item.id"
          :src="item.src"
          v-show="active === item.id"
          class="ele-admin-iframe"
        ></iframe>
      </template>
    </template>
    <TransitionGroup
      v-else
      :appear="true"
      :name="transitionName"
      @afterLeave="handleLeave()"
    >
      <template v-for="item in data" :key="item.id">
        <iframe
          v-if="!item.refresh"
          :data-id="item.id"
          :src="item.src"
          v-show="active === item.id"
          class="ele-admin-iframe"
        ></iframe>
      </template>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, computed, watch, nextTick } from 'vue';
  import { useTimer } from '../../utils/hook';
  import type { TabItem, IframeItem } from '../types';
  import { getIframeSrc } from '../util';

  defineOptions({ name: 'IframeGroup' });

  const props = defineProps({
    /** 是否支持内嵌缓存 */
    keepAlive: Boolean,
    /** 内嵌切换动画 */
    transitionName: String,
    /** 内嵌进入动画延迟时间 */
    transitionDelay: Number,
    /** 页签数据 */
    tabData: {
      type: Array as PropType<TabItem[]>,
      required: true
    },
    /** 页签选中 */
    tabActive: String
  });

  const [startActiveTimer, stopActiveTimer] = useTimer();

  /** 内嵌数据 */
  const data = computed<IframeItem[]>(() => {
    const list: IframeItem[] = [];
    props.tabData.forEach((t) => {
      const isAlive = t.meta?.keepAlive !== false;
      if (t.key && t.meta?.iframe && isAlive) {
        const src = getIframeSrc(t.fullPath, t.meta.iframe);
        list.push({ id: t.key, src, refresh: t.refresh });
      }
    });
    return list.sort((a, b) => (a.id === b.id ? 0 : a.id > b.id ? 1 : -1));
  });

  /** 内嵌选中 */
  const dataActive = computed(() => {
    if (
      !props.tabActive ||
      !data.value.length ||
      !data.value.some((d) => d.id === props.tabActive)
    ) {
      return;
    }
    return props.tabActive;
  });

  /** 当前显示 */
  const active = ref<string | null | undefined>(dataActive.value);

  /** 离开动画结束事件 */
  const handleLeave = (delay?: number) => {
    if (!dataActive.value) {
      active.value = null;
      return;
    }
    if (!delay) {
      active.value = dataActive.value;
      return;
    }
    startActiveTimer(() => {
      nextTick(() => {
        active.value = dataActive.value;
      });
    }, delay);
  };

  watch(dataActive, () => {
    stopActiveTimer();
    if (active.value == null) {
      handleLeave(props.transitionName ? props.transitionDelay : void 0);
    } else if (!props.transitionName) {
      handleLeave();
    } else {
      active.value = null;
    }
  });
</script>

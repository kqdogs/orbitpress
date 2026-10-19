<!-- 标签栏 -->
<template>
  <div class="ele-tab-bar" :class="{ 'is-plain': type === 'plain' }">
    <div class="ele-tab-nav">
      <div
        v-for="item in items"
        :key="item.value"
        :style="itemStyle"
        class="ele-tab-item"
        :class="{ 'is-active': item.value === modelValue }"
        @click="handleItemClick(item)"
      >
        <slot name="label" :label="item.label" :item="item">
          {{ item.label }}
        </slot>
      </div>
    </div>
    <slot name="extra"></slot>
  </div>
</template>

<script lang="ts" setup>
  import type { TabBarItem } from './types';
  import { tabBarProps, tabBarEmits } from './props';

  defineOptions({ name: 'EleTabBar' });

  const props = defineProps(tabBarProps);

  const emit = defineEmits(tabBarEmits);

  /** 标签项点击事件 */
  const handleItemClick = (item: TabBarItem) => {
    if (props.modelValue !== item.value) {
      emit('update:modelValue', item.value);
      emit('change', item.value);
    }
  };
</script>

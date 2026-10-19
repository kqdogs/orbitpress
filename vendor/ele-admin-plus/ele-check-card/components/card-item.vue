<template>
  <div
    class="ele-check-card"
    :class="[
      { 'is-bordered': bordered },
      { 'is-checked': checked },
      { 'is-disabled': disabled }
    ]"
  >
    <slot :item="item" :checked="checked" :disabled="disabled"></slot>
    <div v-if="arrow" class="ele-check-card-arrow" :style="arrowStyle"></div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import type { StyleValue } from '../../ele-app/types';
  import type { CheckCardItem } from '../types';

  defineOptions({ name: 'CardItem' });

  defineProps({
    /** 数据 */
    item: Object as PropType<CheckCardItem>,
    /** 是否选中 */
    checked: Boolean,
    /** 是否禁用 */
    disabled: Boolean,
    /** 是否显示边框 */
    bordered: Boolean,
    /** 是否需要选中箭头 */
    arrow: Boolean,
    /** 选中箭头样式 */
    arrowStyle: Object as PropType<StyleValue>
  });
</script>

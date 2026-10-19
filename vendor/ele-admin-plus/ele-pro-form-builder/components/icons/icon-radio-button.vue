<template>
  <IconButton
    :size="size"
    :type="checked ? 'primary' : 'bordered'"
    :style="buttonStyle"
  />
</template>

<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';
  import { IconButton } from './index';

  const props = defineProps<{
    size?: 'sm' | 'md';
    /** 是否选中 */
    checked?: boolean;
    /** 类型(1第一个, 2中间, 3最后一个) */
    type?: number;
  }>();

  /** 样式 */
  const buttonStyle = computed(() => {
    const style: CSSProperties = { flex: 1 };
    if (props.type !== 1) {
      style.borderLeftWidth = 0;
    }
    if (props.type === 1 || props.type === 2) {
      style.borderTopRightRadius = 0;
      style.borderBottomRightRadius = 0;
    }
    if (props.type === 3 || props.type === 2) {
      style.borderTopLeftRadius = 0;
      style.borderBottomLeftRadius = 0;
    }
    return style;
  });
</script>

<template>
  <div
    :style="{ height: contentHeight }"
  >
    <slot v-bind="slotProps"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useSvgOption } from '../../ele-qr-code-svg/util';

  defineOptions({ name: 'MainContent' });

  const props = defineProps({
    /** 内容高度 */
    wrapHeight: [String, Number]
  });

  /** 内容样式 */
  const contentHeight = computed<string | undefined>(() => {
    if (props.wrapHeight != null && typeof props.wrapHeight === 'number') {
      return `${props.wrapHeight}px`;
    }
    return props.wrapHeight;
  });

  // 保留插槽配置，移除经弹窗容器 Teleport 的全屏品牌水印。
  const { svgProps: slotProps } = useSvgOption();
</script>

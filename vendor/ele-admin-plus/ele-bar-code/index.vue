<!-- 条形码 -->
<template>
  <component
    ref="rootRef"
    :is="tag"
    :style="value ? void 0 : { display: 'none' }"
  />
</template>

<script lang="ts" setup>
  import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
  import JsBarCode from 'jsbarcode';
  import type { JsBarCodeInstance } from './types';
  import { barCodeProps } from './props';

  defineOptions({ name: 'EleBarCode' });

  const props = defineProps(barCodeProps);

  /** 根节点 */
  const rootRef = ref<HTMLElement | null>(null);

  /** 实例 */
  let instance: JsBarCodeInstance | null = null;

  /** 渲染 */
  const render = () => {
    if (!props.value || !rootRef.value) {
      return;
    }
    try {
      instance = new JsBarCode(rootRef.value, props.value, props.options);
    } catch (e) {
      console.error(e);
    }
  };

  /** 获取实例 */
  const getInstance = () => {
    return instance;
  };

  watch(
    () => props.value,
    () => {
      render();
    }
  );

  watch(
    () => props.options,
    () => {
      render();
    },
    { deep: true }
  );

  watch(
    () => props.tag,
    () => {
      nextTick(() => {
        render();
      });
    }
  );

  onMounted(() => {
    render();
  });

  onBeforeUnmount(() => {
    instance = null;
  });

  defineExpose({
    instance,
    getInstance
  });
</script>

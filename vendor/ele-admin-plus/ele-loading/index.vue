<!-- 加载组件 -->
<template>
  <LoadingSpinner
    v-if="plain"
    v-bind="$attrs"
    :loading="loading"
    :text="text"
    :blur="blur"
    :size="size"
    :spinnerStyle="spinnerStyle"
    :textStyle="textStyle"
    :plain="true"
  >
    <slot v-if="$slots.spinner" name="spinner"></slot>
  </LoadingSpinner>
  <ReceiverView
    v-else
    v-bind="$attrs"
    v-loading="isCircle && loading"
    :element-loading-text="isCircle ? text : void 0"
    :element-loading-background="isCircle ? background : void 0"
    :element-loading-spinner="isCircle ? spinner : void 0"
    :element-loading-svg-view-box="isCircle ? svgViewBox : void 0"
    class="ele-loading"
    :class="{ 'ele-loading-show': loading }"
  >
    <slot></slot>
    <LoadingSpinner
      v-if="!isCircle"
      :loading="loading"
      :text="text"
      :blur="blur"
      :size="size"
      :spinnerStyle="spinnerStyle"
      :textStyle="textStyle"
      :plain="false"
    >
      <slot v-if="$slots.spinner" name="spinner"></slot>
    </LoadingSpinner>
  </ReceiverView>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { vLoading } from 'element-plus';
  import ReceiverView from '../ele-config-provider/components/receiver-view';
  import LoadingSpinner from './components/loading-spinner.vue';
  import { loadingProps } from './props';

  defineOptions({ name: 'EleLoading', inheritAttrs: false });

  const props = defineProps(loadingProps);

  /** 是否是圆形加载器 */
  const isCircle = computed(() => {
    return props.type === 'circle';
  });
</script>

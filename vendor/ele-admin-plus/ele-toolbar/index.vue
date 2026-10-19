<!-- 表头工具栏 -->
<template>
  <div
    class="ele-toolbar"
    :class="[
      { 'is-default': 'plain' !== theme },
      { 'is-plain': 'plain' === theme }
    ]"
  >
    <div v-if="title || subtitle" class="ele-toolbar-title" :style="titleStyle">
      <EleText v-if="title" type="heading" v-bind="titleProps || {}">
        {{ title }}
      </EleText>
      <EleText v-if="subtitle" size="xs" v-bind="subtitleProps || {}">
        {{ subtitle }}
      </EleText>
    </div>
    <div class="ele-toolbar-body" :style="bodyStyle">
      <slot></slot>
    </div>
    <div class="ele-toolbar-tools" :style="toolsStyle">
      <slot name="tools"></slot>
    </div>
    <EleTooltip
      trigger="hover"
      placement="top"
      :persistent="false"
      :content="tooltipContent"
      v-bind="tooltipProps || {}"
      :virtualTriggering="true"
      :virtualRef="virtualRef"
      ref="tooltipRef"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref, provide, shallowReactive } from 'vue';
  import type { EleTooltipInstance, EleTooltipProps } from '../ele-app/plus';
  import EleTooltip from '../ele-tooltip/index.vue';
  import EleText from '../ele-text/index.vue';
  import type { ToolbarProvide } from './types';
  import { toolbarProps, TOOLBAR_KEY } from './props';

  defineOptions({ name: 'EleToolbar' });

  defineProps(toolbarProps);

  /** 提示组件 */
  const tooltipRef = ref<EleTooltipInstance>(null);

  /** 提示目标 */
  const virtualRef = ref<any>();

  /** 提示文本 */
  const tooltipContent = ref<string>('');

  /** 提示属性 */
  const tooltipProps: Ref<EleTooltipProps> = ref<EleTooltipProps>({});

  /** 显示提示 */
  const showTooltip = (
    text?: string,
    el?: HTMLElement,
    options?: EleTooltipProps
  ) => {
    virtualRef.value = el;
    tooltipContent.value = text ?? '';
    tooltipProps.value = options || {};
  };

  /** 关闭提示 */
  const hideTooltip = () => {
    tooltipRef.value && tooltipRef.value.hide();
  };

  /** 注入打开提示的方法 */
  const toolbarProvide = shallowReactive<ToolbarProvide>({
    showTooltip,
    hideTooltip
  });
  provide<ToolbarProvide>(TOOLBAR_KEY, toolbarProvide);

  defineExpose({
    tooltipRef,
    showTooltip,
    hideTooltip
  });
</script>

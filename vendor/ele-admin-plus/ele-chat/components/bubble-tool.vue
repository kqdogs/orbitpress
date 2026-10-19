<!-- 消息气泡底部按钮 -->
<template>
  <div
    ref="toolRef"
    class="ele-chat-bubble-tool"
    :class="{ 'is-disabled': disabled, 'is-text': type === 'text' }"
    @click="handleClick"
    @mouseover="handleMouseover"
  >
    <slot name="prefix"></slot>
    <ElIcon v-if="icon" v-bind="iconProps || {}">
      <component :is="icon" :style="iconStyle" />
    </ElIcon>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, inject, onBeforeUnmount } from 'vue';
  import { ElIcon } from 'element-plus';
  import type { StyleValues, UserComponent } from '../../ele-app/types';
  import type { ElIconProps } from '../../ele-app/el';
  import type { EleTooltipProps } from '../../ele-app/plus';
  import { useTooltip } from '../../ele-tooltip-provider/util';
  import { CHAT_KEY, defaultTooltipProps } from '../props';

  defineSlots<{
    /** 默认插槽 */
    default: () => any;
    /** 最前面插槽 */
    prefix: () => any;
  }>();

  const props = defineProps({
    /** 图标 */
    icon: [String, Object, Function] as PropType<UserComponent>,
    /** 图标属性 */
    iconProps: Object as PropType<ElIconProps>,
    /** 图标样式 */
    iconStyle: [Object, Array, String] as PropType<StyleValues>,
    /** 文本 */
    tooltip: String,
    /** 文本提示属性 */
    tooltipProps: Object as PropType<EleTooltipProps>,
    /** 是否禁用状态 */
    disabled: Boolean,
    /** 按钮类型 */
    type: String as PropType<'default' | 'text'>
  });

  const emit = defineEmits({
    click: (_e: MouseEvent) => true
  });

  const chatProvider = inject(CHAT_KEY, null);
  const tooltipProvider = useTooltip();

  /** 根节点 */
  const toolRef = ref<HTMLElement | null>(null);

  /** 鼠标移入事件 */
  const handleMouseover = (e: MouseEvent) => {
    const triggerEl = e.currentTarget;
    if (!props.tooltip) {
      const f = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
      f && f(triggerEl);
      return;
    }
    const option: EleTooltipProps = {
      ...defaultTooltipProps,
      ...(props.tooltipProps || {}),
      content: props.tooltip
    };
    const func = tooltipProvider?.showTooltip ?? chatProvider?.showTooltip;
    func && func(triggerEl, option);
  };

  /** 点击事件 */
  const handleClick = (e: MouseEvent) => {
    if (!props.disabled) {
      emit('click', e);
    }
  };

  onBeforeUnmount(() => {
    const f = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
    f && f(toolRef.value);
  });
</script>

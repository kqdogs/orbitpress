<!-- 输入框底部按钮 -->
<template>
  <div
    ref="toolRef"
    class="ele-chat-input-tool"
    :class="{
      'is-primary': type === 'primary',
      'is-btn': !!button,
      'is-round': round,
      'is-selected': selected,
      'is-disabled': disabled,
      'is-loading': loading
    }"
    @click="handleClick"
    @mouseover="handleMouseover"
  >
    <slot name="prefix"></slot>
    <div v-if="loading" class="ele-chat-input-tool-loading">
      <ElIcon class="is-loading">
        <LoadingOutlined />
      </ElIcon>
    </div>
    <ElIcon
      v-else-if="icon"
      v-bind="iconProps || {}"
      class="ele-chat-input-tool-icon"
    >
      <component :is="icon" :style="iconStyle" />
    </ElIcon>
    <div
      v-if="button && label"
      :style="labelStyle"
      class="ele-chat-input-tool-label"
    >
      {{ label }}
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, inject, onBeforeUnmount } from 'vue';
  import { ElIcon } from 'element-plus';
  import { LoadingOutlined } from '../../icons/index';
  import type {
    EleTooltipProps,
    EleDropdownPropsAndEmits
  } from '../../ele-app/plus';
  import { useTooltip } from '../../ele-tooltip-provider/util';
  import { useDropdown } from '../../ele-dropdown-provider/util';
  import { chatInputToolProps, CHAT_KEY, defaultTooltipProps } from '../props';

  defineSlots<{
    /** 默认插槽 */
    default: () => any;
    /** 最前面插槽 */
    prefix: () => any;
  }>();

  const props = defineProps(chatInputToolProps);

  const emit = defineEmits({
    click: (_e: MouseEvent) => true
  });

  const chatProvider = inject(CHAT_KEY, null);
  const tooltipProvider = useTooltip();
  const dropdownProvider = useDropdown();

  /** 根节点 */
  const toolRef = ref<HTMLElement | null>(null);

  /** 打开下拉菜单 */
  const openDropdown = (triggerEl: any) => {
    if (!props.dropdownItems?.length) {
      const f =
        dropdownProvider?.removeDropdown ?? chatProvider?.removeDropdown;
      f && f(triggerEl);
      return;
    }
    const option: EleDropdownPropsAndEmits = {
      trigger: 'click',
      placement: 'top-start',
      popperOptions: {
        modifiers: [{ name: 'offset', options: { offset: [0, 6] } }]
      },
      ...(props.dropdownProps || {})
    };
    const func = dropdownProvider?.openDropdown ?? chatProvider?.openDropdown;
    func && func(triggerEl, props.dropdownItems, option);
  };

  /** 鼠标移入事件 */
  const handleMouseover = (e: MouseEvent) => {
    const triggerEl = e.currentTarget;
    // 打开下拉菜单
    if (props.dropdownProps?.trigger === 'hover') {
      openDropdown(triggerEl);
    }
    // 打开文本提示
    if (props.button || !props.label) {
      const ft = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
      ft && ft(triggerEl);
      return;
    }
    const option: EleTooltipProps = {
      ...defaultTooltipProps,
      ...(props.tooltipProps || {}),
      content: props.label
    };
    const func = tooltipProvider?.showTooltip ?? chatProvider?.showTooltip;
    func && func(triggerEl, option);
  };

  /** 点击事件 */
  const handleClick = (e: MouseEvent) => {
    if (!props.disabled) {
      if (props.dropdownProps?.trigger !== 'hover') {
        openDropdown(e.currentTarget);
      }
      emit('click', e);
    }
  };

  onBeforeUnmount(() => {
    const ft = tooltipProvider?.removeTooltip ?? chatProvider?.removeTooltip;
    ft && ft(toolRef.value);
    const f = dropdownProvider?.removeDropdown ?? chatProvider?.removeDropdown;
    f && f(toolRef.value);
  });
</script>

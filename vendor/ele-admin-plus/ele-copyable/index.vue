<!-- 文本复制 -->
<template>
  <div class="ele-copyable" :class="{ 'ele-copyable-done': copied }">
    <div ref="innerRef" class="ele-copyable-inner" :style="innerStyle">
      <slot></slot>
    </div>
    <div
      class="ele-copyable-icon"
      :style="customStyle"
      @mouseover="handleCopyHover"
      @click="handleCopyClick"
    >
      <ElIcon v-if="copied" v-bind="copiedIconProps || {}">
        <component
          v-if="copiedIcon"
          :is="copiedIcon"
          :style="copiedIconStyle"
        />
        <CheckOutlined v-else :style="copiedIconStyle" />
      </ElIcon>
      <ElIcon v-else v-bind="iconProps || {}">
        <component v-if="icon" :is="icon" :style="iconStyle" />
        <CopyOutlined v-else :style="iconStyle" />
      </ElIcon>
    </div>
    <EleTooltip
      placement="top"
      :offset="6"
      v-bind="!tooltip || tooltip === true ? {} : tooltip"
      :content="copied ? lang.copied : lang.copy"
      :virtualRef="virtualRef"
      :virtualTriggering="true"
      ref="tooltipRef"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onDeactivated, onBeforeUnmount } from 'vue';
  import { ElIcon } from 'element-plus';
  import { CopyOutlined, CheckOutlined } from '../icons/index';
  import { copyText } from '../utils/common';
  import { useLocale } from '../ele-config-provider/receiver';
  import type { EleTooltipInstance } from '../ele-app/plus';
  import EleTooltip from '../ele-tooltip/index.vue';
  import { copyableProps, copyableEmits } from './props';

  defineOptions({ name: 'EleCopyable' });

  const props = defineProps(copyableProps);

  const emit = defineEmits(copyableEmits);

  const { lang } = useLocale('copyable', props);
  const state: { timer: number | null } = { timer: null };

  /** 文本组件 */
  const innerRef = ref<HTMLElement | null>(null);

  /** 提示组件 */
  const tooltipRef = ref<EleTooltipInstance>(null);

  /** 提示单例目标 */
  const virtualRef = ref<HTMLElement>();

  /** 是否拷贝完成 */
  const copied = ref<boolean>(false);

  /** 更新提示组件位置 */
  const updateTooltip = () => {
    tooltipRef.value && tooltipRef.value.updatePopper();
  };

  /** 获取复制内容 */
  const getText = (): string => {
    if (props.text) {
      return props.text;
    }
    return innerRef.value?.innerText || '';
  };

  /** 复制 */
  const handleCopyClick = () => {
    copyText(getText())
      .then(() => {
        copied.value = true;
        updateTooltip();
        state.timer && clearTimeout(state.timer);
        state.timer = setTimeout(() => {
          copied.value = false;
          updateTooltip();
        }, props.resetAfter || 1000) as unknown as number;
        emit('copy');
      })
      .catch((error) => {
        copied.value = false;
        updateTooltip();
        emit('copy', error);
      });
  };

  /** 打开提示 */
  const handleCopyHover = (e: MouseEvent) => {
    if (props.tooltip) {
      virtualRef.value = e.currentTarget as HTMLElement;
    }
  };

  onDeactivated(() => {
    state.timer && clearTimeout(state.timer);
    state.timer = null;
    copied.value = false;
  });

  onBeforeUnmount(() => {
    state.timer && clearTimeout(state.timer);
    state.timer = null;
  });
</script>

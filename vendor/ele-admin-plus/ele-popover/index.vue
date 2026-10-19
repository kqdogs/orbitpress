<!-- 气泡卡片 -->
<template>
  <EleTooltip
    :tabindex="tabindex"
    v-bind="tooltipProps"
    ref="tooltipRef"
    :isPopover="true"
    @update:visible="handleUpdateVisible"
    @before-show="handlePopBeforeEnter"
    @before-hide="handlePopBeforeLeave"
    @show="handlePopAfterEnter"
    @hide="handlePopAfterLeave"
  >
    <template v-if="$slots.reference">
      <slot name="reference"></slot>
    </template>
    <template #body>
      <div class="ele-popover-body" :class="bodyClass" :style="bodyStyle">
        <slot name="body">
          <div
            v-if="(title != null && title != '') || $slots.title"
            class="ele-popover-title"
            :style="titleStyle"
          >
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="ele-popover-content" :style="contentStyle">
            <slot>{{ content }}</slot>
          </div>
        </slot>
      </div>
    </template>
  </EleTooltip>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import type { EleTooltipInstance, EleTooltipProps } from '../ele-app/plus';
  import { pick } from '../utils/common';
  import EleTooltip from '../ele-tooltip/index.vue';
  import { tooltipPropKeys } from '../ele-tooltip/props';
  import { popoverProps, popoverEmits } from './props';

  defineOptions({ name: 'ElePopover' });

  const props = defineProps(popoverProps);

  const emit = defineEmits(popoverEmits);

  /** 文字提示实例 */
  const tooltipRef = ref<EleTooltipInstance>(null);

  /** 文字提示属性 */
  const tooltipProps = computed<EleTooltipProps>(() => {
    const keys: any = tooltipPropKeys.filter(
      (k) => !['content', 'bodyStyle'].includes(k)
    );
    const options: EleTooltipProps = pick(props, keys) as EleTooltipProps;
    options.ariaLabel = props.title;
    options.gpuAcceleration = props.transition === 'el-fade-in-linear';
    return options;
  });

  /** 关闭气泡 */
  const hide = () => {
    tooltipRef.value && tooltipRef.value.hide();
  };

  /** 更新打开状态 */
  const handleUpdateVisible = (visible: boolean) => {
    emit('update:visible', visible);
  };

  /** 开始打开事件 */
  const handlePopBeforeEnter = () => {
    emit('before-enter');
  };

  /** 开始关闭事件 */
  const handlePopBeforeLeave = () => {
    emit('before-leave');
  };

  /** 打开结束事件 */
  const handlePopAfterEnter = () => {
    emit('after-enter');
  };

  /** 关闭结束事件 */
  const handlePopAfterLeave = () => {
    emit('after-leave');
  };

  defineExpose({
    tooltipRef,
    hide
  });
</script>

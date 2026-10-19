<!-- 漫游式引导 -->
<template>
  <Teleport to="body">
    <div
      v-bind="$attrs"
      class="ele-tour"
      :class="[{ 'show-mask': showMask }, { 'is-open': visible }]"
      :style="{ zIndex: zIndex }"
    >
      <div class="ele-tour-box" :style="boxStyle"></div>
      <div ref="triggerRef" class="ele-tour-reference" :style="boxStyle"></div>
      <EleTooltip
        v-bind="tooltipProps"
        ref="tooltipRef"
        :virtualRef="triggerRef"
        :virtualTriggering="true"
        :disabled="!visible"
        :hideAfter="0"
      >
        <template #body>
          <div v-if="steps && step" class="ele-popover-body">
            <div v-if="step.title" class="ele-tour-title">
              <slot name="title" :step="step" :current="modelValue">
                {{ step.title }}
              </slot>
            </div>
            <div class="ele-tour-text">
              <slot name="text" :step="step" :current="modelValue">
                {{ step.description }}
              </slot>
            </div>
            <slot name="footer" :step="step" :current="modelValue">
              <div class="ele-tour-footer">
                <div class="ele-tour-counter">
                  {{ (modelValue || 0) + 1 }}/{{ steps.length }}
                </div>
                <div class="ele-tour-action">
                  <ElButton v-if="!isLast" size="small" @click="handleFinish">
                    {{ lang.skip }}
                  </ElButton>
                  <ElButton
                    v-if="modelValue !== 0"
                    size="small"
                    @click="handlePrev"
                  >
                    {{ lang.prev }}
                  </ElButton>
                  <ElButton
                    v-if="!isLast"
                    size="small"
                    type="primary"
                    @click="handleNext"
                  >
                    {{ lang.next }}
                  </ElButton>
                  <ElButton
                    v-if="isLast"
                    size="small"
                    type="primary"
                    @click="handleFinish"
                  >
                    {{ lang.finish }}
                  </ElButton>
                </div>
              </div>
            </slot>
          </div>
        </template>
      </EleTooltip>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { ref, shallowRef, onMounted, watch, nextTick } from 'vue';
  import { ElButton } from 'element-plus';
  import EleTooltip from '../ele-tooltip/index.vue';
  import type { StyleValue } from '../ele-app/types';
  import type { EleTooltipProps, EleTooltipInstance } from '../ele-app/plus';
  import { useLocale } from '../ele-config-provider/receiver';
  import { getOffset, getPopperProps, scrollIntoView } from './util';
  import type { TourStep } from './types';
  import { tourProps, tourEmits } from './props';

  defineOptions({ name: 'EleTour', inheritAttrs: false });

  const props = defineProps(tourProps);

  const emit = defineEmits(tourEmits);

  const { lang } = useLocale('tour', props);

  /** 气泡触发组件 */
  const triggerRef = ref<any>(null);

  /** 气泡组件 */
  const tooltipRef = ref<EleTooltipInstance>(null);

  /** 气泡组件属性 */
  const tooltipProps = shallowRef<EleTooltipProps>({});

  /** 是否打开引导 */
  const visible = ref<boolean>(false);

  /** 当前步骤 */
  const step = shallowRef<TourStep | null>(null);

  /** 是否是最后一步 */
  const isLast = ref<boolean>(false);

  /** 盒子样式 */
  const boxStyle: Ref<StyleValue> = ref<StyleValue>({});

  /** 是否显示遮罩 */
  const showMask = ref<boolean>(false);

  /** 开始引导 */
  const start = () => {
    if (
      !props.steps ||
      props.modelValue == null ||
      props.modelValue < 0 ||
      props.modelValue >= props.steps.length
    ) {
      close();
      return;
    }
    step.value = props.steps[props.modelValue];
    if (!step.value) {
      return;
    }
    isLast.value = props.modelValue === props.steps.length - 1;
    const { mask, popoverProps, target, padding } = step.value;
    showMask.value = mask ?? props.mask;
    const el = typeof target === 'function' ? target() : target;
    if (el) {
      scrollIntoView(el);
      // 气泡形式
      const { width, height } = el.getBoundingClientRect();
      const { top, left } = getOffset(el);
      const space = padding ?? props.padding ?? 0;
      boxStyle.value = {
        width: width + space + space + 'px',
        height: height + space + space + 'px',
        top: top - space + 'px',
        left: left - space + 'px'
      };
    } else {
      // 弹窗形式
      boxStyle.value = {
        width: '0px',
        height: '0px',
        top: '50%',
        left: '50%'
      };
    }
    // 显示
    visible.value = true;
    tooltipProps.value = getPopperProps(true, !el, popoverProps as any);
    nextTick(() => {
      updatePopper();
    });
  };

  /** 关闭引导 */
  const close = () => {
    visible.value = false;
    boxStyle.value = {};
    step.value = null;
    showMask.value = false;
    tooltipProps.value = getPopperProps();
  };

  /** 更新步骤值 */
  const updateModelValue = (value?: number | null) => {
    emit('update:modelValue', value);
  };

  /** 上一步 */
  const handlePrev = () => {
    if (
      props.modelValue != null &&
      props.steps != null &&
      props.steps.length &&
      props.modelValue > 0
    ) {
      updateModelValue(props.modelValue - 1);
    }
  };

  /** 下一步 */
  const handleNext = () => {
    if (
      props.modelValue != null &&
      props.steps != null &&
      props.steps.length &&
      props.modelValue < props.steps.length - 1
    ) {
      updateModelValue(props.modelValue + 1);
    }
  };

  /** 结束 */
  const handleFinish = () => {
    updateModelValue(null);
  };

  /** 更新气泡位置 */
  const updatePopper = () => {
    tooltipRef.value && tooltipRef.value.updatePopper();
  };

  onMounted(() => {
    start();
  });

  watch(
    () => props.modelValue,
    () => {
      start();
    }
  );

  defineExpose({
    tooltipRef
  });
</script>

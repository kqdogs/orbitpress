<!-- 气泡确认 -->
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
        <div class="ele-popconfirm-main">
          <ElIcon
            v-if="!hideIcon"
            v-bind="iconProps || {}"
            :style="iconColor ? { color: iconColor } : void 0"
            class="ele-popconfirm-icon"
          >
            <component v-if="icon" :is="icon" :style="iconStyle" />
            <QuestionCircleFilled v-else :style="iconStyle" />
          </ElIcon>
          <div class="ele-popconfirm-body">
            <div
              v-if="(content || $slots.content) && (title || $slots.title)"
              class="ele-popconfirm-title"
              :style="titleStyle"
            >
              <slot name="title">{{ title }}</slot>
            </div>
            <div class="ele-popconfirm-content" :style="contentStyle">
              <slot name="content">{{ content || title }}</slot>
            </div>
          </div>
        </div>
        <div class="ele-popconfirm-action" :style="footerStyle">
          <slot
            name="actions"
            :cancel="handleCancel"
            :confirm="handleConfirm"
            :cancelText="cancelText"
            :confirmText="confirmText"
          >
            <slot
              name="action"
              :cancel="handleCancel"
              :confirm="handleConfirm"
              :cancelText="cancelText"
              :confirmText="confirmText"
            ></slot>
            <ElButton
              v-if="!hideCancelButton"
              size="small"
              :type="cancelButtonType === 'text' ? void 0 : cancelButtonType"
              :text="cancelButtonType === 'text'"
              v-bind="cancelButtonProps || {}"
              @click="handleCancel"
            >
              {{ cancelText }}
            </ElButton>
            <ElButton
              v-if="!hideConfirmButton"
              size="small"
              :type="confirmButtonType === 'text' ? void 0 : confirmButtonType"
              :text="confirmButtonType === 'text'"
              v-bind="confirmButtonProps || {}"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </ElButton>
          </slot>
        </div>
      </div>
    </template>
  </EleTooltip>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useLocale, ElIcon, ElButton } from 'element-plus';
  import type { EleTooltipInstance, EleTooltipProps } from '../ele-app/plus';
  import { pick } from '../utils/common';
  import EleTooltip from '../ele-tooltip/index.vue';
  import { tooltipPropKeys } from '../ele-tooltip/props';
  import { QuestionCircleFilled } from '../icons/index';
  import { popconfirmProps, popconfirmEmits } from './props';

  defineOptions({ name: 'ElePopconfirm' });

  const props = defineProps(popconfirmProps);

  const emit = defineEmits(popconfirmEmits);

  const { t } = useLocale();

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
    const classes: string[] = ['ele-popconfirm'];
    if (typeof props.popperClass === 'string' && props.popperClass) {
      classes.push(props.popperClass);
    }
    options.popperClass = classes.join(' ');
    return options;
  });

  /** 确认按钮文字 */
  const confirmText = computed(() => {
    return props.confirmButtonText || t('el.popconfirm.confirmButtonText');
  });

  /** 取消按钮文字 */
  const cancelText = computed(() => {
    return props.cancelButtonText || t('el.popconfirm.cancelButtonText');
  });

  /** 关闭气泡 */
  const hidePopper = () => {
    tooltipRef.value && tooltipRef.value.hide();
  };

  /** 确认按钮点击事件 */
  const handleConfirm = (e: MouseEvent) => {
    hidePopper();
    emit('confirm', e);
  };

  /** 取消按钮点击事件 */
  const handleCancel = (e: MouseEvent) => {
    hidePopper();
    emit('cancel', e);
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
    hidePopper,
    popperRef: tooltipRef,
    hide: hidePopper
  });
</script>

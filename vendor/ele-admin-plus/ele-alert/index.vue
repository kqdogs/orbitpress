<!-- 警告提示 -->
<template>
  <Transition :name="transitionName">
    <div
      v-if="visible"
      v-bind="$attrs"
      class="ele-alert"
      :class="[
        { 'is-success': type === 'success' },
        { 'is-warning': type === 'warning' },
        { 'is-error': type === 'error' },
        { 'is-dark': effect === 'dark' },
        { 'is-center': center },
        { 'is-rich': isRich }
      ]"
    >
      <div v-if="showIcon" class="ele-alert-icon" :style="iconStyle">
        <slot name="icon">
          <ElIcon v-bind="iconProps || {}">
            <CheckCircleFilled v-if="type === 'success'" />
            <ExclamationCircleFilled v-else-if="type === 'warning'" />
            <CloseCircleFilled v-else-if="type === 'error'" />
            <InfoCircleFilled v-else />
          </ElIcon>
        </slot>
      </div>
      <div class="ele-alert-body" :style="bodyStyle">
        <div
          v-if="title || $slots.title"
          class="ele-alert-title"
          :style="titleStyle"
        >
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="isRich" class="ele-alert-text" :style="descriptionStyle">
          <slot>{{ description === true ? '' : description }}</slot>
        </div>
      </div>
      <slot name="action"></slot>
      <div
        v-if="closable"
        class="ele-alert-close"
        :style="closeIconStyle"
        @click="handleClose"
      >
        <slot name="closeIcon">
          <span v-if="closeText">{{ closeText }}</span>
          <ElIcon v-else v-bind="closeIconProps || {}">
            <CloseOutlined />
          </ElIcon>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  import { ref, computed, useSlots } from 'vue';
  import { ElIcon } from 'element-plus';
  import {
    CloseOutlined,
    InfoCircleFilled,
    CheckCircleFilled,
    ExclamationCircleFilled,
    CloseCircleFilled
  } from '../icons/index';
  import { alertProps, alertEmits } from './props';

  defineOptions({ name: 'EleAlert', inheritAttrs: false });

  const props = defineProps(alertProps);

  const emit = defineEmits(alertEmits);

  const slots = useSlots();

  /** 是否非关闭状态 */
  const visible = ref<boolean>(true);

  /** 是否有描述 */
  const isRich = computed<boolean>(() => {
    return (
      props.description !== false && (!!props.description || !!slots.default)
    );
  });

  /** 关闭 */
  const handleClose = (e: MouseEvent) => {
    if (!visible.value || !props.closable) {
      return;
    }
    visible.value = false;
    emit('close', e);
  };

  /** 打开 */
  const open = () => {
    if (!visible.value) {
      visible.value = true;
    }
  };

  defineExpose({
    handleClose,
    open
  });
</script>

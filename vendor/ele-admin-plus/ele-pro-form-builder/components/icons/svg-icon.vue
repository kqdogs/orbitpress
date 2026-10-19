<template>
  <div
    :class="[
      {
        'ele-icon-color-primary':
          color !== 'secondary' &&
          color !== 'lighter' &&
          color !== 'base' &&
          color !== 'placeholder' &&
          color !== 'light' &&
          color !== 'primary5' &&
          color !== 'success'
      },
      { 'ele-icon-color-secondary': color === 'secondary' },
      { 'ele-icon-color-lighter': color === 'lighter' },
      { 'ele-icon-color-base': color === 'base' },
      { 'ele-icon-color-placeholder': color === 'placeholder' },
      { 'ele-icon-color-light': color === 'light' },
      { 'ele-icon-color-primary5': color === 'primary5' },
      { 'ele-icon-color-success': color === 'success' }
    ]"
    :style="{
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size === 'sm' ? '12px' : '14px'
    }"
  >
    <slot>
      <component :is="name" width="1em" height="1em" :style="iconStyle" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import {
    ArrowUp,
    ArrowDown,
    ArrowRight,
    ArrowLeft,
    CheckOutlined,
    CalendarOutlined,
    PlusOutlined,
    StarFilled,
    ClockCircleOutlined,
    EnvironmentOutlined,
    CheckCircleFilled,
    StepForwardFilled,
    ExclamationCircleFilled,
    UserOutlined,
    CloseOutlined
  } from '../../../icons/index';

  defineOptions({
    components: {
      ArrowUp,
      ArrowDown,
      ArrowRight,
      ArrowLeft,
      CheckOutlined,
      CalendarOutlined,
      PlusOutlined,
      StarFilled,
      ClockCircleOutlined,
      EnvironmentOutlined,
      CheckCircleFilled,
      StepForwardFilled,
      ExclamationCircleFilled,
      UserOutlined,
      CloseOutlined
    }
  });

  defineProps<{
    name?: string;
    iconStyle?: CSSProperties;
    size?: 'sm' | 'md';
    color?:
      | 'primary'
      | 'secondary'
      | 'lighter'
      | 'base'
      | 'placeholder'
      | 'light'
      | 'primary5'
      | 'success';
  }>();
</script>

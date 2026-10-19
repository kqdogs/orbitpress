<!-- 返回顶部 -->
<template>
  <Transition :name="transitionName">
    <div
      v-if="visible"
      v-bind="$attrs"
      class="ele-backtop"
      :style="{
        bottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
        right: typeof right === 'number' ? `${right}px` : right
      }"
      @click="handleClick"
    >
      <slot>
        <ElIcon>
          <ArrowUp />
        </ElIcon>
      </slot>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  import {
    ref,
    shallowRef,
    watch,
    onMounted,
    onBeforeUnmount,
    onDeactivated,
    onActivated
  } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowUp } from '../icons/index';
  import { throttle } from '../utils/common';
  import { backtopProps, backtopEmits } from './props';

  defineOptions({ name: 'EleBacktop', inheritAttrs: false });

  const props = defineProps(backtopProps);

  const emit = defineEmits(backtopEmits);

  /** 是否显示 */
  const visible = ref(false);

  /** 目标元素 */
  const targetEl = shallowRef<Element | null>(null);

  /** 更新目标元素 */
  const updateTarget = (el?: Element | null | string) => {
    if (el !== targetEl.value && !(el == null && targetEl.value == null)) {
      targetEl.value = !el || typeof el === 'string' ? null : el;
    }
  };

  /** 点击事件 */
  const handleClick = (e: MouseEvent) => {
    if (targetEl.value) {
      targetEl.value.scrollTo({ top: 0, behavior: 'smooth' });
    }
    emit('click', e);
  };

  /** 处理滚动事件 */
  const handleScroll = () => {
    if (targetEl.value != null && props.visibilityHeight != null) {
      visible.value = targetEl.value.scrollTop >= props.visibilityHeight;
    } else {
      visible.value = false;
    }
  };

  /** 滚动事件监听 */
  const scrollListener = throttle(handleScroll, 300, true);

  /** 解绑事件 */
  const unbindEvent = () => {
    if (targetEl.value != null) {
      targetEl.value.removeEventListener('scroll', scrollListener);
      targetEl.value = null;
    }
  };

  /** 绑定事件 */
  const bindEvent = () => {
    unbindEvent();
    if (typeof props.target === 'undefined') {
      updateTarget(document.body);
    } else if (typeof props.target === 'string' && props.target) {
      updateTarget(document.querySelector(props.target));
    } else {
      updateTarget(props.target);
    }
    handleScroll();
    if (targetEl.value) {
      targetEl.value.addEventListener('scroll', scrollListener);
    }
  };

  watch(
    () => props.target,
    () => {
      bindEvent();
    }
  );

  onMounted(() => {
    bindEvent();
  });

  onBeforeUnmount(() => {
    unbindEvent();
  });

  onDeactivated(() => {
    visible.value = false;
  });

  onActivated(() => {
    handleScroll();
  });
</script>

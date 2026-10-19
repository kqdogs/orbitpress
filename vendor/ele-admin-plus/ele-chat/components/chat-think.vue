<!-- 消息气泡底部按钮 -->
<template>
  <div
    class="ele-chat-think"
    :class="{ 'is-thinking': thinking, 'is-expanded': isExpanded }"
  >
    <div class="ele-chat-think-status" @click="handleStatusClick">
      <ElIcon
        class="ele-chat-think-status-icon"
        :class="{ 'is-loading': thinking }"
      >
        <LoadingDotOutlined v-if="thinking" />
        <DeepThinkOutlined v-else />
      </ElIcon>
      <div class="ele-chat-think-status-text">
        {{ thinking ? thinkingText : thoughtText }}
      </div>
      <ElIcon class="ele-chat-think-status-expand">
        <ArrowDown />
      </ElIcon>
    </div>
    <div class="ele-chat-think-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { ElIcon } from 'element-plus';
  import {
    DeepThinkOutlined,
    ArrowDown,
    LoadingDotOutlined
  } from '../../icons/index';

  defineSlots<{
    /** 默认插槽 */
    default: () => any;
  }>();

  const props = defineProps({
    /** 是否展开 */
    expanded: {
      type: Boolean,
      default: true
    },
    /** 是否是思考中 */
    thinking: Boolean,
    /** 思考中文案 */
    thinkingText: String,
    /** 已思考文案 */
    thoughtText: String
  });

  const emit = defineEmits({
    /** 更新展开状态事件 */
    'update:expanded': (_expanded?: boolean) => true
  });

  /** 是否是展开状态 */
  const isExpanded = ref(props.expanded);

  /** 切换展开状态 */
  const handleStatusClick = () => {
    isExpanded.value = !isExpanded.value;
    if (props.expanded !== isExpanded.value) {
      emit('update:expanded', isExpanded.value);
    }
  };

  /** 同步展开状态 */
  watch(
    () => props.expanded,
    (expanded) => {
      if (isExpanded.value !== expanded) {
        isExpanded.value = expanded;
      }
    }
  );
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="ele-message-icon">
    <ElIcon :class="{ 'is-loading': loading }">
      <component v-if="icon" :is="icon" />
      <LoadingDotOutlined v-else-if="loading" />
      <CheckCircleFilled v-else-if="type === 'success'" />
      <ExclamationCircleFilled v-else-if="type === 'warning'" />
      <CloseCircleFilled v-else-if="type === 'error'" />
      <InfoCircleFilled v-else />
    </ElIcon>
  </div>
  <slot>
    <div
      v-if="dangerouslyUseHTMLString"
      v-html="message"
      class="ele-message-content"
    ></div>
    <div v-else class="ele-message-content">{{ message }}</div>
  </slot>
  <div v-if="showClose" class="ele-message-close" @click="handleClose">
    <ElIcon>
      <CloseOutlined />
    </ElIcon>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { onBeforeUnmount } from 'vue';
  import { ElIcon } from 'element-plus';
  import {
    CloseOutlined,
    InfoCircleFilled,
    CheckCircleFilled,
    ExclamationCircleFilled,
    CloseCircleFilled,
    LoadingDotOutlined
  } from '../../icons/index';
  import type { ElMessageOptions } from '../el';

  defineOptions({ name: 'MessageBody' });

  const props = defineProps({
    /** 内容 */
    message: String,
    /** 类型 */
    type: String as PropType<ElMessageOptions['type']>,
    /** 图标 */
    icon: [String, Object, Function] as PropType<ElMessageOptions['icon']>,
    /** 是否显示关闭按钮 */
    showClose: Boolean,
    /** 内容是否是富文本 */
    dangerouslyUseHTMLString: Boolean,
    /** 是否是加载框 */
    loading: Boolean as PropType<boolean | null>,
    /** 标识id */
    messageId: String
  });

  const emit = defineEmits({
    close: () => true,
    messageDestroy: (_messageId?: string) => true
  });

  onBeforeUnmount(() => {
    emit('messageDestroy', props.messageId);
  });

  const handleClose = () => {
    emit('close');
  };
</script>

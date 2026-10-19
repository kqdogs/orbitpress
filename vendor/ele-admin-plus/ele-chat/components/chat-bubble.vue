<!-- 消息气泡 -->
<template>
  <div
    class="ele-chat-bubble"
    :class="{
      'is-placement-end': item.placement === 'end',
      'is-receiving': item.status === 'receiving'
    }"
  >
    <slot name="itemTop" :item="item"></slot>
    <ChatFiles
      v-if="item.files && item.files.length"
      :files="item.files"
      :readonly="true"
      :uploadError="uploadError"
      @fileClick="handleFileClick"
      @fileRemove="handleFileRemove"
    >
      <template v-for="name in Object.keys($slots)" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </ChatFiles>
    <div class="ele-chat-bubble-main">
      <div v-if="item.avatar != null" class="ele-chat-bubble-avatar">
        <slot name="itemAvatar" :item="item">
          <img :src="item.avatar" class="ele-chat-bubble-avatar-img" />
        </slot>
      </div>
      <BubbleLoading v-if="item.avatar == null && item.status === 'loading'" />
      <div v-else class="ele-chat-bubble-body">
        <slot name="itemBodyTop" :item="item"></slot>
        <div v-if="item.header != null" class="ele-chat-bubble-header">
          <slot name="itemHeader" :item="item">{{ item.header }}</slot>
        </div>
        <BubbleLoading v-if="item.status === 'loading'" />
        <div v-else-if="item.editStatus" class="ele-chat-bubble-edit">
          <ElInput
            type="textarea"
            resize="none"
            :validateEvent="false"
            :placeholder="editPlaceholder"
            v-bind="editInputProps || {}"
            ref="inputRef"
            v-model="editContent"
            class="ele-chat-bubble-edit-input"
            @keydown="handleInputKeydown"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
          />
          <div class="ele-chat-bubble-edit-footer">
            <ElButton
              size="small"
              :round="true"
              v-bind="editCancelBtnProps || {}"
              @click="handleEditCancel"
            >
              {{ editCancelText }}
            </ElButton>
            <ElButton
              size="small"
              type="primary"
              :round="true"
              v-bind="editConfirmBtnProps || {}"
              @click="handleEditConfirm"
            >
              {{ editConfirmText }}
            </ElButton>
          </div>
        </div>
        <template v-else>
          <div
            v-if="item.content != null || item.reasoning != null"
            class="ele-chat-bubble-content"
            @click="handleContentClick"
          >
            <slot name="itemThink" :item="item">
              <ChatThink
                v-if="item.reasoning != null"
                :thinking="item.status === 'thinking'"
                :thinkingText="thinkingText"
                :thoughtText="thoughtText"
              >
                {{ item.reasoning }}
              </ChatThink>
            </slot>
            <slot name="itemContent" :item="item">
              <div
                v-if="item.content != null"
                class="ele-chat-bubble-content-text"
              >
                {{ item.content }}
              </div>
            </slot>
          </div>
          <div v-if="$slots.itemFooter" class="ele-chat-bubble-footer">
            <slot name="itemFooter" :item="item"></slot>
          </div>
        </template>
        <slot name="itemBodyBottom" :item="item"></slot>
      </div>
      <slot name="itemExtra" :item="item"></slot>
    </div>
    <slot name="itemBottom" :item="item"></slot>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch, nextTick } from 'vue';
  import { ElInput, ElButton } from 'element-plus';
  import type {
    ElButtonProps,
    ElInputProps,
    ElInputInstance
  } from '../../ele-app/el';
  import type { MessageItem, FileItem, ChatBubbleSlots } from '../types';
  import BubbleLoading from './bubble-loading.vue';
  import ChatFiles from './chat-files.vue';
  import ChatThink from './chat-think.vue';

  defineSlots<ChatBubbleSlots>();

  const props = defineProps({
    /** 消息 */
    item: {
      type: Object as PropType<MessageItem>,
      required: true
    },
    /** 上传失败文本 */
    uploadError: String,
    /** 思考中文案 */
    thinkingText: String,
    /** 已思考文案 */
    thoughtText: String,
    /** 编辑框提示文本 */
    editPlaceholder: String,
    /** 编辑取消按钮文本 */
    editCancelText: String,
    /** 编辑确认按钮文本 */
    editConfirmText: String,
    /** 内容编辑确认按钮属性 */
    editConfirmBtnProps: Object as PropType<ElButtonProps>,
    /** 内容编辑取消按钮属性 */
    editCancelBtnProps: Object as PropType<ElButtonProps>,
    /** 内容编辑框属性 */
    editInputProps: Object as PropType<ElInputProps>
  });

  const emit = defineEmits({
    /** 气泡内容点击事件 */
    bubbleContentClick: (_item: MessageItem, _e: MouseEvent) => true,
    /** 附件点击事件 */
    fileClick: (_item: MessageItem, _fileItem: FileItem) => true,
    /** 附件删除事件 */
    fileRemove: (_item: MessageItem, _fileItem: FileItem) => true,
    /** 编辑取消事件 */
    editCancel: (_item: MessageItem) => true,
    /** 编辑确认事件 */
    editConfirm: (_item: MessageItem, _content: string) => true
  });

  /** 消息编辑内容 */
  const editContent = ref('');

  /** 输入框 */
  const inputRef = ref<ElInputInstance>(null);

  /** 是否是输入组合 */
  const isComposing = ref(false);

  /** 气泡内容点击事件 */
  const handleContentClick = (e: MouseEvent) => {
    emit('bubbleContentClick', props.item, e);
  };

  /** 附件点击事件 */
  const handleFileClick = (fileItem: FileItem) => {
    emit('fileClick', props.item, fileItem);
  };

  /** 附件删除事件 */
  const handleFileRemove = (fileItem: FileItem) => {
    emit('fileRemove', props.item, fileItem);
  };

  /** 编辑取消事件 */
  const handleEditCancel = () => {
    emit('editCancel', props.item);
  };

  /** 编辑确认事件 */
  const handleEditConfirm = () => {
    emit('editConfirm', props.item, editContent.value);
  };

  /** 输入框键盘事件 */
  const handleInputKeydown = (e: KeyboardEvent) => {
    if (!(isComposing.value || e.shiftKey) && e.key === 'Enter') {
      e.preventDefault();
      handleEditConfirm();
    }
  };

  /** 监听输入组合开始 */
  const handleCompositionStart = () => {
    isComposing.value = true;
  };

  /** 监听输入组合结束 */
  const handleCompositionEnd = () => {
    isComposing.value = false;
  };

  /** 监听编辑状态 */
  watch(
    () => props.item.editStatus,
    (editStatus) => {
      if (editStatus) {
        editContent.value = props.item.content ?? '';
        nextTick(() => {
          inputRef.value && inputRef.value.focus();
        });
      } else {
        editContent.value = '';
      }
    }
  );
</script>

<!-- 输入框 -->
<template>
  <div class="ele-chat-input-wrapper" :class="{ 'is-focused': isFocused }">
    <slot name="inputTop"></slot>
    <ChatFiles
      v-if="files && files.length"
      :files="files"
      :uploadError="uploadError"
      @fileClick="handleFileClick"
      @fileRemove="handleFileRemove"
    >
      <template v-for="name in Object.keys($slots)" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </ChatFiles>
    <div class="ele-chat-input">
      <textarea
        v-model="content"
        class="ele-chat-textarea"
        :placeholder="placeholder"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      ></textarea>
      <div class="ele-chat-input-hidden">{{ hidden }}</div>
    </div>
    <div class="ele-chat-input-tools">
      <div class="ele-chat-input-tools-left">
        <slot name="inputLeftTools"></slot>
      </div>
      <div class="ele-chat-input-tools-right">
        <slot name="inputRightTools"></slot>
        <ElUpload
          v-if="uploadBtnProps !== false"
          action=""
          :drag="false"
          :multiple="true"
          :showFileList="false"
          :beforeUpload="handleFileUpload"
          class="ele-chat-input-tool-upload"
          v-bind="uploadProps || {}"
        >
          <InputTool
            :icon="PaperClipOutlined"
            :label="uploadTip"
            v-bind="(uploadBtnProps === true ? void 0 : uploadBtnProps) || {}"
          />
        </ElUpload>
        <InputTool
          v-if="sendBtnProps !== false"
          :icon="SendFilled"
          type="primary"
          class="ele-chat-input-tool-send"
          v-bind="(sendBtnProps === true ? void 0 : sendBtnProps) || {}"
          @click="handleSendBtnClick"
        />
      </div>
    </div>
    <slot name="inputBottom"></slot>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, computed, watch } from 'vue';
  import { ElUpload } from 'element-plus';
  import { SendFilled, PaperClipOutlined } from '../../icons/index';
  import { uuid, formatFileSize } from '../../utils/common';
  import type { ElUploadProps } from '../../ele-app/el';
  import ChatFiles from './chat-files.vue';
  import InputTool from './input-tool.vue';
  import type { FileItem, ChatInputSlots } from '../types';
  import type { EleChatInputToolProps } from '../props';

  defineSlots<ChatInputSlots>();

  const props = defineProps({
    /** 输入框文本 */
    modelValue: String,
    /** 发送按钮属性 */
    sendBtnProps: {
      type: [Object, Boolean] as PropType<EleChatInputToolProps | boolean>,
      default: () => null
    },
    /** 上传按钮属性 */
    uploadBtnProps: {
      type: [Object, Boolean] as PropType<EleChatInputToolProps | boolean>,
      default: () => null
    },
    /** 附件 */
    files: Array as PropType<FileItem[]>,
    /** 输入框提示文本 */
    placeholder: String,
    /** 上传组件属性 */
    uploadProps: Object as PropType<ElUploadProps>,
    /** 上传按钮提示文本 */
    uploadTip: String,
    /** 上传失败提示文本 */
    uploadError: String
  });

  const emit = defineEmits({
    /** 更新输入框文本 */
    'update:modelValue': (_value: string) => true,
    /** 输入事件 */
    input: (_e: InputEvent) => true,
    /** 获取焦点事件 */
    focus: (_e: FocusEvent) => true,
    /** 失去焦点事件 */
    blur: (_e: FocusEvent) => true,
    /** 回车发送事件 */
    send: (_content: string) => true,
    /** 发送按钮点击事件 */
    sendBtnClick: (_e: MouseEvent) => true,
    /** 附件点击事件 */
    fileClick: (_item: FileItem) => true,
    /** 附件删除事件 */
    fileRemove: (_item: FileItem) => true,
    /** 附件上传事件 */
    fileUpload: (_item: FileItem) => true
  });

  /** 输入内容 */
  const content = ref(props.modelValue ?? '');

  /** 同步隐藏内容 */
  const hidden = computed(() => `${content.value ?? ''}\u200B`);

  /** 焦点状态 */
  const isFocused = ref(false);

  /** 是否是输入组合 */
  const isComposing = ref(false);

  /** 发送按钮点击事件 */
  const handleSendBtnClick = (e: MouseEvent) => {
    emit('sendBtnClick', e);
  };

  /** 输入事件 */
  const handleInput = (e: InputEvent) => {
    emit('input', e);
  };

  /** 获取焦点事件 */
  const handleFocus = (e: FocusEvent) => {
    isFocused.value = true;
    emit('focus', e);
  };

  /** 失去焦点事件 */
  const handleBlur = (e: FocusEvent) => {
    isFocused.value = false;
    emit('blur', e);
  };

  /** 监听回车键 */
  const handleEnter = (e: KeyboardEvent) => {
    if (isComposing.value || e.shiftKey) {
      return;
    }
    e.preventDefault();
    emit('send', content.value);
  };

  /** 监听输入组合开始 */
  const handleCompositionStart = () => {
    isComposing.value = true;
  };

  /** 监听输入组合结束 */
  const handleCompositionEnd = () => {
    isComposing.value = false;
  };

  /** 附件点击事件 */
  const handleFileClick = (item: FileItem) => {
    emit('fileClick', item);
  };

  /** 附件删除事件 */
  const handleFileRemove = (item: FileItem) => {
    emit('fileRemove', item);
  };

  /** 附件上传事件 */
  const handleFileUpload = (file: File) => {
    const { name, size } = file;
    const key = `ele${uuid(16, 10)}${String(Date.now())}`;
    const suffixIndex = name.lastIndexOf('.');
    const suffix = suffixIndex === -1 ? '' : name.substring(suffixIndex + 1);
    const item: FileItem = {
      key,
      name,
      description: `${suffix}  ${formatFileSize(size)[0]}`,
      file
    };
    emit('fileUpload', item);
    return false;
  };

  /** 同步输入框文本 */
  watch(
    () => props.modelValue,
    (val) => {
      const text = val ?? '';
      if ((content.value ?? '') !== text) {
        content.value = text;
      }
    }
  );

  watch(content, (val) => {
    const text = val ?? '';
    if ((props.modelValue ?? '') !== text) {
      emit('update:modelValue', text);
    }
  });
</script>

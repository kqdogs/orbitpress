<!-- 文件卡片 -->
<template>
  <div
    class="ele-chat-file-item"
    :class="[
      { 'is-exception': item.status === 'exception' },
      { 'is-uploading': item.status === 'uploading' }
    ]"
  >
    <div class="ele-chat-file-item-icon">
      <slot name="fileIcon" :item="item">
        <ElIcon
          v-if="item.status === 'uploading'"
          class="is-loading ele-chat-file-item-icon-loading"
        >
          <LoadingDotOutlined />
        </ElIcon>
        <FileIcon
          :fileName="item.name"
          :isDirectory="item.isDirectory"
          :icons="svgIcons"
        />
      </slot>
    </div>
    <div class="ele-chat-file-item-body">
      <div class="ele-chat-file-item-name" :title="item.name">
        {{ item.name }}
      </div>
      <div
        v-if="item.status === 'exception' && item.error !== ''"
        class="ele-chat-file-item-text is-exception"
      >
        {{ item.error ?? uploadError }}
      </div>
      <div v-else class="ele-chat-file-item-text">
        {{ item.description }}
      </div>
    </div>
    <div
      v-if="!(item.readonly ?? readonly)"
      class="ele-chat-file-item-del"
      @click.stop="handleItemDel"
    >
      <ElIcon>
        <CloseOutlined style="stroke-width: 6" />
      </ElIcon>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ElIcon } from 'element-plus';
  import { CloseOutlined, LoadingDotOutlined } from '../../icons/index';
  import FileIcon from '../../ele-file-list/components/file-icon.vue';
  import { svgIcons } from '../../ele-file-list/icons';
  import type { FileItem, FileCardSlots } from '../types';

  defineSlots<FileCardSlots>();

  const props = defineProps({
    /** 附件 */
    item: {
      type: Object as PropType<FileItem>,
      required: true
    },
    /** 是否只读模式 */
    readonly: Boolean,
    /** 上传失败文本 */
    uploadError: String
  });

  const emit = defineEmits({
    /** 附件删除事件 */
    fileRemove: (_item: FileItem, _e: MouseEvent) => true
  });

  /** 删除按钮点击事件 */
  const handleItemDel = (e: MouseEvent) => {
    emit('fileRemove', props.item, e);
  };
</script>

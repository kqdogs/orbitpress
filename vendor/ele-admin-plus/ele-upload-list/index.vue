<!-- 文件上传 -->
<template>
  <VueDraggable
    itemKey="key"
    :animation="300"
    :setData="() => void 0"
    handle=".ele-upload-handle"
    class="ele-upload-list"
    :class="[
      { 'is-file-list': listType === 'file' },
      { 'is-disabled': disabled }
    ]"
    v-bind="!sortable || sortable === true ? {} : sortable"
    :modelValue="modelValue || []"
    @update:modelValue="updateModelValue"
  >
    <template #item="{ element }">
      <ListItem
        :item="element"
        :readonly="readonly"
        :disabled="disabled"
        :sortable="sortable && !readonly && !disabled && limit !== 1"
        :imageProps="imageProps"
        :progressProps="progressProps"
        :imageObjectUrls="imageObjectUrls"
        :tools="tools"
        :listType="listType"
        :locale="lang"
        :style="itemStyle"
        @itemClick="handleItemClick"
        @remove="handleItemRemove"
        @edit="handleItemEdit"
        @preview="handleItemPreview"
        @retry="handleItemRetry"
      >
        <template
          v-for="name in Object.keys($slots).filter(
            (k) => !ownSlots.includes(k)
          )"
          #[name]="slotProps"
        >
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </ListItem>
    </template>
    <template #footer>
      <div
        v-if="uploadEnable && buttonStyle !== false"
        :style="typeof buttonStyle === 'boolean' ? void 0 : buttonStyle"
        class="ele-upload-item ele-upload-button"
      >
        <ElUpload
          action=""
          :drag="drag"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :showFileList="false"
          :beforeUpload="handleUpload"
        >
          <div class="ele-upload-button-inner" @click="handleUploadClick">
            <slot name="icon">
              <ElIcon class="ele-upload-icon">
                <PlusOutlined />
              </ElIcon>
            </slot>
          </div>
        </ElUpload>
      </div>
      <div class="ele-upload-hidden">
        <input
          v-if="tools && !readonly"
          ref="uploadInputRef"
          type="file"
          :accept="accept"
          class="ele-upload-input"
          @change="handleInputChange"
        />
        <EleImageViewer
          :infinite="false"
          v-bind="previewProps || {}"
          v-model="previewVisible"
          :urlList="previewImages"
          :initialIndex="previewCurrentIndex"
        />
      </div>
      <slot name="extra"></slot>
    </template>
  </VueDraggable>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onBeforeUnmount } from 'vue';
  import VueDraggable from 'vuedraggable';
  import { ElUpload, ElIcon } from 'element-plus';
  import { uuid } from '../utils/common';
  import { useLocale } from '../ele-config-provider/receiver';
  import EleImageViewer from '../ele-image-viewer/index.vue';
  import { PlusOutlined } from '../icons/index';
  import ListItem from './components/list-item.vue';
  import type { UploadItem, ImageObjectUrl } from './types';
  import { uploadListProps, uploadListEmits } from './props';
  const ownSlots = ['default', 'icon'];

  defineOptions({ name: 'EleUploadList' });

  const props = defineProps(uploadListProps);

  const emit = defineEmits(uploadListEmits);

  /** 国际化 */
  const { lang } = useLocale('upload', props);

  /** 图片预览是否打开 */
  const previewVisible = ref(false);

  /** 图片预览数据 */
  const previewImages = ref<string[]>([]);

  /** 图片预览当前索引 */
  const previewCurrentIndex = ref(0);

  /** 预读图片文件 */
  const imageObjectUrls = ref<ImageObjectUrl[]>([]);

  /** 修改时文件选择框 */
  const uploadInputRef = ref<HTMLInputElement | null>(null);

  /** 当前修改时的数据 */
  let editItem: UploadItem | null = null;

  /** 是否可上传 */
  const uploadEnable = computed<boolean>(() => {
    return (
      !props.readonly &&
      !(
        typeof props.limit === 'number' &&
        props.limit > 0 &&
        props.modelValue != null &&
        props.modelValue.length >= props.limit
      )
    );
  });

  /** 文件选择后生成数据 */
  const buildItem = (file: File): UploadItem => {
    return {
      key: `ele${uuid(16, 10)}${String(Date.now())}`,
      name: file.name,
      status: void 0,
      progress: 0,
      file
    };
  };

  /** 获取图片预览地址 */
  const getItemImageUrl = (item?: UploadItem, file?: File) => {
    if (item && item.url) {
      return item.url;
    }
    const itemFile = file ?? item?.file;
    if (itemFile != null && itemFile.type.startsWith('image')) {
      const t = imageObjectUrls.value.find((d) => d.file === itemFile);
      if (t != null) {
        return t.url;
      }
      const url = URL.createObjectURL(itemFile);
      imageObjectUrls.value.push({ file: itemFile, url });
      return url;
    }
  };

  /** 预览图片 */
  const previewItem = (item: UploadItem) => {
    if (props.beforePreview && props.beforePreview(item) === false) {
      return;
    }
    if (props.modelValue != null) {
      const data: { item: UploadItem; url: string }[] = [];
      props.modelValue.forEach((d) => {
        const url = getItemImageUrl(d);
        if (url && d.thumbnail !== false) {
          data.push({ item: d, url });
        }
      });
      const index = data.findIndex((t) => t.item.key === item.key);
      if (index !== -1) {
        const urls = data.map((d) => d.url);
        openImagePreview(urls, index);
      }
    }
  };

  /** 打开预览图片弹窗 */
  const openImagePreview = (urls: string[], index: number) => {
    previewImages.value = urls;
    previewCurrentIndex.value = index;
    previewVisible.value = true;
  };

  /** 更新数据 */
  const updateModelValue = (value: UploadItem[]) => {
    emit('update:modelValue', value);
  };

  /** 上传事件 */
  const handleUpload = (file: File) => {
    if (uploadEnable.value && !props.disabled) {
      const item = buildItem(file);
      emit('upload', item);
    }
    return false;
  };

  /** 点击事件 */
  const handleItemClick = (item: UploadItem) => {
    if (props.preview) {
      previewItem(item);
    }
    emit('itemClick', item);
  };

  /** 删除事件 */
  const handleItemRemove = (item: UploadItem) => {
    emit('remove', item);
  };

  /** 修改事件 */
  const handleItemEdit = (item: UploadItem) => {
    if (props.beforeItemEdit && props.beforeItemEdit(item) === false) {
      return;
    }
    const $input = uploadInputRef.value;
    if ($input != null) {
      editItem = item;
      $input.value = '';
      $input && $input.click();
    }
  };

  /** 预览事件 */
  const handleItemPreview = (item: UploadItem) => {
    previewItem(item);
    emit('preview', item);
  };

  /** 重试事件 */
  const handleItemRetry = (item: UploadItem) => {
    emit('retry', item);
  };

  /** 文件框选择事件 */
  const handleInputChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file != null && editItem != null) {
      const result = { item: editItem, newItem: buildItem(file) };
      editItem = null;
      emit('editUpload', result);
    }
  };

  /** 上传按钮点击事件 */
  const handleUploadClick = (e: MouseEvent) => {
    if (props.beforeUploadClick && props.beforeUploadClick(e) === false) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  /** 释放全部图片文件预读 */
  const clearImageObjectUrls = () => {
    const temp = imageObjectUrls.value;
    imageObjectUrls.value = [];
    temp.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });
  };

  /** 更新图片文件预读 */
  watch(
    () => props.modelValue,
    () => {
      if (props.modelValue == null) {
        clearImageObjectUrls();
        return;
      }
      const urls: string[] = [];
      props.modelValue.forEach((item) => {
        const url = getItemImageUrl(item);
        if (url) {
          urls.push(url);
        }
      });
      for (let i = imageObjectUrls.value.length - 1; i >= 0; i--) {
        const url = imageObjectUrls.value[i].url;
        if (!urls.includes(url)) {
          imageObjectUrls.value.splice(i, 1);
          URL.revokeObjectURL(url);
        }
      }
    },
    {
      immediate: true,
      deep: true
    }
  );

  /** 释放图片文件预读 */
  onBeforeUnmount(() => {
    clearImageObjectUrls();
  });

  defineExpose({
    openImagePreview
  });
</script>

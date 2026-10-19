<!-- 图片裁剪弹窗 -->
<template>
  <EleModal
    width="660px"
    :title="lang.title"
    v-bind="modalProps || {}"
    :modelValue="modelValue"
    @update:modelValue="updateModelValue"
  >
    <EleCropper
      :height="height"
      :src="src"
      :imageType="imageType"
      :accept="accept"
      :tools="tools"
      :preview="preview"
      :previewWidth="previewWidth"
      :toBlob="toBlob"
      :options="options"
      :croppedOptions="croppedOptions"
      :aspectRatio="aspectRatio"
      :tooltip="tooltip"
      :tooltipProps="tooltipProps"
      :beforeUploadClick="beforeUploadClick"
      :responsive="responsive"
      :locale="locale"
      @init="handleInit"
      @done="handleDone"
    />
    <template
      v-for="name in Object.keys($slots).filter((k) => k !== 'default')"
      #[name]="slotProps"
    >
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EleModal>
</template>

<script lang="ts" setup>
  import type Cropper from 'cropperjs';
  import { useLocale } from '../ele-config-provider/receiver';
  import EleModal from '../ele-modal/index.vue';
  import EleCropper from '../ele-cropper/index.vue';
  import { cropperModalProps, cropperModalEmits } from './props';

  defineOptions({ name: 'EleCropperModal' });

  const props = defineProps(cropperModalProps);

  const emit = defineEmits(cropperModalEmits);

  const { lang } = useLocale('cropper', props);

  /** 更新绑定值 */
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };

  /** 初始化完成 */
  const handleInit = (cropperInstance: Cropper) => {
    emit('init', cropperInstance);
  };

  /** 裁剪完成 */
  const handleDone = (result: Blob | string | null) => {
    emit('done', result);
  };
</script>

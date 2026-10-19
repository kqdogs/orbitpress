<template>
  <slot></slot>
  <EleImageViewer
    v-if="imageViewerProps"
    v-bind="imageViewerProps"
    ref="imageViewerRef"
    v-model="imageViewerVisible"
  />
</template>

<script lang="ts" setup>
  import EleImageViewer from '../ele-image-viewer/index.vue';
  import { useImageViewerProvider } from './util';

  defineOptions({ name: 'EleImageViewerProvider' });

  const {
    imageViewerRef,
    imageViewerProps,
    imageViewerVisible,
    opemImageViewer,
    removeImageViewer
  } = useImageViewerProvider();

  defineExpose({
    opemImageViewer,
    removeImageViewer,
    imageViewerRef
  });
</script>

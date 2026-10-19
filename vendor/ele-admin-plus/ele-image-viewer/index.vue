<!-- 图片预览 -->
<template>
  <Teleport to="body" :disabled="!teleported">
    <Transition :name="transitionName" :appear="true">
      <MainContent
        v-if="modelValue"
        class="ele-image-viewer"
        :class="customClass"
        :style="customStyle"
      >
        <ElImageViewer
          v-bind="{
            ...$attrs,
            ...omit($props, [
              'modelValue',
              'customClass',
              'customStyle',
              'transitionName',
              'keepAlive'
            ])
          }"
          ref="imageViewerRef"
          :teleported="false"
          @close="handleClose"
          @switch="handleSwitch"
          @rotate="handleRotate"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ElImageViewer>
      </MainContent>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
  import { ref, onDeactivated } from 'vue';
  import { ElImageViewer } from 'element-plus';
  import { omit } from '../utils/common';
  import type { ElImageViewerInstance } from '../ele-app/el';
  import MainContent from '../ele-loading/components/main-content.vue';
  import { imageViewerProps, imageViewerEmits } from './props';

  defineOptions({ name: 'EleImageViewer', inheritAttrs: false });

  defineProps(imageViewerProps);

  const emit = defineEmits(imageViewerEmits);

  /** 组件实例 */
  const imageViewerRef = ref<ElImageViewerInstance>(null);

  /** 关闭 */
  const handleClose = () => {
    emit('update:modelValue', false);
    emit('close');
  };

  /** 切换图像 */
  const handleSwitch = (index: number) => {
    emit('switch', index);
  };

  /** 旋转图像 */
  const handleRotate = (deg: number) => {
    emit('rotate', deg);
  };

  /** 切换图片 */
  const setActiveItem = (index: number) => {
    imageViewerRef.value && imageViewerRef.value.setActiveItem(index);
  };

  /** 页面失活关闭 */
  onDeactivated(() => {
    handleClose();
  });

  defineExpose({
    imageViewerRef,
    setActiveItem
  });
</script>

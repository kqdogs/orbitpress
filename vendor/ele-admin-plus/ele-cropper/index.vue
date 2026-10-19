<!-- 图片裁剪 -->
<template>
  <div class="ele-cropper" :class="{ 'is-responsive': isResponsive }">
    <div ref="containerRef" class="ele-cropper-main" :style="{ height }"></div>
    <CropperTools
      :tools="tools"
      :accept="accept"
      :locale="locale"
      :tooltip="tooltip"
      :tooltipProps="tooltipProps"
      :beforeUploadClick="beforeUploadClick"
      @action="handleAction"
      @upload="handleUpload"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, onBeforeUnmount, useId } from 'vue';
  import Cropper from 'cropperjs';
  import { useResponsive } from '../ele-pro-layout/util';
  import CropperTools from './components/cropper-tools.vue';
  import type { ToolName, UploadOption } from './types';
  import { cropperProps, cropperEmits } from './props';

  defineOptions({ name: 'EleCropper' });

  const props = defineProps(cropperProps);

  const emit = defineEmits(cropperEmits);

  const cropperId = useId();

  /** 是否开启布局响应 */
  const isResponsive = useResponsive(props);

  /** 容器节点 */
  const containerRef = ref<HTMLDivElement | null>(null);

  /** 裁剪组件实例 */
  let cropperInstance: Cropper | null = null;

  /** 当前图片类型 */
  let imageType = props.imageType;

  /** 获取裁剪图像组件实例 */
  const getCropperImage = () => {
    if (!cropperInstance) {
      return;
    }
    return cropperInstance.getCropperImage();
  };

  /** 获取裁剪选区组件实例 */
  const getCropperSelection = () => {
    if (!cropperInstance) {
      return;
    }
    return cropperInstance.getCropperSelection();
  };

  /** 获取裁剪画布组件实例 */
  /* const getCropperCanvas = () => {
    if (!cropperInstance) {
      return;
    }
    return cropperInstance.getCropperCanvas();
  }; */

  /** 渲染 */
  const render = (src: string) => {
    if (!containerRef.value) {
      return;
    }
    const pw = props.previewWidth;
    const aspectRatio =
      props.aspectRatio ?? (props.options as any)?.aspectRatio;
    const aspectRatioStr = aspectRatio ? ` aspect-ratio="${aspectRatio}"` : '';
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'anonymous';
    cropperInstance = new Cropper(image, {
      template:
        props.options?.template ??
        `<div class="ele-cropper-image">
  <cropper-canvas background>
    <cropper-image rotatable scalable translatable></cropper-image>
    <cropper-shade hidden></cropper-shade>
    <cropper-handle action="move" plain></cropper-handle>
    <cropper-selection id="${cropperId}"${aspectRatioStr} initial-coverage="0.8" movable resizable>
      <cropper-grid role="grid" bordered covered></cropper-grid>
      <cropper-crosshair centered></cropper-crosshair>
      <cropper-handle action="move" theme-color="rgba(0, 0, 0, 0)"></cropper-handle>
      <cropper-handle action="n-resize"></cropper-handle>
      <cropper-handle action="e-resize"></cropper-handle>
      <cropper-handle action="s-resize"></cropper-handle>
      <cropper-handle action="w-resize"></cropper-handle>
      <cropper-handle action="ne-resize"></cropper-handle>
      <cropper-handle action="nw-resize"></cropper-handle>
      <cropper-handle action="se-resize"></cropper-handle>
      <cropper-handle action="sw-resize"></cropper-handle>
    </cropper-selection>
  </cropper-canvas>
</div>
<div class="ele-cropper-previews" style="width: ${pw}px;">
  <cropper-viewer selection="#${cropperId}" class="ele-cropper-preview"></cropper-viewer>
  <cropper-viewer selection="#${cropperId}" class="ele-cropper-preview ${aspectRatio === 1 ? 'is-circle' : 'is-small'}"></cropper-viewer>
</div>`,
      container: containerRef.value
    });
    /* const cropperSelection = getCropperSelection();
    if (cropperSelection) {
      cropperSelection.addEventListener('change', (e: any) => {
        const cropperImage = getCropperImage();
        const cropperCanvas = getCropperCanvas();
        if (cropperImage && cropperCanvas) {
          const cropperImageRect = cropperImage.getBoundingClientRect();
          const cropperCanvasRect = cropperCanvas.getBoundingClientRect();
          const selection = e.detail;
          const maxSelection = {
            x: cropperImageRect.left - cropperCanvasRect.left,
            y: cropperImageRect.top - cropperCanvasRect.top,
            width: cropperImageRect.width,
            height: cropperImageRect.height
          };
          if (maxSelection.width && maxSelection.height) {
            const inSelection =
              selection.x >= maxSelection.x &&
              selection.y >= maxSelection.y &&
              selection.x + selection.width <=
                maxSelection.x + maxSelection.width &&
              selection.y + selection.height <=
                maxSelection.y + maxSelection.height;
            if (!inSelection) {
              e.preventDefault();
            }
          }
        }
      });
    } */
    emit('init', cropperInstance);
  };

  /** 触发完成事件 */
  const handleDone = (result?: Blob | string | null) => {
    emit('done', result);
  };

  /** 操作裁剪组件 */
  const handleAction = (action: Exclude<ToolName, 'upload'>) => {
    const cropperImage = getCropperImage();
    if (!cropperImage) {
      return;
    }
    switch (action) {
      case 'zoomIn':
        cropperImage.$zoom(0.1);
        break;
      case 'zoomOut':
        cropperImage.$zoom(-0.1);
        break;
      case 'moveLeft':
        cropperImage.$move(-10, 0);
        break;
      case 'moveRight':
        cropperImage.$move(10, 0);
        break;
      case 'moveUp':
        cropperImage.$move(0, -10);
        break;
      case 'moveDown':
        cropperImage.$move(0, 10);
        break;
      case 'rotateLeft':
        cropperImage.$rotate(-Math.PI / 4);
        break;
      case 'rotateRight':
        cropperImage.$rotate(Math.PI / 4);
        break;
      case 'flipX':
        cropperImage.$scale(-1, 1);
        break;
      case 'flipY':
        cropperImage.$scale(1, -1);
        break;
      case 'reset':
        cropperImage.$resetTransform();
        cropperImage.$center('contain');
        const cropperSelection = getCropperSelection();
        cropperSelection && cropperSelection.$reset();
        break;
      case 'ok':
        handleOk();
        break;
    }
  };

  /** 销毁 */
  const destroy = () => {
    cropperInstance && cropperInstance.destroy();
    cropperInstance = null;
  };

  /** 替换图片 */
  const handleUpload = ({ data, type }: UploadOption) => {
    if (!data) {
      return;
    }
    const cropperImage = getCropperImage();
    if (cropperImage) {
      imageType = type;
      cropperImage.src = data;
    }
  };

  /** 裁剪 */
  const handleOk = () => {
    const cropperSelection = getCropperSelection();
    if (!cropperSelection) {
      handleDone();
      return;
    }
    cropperSelection
      .$toCanvas(props.croppedOptions)
      .then((canvas) => {
        if (props.toBlob) {
          canvas.toBlob((blob) => {
            handleDone(blob);
          }, imageType);
        } else {
          handleDone(canvas.toDataURL(imageType));
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  /** 同步属性 */
  watch(
    () => props.imageType,
    (type) => {
      if (type) {
        imageType = type;
      }
    }
  );

  watch(
    () => props.src,
    (src) => {
      if (!src) {
        destroy();
        return;
      }
      const cropperImage = getCropperImage();
      if (!cropperImage) {
        render(src);
        return;
      }
      cropperImage.src = src;
    }
  );

  onMounted(() => {
    if (props.src) {
      render(props.src);
    }
  });

  onBeforeUnmount(() => {
    destroy();
  });
</script>

<template>
  <div class="ele-qr-code" :style="{ display: 'inline-flex' }">
    <img
      v-if="tag === 'img'"
      :src="imgData"
      :style="[{ width: size + 'px', height: size + 'px' }, customStyle || {}]"
    />
    <canvas
      ref="canvasRef"
      :style="[
        {
          width: size + 'px',
          height: size + 'px',
          display: tag === 'img' ? 'none' : void 0
        },
        customStyle || {}
      ]"
    >
    </canvas>
    <img
      v-if="imageSettings && imageSettings.src"
      ref="imageRef"
      :src="imageSettings.src"
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
      :style="{ display: 'none' }"
      @load="render"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from 'vue';
  import qrcodegen from '../qrcodegen';
  import { qrCodeProps, qrCodeEmits } from '../props';
  import {
    ERROR_LEVEL_MAP,
    SUPPORTS_PATH2D,
    getImageSettings,
    excavateModules,
    generatePath
  } from '../util';

  defineOptions({ name: 'CanvasRender' });

  const props = defineProps(qrCodeProps);

  const emit = defineEmits(qrCodeEmits);

  /** 使用图片标签时的图片数据 */
  const imgData = ref('');

  /** 画布节点 */
  const canvasRef = ref<HTMLCanvasElement | null>(null);

  /** 图像节点 */
  const imageRef = ref<HTMLImageElement | null>(null);

  /** 渲染 */
  const render = () => {
    const { value, size, level, bgColor, fgColor, margin, imageSettings } =
      props;
    const canvas = canvasRef.value;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    if (!value) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    let cells = qrcodegen.QrCode.encodeText(
      value,
      ERROR_LEVEL_MAP[level]
    ).getModules();
    const numCells = cells.length + margin * 2;
    const calculatedImageSettings = getImageSettings(
      imageSettings,
      size,
      margin,
      cells
    );
    const image = imageRef.value;
    const haveImageToRender =
      calculatedImageSettings != null &&
      image != null &&
      image.complete &&
      image.naturalHeight !== 0 &&
      image.naturalWidth !== 0;
    if (haveImageToRender && calculatedImageSettings.excavation != null) {
      cells = excavateModules(cells, calculatedImageSettings.excavation);
    }
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.height = canvas.width = size * pixelRatio;
    const scale = (size / numCells) * pixelRatio;
    ctx.scale(scale, scale);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, numCells, numCells);
    ctx.fillStyle = fgColor;
    if (SUPPORTS_PATH2D) {
      ctx.fill(new Path2D(generatePath(cells, margin)));
    } else {
      cells.forEach(function (row, rdx) {
        row.forEach(function (cell, cdx) {
          if (cell) {
            ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
          }
        });
      });
    }
    if (haveImageToRender) {
      ctx.drawImage(
        image as CanvasImageSource,
        calculatedImageSettings.x + margin,
        calculatedImageSettings.y + margin,
        calculatedImageSettings.w,
        calculatedImageSettings.h
      );
    }
    if (props.tag === 'img') {
      imgData.value = canvas.toDataURL();
    }
    emit('done');
  };

  watch(
    [
      () => props.value,
      () => props.size,
      () => props.level,
      () => props.margin,
      () => props.bgColor,
      () => props.fgColor,
      () => props.tag
    ],
    () => {
      render();
    }
  );

  watch(
    () => props.imageSettings,
    () => {
      render();
    },
    { deep: true }
  );

  onMounted(() => {
    render();
  });
</script>

<!-- 二维码svg渲染 -->
<template>
  <div class="ele-qr-code" :style="{ display: 'inline-flex' }">
    <svg
      v-if="viewBox"
      shapeRendering="crispEdges"
      :height="size"
      :width="size"
      :viewBox="viewBox"
      :style="customStyle"
    >
      <path :fill="bgColor" :d="path" />
      <path :fill="fgColor" :d="fgPath" />
      <image
        v-if="imageSettings && imageSettings.src"
        :xlink:href="imageSettings.src"
        :height="imageHeight"
        :width="imageWidth"
        :x="imageX"
        :y="imageY"
        preserveAspectRatio="none"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import qrcodegen from '../ele-qr-code/qrcodegen';
  import {
    ERROR_LEVEL_MAP,
    getImageSettings,
    excavateModules,
    generatePath
  } from '../ele-qr-code/util';
  import { qrCodeProps, qrCodeEmits } from '../ele-qr-code/props';

  defineOptions({ name: 'EleQrCodeSvg' });

  const props = defineProps(qrCodeProps);

  const emit = defineEmits(qrCodeEmits);

  /** 绘制区域 */
  const viewBox = ref<string>('');

  /** 背景路径 */
  const path = ref<string>('');

  /** 前景路径 */
  const fgPath = ref<string>('');

  /** 自定义图片高度 */
  const imageHeight = ref<number>(0);

  /** 自定义图片宽度 */
  const imageWidth = ref<number>(0);

  /** 自定义图片x坐标 */
  const imageX = ref<number>(0);

  /** 自定义图片y坐标 */
  const imageY = ref<number>(0);

  /** 渲染 */
  const render = () => {
    const { value, size, level, margin, imageSettings } = props;
    if (!value) {
      viewBox.value = '';
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
    if (imageSettings != null && calculatedImageSettings != null) {
      if (calculatedImageSettings.excavation != null) {
        cells = excavateModules(cells, calculatedImageSettings.excavation);
      }
      imageHeight.value = calculatedImageSettings.h;
      imageWidth.value = calculatedImageSettings.w;
      imageX.value = calculatedImageSettings.x + margin;
      imageY.value = calculatedImageSettings.y + margin;
    }
    viewBox.value = `0 0 ${numCells} ${numCells}`;
    path.value = `M0,0 h${numCells}v${numCells}H0z`;
    fgPath.value = generatePath(cells, margin);
    emit('done');
  };

  watch(
    [
      () => props.value,
      () => props.size,
      () => props.level,
      () => props.margin
    ],
    () => {
      render();
    },
    { immediate: true }
  );

  watch(
    () => props.imageSettings,
    () => {
      render();
    },
    { deep: true }
  );
</script>

<!-- 二维码 -->
<template>
  <EleQrCodeSvg
    v-if="tag === 'svg'"
    :value="value"
    :size="size"
    :level="level"
    :bgColor="bgColor"
    :fgColor="fgColor"
    :margin="margin"
    :imageSettings="imageSettings"
    :customStyle="customStyle"
    @done="handleDone"
  />
  <CanvasRender
    v-else
    :value="value"
    :size="size"
    :level="level"
    :bgColor="bgColor"
    :fgColor="fgColor"
    :margin="margin"
    :imageSettings="imageSettings"
    :customStyle="customStyle"
    :tag="tag"
    @done="handleDone"
  />
</template>

<script lang="ts" setup>
  import EleQrCodeSvg from '../ele-qr-code-svg/index.vue';
  import CanvasRender from './components/canvas-render.vue';
  import { qrCodeProps, qrCodeEmits } from './props';

  defineOptions({ name: 'EleQrCode' });

  defineProps(qrCodeProps);

  const emit = defineEmits(qrCodeEmits);

  const handleDone = () => {
    emit('done');
  };
</script>

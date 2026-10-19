<!-- 水印 -->
<template>
  <div ref="wrapperRef" :key="imageId" :style="markWrapperStyle">
    <slot></slot>
    <div
      v-if="!svgRender && markDisabled"
      ref="imageRef"
      :key="imageStyleId"
      :style="imageStyle"
    ></div>
    <Teleport
      v-else-if="svgMarkOption && markDisabled"
      to="body"
      :disabled="markTeleport"
    >
      <SvgRender v-bind="svgMarkOption" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed,
    watch,
    inject,
    onActivated,
    onDeactivated
  } from 'vue';
  import type { StyleValue } from '../ele-app/types';
  import { normalizeStringArray } from '../utils/common';
  import { useMutation } from '../ele-qr-code-svg/util';
  import SvgRender from '../ele-qr-code-svg/components/svg-render.vue';
  import type { WatermarkFont, ImageStyleOption, SvgMarkOption } from './types';
  import { svgContents } from './util';
  import { watermarkProps } from './props';

  defineOptions({ name: 'EleWatermark' });

  const props = defineProps(watermarkProps);

  /** 容器节点 */
  const wrapperRef = ref<HTMLDivElement | null>(null);

  /** 水印节点 */
  const imageRef = ref<HTMLDivElement | null>(null);

  /** 公共样式 */
  const markCommonStyle = computed<StyleValue>(() => {
    const position = props.fixed ? 'fixed' : 'absolute';
    const width = props.fixed ? '100vw' : '100%';
    const height = props.fixed ? '100vh' : '100%';
    return {
      position: `${position} !important` as any,
      top: '0 !important',
      left: '0 !important',
      right: '0 !important',
      bottom: '0 !important',
      width: `${width} !important`,
      height: `${height} !important`,
      zIndex: `${props.zIndex ?? 2147483647} !important` as any,
      pointerEvents: 'none !important' as any,
      ...(props.customStyle || {})
    };
  });

  /** 页面是否是失活状态 */
  const isDeactivated = ref<boolean>(false);

  /** svg模式参数 */
  const svgMarkOption = ref<SvgMarkOption>();

  /** canvas模式参数 */
  const imageConfig = inject(svgContents, null);

  /** 容器高度 */
  const markWrapperHeight = computed<string | undefined>(() => {
    if (props.wrapHeight != null && typeof props.wrapHeight === 'number') {
      return `${props.wrapHeight}px`;
    }
    return props.wrapHeight;
  });

  /** 容器样式 */
  const markWrapperStyle = computed<StyleValue[]>(() => {
    const styles: StyleValue[] = [];
    if (markWrapperHeight.value) {
      styles.push({ height: markWrapperHeight.value });
    }
    if (props.wrapPosition && !props.fixed) {
      styles.push({ position: 'relative' });
    }
    return styles;
  });

  /** 重绘水印 */
  const markId = computed(() => (imageConfig ? !imageConfig.id : 1));

  /** 获取生成参数 */
  const getImageStyleOption = (): ImageStyleOption | undefined => {
    if (!markDisabled.value) {
      svgMarkOption.value = void 0;
      return;
    }
    const defaultWidth = 120;
    const defaultHeight = 64;
    const gapX = props.gap?.[0] ?? 100;
    const gapY = props.gap?.[1] ?? 100;
    const option = {
      rotate: props.rotate ?? -22,
      lineGap: props.lineGap ?? 3,
      font: {
        color: 'rgba(122, 122, 122, 0.35)',
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontStyle: 'normal',
        ...(props.font || {})
      } as Required<WatermarkFont>,
      contents: normalizeStringArray(
        props.content,
        [imageConfig && !imageConfig.id, 'el', 'NDSP'],
        observeText
      ),
      image: props.image,
      width: props.width,
      height: props.height,
      gapX,
      gapY,
      commonStyle: markCommonStyle.value
    };
    if (props.svgRender) {
      svgMarkOption.value = {
        ...option,
        width: option.width ?? defaultWidth,
        height: option.height ?? defaultHeight,
        offsetX: props.offset?.[0] ?? gapX / 2,
        offsetY: props.offset?.[1] ?? gapY / 2
      };
      return;
    }
    return {
      ...option,
      defaultWidth,
      defaultHeight,
      offsetX: props.offset?.[0] ?? 0,
      offsetY: props.offset?.[1] ?? 0
    };
  };
  const { imageId, imageStyleId, imageStyle, observeText, updateImageStyle } =
    useMutation({
      getWrapperEl: () => wrapperRef.value,
      getImageEl: () => imageRef.value,
      getImageStyleOption
    });

  /** 水印插入到页面主体 */
  const markTeleport = computed(() => isDeactivated.value || !props.fixed);

  /** 禁用水印 */
  const markDisabled = computed(() => !props.disabled || markId.value);

  /** 更新水印 */
  watch(
    [
      () => props.offset,
      () => props.width,
      () => props.height,
      () => props.gap,
      () => props.font,
      () => props.content,
      () => props.rotate,
      () => props.image,
      () => props.lineGap,
      () => props.svgRender,
      markCommonStyle,
      markDisabled
    ],
    () => {
      updateImageStyle();
    },
    { deep: true }
  );

  onActivated(() => {
    isDeactivated.value = false;
  });

  onDeactivated(() => {
    isDeactivated.value = true;
  });
</script>

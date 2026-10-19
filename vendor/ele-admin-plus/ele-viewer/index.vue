<!-- 内容预览 -->
<template>
  <div ref="viewerRef" class="ele-viewer">
    <div
      ref="bodyRef"
      class="ele-viewer-body"
      :style="{
        transform: `translate(${viewerTranslateX}px, ${viewerTranslateY}px)`
      }"
    >
      <div
        class="ele-viewer-main"
        :style="{ transform: `scale(${(viewerScale / 100).toFixed(6)})` }"
      >
        <div
          class="ele-viewer-content"
          :class="{ 'is-moving': viewerMoving }"
          :style="[contentStyle || {}, { transform: imageTransform }]"
          @mousedown="handleMousedown"
          @touchstart.passive="handleTouchstart"
          @click="handleClick"
          @contextmenu="handleContextmenu"
        >
          <img
            v-if="src"
            :src="src"
            class="ele-viewer-image"
            :style="imageStyle"
            @load="handleImgLoad"
          />
          <div v-else class="ele-viewer-image" :style="imageStyle">
            <slot></slot>
          </div>
          <div
            v-for="marker in markers"
            :key="marker.key"
            :style="{
              left: (marker.x || 0) + 'px',
              top: (marker.y || 0) + 'px',
              transform: marker.fixed ? `scale(${scaleReverse})` : void 0
            }"
            class="ele-viewer-marker"
          >
            <div
              class="ele-viewer-marker-content"
              :style="{
                transform: marker.fixed ? imageTransformReverse : void 0
              }"
            >
              <slot name="markerItem" :item="marker"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useMousewheel, useMoveEvent } from '../utils/hook';
  import { getRotatedBounds, useContentRatio } from './util';
  import { viewerProps, viewerEmits } from './props';

  defineOptions({ name: 'EleViewer' });

  const props = defineProps(viewerProps);

  const emit = defineEmits(viewerEmits);

  /** 容器节点 */
  const viewerRef = ref<HTMLElement | null>(null);

  /** 主体节点 */
  const bodyRef = ref<HTMLElement | null>(null);

  /** 是否移动中 */
  const viewerMoving = ref(false);

  /** 横向平移 */
  const viewerTranslateX = ref(0);

  /** 纵向平移 */
  const viewerTranslateY = ref(0);

  /** 缩放等级 */
  const viewerScale = ref(100);

  /** 是否水平翻转 */
  const viewerFlipX = ref(false);

  /** 是否垂直翻转 */
  const viewerFlipY = ref(false);

  /** 旋转角度 */
  const viewerRotate = ref(0);

  /** 图片变换样式 */
  const imageTransform = computed(() => {
    const sx = viewerFlipX.value ? -1 : 1;
    const sy = viewerFlipY.value ? -1 : 1;
    return `scaleX(${sx}) scaleY(${sy}) rotate(${viewerRotate.value}deg)`;
  });

  /** 反向缩放等级 */
  const scaleReverse = computed<string>(() => {
    return (100 / viewerScale.value).toFixed(6);
  });

  /** 反向图片变换样式 */
  const imageTransformReverse = computed(() => {
    const sx = viewerFlipX.value ? -1 : 1;
    const sy = viewerFlipY.value ? -1 : 1;
    return `scaleX(${sx}) scaleY(${sy}) rotate(${360 - viewerRotate.value}deg)`;
  });

  /** 内容点击事件 */
  const handleClick = (e: MouseEvent) => {
    emit('contentClick', e);
  };

  /** 内容右键点击事件 */
  const handleContextmenu = (e: MouseEvent) => {
    emit('contentContextmenu', e);
  };

  /** 图片加载完成事件 */
  const handleImgLoad = () => {
    autoIntoView();
  };

  /** 获取缩放步数 */
  const getZoomStep = () => {
    return props.zoomStep;
  };

  /** 放大 */
  const zoomIn = () => {
    if (viewerScale.value >= props.zoomMax) {
      return;
    }
    viewerScale.value += getZoomStep();
  };

  /** 缩小 */
  const zoomOut = () => {
    if (viewerScale.value <= props.zoomMin) {
      return;
    }
    viewerScale.value -= getZoomStep();
  };

  /** 水平翻转 */
  const flipX = () => {
    viewerFlipX.value = !viewerFlipX.value;
  };

  /** 垂直翻转 */
  const flipY = () => {
    viewerFlipY.value = !viewerFlipY.value;
  };

  /** 向左旋转 */
  const rotateLeft = () => {
    if (viewerRotate.value === 0) {
      viewerRotate.value = 360 - props.rotateStep;
      return;
    }
    if (viewerRotate.value <= props.rotateStep) {
      viewerRotate.value = 0;
      return;
    }
    viewerRotate.value -= props.rotateStep;
  };

  /** 向右旋转 */
  const rotateRight = () => {
    if (viewerRotate.value >= 360 - props.rotateStep) {
      viewerRotate.value = 0;
      return;
    }
    viewerRotate.value += props.rotateStep;
  };

  /** 设置横向平移距离 */
  const setTranslateX = (xValue: number) => {
    viewerTranslateX.value = xValue;
  };

  /** 设置纵向平移距离 */
  const setTranslateY = (yValue: number) => {
    viewerTranslateY.value = yValue;
  };

  /** 自动缩放到完全展示并移动至中间 */
  const autoIntoView = () => {
    const pEl = viewerRef.value;
    const pw = pEl?.offsetWidth || 0;
    const ph = pEl?.offsetHeight || 0;
    const el = bodyRef.value;
    const w = el?.offsetWidth || 0;
    const h = el?.offsetHeight || 0;
    viewerTranslateX.value = Math.floor((pw - w) / 2);
    viewerTranslateY.value = Math.floor((ph - h) / 2);
    const { width, height } = getRotatedBounds(w, h, viewerRotate.value);
    viewerScale.value = Math.min((pw / width) * 100, (ph / height) * 100);
  };

  /** 自动缩放到宽度完全展示并移动至中间 */
  const autoIntoViewWidth = () => {
    const pEl = viewerRef.value;
    const pw = pEl?.offsetWidth || 0;
    const ph = pEl?.offsetHeight || 0;
    const el = bodyRef.value;
    const w = el?.offsetWidth || 0;
    const h = el?.offsetHeight || 0;
    viewerScale.value = (pw / w) * 100;
    const sh = h * (viewerScale.value / 100);
    viewerTranslateX.value = Math.floor((pw - w) / 2);
    if (sh < ph) {
      viewerTranslateY.value = Math.floor((ph - h) / 2);
    } else {
      viewerTranslateY.value = Math.floor((sh - h) / 2);
    }
  };

  /** 自动缩放到高度完全展示并移动至中间 */
  const autoIntoViewHeight = () => {
    const pEl = viewerRef.value;
    const pw = pEl?.offsetWidth || 0;
    const ph = pEl?.offsetHeight || 0;
    const el = bodyRef.value;
    const w = el?.offsetWidth || 0;
    const h = el?.offsetHeight || 0;
    viewerScale.value = (ph / h) * 100;
    const sw = w * (viewerScale.value / 100);
    if (sw < pw) {
      viewerTranslateX.value = Math.floor((pw - w) / 2);
    } else {
      viewerTranslateX.value = Math.floor((sw - w) / 2);
    }
    viewerTranslateY.value = Math.floor((ph - h) / 2);
  };

  /** 重置 */
  const reset = () => {
    viewerFlipX.value = false;
    viewerFlipY.value = false;
    viewerRotate.value = 0;
    autoIntoView();
  };

  /** 移动事件处理 */
  let startX: number | null = null;
  let startY: number | null = null;
  const { handleMousedown, handleTouchstart } = useMoveEvent({
    start: () => {
      viewerMoving.value = true;
      startX = viewerTranslateX.value;
      startY = viewerTranslateY.value;
    },
    move: ({ distanceX, distanceY, e }) => {
      if (
        startX == null ||
        startY == null ||
        distanceX == null ||
        distanceY == null ||
        !contentStyle.show.value
      ) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      viewerTranslateX.value = Math.floor(distanceX + startX);
      viewerTranslateY.value = Math.floor(distanceY + startY);
    },
    end: () => {
      startX = null;
      startY = null;
      viewerMoving.value = false;
    },
    touchmoveOptions: { passive: false }
  });

  /** 鼠标滚动方法缩小 */
  const { bindMousewheel, unbindMousewheel } = useMousewheel(
    ({ e, direction }) => {
      e.preventDefault();
      e.stopPropagation();
      if (direction === 'up') {
        zoomIn();
        return;
      }
      zoomOut();
    }
  );
  const contentStyle = useContentRatio();

  onMounted(() => {
    viewerRef.value && bindMousewheel(viewerRef.value);
    autoIntoView();
  });

  onBeforeUnmount(() => {
    viewerRef.value && unbindMousewheel(viewerRef.value);
  });

  defineExpose({
    viewerMoving,
    viewerTranslateX,
    viewerTranslateY,
    viewerScale,
    viewerFlipX,
    viewerFlipY,
    viewerRotate,
    zoomIn,
    zoomOut,
    flipX,
    flipY,
    rotateLeft,
    rotateRight,
    setTranslateX,
    setTranslateY,
    autoIntoView,
    autoIntoViewWidth,
    autoIntoViewHeight,
    reset
  });
</script>

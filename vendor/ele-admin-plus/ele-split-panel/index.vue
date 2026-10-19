<!-- 分割面板 -->
<template>
  <div
    ref="wrapperRef"
    class="ele-split-panel"
    :class="[
      { 'is-reverse': reverse },
      { 'is-vertical': vertical },
      { 'is-collapse': isCollapse === true },
      { 'is-maximized': isCollapse === 'body' },
      { 'is-resizing': resizing },
      { 'is-responsive': isResponsive },
      { 'is-flex-table': flexTable && flexTable !== 'auto' },
      { 'is-flex-auto-table': flexTable === 'auto' }
    ]"
  >
    <!-- 边栏 -->
    <div
      ref="sideWrapperRef"
      class="ele-split-panel-wrap"
      :style="[customWrapStyle, sideWrapStyle]"
    >
      <div class="ele-split-panel-side" :style="customStyle">
        <div
          v-if="$slots.sideHeader"
          class="ele-split-panel-side-header"
          :style="sideHeaderStyle"
        >
          <slot name="sideHeader"></slot>
        </div>
        <slot></slot>
      </div>
      <div class="ele-split-panel-tools">
        <!-- 拉伸线 -->
        <div
          v-if="resizable"
          class="ele-split-panel-resize"
          @mousedown="handleMousedown"
          @touchstart.passive="handleTouchstart"
        ></div>
        <!-- 折叠按钮组 -->
        <div
          v-if="allowCollapse === 'both'"
          class="ele-split-panel-collapse-btn-group"
          :style="btnGroupStyle"
        >
          <!-- 折叠按钮 -->
          <div
            :style="collapseStyle"
            class="ele-split-panel-collapse-btn is-collapse-btn"
            @click="toggleCollapse(isCollapse === 'body' ? false : true)"
          >
            <slot name="collapse" :collapse="isCollapse">
              <ElIcon class="ele-split-panel-collapse-icon">
                <ArrowUp
                  v-if="vertical"
                  :style="{ strokeWidth: 5, marginTop: '-1.25px' }"
                />
                <ArrowLeft
                  v-else
                  :style="{ strokeWidth: 5, marginLeft: '-1.25px' }"
                />
              </ElIcon>
            </slot>
          </div>
          <!-- 最大化按钮 -->
          <div
            :style="collapseStyle"
            class="ele-split-panel-collapse-btn is-maximized-btn"
            @click="toggleCollapse(isCollapse === true ? false : 'body')"
          >
            <slot name="maximized" :collapse="isCollapse">
              <ElIcon class="ele-split-panel-collapse-icon">
                <ArrowUp
                  v-if="vertical"
                  :style="{ strokeWidth: 5, marginTop: '-1.25px' }"
                />
                <ArrowLeft
                  v-else
                  :style="{ strokeWidth: 5, marginLeft: '-1.25px' }"
                />
              </ElIcon>
            </slot>
          </div>
        </div>
        <!-- 折叠按钮 -->
        <div
          v-else-if="allowCollapse === true"
          :style="[collapseStyle, btnOffsetStyle]"
          class="ele-split-panel-collapse-btn"
          @click="toggleCollapse()"
        >
          <slot name="collapse" :collapse="isCollapse">
            <ElIcon class="ele-split-panel-collapse-icon">
              <ArrowUp
                v-if="vertical"
                :style="{ strokeWidth: 5, marginTop: '-1.25px' }"
              />
              <ArrowLeft
                v-else
                :style="{ strokeWidth: 5, marginLeft: '-1.25px' }"
              />
            </ElIcon>
          </slot>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <MainContent class="ele-split-panel-body" :style="bodyStyle">
      <div
        v-if="$slots.bodyHeader"
        class="ele-split-panel-body-header"
        :style="bodyHeaderStyle"
      >
        <slot name="bodyHeader"></slot>
      </div>
      <slot name="body" :collapse="isCollapse"></slot>
    </MainContent>
    <!-- 小屏幕遮罩层 -->
    <div class="ele-split-panel-mask" @click="toggleCollapse()"></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowLeft, ArrowUp } from '../icons/index';
  import type { StyleValue } from '../ele-app/types';
  import { useMoveEvent } from '../utils/hook';
  import MainContent from '../ele-loading/components/main-content.vue';
  import { useResponsive } from '../ele-pro-layout/util';
  import { splitPanelProps, splitPanelEmits } from './props';

  defineOptions({ name: 'EleSplitPanel' });

  const props = defineProps(splitPanelProps);

  const emit = defineEmits(splitPanelEmits);

  /** 是否开启布局响应 */
  const isResponsive = useResponsive(props);

  /** 容器节点 */
  const wrapperRef = ref<HTMLElement | null>(null);

  /** 边栏容器节点 */
  const sideWrapperRef = ref<HTMLElement | null>(null);

  /** 是否折叠边栏 */
  const isCollapse = ref<boolean | 'body'>(false);

  /** 拉伸后尺寸 */
  const resizedSize = ref<string | null>(null);

  /** 是否正在拉伸 */
  const resizing = ref<boolean>(false);

  /** 边栏尺寸 */
  const sideSize = computed<string>(() => {
    const size = resizedSize.value ?? props.size ?? '20%';
    if (typeof size === 'number') {
      return `${size}px`;
    }
    return size;
  });

  /** 间距尺寸 */
  const spaceSize = computed<string>(() => {
    const size = props.space ?? '16px';
    if (typeof size === 'number') {
      return `${size}px`;
    }
    return size;
  });

  /** 边栏样式 */
  const sideWrapStyle = computed<StyleValue>(() => {
    const style: StyleValue = {};
    // 设置边栏尺寸
    if (props.vertical) {
      style.height = sideSize.value;
    } else {
      style.width = sideSize.value;
    }
    if (isCollapse.value === true) {
      // 折叠状态收起边栏
      const m = `calc(${sideSize.value} * -1)`; // 边栏移出距离
      if (props.vertical) {
        // 垂直布局
        if (sideSize.value.endsWith('px')) {
          if (props.reverse) {
            style.margin = `0 0 ${m} 0`; // 边栏在下
          } else {
            style.margin = `${m} 0 0 0`; // 边栏在上
          }
        } else {
          style.height = 0; // 百分比模式
        }
      } else {
        // 水平布局
        if (sideSize.value.endsWith('px') || sideSize.value.endsWith('%')) {
          if (props.reverse) {
            style.margin = `0 ${m} 0 0`; // 边栏在右
          } else {
            style.margin = `0 0 0 ${m}`; // 边栏在左
          }
        } else {
          style.width = 0; // 非具体数值模式
        }
      }
    } else {
      // 展开状态设置间距
      if (props.vertical) {
        // 垂直布局
        if (props.reverse) {
          style.marginTop = spaceSize.value; // 边栏在下
        } else {
          style.marginBottom = spaceSize.value; // 边栏在上
        }
      } else {
        // 水平布局
        if (props.reverse) {
          style.marginLeft = spaceSize.value; // 边栏在右
        } else {
          style.marginRight = spaceSize.value; // 边栏在左
        }
      }
    }
    return style;
  });

  /** 折叠按钮折叠时位置 */
  const btnOffsetStyle = computed<StyleValue>(() => {
    const offset = props.collapseBtnOffset;
    if (isCollapse.value !== true || offset == null || offset === '') {
      return {};
    }
    const p = typeof offset === 'number' ? `${offset}px` : offset;
    return props.vertical
      ? props.reverse
        ? { marginBottom: p }
        : { marginTop: p }
      : props.reverse
        ? { marginRight: p }
        : { marginLeft: p };
  });

  /** 折叠按钮组样式 */
  const btnGroupStyle = computed<StyleValue>(() => {
    const offset = props.collapseBtnOffset;
    if (offset == null || offset === '') {
      return {};
    }
    const p = typeof offset === 'number' ? `${offset}px` : offset;
    return { gap: `calc(${p} * 2)` };
  });

  /** 切换边栏折叠状态 */
  const toggleCollapse = (collapse?: boolean | 'body') => {
    const c =
      collapse === 'body' || typeof collapse === 'boolean'
        ? collapse
        : !isCollapse.value;
    if (isCollapse.value !== c) {
      isCollapse.value = c;
    }
    if (props.collapse !== isCollapse.value) {
      emit('update:collapse', isCollapse.value);
    }
  };

  /** 重置拉伸尺寸 */
  const resetSize = () => {
    resizedSize.value = null;
  };

  /** 获取拉伸后的尺寸 */
  const getResizedSize = (size: number) => {
    const el = wrapperRef.value;
    if (!props.percentage || !el) {
      return `${size}px`;
    }
    // 百分比模式
    const sideSize = props.vertical ? el.offsetHeight : el.offsetWidth;
    return `${(size / sideSize) * 100}%`;
  };

  /** 获取最小拉伸尺寸 */
  const getMinSize = (): number => {
    return !props.minSize || props.minSize < 0 ? 0 : props.minSize;
  };

  /** 获取最大拉伸尺寸 */
  const getMaxSize = (): number | undefined => {
    const el = wrapperRef.value;
    if (!el) {
      if (props.maxSize && props.maxSize > 1) {
        return props.maxSize;
      }
      return;
    }
    const size = props.vertical ? el.offsetHeight : el.offsetWidth;
    if (!props.maxSize) {
      return size;
    }
    if (props.maxSize < 0) {
      // 负值形式
      return size + props.maxSize;
    } else if (props.maxSize < 1) {
      // 百分比形式
      return Math.floor(size * props.maxSize);
    }
    return Math.min(props.maxSize, size);
  };

  /** 拉伸 */
  interface ResizeEventData {
    downW: number;
    downH: number;
    min: number;
    max?: number;
    size?: number;
  }
  let resizeEventData: ResizeEventData | null = null;
  const { handleMousedown, handleTouchstart } = useMoveEvent({
    start: () => {
      const el = sideWrapperRef.value;
      if (!el) {
        resizeEventData = null;
        return;
      }
      resizing.value = true;
      resizeEventData = {
        downW: el.offsetWidth,
        downH: el.offsetHeight,
        min: getMinSize(),
        max: getMaxSize()
      };
      emit(
        'resizeStart',
        props.vertical ? resizeEventData.downH : resizeEventData.downW
      );
    },
    move: ({ distanceX, distanceY, e }) => {
      if (!resizeEventData) {
        return;
      }
      const dx = distanceX ?? 0;
      const dy = distanceY ?? 0;
      const { downW, downH, min, max } = resizeEventData;
      e.preventDefault();
      const size = props.vertical
        ? (props.reverse ? -dy : dy) + downH
        : (props.reverse ? -dx : dx) + downW;
      const rSize = Math.max(size, min);
      resizeEventData.size = max == null ? rSize : Math.min(rSize, max);
      resizedSize.value = getResizedSize(resizeEventData.size);
      emit('resize', resizeEventData.size, resizedSize.value);
    },
    end: () => {
      resizing.value = false;
      const size = resizeEventData?.size;
      resizeEventData = null;
      emit('resizeEnd', size, resizedSize.value);
    },
    touchmoveOptions: { passive: false }
  });

  /** 同步默认尺寸 */
  watch(
    () => props.size,
    () => {
      resetSize();
    }
  );

  /** 同步最小尺寸 */
  watch(
    () => props.minSize,
    () => {
      if (resizedSize.value) {
        const min = getMinSize();
        if (resizedSize.value.endsWith('px')) {
          if (Number.parseInt(resizedSize.value) < min) {
            resizedSize.value = getResizedSize(min);
          }
        } else if (resizedSize.value.endsWith('%')) {
          const el = wrapperRef.value;
          if (el) {
            const sideSize = props.vertical ? el.offsetHeight : el.offsetWidth;
            if ((Number.parseInt(resizedSize.value) / 100) * sideSize < min) {
              resizedSize.value = getResizedSize(min);
            }
          }
        }
      }
    }
  );

  /** 同步最大尺寸 */
  watch([() => props.maxSize, () => props.vertical], () => {
    if (resizedSize.value) {
      const max = getMaxSize();
      if (max != null) {
        if (resizedSize.value.endsWith('px')) {
          if (Number.parseInt(resizedSize.value) > max) {
            resizedSize.value = getResizedSize(max);
          }
        } else if (resizedSize.value.endsWith('%')) {
          const el = wrapperRef.value;
          if (el) {
            const sideSize = props.vertical ? el.offsetHeight : el.offsetWidth;
            if ((Number.parseInt(resizedSize.value) / 100) * sideSize > max) {
              resizedSize.value = getResizedSize(max);
            }
          }
        }
      }
    }
  });

  /** 同步边栏折叠状态 */
  watch(
    [() => props.collapse, () => props.allowCollapse],
    () => {
      if (props.allowCollapse !== true && props.allowCollapse !== 'both') {
        toggleCollapse(false);
      } else if (props.allowCollapse !== 'both' && props.collapse === 'body') {
        toggleCollapse(false);
      } else {
        toggleCollapse(
          props.collapse === 'body' || props.collapse === true
            ? props.collapse
            : false
        );
      }
    },
    { immediate: true }
  );

  defineExpose({
    toggleCollapse,
    resetSize
  });
</script>

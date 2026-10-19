<!-- 弹窗 -->
<template>
  <Teleport :to="teleportTo" :disabled="teleportDisabled">
    <ElDialog
      v-bind="{ ...$attrs, ...pick($props, dialogPropKeys) }"
      ref="dialogRef"
      :fullscreen="false"
      :modal="multiple ? false : modal"
      :modalClass="dialogClass"
      :appendToBody="false"
      :lockScroll="inner || multiple ? false : lockScroll"
      :showClose="false"
      :draggable="false"
      :overflow="false"
      :alignCenter="false"
      :zIndex="modalZIndex"
      :style="{
        margin: modalIsAbsolute ? 0 : modalPositionMargin,
        position: modalIsAbsolute ? 'absolute' : void 0,
        top: modalPositionTop,
        left: modalPositionLeft,
        width: modalResizedWidth,
        maxWidth: modalResizedWidth,
        minWidth: modalResizedWidth,
        height:
          modalResizedHeight ??
          (typeof height === 'number' ? `${height}px` : height),
        maxHeight:
          modalResizedHeight ??
          (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight),
        minHeight: modalResizedHeight,
        userSelect: modalIsMoving ? 'none' : void 0
      }"
      @update:modelValue="updateModelValue"
      @open="handleOpen"
      @opened="handleOpened"
      @close="handleClose"
      @closed="handleClosed"
      @openAutoFocus="handleOpenAutoFocus"
      @closeAutoFocus="handleCloseAutoFocus"
    >
      <template #header="{ close, titleId, titleClass }">
        <div
          :style="headerStyle"
          class="ele-modal-header"
          @mousedown="handleHeaderMousedown"
          @touchstart.passive="handleHeaderTouchstart"
        >
          <div class="ele-modal-title" :style="titleStyle">
            <slot
              name="header"
              :close="close"
              :titleId="titleId"
              :titleClass="titleClass"
            >
              {{ title }}
            </slot>
          </div>
          <!-- 最大化图标 -->
          <div
            v-if="maxable"
            class="ele-modal-tool ele-modal-tool-max"
            :style="fullscreenBtnStyle"
            @click="toggleFullscreen()"
            @mousedown.stop=""
            @touchstart.stop.passive=""
          >
            <slot name="maxIcon" :fullscreen="isFullscreen">
              <ElIcon>
                <CompressOutlined v-if="isFullscreen" />
                <ExpandOutlined v-else />
              </ElIcon>
            </slot>
          </div>
          <!-- 关闭图标 -->
          <div
            v-if="showClose"
            class="ele-modal-tool"
            :style="closeBtnStyle"
            @click="close()"
            @mousedown.stop=""
            @touchstart.stop.passive=""
          >
            <slot name="closeIcon">
              <ElIcon>
                <component v-if="closeIcon" :is="closeIcon" />
                <CloseOutlined v-else />
              </ElIcon>
            </slot>
          </div>
        </div>
        <!-- 拉伸图标 -->
        <div
          v-if="resizable"
          class="ele-modal-resize-icon"
          :class="[
            { 'is-horizontal': resizable === 'horizontal' },
            { 'is-vertical': resizable === 'vertical' }
          ]"
          :style="resizeIconStyle"
          @mousedown="handleResizeMousedown"
          @touchstart.passive="handleResizeTouchstart"
        >
          <slot name="resizeIcon">
            <ElIcon>
              <ResizeOutlined />
            </ElIcon>
          </slot>
        </div>
      </template>
      <template v-if="$slots.footer" #footer>
        <div class="ele-modal-footer" :style="footerStyle">
          <slot name="footer"></slot>
        </div>
      </template>
      <MainContent
        class="ele-modal-body"
        :class="[{ 'is-form': form }, modalBodyClass]"
        :style="bodyStyle"
      >
        <slot></slot>
      </MainContent>
      <LoadingSpinner
        v-bind="loadingProps || {}"
        :loading="compLoading || loading"
        :plain="true"
      />
    </ElDialog>
  </Teleport>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    onActivated,
    onDeactivated,
    watch,
    unref
  } from 'vue';
  import { ElDialog, ElIcon } from 'element-plus';
  import {
    CloseOutlined,
    CompressOutlined,
    ExpandOutlined,
    ResizeOutlined
  } from '../icons/index';
  import type { ElDialogInstance } from '../ele-app/el';
  import { pick } from '../utils/common';
  import { useMoveEvent } from '../utils/hook';
  import MainContent from '../ele-loading/components/main-content.vue';
  import LoadingSpinner from '../ele-loading/components/loading-spinner.vue';
  import { useLayoutState, useResponsive } from '../ele-pro-layout/util';
  import {
    wrapperClass,
    closedClass,
    getModalContainer,
    getPositionMargin,
    getMaxZIndex,
    canMoveOut
  } from './util';
  import { modalEmits, modalProps, dialogPropKeys } from './props';

  defineOptions({ name: 'EleModal', inheritAttrs: false });

  const props = defineProps(modalProps);

  const emit = defineEmits(modalEmits);

  const layoutState = useLayoutState();
  const isResponsive = useResponsive(props);

  /** 弹窗组件 */
  const dialogRef = ref<ElDialogInstance>(null);

  /** 弹窗是否全屏 */
  const isFullscreen = ref<boolean>(props.fullscreen ?? false);

  /** 弹窗移动后的垂直位置 */
  const modalPositionTop = ref<string>();

  /** 弹窗移动后的水平位置 */
  const modalPositionLeft = ref<string>();

  /** 弹窗拉伸后的宽度 */
  const modalResizedWidth = ref<string>();

  /** 弹窗拉伸后的高度 */
  const modalResizedHeight = ref<string>();

  /** 弹窗层级 */
  const modalZIndex = ref<number | undefined>(props.zIndex);

  /** 弹窗是否移动或拉伸状态 */
  const modalIsMoving = ref(false);

  /** 适配组件缓存 */
  const isActivated = ref<boolean>(!props.isDeactivated);

  /** 弹窗类名 */
  const dialogClass = computed<string>(() => {
    const classes: string[] = [wrapperClass];
    // 开启布局响应
    if (isResponsive.value) {
      classes.push('ele-modal-responsive');
    }
    // 限制最大高度
    if (
      props.maxHeight == null ||
      (props.maxHeight != null && props.maxHeight !== '')
    ) {
      classes.push('ele-modal-fluid');
    }
    // 初始位置
    if (props.position === 'top') {
      classes.push('ele-modal-top');
    } else if (props.position === 'bottom') {
      classes.push('ele-modal-bottom');
    } else if (props.position === 'left') {
      classes.push('ele-modal-left');
    } else if (props.position === 'right') {
      classes.push('ele-modal-right');
    } else if (props.position === 'leftTop') {
      classes.push('ele-modal-left-top');
    } else if (props.position === 'leftBottom') {
      classes.push('ele-modal-left-bottom');
    } else if (props.position === 'rightTop') {
      classes.push('ele-modal-right-top');
    } else if (props.position === 'rightBottom') {
      classes.push('ele-modal-right-bottom');
    }
    // 支持拖动
    if (props.draggable) {
      classes.push('ele-modal-movable');
    }
    // 支持拉伸
    if (props.resizable) {
      classes.push('ele-modal-resizable');
    }
    // 支持打开多个
    if (props.multiple) {
      classes.push('ele-modal-multiple');
    }
    // 全屏
    if (isFullscreen.value) {
      classes.push('ele-modal-fullscreen');
    }
    // 关闭状态
    if (!props.modelValue) {
      classes.push(closedClass);
    }
    // 失活状态
    if (!isActivated.value && props.modelValue) {
      classes.push('ele-modal-hide');
    }
    // 限制在内部区域
    if (props.inner) {
      classes.push('ele-modal-inner');
    }
    // 异步内容组件时加载状态
    if (props.compLoading && !props.loading) {
      classes.push('ele-modal-comp-loading');
    }
    // 内部表格弹性布局
    if (props.flexTable === 'auto') {
      classes.push('ele-modal-flex-auto-table');
    } else if (props.flexTable) {
      classes.push('ele-modal-flex-table');
    }
    // 在内容区添加自定义底栏
    if (props.customFooter) {
      classes.push('ele-modal-custom-footer');
    }
    // 自定义类名
    if (props.modalClass) {
      classes.push(props.modalClass);
    }
    return classes.join(' ');
  });

  /** 当弹窗拖动后使用绝对定位 */
  const modalIsAbsolute = computed<boolean>(() => {
    return modalPositionTop.value != null || modalPositionLeft.value != null;
  });

  /** 位置对应的外间距 */
  const modalPositionMargin = computed<string | undefined>(() => {
    if (typeof props.position === 'string') {
      return;
    }
    return getPositionMargin({
      top: props.top,
      ...(props.alignCenter
        ? { top: 'auto', left: 'auto', right: 'auto', bottom: 'auto' }
        : {}),
      ...(props.position || {})
    });
  });

  /** 弹窗插入位置 */
  const teleportTo = computed<Element | string>(() => {
    return getModalContainer(
      props.inner,
      props.multiple,
      props.appendTo,
      layoutState.modalsEl
    );
  });

  /** 禁用弹窗插入其它位置 */
  const teleportDisabled = computed<boolean>(() => {
    const bodyAppend = 'body';
    const appendTo = props.appendTo || bodyAppend;
    const disabled = appendTo === bodyAppend ? !props.appendToBody : false;
    return props.multiple || props.inner ? false : disabled;
  });

  /** 获取弹窗节点 */
  const getModalEl = () => {
    const el = unref(dialogRef.value?.dialogContentRef)?.$el;
    return el as HTMLElement | undefined;
  };

  /** 置顶弹窗 */
  const topModal = () => {
    const zIndex = getMaxZIndex(getModalEl(), props.zIndex);
    if (zIndex != null && modalZIndex.value !== zIndex) {
      modalZIndex.value = zIndex;
    }
  };

  /** 处理弹窗拖拽拉伸事件参数 */
  const moveEventOption = {
    modalEl: null as HTMLElement | undefined | null,
    wrapEl: null as HTMLElement | undefined | null,
    downOL: null as number | null,
    downOT: null as number | null,
    downW: null as number | null,
    downH: null as number | null,
    fixTop: 0.65,
    fixLeft: 0.65
  };

  /** 弹窗拖拽事件 */
  const {
    handleMousedown: handleHeaderMousedown,
    handleTouchstart: handleHeaderTouchstart
  } = useMoveEvent({
    start: () => {
      moveEventOption.modalEl = getModalEl();
      moveEventOption.wrapEl = moveEventOption.modalEl?.parentElement;
      if (
        !moveEventOption.modalEl ||
        !moveEventOption.wrapEl ||
        !props.draggable ||
        isFullscreen.value
      ) {
        return;
      }
      modalIsMoving.value = true;
      moveEventOption.downOL = moveEventOption.modalEl.offsetLeft;
      moveEventOption.downOT = moveEventOption.modalEl.offsetTop;
    },
    move: ({ distanceX, distanceY, e }) => {
      if (
        !moveEventOption.modalEl ||
        !moveEventOption.wrapEl ||
        moveEventOption.downOL == null ||
        moveEventOption.downOT == null ||
        distanceX == null ||
        distanceY == null
      ) {
        return;
      }
      e.preventDefault();
      let positionLeft = distanceX + moveEventOption.downOL;
      let positionTop = distanceY + moveEventOption.downOT;
      // 边界判断
      const limitL =
        moveEventOption.wrapEl.clientWidth -
        moveEventOption.modalEl.clientWidth -
        moveEventOption.fixLeft;
      const limitT =
        moveEventOption.wrapEl.clientHeight -
        moveEventOption.modalEl.clientHeight -
        moveEventOption.fixTop;
      if (!props.moveOut) {
        if (positionLeft < 0) {
          positionLeft = 0;
        } else if (positionLeft > limitL) {
          positionLeft = limitL;
        }
        if (positionTop > limitT) {
          positionTop = limitT;
        }
        if (positionTop < 0) {
          positionTop = 0;
        }
      } else {
        if (!canMoveOut(props.moveOut, 'left') && positionLeft < 0) {
          positionLeft = 0;
        }
        if (!canMoveOut(props.moveOut, 'right') && positionLeft > limitL) {
          positionLeft = limitL;
        }
        if (!canMoveOut(props.moveOut, 'bottom') && positionTop > limitT) {
          positionTop = limitT;
        }
        if (!canMoveOut(props.moveOut, 'top') && positionTop < 0) {
          positionTop = 0;
        }
        const minLimitL = moveEventOption.wrapEl.clientWidth - 48;
        if (positionLeft > minLimitL) {
          positionLeft = minLimitL;
        }
        const minLimitT = moveEventOption.wrapEl.clientHeight - 48;
        if (props.multiple && positionTop > minLimitT) {
          positionTop = minLimitT;
        }
      }
      // 移动
      modalPositionLeft.value = `${Math.floor(positionLeft)}px`;
      modalPositionTop.value = `${Math.floor(positionTop)}px`;
    },
    end: () => {
      modalIsMoving.value = false;
      moveEventOption.downOL = null;
      moveEventOption.downOT = null;
    },
    touchmoveOptions: { passive: false }
  });

  /** 弹窗拉伸事件 */
  const {
    handleMousedown: handleResizeMousedown,
    handleTouchstart: handleResizeTouchstart
  } = useMoveEvent({
    start: () => {
      moveEventOption.modalEl = getModalEl();
      moveEventOption.wrapEl = moveEventOption.modalEl?.parentElement;
      if (
        !moveEventOption.modalEl ||
        !moveEventOption.wrapEl ||
        !props.resizable ||
        isFullscreen.value
      ) {
        return;
      }
      modalIsMoving.value = true;
      moveEventOption.downW = moveEventOption.modalEl.clientWidth;
      moveEventOption.downH = moveEventOption.modalEl.clientHeight;
    },
    move: ({ distanceX, distanceY, e }) => {
      if (
        !moveEventOption.modalEl ||
        !moveEventOption.wrapEl ||
        moveEventOption.downW == null ||
        moveEventOption.downH == null ||
        distanceX == null ||
        distanceY == null
      ) {
        return;
      }
      e.preventDefault();
      if (modalPositionLeft.value == null) {
        modalPositionLeft.value = `${moveEventOption.modalEl.offsetLeft}px`;
      }
      if (modalPositionTop.value == null) {
        modalPositionTop.value = `${moveEventOption.modalEl.offsetTop}px`;
      }
      if (props.resizable !== 'vertical') {
        const w = distanceX + moveEventOption.downW;
        const maxW =
          moveEventOption.wrapEl.clientWidth -
          moveEventOption.modalEl.offsetLeft -
          moveEventOption.fixLeft;
        const nw =
          (w < props.minWidth
            ? props.minWidth
            : !canMoveOut(props.moveOut, 'right') && w > maxW
              ? maxW
              : w) + 'px';
        modalResizedWidth.value = nw;
      }
      if (props.resizable !== 'horizontal') {
        const h = distanceY + moveEventOption.downH;
        const maxH =
          moveEventOption.wrapEl.clientHeight -
          moveEventOption.modalEl.offsetTop -
          moveEventOption.fixTop;
        const nh =
          (h < props.minHeight
            ? props.minHeight
            : !canMoveOut(props.moveOut, 'bottom') && h > maxH
              ? maxH
              : h) + 'px';
        modalResizedHeight.value = nh;
      }
      emit('resized', {
        width: modalResizedWidth.value,
        height: modalResizedHeight.value
      });
    },
    end: () => {
      modalIsMoving.value = false;
      moveEventOption.downW = null;
      moveEventOption.downH = null;
    },
    touchmoveOptions: { passive: false }
  });

  /** 弹窗点击自动置顶事件处理 */
  const mousedownListener = () => {
    if (props.multiple) {
      topModal();
    }
  };

  const bindAutoTopEvent = () => {
    const modalEl = getModalEl();
    if (modalEl) {
      modalEl.addEventListener('mousedown', mousedownListener);
      modalEl.addEventListener('touchstart', mousedownListener, {
        passive: true
      });
    }
  };

  const unbindAutoTopEvent = () => {
    const modalEl = getModalEl();
    if (modalEl) {
      modalEl.removeEventListener('mousedown', mousedownListener);
      modalEl.removeEventListener('touchstart', mousedownListener);
    }
  };

  /** 更新显示状态 */
  const updateModelValue = (modelValue: boolean) => {
    emit('update:modelValue', modelValue);
  };

  /** 弹窗全屏切换 */
  const toggleFullscreen = (fullscreen?: boolean) => {
    isFullscreen.value = fullscreen ?? !isFullscreen.value;
    topModal();
    emit('update:fullscreen', isFullscreen.value);
  };

  /** 重置弹窗位置 */
  const resetPosition = () => {
    isFullscreen.value = props.fullscreen ?? false;
    modalPositionTop.value = void 0;
    modalPositionLeft.value = void 0;
    modalResizedWidth.value = void 0;
    modalResizedHeight.value = void 0;
    modalIsMoving.value = false;
  };

  /** 打开的回调 */
  const handleOpen = () => {
    topModal();
    emit('open');
  };

  /** 打开动画结束的回调 */
  const handleOpened = () => {
    bindAutoTopEvent();
    emit('opened');
  };

  /** 关闭的回调 */
  const handleClose = () => {
    unbindAutoTopEvent();
    emit('close');
  };

  /** 关闭动画结束的回调 */
  const handleClosed = () => {
    if (props.resetOnClose || props.destroyOnClose) {
      resetPosition();
    }
    emit('closed');
  };

  /** 内容获取焦点的回调 */
  const handleOpenAutoFocus = () => {
    emit('openAutoFocus');
  };

  /** 内容失去焦点的回调 */
  const handleCloseAutoFocus = () => {
    emit('closeAutoFocus');
  };

  /** 关闭弹窗 */
  const closeModal = () => {
    if (dialogRef.value) {
      dialogRef.value.handleClose();
    } else {
      updateModelValue(false);
    }
  };

  /** 同步属性 */
  watch(
    () => props.zIndex,
    (zIndex) => {
      modalZIndex.value = zIndex;
    }
  );

  watch(
    () => props.fullscreen,
    (fullscreen) => {
      isFullscreen.value = fullscreen ?? false;
    }
  );

  watch(
    () => props.isDeactivated,
    (deactivated) => {
      isActivated.value = !deactivated;
    }
  );

  /** 初始化位置 */
  onMounted(() => {
    if (props.modelValue) {
      topModal();
    }
  });

  /** 销毁事件 */
  onBeforeUnmount(() => {
    moveEventOption.modalEl = null;
    moveEventOption.wrapEl = null;
    unbindAutoTopEvent();
  });

  /** 适配组件缓存 */
  onActivated(() => {
    isActivated.value = true;
  });

  onDeactivated(() => {
    isActivated.value = false;
  });

  defineExpose({
    dialogRef,
    resetPosition,
    handleClose: closeModal
  });
</script>

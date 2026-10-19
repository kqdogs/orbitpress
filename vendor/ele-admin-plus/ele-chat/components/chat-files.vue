<!-- 附件列表 -->
<template>
  <div
    class="ele-chat-file-wrapper"
    :class="[
      { 'is-ping-left': enableScrollLeft },
      { 'is-ping-right': enableScrollRight },
      { 'is-vertical': overflow === 'scrollY' }
    ]"
  >
    <div
      v-if="enableScrollLeft"
      class="ele-chat-file-tool"
      @click="handleScrollLeft"
    >
      <ElIcon>
        <ArrowUp v-if="overflow === 'scrollY'" />
        <ArrowLeft v-else />
      </ElIcon>
    </div>
    <div ref="filesRef" class="ele-chat-files" @scroll="handleScroll">
      <FileCard
        v-for="item in files"
        :key="item.key ?? item.name"
        :item="item"
        :readonly="readonly"
        :uploadError="uploadError"
        @click="(e: MouseEvent) => handleItemClick(item, e)"
        @fileRemove="handleItemDel"
      >
        <template v-for="name in Object.keys($slots)" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}"></slot>
        </template>
      </FileCard>
    </div>
    <div
      v-if="enableScrollRight"
      class="ele-chat-file-tool"
      @click="handleScrollRight"
    >
      <ElIcon>
        <ArrowDown v-if="overflow === 'scrollY'" />
        <ArrowRight v-else />
      </ElIcon>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from '../../icons/index';
  import { useTimer, useMousewheel } from '../../utils/hook';
  import type { FileItem, FileCardSlots } from '../types';
  import FileCard from './file-card.vue';

  defineSlots<FileCardSlots>();

  const props = defineProps({
    /** 附件 */
    files: Array as PropType<FileItem[]>,
    /** 是否只读模式 */
    readonly: Boolean,
    /** 滚动模式 */
    overflow: String as PropType<'scrollX' | 'scrollY'>,
    /** 上传失败文本 */
    uploadError: String
  });

  const emit = defineEmits({
    /** 附件点击事件 */
    fileClick: (_item: FileItem, _e: MouseEvent) => true,
    /** 附件删除事件 */
    fileRemove: (_item: FileItem, _e: MouseEvent) => true
  });

  /** 容器节点 */
  const filesRef = ref<HTMLElement | null>(null);

  /** 能否向左滚动 */
  const enableScrollLeft = ref(false);

  /** 能否向右滚动 */
  const enableScrollRight = ref(false);

  /** 点击事件 */
  const handleItemClick = (item: FileItem, e: MouseEvent) => {
    emit('fileClick', item, e);
  };

  /** 删除按钮点击事件 */
  const handleItemDel = (item: FileItem, e: MouseEvent) => {
    emit('fileRemove', item, e);
  };

  /** 容器滚动事件 */
  const handleScroll = () => {
    // 计算是否显示左右滚动按钮
    const filesEl = filesRef.value;
    if (!filesEl) {
      return;
    }
    // 水平滚动模式
    if (props.overflow !== 'scrollY') {
      const left = filesEl.scrollLeft || 0;
      enableScrollLeft.value = left > 1;
      const width = filesEl.scrollWidth - filesEl.clientWidth - 1;
      enableScrollRight.value = width > 1 && left < width;
      return;
    }
    // 垂直滚动模式
    const top = filesEl.scrollTop || 0;
    enableScrollLeft.value = top > 1;
    const height = filesEl.scrollHeight - filesEl.clientHeight - 1;
    enableScrollRight.value = height > 1 && top < height;
  };

  /** 向上滚动 */
  const handleScrollTop = (_e: MouseEvent, callback?: () => void) => {
    const filesEl = filesRef.value;
    if (filesEl && filesEl.scrollTop > 0) {
      const top = filesEl.scrollTop - filesEl.clientHeight + 50;
      filesEl.scrollTo({
        top: top < 0 ? 0 : top,
        behavior: 'smooth'
      });
      callback && callback();
    }
  };

  /** 向左滚动 */
  const handleScrollLeft = (e: MouseEvent, callback?: () => void) => {
    if (props.overflow === 'scrollY') {
      handleScrollTop(e, callback);
      return;
    }
    const filesEl = filesRef.value;
    if (filesEl && filesEl.scrollLeft > 0) {
      const left = filesEl.scrollLeft - filesEl.clientWidth + 50;
      filesEl.scrollTo({
        left: left < 0 ? 0 : left,
        behavior: 'smooth'
      });
      callback && callback();
    }
  };

  /** 向下滚动 */
  const handleScrollBottom = (_e: MouseEvent, callback?: () => void) => {
    const filesEl = filesRef.value;
    if (filesEl) {
      const top = filesEl.scrollTop + filesEl.clientHeight - 50;
      filesEl.scrollTo({
        top: top,
        behavior: 'smooth'
      });
      callback && callback();
    }
  };

  /** 向右滚动 */
  const handleScrollRight = (e: MouseEvent, callback?: () => void) => {
    if (props.overflow === 'scrollY') {
      handleScrollBottom(e, callback);
      return;
    }
    const filesEl = filesRef.value;
    if (filesEl) {
      const left = filesEl.scrollLeft + filesEl.clientWidth - 50;
      filesEl.scrollTo({
        left: left,
        behavior: 'smooth'
      });
      callback && callback();
    }
  };

  /** 更新滚动状态 */
  watch(
    () => props.files,
    () => {
      nextTick(() => {
        handleScroll();
      });
    },
    { deep: true }
  );

  /** 鼠标滚动节流 */
  const [startScrollTimer, _stopScrollTimer, scrollWaiting] = useTimer(320);

  /** 鼠标滚动事件 */
  const { bindMousewheel, unbindMousewheel } = useMousewheel((param) => {
    if (props.overflow === 'scrollY' || scrollWaiting.value) {
      return;
    }
    const { e, direction } = param;
    const callback = () => {
      e.preventDefault();
      e.stopPropagation();
    };
    if (direction === 'up') {
      if (!enableScrollLeft.value) {
        return;
      }
      startScrollTimer();
      handleScrollLeft(e, callback);
    } else {
      if (!enableScrollRight.value) {
        return;
      }
      startScrollTimer();
      handleScrollRight(e, callback);
    }
    e.preventDefault();
    e.stopPropagation();
  });

  /** 容器尺寸改变监听器 */
  const observer =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          requestAnimationFrame(() => {
            handleScroll();
          });
        })
      : void 0;

  /** 绑定鼠标滚轮事件和监听容器尺寸改变事件 */
  onMounted(() => {
    const filesEl = filesRef.value;
    if (filesEl) {
      if (props.overflow === 'scrollY') {
        handleScroll();
      } else {
        bindMousewheel(filesEl);
        observer && observer.observe(filesEl);
      }
    }
  });

  onBeforeUnmount(() => {
    const filesEl = filesRef.value;
    if (filesEl) {
      unbindMousewheel(filesEl);
      observer && observer.unobserve(filesEl);
    }
  });
</script>

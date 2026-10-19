<!-- 聊天 -->
<template>
  <div
    class="ele-chat ele-chat-wrapper"
    :class="{
      'is-collapse': sideCollapse,
      'is-responsive': isResponsive && sideStyle !== false
    }"
  >
    <div
      v-if="sideStyle !== false"
      :style="sideStyle === true ? void 0 : sideStyle"
      class="ele-chat-side"
    >
      <div class="ele-chat-logo-wrapper">
        <div :style="logoStyle" class="ele-chat-logo" @click="handleLogoClick">
          <slot name="logo">
            <img
              v-if="logoSrc"
              :src="logoSrc"
              :style="logoImgStyle"
              class="ele-chat-logo-img"
            />
            <div
              v-if="logoTitle"
              :style="logoTitleStyle"
              class="ele-chat-logo-title"
            >
              {{ logoTitle }}
            </div>
          </slot>
        </div>
        <div class="ele-chat-logo-tools">
          <slot name="logoTool"></slot>
          <div
            class="ele-chat-logo-tool"
            @mouseenter="handleLogoCollapseToolMouseenter"
            @click="handleCollapse"
          >
            <ElIcon>
              <SideFoldOutlined />
            </ElIcon>
          </div>
        </div>
      </div>
      <slot name="sideTop"></slot>
      <div class="ele-chat-side-main">
        <div class="ele-chat-side-tools">
          <slot name="sideTool"></slot>
          <ElButton
            v-if="newBtnProps !== false"
            :icon="MessageAddOutlined"
            class="ele-chat-new-btn"
            v-bind="(newBtnProps === true ? void 0 : newBtnProps) || {}"
            @click="handleNewBtnClick"
          >
            {{ lang.newText }}
          </ElButton>
        </div>
        <ChatConversations
          :items="conversations"
          :active="active"
          :dropdownProps="dropdownProps"
          :dropdownItems="dropdownItems"
          @itemClick="handleChatItemClick"
          @update:active="handleUpdateActive"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ChatConversations>
      </div>
      <div v-if="$slots.sideBottom" class="ele-chat-side-footer">
        <slot name="sideBottom"></slot>
      </div>
    </div>
    <div class="ele-chat-body">
      <div
        v-if="headerStyle !== false"
        :style="headerStyle === true ? void 0 : headerStyle"
        class="ele-chat-header"
      >
        <slot name="headerLeft"></slot>
        <div
          :style="headerLogoStyle"
          class="ele-chat-header-logo"
          @click="handleLogoClick"
        >
          <slot name="logo" :header="true">
            <img
              v-if="logoSrc"
              :src="logoSrc"
              :style="logoImgStyle"
              class="ele-chat-header-logo-img"
            />
          </slot>
        </div>
        <div
          v-if="headerToolsStyle !== false"
          :style="headerToolsStyle === true ? void 0 : headerToolsStyle"
          class="ele-chat-header-tools"
        >
          <slot name="headerTool"></slot>
          <div
            class="ele-chat-header-tool"
            @click="handleCollapse"
            @mouseenter="handleHeaderCollapseToolMouseenter"
          >
            <ElIcon>
              <SideExpandOutlined />
            </ElIcon>
          </div>
          <div
            v-if="newBtnProps !== false"
            class="ele-chat-header-tool"
            @click="handleNewBtnClick"
            @mouseenter="handleHeaderNewBtnMouseenter"
          >
            <ElIcon>
              <MessageAddOutlined />
            </ElIcon>
          </div>
        </div>
        <div :style="headerTitleStyle" class="ele-chat-header-title">
          <slot name="headerTitle" :activeConversation="activeConversation">
            {{ activeConversation?.label }}
          </slot>
        </div>
        <slot name="headerRight"></slot>
      </div>
      <div
        ref="contentRef"
        class="ele-chat-content"
        @scroll="handleContentScroll"
      >
        <slot name="content"></slot>
        <MainContent class="ele-chat-bubble-list" #default="contentProps">
          <template v-if="messages?.length && contentProps?.['size'] == 1">
            <ChatBubble
              v-for="item in messages"
              :key="item.key ?? item.content"
              :item="item"
              :uploadError="lang.uploadError"
              :thinkingText="lang.thinkingText"
              :thoughtText="lang.thoughtText"
              :editPlaceholder="lang.placeholder"
              :editCancelText="lang.editCancel"
              :editConfirmText="lang.editConfirm"
              :editConfirmBtnProps="editConfirmBtnProps"
              :editCancelBtnProps="editCancelBtnProps"
              :editInputProps="editInputProps"
              @fileClick="handleBubbleFileClick"
              @fileRemove="handleBubbleFileRemove"
              @editCancel="handleBubbleEditCancel"
              @editConfirm="handleBubbleEditConfirm"
            >
              <template v-for="name in Object.keys($slots)" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps || {}"></slot>
              </template>
            </ChatBubble>
          </template>
        </MainContent>
      </div>
      <div v-if="enableBackbottom" class="ele-chat-backbottom">
        <ElIcon
          class="ele-chat-backbottom-icon"
          v-bind="backbottomProps"
          @click="handleBackbottom"
        >
          <slot name="backbottomIcon">
            <ArrowDown style="transform: translateY(1px)" />
          </slot>
        </ElIcon>
      </div>
      <div class="ele-chat-bottom">
        <ChatInput
          :modelValue="modelValue"
          :sendBtnProps="sendBtnProps"
          :uploadBtnProps="uploadBtnProps"
          :files="files"
          :placeholder="placeholder ?? lang.placeholder"
          :uploadProps="uploadProps"
          :uploadTip="lang.uploadTip"
          :uploadError="lang.uploadError"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @send="handleSend"
          @sendBtnClick="handleSendBtnClick"
          @fileClick="handleFileClick"
          @fileRemove="handleFileRemove"
          @fileUpload="handleFileUpload"
          @update:modelValue="handleUpdateModelValue"
        >
          <template v-for="name in Object.keys($slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}"></slot>
          </template>
        </ChatInput>
        <div
          v-if="footerStyle !== false"
          :style="footerStyle === true ? void 0 : footerStyle"
          class="ele-chat-footer"
        >
          <slot name="footer">
            <div :style="active == null ? { visibility: 'hidden' } : void 0">
              {{ lang.footerText }}
            </div>
          </slot>
        </div>
      </div>
    </div>
    <div class="ele-chat-mask" @click="handleCollapse"></div>
    <EleImageViewer
      v-if="imageViewerProps !== false"
      :infinite="false"
      v-bind="previewProps || {}"
      v-model="previewVisible"
    />
    <EleDropdown
      v-if="dropdownVirtualRef"
      v-bind="dropdownMergedProps"
      ref="dropdownRef"
      :persistent="false"
      :validateEvent="false"
      componentType="pro"
      :virtualTriggering="true"
      :virtualRef="dropdownVirtualRef"
      :disabled="!dropdownMergedItems.length"
      :items="dropdownMergedItems"
    />
    <EleTooltip
      v-if="tooltipVirtualRef"
      :persistent="false"
      v-bind="tooltipMergedProps"
      ref="tooltipRef"
      :virtualTriggering="true"
      :virtualRef="tooltipVirtualRef"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    shallowReactive,
    computed,
    watch,
    onBeforeUnmount,
    provide
  } from 'vue';
  import { ElIcon, ElButton } from 'element-plus';
  import {
    SideFoldOutlined,
    SideExpandOutlined,
    MessageAddOutlined,
    ArrowDown
  } from '../icons/index';
  import { findTree } from '../utils/common';
  import {
    useTimer,
    useMediaQuery,
    mobileMediaQuery,
    useMobileDevice
  } from '../utils/hook';
  import type { EleImageViewerProps, EleTooltipProps } from '../ele-app/plus';
  import { useTooltipProviderPro } from '../ele-tooltip-provider/util';
  import { useLocale } from '../ele-config-provider/receiver';
  import type { ImageObjectUrl } from '../ele-upload-list/types';
  import { useDropdownProviderPro } from '../ele-dropdown-provider/util';
  import { useResponsive } from '../ele-pro-layout/util';
  import EleImageViewer from '../ele-image-viewer/index.vue';
  import EleTooltip from '../ele-tooltip/index.vue';
  import EleDropdown from '../ele-dropdown/index.vue';
  import MainContent from '../ele-loading/components/main-content.vue';
  import ChatConversations from './components/chat-conversations.vue';
  import ChatBubble from './components/chat-bubble.vue';
  import ChatInput from './components/chat-input.vue';
  import type {
    ConversationItem,
    MessageItem,
    FileItem,
    ChatProvide,
    ChatSlots
  } from './types';
  import { chatProps, chatEmits, CHAT_KEY, defaultTooltipProps } from './props';

  defineOptions({ name: 'EleChat' });

  defineSlots<ChatSlots>();

  const props = defineProps(chatProps);

  const emit = defineEmits(chatEmits);

  /** 国际化语言 */
  const { lang } = useLocale('chat', props);

  /** 提供下拉菜单操作 */
  const {
    dropdownRef,
    dropdownVirtualRef,
    dropdownItems: dropdownMergedItems,
    dropdownProps: dropdownMergedProps,
    openDropdown,
    removeDropdown
  } = useDropdownProviderPro();

  /** 提供文本提示操作 */
  const {
    tooltipRef,
    tooltipVirtualRef,
    tooltipProps: tooltipMergedProps,
    showTooltip,
    removeTooltip
  } = useTooltipProviderPro();

  /** 是否开启响应式 */
  const isResponsive = useResponsive(props);

  /** 是否是移动端触摸设备 */
  const [isMobileDevice] = useMobileDevice();

  /** 是否折叠侧栏 */
  const sideCollapse = ref<boolean>(props.collapse);

  /** 是否打开图片预览 */
  const previewVisible = ref(false);

  /** 图片预览属性 */
  const previewProps = ref<EleImageViewerProps>({});

  /** 内容区域节点 */
  const contentRef = ref<HTMLElement | null>(null);

  /** 是否可返回底部 */
  const enableBackbottom = ref(false);

  /** 是否是移动端小屏幕 */
  const mobile = ref<boolean>(false);

  /** 选中对话 */
  const activeConversation = computed<ConversationItem | undefined>(() => {
    if (props.active == null || !props.conversations) {
      return;
    }
    return findTree(props.conversations, (d) => d.key === props.active);
  });

  /** 预读图片文件 */
  const imageObjectUrls: ImageObjectUrl[] = [];

  /** 是否禁用文本提示 */
  let tooltipDisabled = false;
  const [startDisableTooltipTimer] = useTimer(350, () => {
    tooltipDisabled = false;
  });

  /** 打开文本提示 */
  const showTooltipPro = (triggerEl: any, options?: EleTooltipProps) => {
    const tooltipProps = props.tooltipProps;
    if (tooltipProps === false || tooltipDisabled || isMobileDevice.value) {
      return;
    }
    showTooltip(triggerEl, {
      ...defaultTooltipProps,
      ...((tooltipProps === true ? void 0 : tooltipProps) || {}),
      ...(options || {})
    });
  };

  /** 更新侧栏折叠状态 */
  const updateCollapse = (collapse?: boolean) => {
    removeTooltip();
    tooltipDisabled = true;
    startDisableTooltipTimer();
    sideCollapse.value = collapse ?? !sideCollapse.value;
    emit('update:collapse', sideCollapse.value);
  };

  /** 切换侧栏折叠状态 */
  const handleCollapse = () => {
    updateCollapse();
  };

  /** logo 点击事件 */
  const handleLogoClick = (e: MouseEvent) => {
    emit('logoClick', e);
  };

  /** 新对话按钮点击事件 */
  const handleNewBtnClick = (e: MouseEvent) => {
    emit('newBtnClick', e);
    emit('update:active');
  };

  /** 对话列表项点击事件 */
  const handleChatItemClick = (item: ConversationItem) => {
    emit('conversationClick', item);
  };

  /** 回车发送事件 */
  const handleSend = (content: string) => {
    emit('send', content);
  };

  /** 发送按钮点击事件 */
  const handleSendBtnClick = (e: MouseEvent) => {
    emit('sendBtnClick', e);
  };

  /** 输入框输入事件 */
  const handleInput = (e: InputEvent) => {
    emit('input', e);
  };

  /** 输入框获取焦点事件 */
  const handleFocus = (e: FocusEvent) => {
    emit('focus', e);
  };

  /** 输入框失去焦点事件 */
  const handleBlur = (e: FocusEvent) => {
    emit('blur', e);
  };

  /** 打开预览图片弹窗 */
  const openImagePreview = (viewerProps: EleImageViewerProps) => {
    previewProps.value = viewerProps;
    previewVisible.value = true;
  };

  /** 获取图片预览地址 */
  const getItemPreviewUrl = (item: FileItem) => {
    if (item.imageUrl) {
      return item.imageUrl;
    }
    const itemFile = item.file;
    if (itemFile != null && itemFile.type.startsWith('image')) {
      const t = imageObjectUrls.find((u) => u.file === itemFile);
      if (t != null) {
        return t.url;
      }
      const url = URL.createObjectURL(itemFile);
      imageObjectUrls.push({ file: itemFile, url });
      return url;
    }
  };

  /** 预览图片 */
  const previewImage = (
    item: FileItem,
    viewerProps?: EleImageViewerProps,
    message?: MessageItem
  ) => {
    const options: EleImageViewerProps = { ...(viewerProps || {}) };
    if (!options.urlList) {
      if (message) {
        // 获取消息气泡中的图片列表
        let index = -1;
        const urls: string[] = [];
        (message.files || []).forEach((f) => {
          const url = getItemPreviewUrl(f);
          if (url) {
            if (f === item) {
              index = urls.length;
            }
            urls.push(url);
          }
        });
        options.urlList = urls;
        options.initialIndex = index;
      } else {
        // 获取上传附件中的图片列表
        let index = -1;
        const urls: string[] = [];
        (props.files || []).forEach((f) => {
          const url = getItemPreviewUrl(f);
          if (url) {
            if (f === item) {
              index = urls.length;
            }
            urls.push(url);
          }
        });
        options.urlList = urls;
        options.initialIndex = index;
      }
    } else if (options.initialIndex == null) {
      options.initialIndex = 0;
    }
    if (
      options.urlList?.length &&
      options.initialIndex != null &&
      options.initialIndex >= 0
    ) {
      openImagePreview(options);
    }
  };

  /** 附件点击事件 */
  const handleFileClick = (item: FileItem) => {
    const viewerProps =
      typeof props.imageViewerProps === 'function'
        ? props.imageViewerProps(item)
        : props.imageViewerProps;
    if (viewerProps !== false) {
      previewImage(item, viewerProps === true ? void 0 : viewerProps);
    }
    emit('fileClick', item);
  };

  /** 附件删除事件 */
  const handleFileRemove = (item: FileItem) => {
    emit('fileRemove', item);
  };

  /** 附件上传事件 */
  const handleFileUpload = (item: FileItem) => {
    emit('fileUpload', item);
  };

  /** 更新输入框文本 */
  const handleUpdateModelValue = (content: string) => {
    emit('update:modelValue', content);
  };

  /** 聊天气泡中附件点击事件 */
  const handleBubbleFileClick = (item: MessageItem, fileItem: FileItem) => {
    const viewerProps =
      typeof props.imageViewerProps === 'function'
        ? props.imageViewerProps(fileItem, item)
        : props.imageViewerProps;
    if (viewerProps !== false) {
      previewImage(fileItem, viewerProps === true ? void 0 : viewerProps, item);
    }
    emit('bubbleFileClick', item, fileItem);
  };

  /** 聊天气泡中附件删除事件 */
  const handleBubbleFileRemove = (item: MessageItem, fileItem: FileItem) => {
    emit('bubbleFileRemove', item, fileItem);
  };

  /** 聊天气泡中编辑取消事件 */
  const handleBubbleEditCancel = (item: MessageItem) => {
    emit('bubbleEditCancel', item);
  };

  /** 聊天气泡中编辑确认事件 */
  const handleBubbleEditConfirm = (item: MessageItem, content: string) => {
    emit('bubbleEditConfirm', item, content);
  };

  /** 释放全部图片文件预读 */
  const clearImageObjectUrls = () => {
    imageObjectUrls.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });
    imageObjectUrls.splice(0, imageObjectUrls.length);
  };

  /** 更新对话列表选中 */
  const handleUpdateActive = (active?: string | number) => {
    emit('update:active', active);
  };

  /** 折叠侧栏按钮鼠标移入事件 */
  const handleLogoCollapseToolMouseenter = (e: MouseEvent) => {
    showTooltipPro(e.currentTarget, {
      content: lang.value.sideFoldTip,
      placement: 'right'
    });
  };

  /** 展开侧栏按钮鼠标移入事件 */
  const handleHeaderCollapseToolMouseenter = (e: MouseEvent) => {
    showTooltipPro(e.currentTarget, {
      content: lang.value.sideExpandTip,
      placement: 'bottom'
    });
  };

  /** 新对话按钮鼠标移入事件 */
  const handleHeaderNewBtnMouseenter = (e: MouseEvent) => {
    showTooltipPro(e.currentTarget, {
      content: lang.value.newText,
      placement: 'bottom'
    });
  };

  /** 检查是否可滚动到底部 */
  const checkBackbottom = () => {
    const contentEl = contentRef.value;
    if (!contentEl) {
      return false;
    }
    const top = contentEl.scrollTop || 0;
    const height = contentEl.scrollHeight - contentEl.clientHeight - 1;
    if (!(height > 1 && top < height)) {
      enableBackbottom.value = false;
      return false;
    }
    return true;
  };

  /** 内容区域滚动到顶部 */
  const contentScrollToTop = (option?: ScrollToOptions) => {
    const contentEl = contentRef.value;
    if (contentEl) {
      contentEl.scrollTo({ top: 0, behavior: 'smooth', ...(option || {}) });
    }
    checkBackbottom();
  };

  /** 内容区域滚动到底部 */
  const contentScrollToBottom = (option?: ScrollToOptions) => {
    if (!checkBackbottom()) {
      return;
    }
    const contentEl = contentRef.value;
    if (contentEl) {
      contentEl.scrollTo({
        top: contentEl.scrollHeight - contentEl.clientHeight,
        behavior: 'smooth',
        ...(option || {})
      });
    }
  };

  /** 返回底部 */
  const handleBackbottom = () => {
    contentScrollToBottom();
  };

  /** 内容区域滚动事件 */
  const handleContentScroll = () => {
    if (checkBackbottom()) {
      enableBackbottom.value = true;
    }
  };

  /** 同步更新侧栏折叠状态 */
  watch(
    () => props.collapse,
    (collapse) => {
      if (sideCollapse.value !== collapse) {
        sideCollapse.value = collapse;
      }
    }
  );

  /** 移动端小屏幕媒体查询 */
  const [media, startMedia, stopMedia] = useMediaQuery(mobileMediaQuery, () => {
    const isMobile = isResponsive.value ? media.matches : false;
    if (mobile.value !== isMobile) {
      mobile.value = isMobile;
      updateCollapse(mobile.value);
    }
  });

  watch(
    isResponsive,
    (responsive) => {
      if (responsive) {
        startMedia();
      } else {
        stopMedia();
      }
    },
    { immediate: true }
  );

  /** 对话选中改变后在移动端小屏幕自动收起侧栏 */
  watch(
    () => props.active,
    () => {
      if (mobile.value) {
        updateCollapse(true);
      }
    }
  );

  /** TODO 在 files 和 messages 改变后释放无用的 File 预读 */
  onBeforeUnmount(() => {
    // 释放图片文件预读
    previewVisible.value = false;
    previewProps.value = {};
    clearImageObjectUrls();
  });

  /** 共享方法 */
  const chatProvide = shallowReactive<ChatProvide>({
    openDropdown,
    removeDropdown,
    showTooltip,
    removeTooltip
  });
  provide<ChatProvide>(CHAT_KEY, chatProvide);

  defineExpose({
    contentRef,
    contentScrollToTop,
    contentScrollToBottom,
    openImagePreview,
    dropdownRef,
    openDropdown,
    removeDropdown,
    tooltipRef,
    showTooltip,
    removeTooltip
  });
</script>

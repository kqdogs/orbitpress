<!-- 包裹组件 -->
<template>
  <slot></slot>
  <EleModalRender
    :modals="modals"
    @removeItem="removeModal"
    @updateItemVisible="updateModalVisible"
    @updateItemProps="updateModalProps"
  />
  <EleDropdown
    v-if="dropdownVirtualRef"
    v-bind="dropdownProps"
    ref="dropdownRef"
    :persistent="false"
    :validateEvent="false"
    componentType="pro"
    :virtualTriggering="true"
    :virtualRef="dropdownVirtualRef"
    :disabled="!dropdownItems.length"
    :items="dropdownItems"
  />
  <ElePopconfirm
    v-if="popconfirmVirtualRef"
    :width="200"
    :persistent="false"
    placement="top-end"
    v-bind="popconfirmProps"
    ref="popconfirmRef"
    :virtualTriggering="true"
    :virtualRef="popconfirmVirtualRef"
  />
  <EleTooltip
    v-if="tooltipVirtualRef"
    :persistent="false"
    v-bind="tooltipProps"
    ref="tooltipRef"
    :virtualTriggering="true"
    :virtualRef="tooltipVirtualRef"
  />
  <EleImageViewer
    v-if="imageViewerProps"
    v-bind="imageViewerProps"
    ref="imageViewerRef"
    v-model="imageViewerVisible"
  />
</template>

<script lang="ts" setup>
  import EleModalRender from '../ele-modal-render/index';
  import { useModalRenderProvider } from '../ele-modal-render/util';
  import EleDropdown from '../ele-dropdown/index.vue';
  import { useDropdownProvider } from '../ele-dropdown-provider/util';
  import ElePopconfirm from '../ele-popconfirm/index.vue';
  import { usePopconfirmProvider } from '../ele-popconfirm-provider/util';
  import EleTooltip from '../ele-tooltip/index.vue';
  import { useTooltipProvider } from '../ele-tooltip-provider/util';
  import EleImageViewer from '../ele-image-viewer/index.vue';
  import { useImageViewerProvider } from '../ele-image-viewer-provider/util';

  defineOptions({ name: 'EleApp' });

  /** 提供弹窗操作 */
  const {
    modals,
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalVisible,
    updateModalProps
  } = useModalRenderProvider();

  /** 提供下拉菜单操作 */
  const {
    dropdownRef,
    dropdownVirtualRef,
    dropdownItems,
    dropdownProps,
    openDropdown,
    removeDropdown
  } = useDropdownProvider();

  /** 提供气泡确认框操作 */
  const {
    popconfirmRef,
    popconfirmVirtualRef,
    popconfirmProps,
    openPopconfirm,
    removePopconfirm
  } = usePopconfirmProvider();

  /** 提供文本提示操作 */
  const {
    tooltipRef,
    tooltipVirtualRef,
    tooltipProps,
    showTooltip,
    removeTooltip
  } = useTooltipProvider();

  /** 提供图片预览操作 */
  const {
    imageViewerRef,
    imageViewerProps,
    imageViewerVisible,
    opemImageViewer,
    removeImageViewer
  } = useImageViewerProvider();

  defineExpose({
    // 弹窗操作
    openModal,
    closeModal,
    closeAllModal,
    removeModal,
    removeAllModal,
    updateModalProps,
    // 下拉菜单操作
    dropdownRef,
    openDropdown,
    removeDropdown,
    // 气泡确认框操作
    popconfirmRef,
    openPopconfirm,
    removePopconfirm,
    // 文本提示操作
    tooltipRef,
    showTooltip,
    removeTooltip,
    // 提供图片预览操作
    imageViewerRef,
    opemImageViewer,
    removeImageViewer
  });
</script>

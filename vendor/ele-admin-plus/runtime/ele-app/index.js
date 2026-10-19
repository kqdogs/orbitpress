import { defineComponent, openBlock, createElementBlock, Fragment, renderSlot, createVNode, unref, createBlock, mergeProps, createCommentVNode, isRef } from "vue";
import EleModalRender from "../ele-modal-render/index";
import { useModalRenderProvider } from "../ele-modal-render/util";
import EleDropdown from "../ele-dropdown/index";
import { useDropdownProvider } from "../ele-dropdown-provider/util";
import ElePopconfirm from "../ele-popconfirm/index";
import { usePopconfirmProvider } from "../ele-popconfirm-provider/util";
import EleTooltip from "../ele-tooltip/index";
import { useTooltipProvider } from "../ele-tooltip-provider/util";
import EleImageViewer from "../ele-image-viewer/index";
import { useImageViewerProvider } from "../ele-image-viewer-provider/util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleApp" },
  __name: "index",
  setup(__props, { expose: __expose }) {
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
    const {
      dropdownRef,
      dropdownVirtualRef,
      dropdownItems,
      dropdownProps,
      openDropdown,
      removeDropdown
    } = useDropdownProvider();
    const {
      popconfirmRef,
      popconfirmVirtualRef,
      popconfirmProps,
      openPopconfirm,
      removePopconfirm
    } = usePopconfirmProvider();
    const {
      tooltipRef,
      tooltipVirtualRef,
      tooltipProps,
      showTooltip,
      removeTooltip
    } = useTooltipProvider();
    const {
      imageViewerRef,
      imageViewerProps,
      imageViewerVisible,
      opemImageViewer,
      removeImageViewer
    } = useImageViewerProvider();
    __expose({
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
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        renderSlot(_ctx.$slots, "default"),
        createVNode(unref(EleModalRender), {
          modals: unref(modals),
          onRemoveItem: unref(removeModal),
          onUpdateItemVisible: unref(updateModalVisible),
          onUpdateItemProps: unref(updateModalProps)
        }, null, 8, ["modals", "onRemoveItem", "onUpdateItemVisible", "onUpdateItemProps"]),
        unref(dropdownVirtualRef) ? (openBlock(), createBlock(EleDropdown, mergeProps({ key: 0 }, unref(dropdownProps), {
          ref_key: "dropdownRef",
          ref: dropdownRef,
          persistent: false,
          validateEvent: false,
          componentType: "pro",
          virtualTriggering: true,
          virtualRef: unref(dropdownVirtualRef),
          disabled: !unref(dropdownItems).length,
          items: unref(dropdownItems)
        }), null, 16, ["virtualRef", "disabled", "items"])) : createCommentVNode("", true),
        unref(popconfirmVirtualRef) ? (openBlock(), createBlock(ElePopconfirm, mergeProps({
          key: 1,
          width: 200,
          persistent: false,
          placement: "top-end"
        }, unref(popconfirmProps), {
          ref_key: "popconfirmRef",
          ref: popconfirmRef,
          virtualTriggering: true,
          virtualRef: unref(popconfirmVirtualRef)
        }), null, 16, ["virtualRef"])) : createCommentVNode("", true),
        unref(tooltipVirtualRef) ? (openBlock(), createBlock(EleTooltip, mergeProps({
          key: 2,
          persistent: false
        }, unref(tooltipProps), {
          ref_key: "tooltipRef",
          ref: tooltipRef,
          virtualTriggering: true,
          virtualRef: unref(tooltipVirtualRef)
        }), null, 16, ["virtualRef"])) : createCommentVNode("", true),
        unref(imageViewerProps) ? (openBlock(), createBlock(EleImageViewer, mergeProps({ key: 3 }, unref(imageViewerProps), {
          ref_key: "imageViewerRef",
          ref: imageViewerRef,
          modelValue: unref(imageViewerVisible),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(imageViewerVisible) ? imageViewerVisible.value = $event : null)
        }), null, 16, ["modelValue"])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

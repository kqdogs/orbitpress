import { defineComponent, ref, computed, watch, onBeforeUnmount, shallowReactive, provide, openBlock, createElementBlock, normalizeClass, unref, normalizeStyle, createElementVNode, renderSlot, createCommentVNode, toDisplayString, createVNode, withCtx, createBlock, mergeProps, createTextVNode, createSlots, renderList, normalizeProps, guardReactiveProps, Fragment } from "vue";
import { ElIcon, ElButton } from "element-plus";
import { SideFoldOutlined, MessageAddOutlined, SideExpandOutlined, ArrowDown } from "../icons/index";
import { findTree } from "../utils/common";
import { useMobileDevice, useTimer, useMediaQuery, mobileMediaQuery } from "../utils/hook";
import { useTooltipProviderPro } from "../ele-tooltip-provider/util";
import { useLocale } from "../ele-config-provider/receiver";
import { useDropdownProviderPro } from "../ele-dropdown-provider/util";
import { useResponsive } from "../ele-pro-layout/util";
import EleImageViewer from "../ele-image-viewer/index";
import EleTooltip from "../ele-tooltip/index";
import EleDropdown from "../ele-dropdown/index";
import MainContent from "../ele-loading/components/main-content";
import ChatConversations from "./components/chat-conversations";
import ChatBubble from "./components/chat-bubble";
import ChatInput from "./components/chat-input";
import { chatEmits, chatProps, CHAT_KEY, defaultTooltipProps } from "./props";
const _hoisted_1 = { class: "ele-chat-logo-wrapper" };
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "ele-chat-logo-tools" };
const _hoisted_4 = { class: "ele-chat-side-main" };
const _hoisted_5 = { class: "ele-chat-side-tools" };
const _hoisted_6 = {
  key: 0,
  class: "ele-chat-side-footer"
};
const _hoisted_7 = { class: "ele-chat-body" };
const _hoisted_8 = ["src"];
const _hoisted_9 = {
  key: 1,
  class: "ele-chat-backbottom"
};
const _hoisted_10 = { class: "ele-chat-bottom" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleChat" },
  __name: "index",
  props: chatProps,
  emits: chatEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("chat", props);
    const {
      dropdownRef,
      dropdownVirtualRef,
      dropdownItems: dropdownMergedItems,
      dropdownProps: dropdownMergedProps,
      openDropdown,
      removeDropdown
    } = useDropdownProviderPro();
    const {
      tooltipRef,
      tooltipVirtualRef,
      tooltipProps: tooltipMergedProps,
      showTooltip,
      removeTooltip
    } = useTooltipProviderPro();
    const isResponsive = useResponsive(props);
    const [isMobileDevice] = useMobileDevice();
    const sideCollapse = ref(props.collapse);
    const previewVisible = ref(false);
    const previewProps = ref({});
    const contentRef = ref(null);
    const enableBackbottom = ref(false);
    const mobile = ref(false);
    const activeConversation = computed(() => {
      if (props.active == null || !props.conversations) {
        return;
      }
      return findTree(props.conversations, (d) => d.key === props.active);
    });
    const imageObjectUrls = [];
    let tooltipDisabled = false;
    const [startDisableTooltipTimer] = useTimer(350, () => {
      tooltipDisabled = false;
    });
    const showTooltipPro = (triggerEl, options) => {
      const tooltipProps = props.tooltipProps;
      if (tooltipProps === false || tooltipDisabled || isMobileDevice.value) {
        return;
      }
      showTooltip(triggerEl, {
        ...defaultTooltipProps,
        ...(tooltipProps === true ? void 0 : tooltipProps) || {},
        ...options || {}
      });
    };
    const updateCollapse = (collapse) => {
      removeTooltip();
      tooltipDisabled = true;
      startDisableTooltipTimer();
      sideCollapse.value = collapse ?? !sideCollapse.value;
      emit("update:collapse", sideCollapse.value);
    };
    const handleCollapse = () => {
      updateCollapse();
    };
    const handleLogoClick = (e) => {
      emit("logoClick", e);
    };
    const handleNewBtnClick = (e) => {
      emit("newBtnClick", e);
      emit("update:active");
    };
    const handleChatItemClick = (item) => {
      emit("conversationClick", item);
    };
    const handleSend = (content) => {
      emit("send", content);
    };
    const handleSendBtnClick = (e) => {
      emit("sendBtnClick", e);
    };
    const handleInput = (e) => {
      emit("input", e);
    };
    const handleFocus = (e) => {
      emit("focus", e);
    };
    const handleBlur = (e) => {
      emit("blur", e);
    };
    const openImagePreview = (viewerProps) => {
      previewProps.value = viewerProps;
      previewVisible.value = true;
    };
    const getItemPreviewUrl = (item) => {
      if (item.imageUrl) {
        return item.imageUrl;
      }
      const itemFile = item.file;
      if (itemFile != null && itemFile.type.startsWith("image")) {
        const t = imageObjectUrls.find((u) => u.file === itemFile);
        if (t != null) {
          return t.url;
        }
        const url = URL.createObjectURL(itemFile);
        imageObjectUrls.push({ file: itemFile, url });
        return url;
      }
    };
    const previewImage = (item, viewerProps, message) => {
      const options = { ...viewerProps || {} };
      if (!options.urlList) {
        if (message) {
          let index = -1;
          const urls = [];
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
          let index = -1;
          const urls = [];
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
      if (options.urlList?.length && options.initialIndex != null && options.initialIndex >= 0) {
        openImagePreview(options);
      }
    };
    const handleFileClick = (item) => {
      const viewerProps = typeof props.imageViewerProps === "function" ? props.imageViewerProps(item) : props.imageViewerProps;
      if (viewerProps !== false) {
        previewImage(item, viewerProps === true ? void 0 : viewerProps);
      }
      emit("fileClick", item);
    };
    const handleFileRemove = (item) => {
      emit("fileRemove", item);
    };
    const handleFileUpload = (item) => {
      emit("fileUpload", item);
    };
    const handleUpdateModelValue = (content) => {
      emit("update:modelValue", content);
    };
    const handleBubbleFileClick = (item, fileItem) => {
      const viewerProps = typeof props.imageViewerProps === "function" ? props.imageViewerProps(fileItem, item) : props.imageViewerProps;
      if (viewerProps !== false) {
        previewImage(fileItem, viewerProps === true ? void 0 : viewerProps, item);
      }
      emit("bubbleFileClick", item, fileItem);
    };
    const handleBubbleFileRemove = (item, fileItem) => {
      emit("bubbleFileRemove", item, fileItem);
    };
    const handleBubbleEditCancel = (item) => {
      emit("bubbleEditCancel", item);
    };
    const handleBubbleEditConfirm = (item, content) => {
      emit("bubbleEditConfirm", item, content);
    };
    const clearImageObjectUrls = () => {
      imageObjectUrls.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
      imageObjectUrls.splice(0, imageObjectUrls.length);
    };
    const handleUpdateActive = (active) => {
      emit("update:active", active);
    };
    const handleLogoCollapseToolMouseenter = (e) => {
      showTooltipPro(e.currentTarget, {
        content: lang.value.sideFoldTip,
        placement: "right"
      });
    };
    const handleHeaderCollapseToolMouseenter = (e) => {
      showTooltipPro(e.currentTarget, {
        content: lang.value.sideExpandTip,
        placement: "bottom"
      });
    };
    const handleHeaderNewBtnMouseenter = (e) => {
      showTooltipPro(e.currentTarget, {
        content: lang.value.newText,
        placement: "bottom"
      });
    };
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
    const contentScrollToTop = (option) => {
      const contentEl = contentRef.value;
      if (contentEl) {
        contentEl.scrollTo({ top: 0, behavior: "smooth", ...option || {} });
      }
      checkBackbottom();
    };
    const contentScrollToBottom = (option) => {
      if (!checkBackbottom()) {
        return;
      }
      const contentEl = contentRef.value;
      if (contentEl) {
        contentEl.scrollTo({
          top: contentEl.scrollHeight - contentEl.clientHeight,
          behavior: "smooth",
          ...option || {}
        });
      }
    };
    const handleBackbottom = () => {
      contentScrollToBottom();
    };
    const handleContentScroll = () => {
      if (checkBackbottom()) {
        enableBackbottom.value = true;
      }
    };
    watch(
      () => props.collapse,
      (collapse) => {
        if (sideCollapse.value !== collapse) {
          sideCollapse.value = collapse;
        }
      }
    );
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
    watch(
      () => props.active,
      () => {
        if (mobile.value) {
          updateCollapse(true);
        }
      }
    );
    onBeforeUnmount(() => {
      previewVisible.value = false;
      previewProps.value = {};
      clearImageObjectUrls();
    });
    const chatProvide = shallowReactive({
      openDropdown,
      removeDropdown,
      showTooltip,
      removeTooltip
    });
    provide(CHAT_KEY, chatProvide);
    __expose({
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
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-chat ele-chat-wrapper", {
          "is-collapse": sideCollapse.value,
          "is-responsive": unref(isResponsive) && _ctx.sideStyle !== false
        }])
      }, [
        _ctx.sideStyle !== false ? (openBlock(), createElementBlock("div", {
          key: 0,
          style: normalizeStyle(_ctx.sideStyle === true ? void 0 : _ctx.sideStyle),
          class: "ele-chat-side"
        }, [
          createElementVNode("div", _hoisted_1, [
            createElementVNode("div", {
              style: normalizeStyle(_ctx.logoStyle),
              class: "ele-chat-logo",
              onClick: handleLogoClick
            }, [
              renderSlot(_ctx.$slots, "logo", {}, () => [
                _ctx.logoSrc ? (openBlock(), createElementBlock("img", {
                  key: 0,
                  src: _ctx.logoSrc,
                  style: normalizeStyle(_ctx.logoImgStyle),
                  class: "ele-chat-logo-img"
                }, null, 12, _hoisted_2)) : createCommentVNode("", true),
                _ctx.logoTitle ? (openBlock(), createElementBlock("div", {
                  key: 1,
                  style: normalizeStyle(_ctx.logoTitleStyle),
                  class: "ele-chat-logo-title"
                }, toDisplayString(_ctx.logoTitle), 5)) : createCommentVNode("", true)
              ])
            ], 4),
            createElementVNode("div", _hoisted_3, [
              renderSlot(_ctx.$slots, "logoTool"),
              createElementVNode("div", {
                class: "ele-chat-logo-tool",
                onMouseenter: handleLogoCollapseToolMouseenter,
                onClick: handleCollapse
              }, [
                createVNode(unref(ElIcon), null, {
                  default: withCtx(() => [
                    createVNode(unref(SideFoldOutlined))
                  ]),
                  _: 1
                })
              ], 32)
            ])
          ]),
          renderSlot(_ctx.$slots, "sideTop"),
          createElementVNode("div", _hoisted_4, [
            createElementVNode("div", _hoisted_5, [
              renderSlot(_ctx.$slots, "sideTool"),
              _ctx.newBtnProps !== false ? (openBlock(), createBlock(unref(ElButton), mergeProps({
                key: 0,
                icon: unref(MessageAddOutlined),
                class: "ele-chat-new-btn"
              }, (_ctx.newBtnProps === true ? void 0 : _ctx.newBtnProps) || {}, { onClick: handleNewBtnClick }), {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(lang).newText), 1)
                ]),
                _: 1
              }, 16, ["icon"])) : createCommentVNode("", true)
            ]),
            createVNode(ChatConversations, {
              items: _ctx.conversations,
              active: _ctx.active,
              dropdownProps: _ctx.dropdownProps,
              dropdownItems: _ctx.dropdownItems,
              onItemClick: handleChatItemClick,
              "onUpdate:active": handleUpdateActive
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["items", "active", "dropdownProps", "dropdownItems"])
          ]),
          _ctx.$slots.sideBottom ? (openBlock(), createElementBlock("div", _hoisted_6, [
            renderSlot(_ctx.$slots, "sideBottom")
          ])) : createCommentVNode("", true)
        ], 4)) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_7, [
          _ctx.headerStyle !== false ? (openBlock(), createElementBlock("div", {
            key: 0,
            style: normalizeStyle(_ctx.headerStyle === true ? void 0 : _ctx.headerStyle),
            class: "ele-chat-header"
          }, [
            renderSlot(_ctx.$slots, "headerLeft"),
            createElementVNode("div", {
              style: normalizeStyle(_ctx.headerLogoStyle),
              class: "ele-chat-header-logo",
              onClick: handleLogoClick
            }, [
              renderSlot(_ctx.$slots, "logo", { header: true }, () => [
                _ctx.logoSrc ? (openBlock(), createElementBlock("img", {
                  key: 0,
                  src: _ctx.logoSrc,
                  style: normalizeStyle(_ctx.logoImgStyle),
                  class: "ele-chat-header-logo-img"
                }, null, 12, _hoisted_8)) : createCommentVNode("", true)
              ])
            ], 4),
            _ctx.headerToolsStyle !== false ? (openBlock(), createElementBlock("div", {
              key: 0,
              style: normalizeStyle(_ctx.headerToolsStyle === true ? void 0 : _ctx.headerToolsStyle),
              class: "ele-chat-header-tools"
            }, [
              renderSlot(_ctx.$slots, "headerTool"),
              createElementVNode("div", {
                class: "ele-chat-header-tool",
                onClick: handleCollapse,
                onMouseenter: handleHeaderCollapseToolMouseenter
              }, [
                createVNode(unref(ElIcon), null, {
                  default: withCtx(() => [
                    createVNode(unref(SideExpandOutlined))
                  ]),
                  _: 1
                })
              ], 32),
              _ctx.newBtnProps !== false ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-chat-header-tool",
                onClick: handleNewBtnClick,
                onMouseenter: handleHeaderNewBtnMouseenter
              }, [
                createVNode(unref(ElIcon), null, {
                  default: withCtx(() => [
                    createVNode(unref(MessageAddOutlined))
                  ]),
                  _: 1
                })
              ], 32)) : createCommentVNode("", true)
            ], 4)) : createCommentVNode("", true),
            createElementVNode("div", {
              style: normalizeStyle(_ctx.headerTitleStyle),
              class: "ele-chat-header-title"
            }, [
              renderSlot(_ctx.$slots, "headerTitle", { activeConversation: activeConversation.value }, () => [
                createTextVNode(toDisplayString(activeConversation.value?.label), 1)
              ])
            ], 4),
            renderSlot(_ctx.$slots, "headerRight")
          ], 4)) : createCommentVNode("", true),
          createElementVNode("div", {
            ref_key: "contentRef",
            ref: contentRef,
            class: "ele-chat-content",
            onScroll: handleContentScroll
          }, [
            renderSlot(_ctx.$slots, "content"),
            createVNode(MainContent, { class: "ele-chat-bubble-list" }, {
              default: withCtx((contentProps) => [
                _ctx.messages?.length && contentProps?.["size"] == 1 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(_ctx.messages, (item) => {
                  return openBlock(), createBlock(ChatBubble, {
                    key: item.key ?? item.content,
                    item,
                    uploadError: unref(lang).uploadError,
                    thinkingText: unref(lang).thinkingText,
                    thoughtText: unref(lang).thoughtText,
                    editPlaceholder: unref(lang).placeholder,
                    editCancelText: unref(lang).editCancel,
                    editConfirmText: unref(lang).editConfirm,
                    editConfirmBtnProps: _ctx.editConfirmBtnProps,
                    editCancelBtnProps: _ctx.editCancelBtnProps,
                    editInputProps: _ctx.editInputProps,
                    onFileClick: handleBubbleFileClick,
                    onFileRemove: handleBubbleFileRemove,
                    onEditCancel: handleBubbleEditCancel,
                    onEditConfirm: handleBubbleEditConfirm
                  }, createSlots({ _: 2 }, [
                    renderList(Object.keys(_ctx.$slots), (name) => {
                      return {
                        name,
                        fn: withCtx((slotProps) => [
                          renderSlot(_ctx.$slots, name, mergeProps({ ref_for: true }, slotProps || {}))
                        ])
                      };
                    })
                  ]), 1032, ["item", "uploadError", "thinkingText", "thoughtText", "editPlaceholder", "editCancelText", "editConfirmText", "editConfirmBtnProps", "editCancelBtnProps", "editInputProps"]);
                }), 128)) : createCommentVNode("", true)
              ]),
              _: 3
            })
          ], 544),
          enableBackbottom.value ? (openBlock(), createElementBlock("div", _hoisted_9, [
            createVNode(unref(ElIcon), mergeProps({ class: "ele-chat-backbottom-icon" }, _ctx.backbottomProps, { onClick: handleBackbottom }), {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "backbottomIcon", {}, () => [
                  createVNode(unref(ArrowDown), { style: { "transform": "translateY(1px)" } })
                ])
              ]),
              _: 3
            }, 16)
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_10, [
            createVNode(ChatInput, {
              modelValue: _ctx.modelValue,
              sendBtnProps: _ctx.sendBtnProps,
              uploadBtnProps: _ctx.uploadBtnProps,
              files: _ctx.files,
              placeholder: _ctx.placeholder ?? unref(lang).placeholder,
              uploadProps: _ctx.uploadProps,
              uploadTip: unref(lang).uploadTip,
              uploadError: unref(lang).uploadError,
              onInput: handleInput,
              onFocus: handleFocus,
              onBlur: handleBlur,
              onSend: handleSend,
              onSendBtnClick: handleSendBtnClick,
              onFileClick: handleFileClick,
              onFileRemove: handleFileRemove,
              onFileUpload: handleFileUpload,
              "onUpdate:modelValue": handleUpdateModelValue
            }, createSlots({ _: 2 }, [
              renderList(Object.keys(_ctx.$slots), (name) => {
                return {
                  name,
                  fn: withCtx((slotProps) => [
                    renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                  ])
                };
              })
            ]), 1032, ["modelValue", "sendBtnProps", "uploadBtnProps", "files", "placeholder", "uploadProps", "uploadTip", "uploadError"]),
            _ctx.footerStyle !== false ? (openBlock(), createElementBlock("div", {
              key: 0,
              style: normalizeStyle(_ctx.footerStyle === true ? void 0 : _ctx.footerStyle),
              class: "ele-chat-footer"
            }, [
              renderSlot(_ctx.$slots, "footer", {}, () => [
                createElementVNode("div", {
                  style: normalizeStyle(_ctx.active == null ? { visibility: "hidden" } : void 0)
                }, toDisplayString(unref(lang).footerText), 5)
              ])
            ], 4)) : createCommentVNode("", true)
          ])
        ]),
        createElementVNode("div", {
          class: "ele-chat-mask",
          onClick: handleCollapse
        }),
        _ctx.imageViewerProps !== false ? (openBlock(), createBlock(EleImageViewer, mergeProps({
          key: 1,
          infinite: false
        }, previewProps.value || {}, {
          modelValue: previewVisible.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => previewVisible.value = $event)
        }), null, 16, ["modelValue"])) : createCommentVNode("", true),
        unref(dropdownVirtualRef) ? (openBlock(), createBlock(EleDropdown, mergeProps({ key: 2 }, unref(dropdownMergedProps), {
          ref_key: "dropdownRef",
          ref: dropdownRef,
          persistent: false,
          validateEvent: false,
          componentType: "pro",
          virtualTriggering: true,
          virtualRef: unref(dropdownVirtualRef),
          disabled: !unref(dropdownMergedItems).length,
          items: unref(dropdownMergedItems)
        }), null, 16, ["virtualRef", "disabled", "items"])) : createCommentVNode("", true),
        unref(tooltipVirtualRef) ? (openBlock(), createBlock(EleTooltip, mergeProps({
          key: 3,
          persistent: false
        }, unref(tooltipMergedProps), {
          ref_key: "tooltipRef",
          ref: tooltipRef,
          virtualTriggering: true,
          virtualRef: unref(tooltipVirtualRef)
        }), null, 16, ["virtualRef"])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

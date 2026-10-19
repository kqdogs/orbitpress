import { defineComponent, ref, computed, watch, onMounted, onBeforeUnmount, onActivated, onDeactivated, openBlock, createBlock, Teleport, createVNode, unref, mergeProps, createSlots, withCtx, normalizeStyle, normalizeClass, renderSlot, createElementVNode, createTextVNode, toDisplayString, createElementBlock, withModifiers, createCommentVNode, resolveDynamicComponent } from "vue";
import { ElDialog, ElIcon } from "element-plus";
import { CompressOutlined, ExpandOutlined, CloseOutlined, ResizeOutlined } from "../icons/index";
import { pick } from "../utils/common";
import { useMoveEvent } from "../utils/hook";
import MainContent from "../ele-loading/components/main-content";
import LoadingSpinner from "../ele-loading/components/loading-spinner";
import { useLayoutState, useResponsive } from "../ele-pro-layout/util";
import { wrapperClass, getPositionMargin, getModalContainer, canMoveOut, closedClass, getMaxZIndex } from "./util";
import { modalEmits, modalProps, dialogPropKeys } from "./props";
const _hoisted_1 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleModal", inheritAttrs: false },
  __name: "index",
  props: modalProps,
  emits: modalEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const layoutState = useLayoutState();
    const isResponsive = useResponsive(props);
    const dialogRef = ref(null);
    const isFullscreen = ref(props.fullscreen ?? false);
    const modalPositionTop = ref();
    const modalPositionLeft = ref();
    const modalResizedWidth = ref();
    const modalResizedHeight = ref();
    const modalZIndex = ref(props.zIndex);
    const modalIsMoving = ref(false);
    const isActivated = ref(!props.isDeactivated);
    const dialogClass = computed(() => {
      const classes = [wrapperClass];
      if (isResponsive.value) {
        classes.push("ele-modal-responsive");
      }
      if (props.maxHeight == null || props.maxHeight != null && props.maxHeight !== "") {
        classes.push("ele-modal-fluid");
      }
      if (props.position === "top") {
        classes.push("ele-modal-top");
      } else if (props.position === "bottom") {
        classes.push("ele-modal-bottom");
      } else if (props.position === "left") {
        classes.push("ele-modal-left");
      } else if (props.position === "right") {
        classes.push("ele-modal-right");
      } else if (props.position === "leftTop") {
        classes.push("ele-modal-left-top");
      } else if (props.position === "leftBottom") {
        classes.push("ele-modal-left-bottom");
      } else if (props.position === "rightTop") {
        classes.push("ele-modal-right-top");
      } else if (props.position === "rightBottom") {
        classes.push("ele-modal-right-bottom");
      }
      if (props.draggable) {
        classes.push("ele-modal-movable");
      }
      if (props.resizable) {
        classes.push("ele-modal-resizable");
      }
      if (props.multiple) {
        classes.push("ele-modal-multiple");
      }
      if (isFullscreen.value) {
        classes.push("ele-modal-fullscreen");
      }
      if (!props.modelValue) {
        classes.push(closedClass);
      }
      if (!isActivated.value && props.modelValue) {
        classes.push("ele-modal-hide");
      }
      if (props.inner) {
        classes.push("ele-modal-inner");
      }
      if (props.compLoading && !props.loading) {
        classes.push("ele-modal-comp-loading");
      }
      if (props.flexTable === "auto") {
        classes.push("ele-modal-flex-auto-table");
      } else if (props.flexTable) {
        classes.push("ele-modal-flex-table");
      }
      if (props.customFooter) {
        classes.push("ele-modal-custom-footer");
      }
      if (props.modalClass) {
        classes.push(props.modalClass);
      }
      return classes.join(" ");
    });
    const modalIsAbsolute = computed(() => {
      return modalPositionTop.value != null || modalPositionLeft.value != null;
    });
    const modalPositionMargin = computed(() => {
      if (typeof props.position === "string") {
        return;
      }
      return getPositionMargin({
        top: props.top,
        ...props.alignCenter ? { top: "auto", left: "auto", right: "auto", bottom: "auto" } : {},
        ...props.position || {}
      });
    });
    const teleportTo = computed(() => {
      return getModalContainer(
        props.inner,
        props.multiple,
        props.appendTo,
        layoutState.modalsEl
      );
    });
    const teleportDisabled = computed(() => {
      const bodyAppend = "body";
      const appendTo = props.appendTo || bodyAppend;
      const disabled = appendTo === bodyAppend ? !props.appendToBody : false;
      return props.multiple || props.inner ? false : disabled;
    });
    const getModalEl = () => {
      const el = unref(dialogRef.value?.dialogContentRef)?.$el;
      return el;
    };
    const topModal = () => {
      const zIndex = getMaxZIndex(getModalEl(), props.zIndex);
      if (zIndex != null && modalZIndex.value !== zIndex) {
        modalZIndex.value = zIndex;
      }
    };
    const moveEventOption = {
      modalEl: null,
      wrapEl: null,
      downOL: null,
      downOT: null,
      downW: null,
      downH: null,
      fixTop: 0.65,
      fixLeft: 0.65
    };
    const {
      handleMousedown: handleHeaderMousedown,
      handleTouchstart: handleHeaderTouchstart
    } = useMoveEvent({
      start: () => {
        moveEventOption.modalEl = getModalEl();
        moveEventOption.wrapEl = moveEventOption.modalEl?.parentElement;
        if (!moveEventOption.modalEl || !moveEventOption.wrapEl || !props.draggable || isFullscreen.value) {
          return;
        }
        modalIsMoving.value = true;
        moveEventOption.downOL = moveEventOption.modalEl.offsetLeft;
        moveEventOption.downOT = moveEventOption.modalEl.offsetTop;
      },
      move: ({ distanceX, distanceY, e }) => {
        if (!moveEventOption.modalEl || !moveEventOption.wrapEl || moveEventOption.downOL == null || moveEventOption.downOT == null || distanceX == null || distanceY == null) {
          return;
        }
        e.preventDefault();
        let positionLeft = distanceX + moveEventOption.downOL;
        let positionTop = distanceY + moveEventOption.downOT;
        const limitL = moveEventOption.wrapEl.clientWidth - moveEventOption.modalEl.clientWidth - moveEventOption.fixLeft;
        const limitT = moveEventOption.wrapEl.clientHeight - moveEventOption.modalEl.clientHeight - moveEventOption.fixTop;
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
          if (!canMoveOut(props.moveOut, "left") && positionLeft < 0) {
            positionLeft = 0;
          }
          if (!canMoveOut(props.moveOut, "right") && positionLeft > limitL) {
            positionLeft = limitL;
          }
          if (!canMoveOut(props.moveOut, "bottom") && positionTop > limitT) {
            positionTop = limitT;
          }
          if (!canMoveOut(props.moveOut, "top") && positionTop < 0) {
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
    const {
      handleMousedown: handleResizeMousedown,
      handleTouchstart: handleResizeTouchstart
    } = useMoveEvent({
      start: () => {
        moveEventOption.modalEl = getModalEl();
        moveEventOption.wrapEl = moveEventOption.modalEl?.parentElement;
        if (!moveEventOption.modalEl || !moveEventOption.wrapEl || !props.resizable || isFullscreen.value) {
          return;
        }
        modalIsMoving.value = true;
        moveEventOption.downW = moveEventOption.modalEl.clientWidth;
        moveEventOption.downH = moveEventOption.modalEl.clientHeight;
      },
      move: ({ distanceX, distanceY, e }) => {
        if (!moveEventOption.modalEl || !moveEventOption.wrapEl || moveEventOption.downW == null || moveEventOption.downH == null || distanceX == null || distanceY == null) {
          return;
        }
        e.preventDefault();
        if (modalPositionLeft.value == null) {
          modalPositionLeft.value = `${moveEventOption.modalEl.offsetLeft}px`;
        }
        if (modalPositionTop.value == null) {
          modalPositionTop.value = `${moveEventOption.modalEl.offsetTop}px`;
        }
        if (props.resizable !== "vertical") {
          const w = distanceX + moveEventOption.downW;
          const maxW = moveEventOption.wrapEl.clientWidth - moveEventOption.modalEl.offsetLeft - moveEventOption.fixLeft;
          const nw = (w < props.minWidth ? props.minWidth : !canMoveOut(props.moveOut, "right") && w > maxW ? maxW : w) + "px";
          modalResizedWidth.value = nw;
        }
        if (props.resizable !== "horizontal") {
          const h = distanceY + moveEventOption.downH;
          const maxH = moveEventOption.wrapEl.clientHeight - moveEventOption.modalEl.offsetTop - moveEventOption.fixTop;
          const nh = (h < props.minHeight ? props.minHeight : !canMoveOut(props.moveOut, "bottom") && h > maxH ? maxH : h) + "px";
          modalResizedHeight.value = nh;
        }
        emit("resized", {
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
    const mousedownListener = () => {
      if (props.multiple) {
        topModal();
      }
    };
    const bindAutoTopEvent = () => {
      const modalEl = getModalEl();
      if (modalEl) {
        modalEl.addEventListener("mousedown", mousedownListener);
        modalEl.addEventListener("touchstart", mousedownListener, {
          passive: true
        });
      }
    };
    const unbindAutoTopEvent = () => {
      const modalEl = getModalEl();
      if (modalEl) {
        modalEl.removeEventListener("mousedown", mousedownListener);
        modalEl.removeEventListener("touchstart", mousedownListener);
      }
    };
    const updateModelValue = (modelValue) => {
      emit("update:modelValue", modelValue);
    };
    const toggleFullscreen = (fullscreen) => {
      isFullscreen.value = !isFullscreen.value;
      topModal();
      emit("update:fullscreen", isFullscreen.value);
    };
    const resetPosition = () => {
      isFullscreen.value = props.fullscreen ?? false;
      modalPositionTop.value = void 0;
      modalPositionLeft.value = void 0;
      modalResizedWidth.value = void 0;
      modalResizedHeight.value = void 0;
      modalIsMoving.value = false;
    };
    const handleOpen = () => {
      topModal();
      emit("open");
    };
    const handleOpened = () => {
      bindAutoTopEvent();
      emit("opened");
    };
    const handleClose = () => {
      unbindAutoTopEvent();
      emit("close");
    };
    const handleClosed = () => {
      if (props.resetOnClose || props.destroyOnClose) {
        resetPosition();
      }
      emit("closed");
    };
    const handleOpenAutoFocus = () => {
      emit("openAutoFocus");
    };
    const handleCloseAutoFocus = () => {
      emit("closeAutoFocus");
    };
    const closeModal = () => {
      if (dialogRef.value) {
        dialogRef.value.handleClose();
      } else {
        updateModelValue(false);
      }
    };
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
    onMounted(() => {
      if (props.modelValue) {
        topModal();
      }
    });
    onBeforeUnmount(() => {
      moveEventOption.modalEl = null;
      moveEventOption.wrapEl = null;
      unbindAutoTopEvent();
    });
    onActivated(() => {
      isActivated.value = true;
    });
    onDeactivated(() => {
      isActivated.value = false;
    });
    __expose({
      dialogRef,
      resetPosition,
      handleClose: closeModal
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: teleportTo.value,
        disabled: teleportDisabled.value
      }, [
        createVNode(unref(ElDialog), mergeProps({ ..._ctx.$attrs, ...unref(pick)(_ctx.$props, unref(dialogPropKeys)) }, {
          ref_key: "dialogRef",
          ref: dialogRef,
          fullscreen: false,
          modal: _ctx.multiple ? false : _ctx.modal,
          modalClass: dialogClass.value,
          appendToBody: false,
          lockScroll: _ctx.inner || _ctx.multiple ? false : _ctx.lockScroll,
          showClose: false,
          draggable: false,
          overflow: false,
          alignCenter: false,
          zIndex: modalZIndex.value,
          style: {
            margin: modalIsAbsolute.value ? 0 : modalPositionMargin.value,
            position: modalIsAbsolute.value ? "absolute" : void 0,
            top: modalPositionTop.value,
            left: modalPositionLeft.value,
            width: modalResizedWidth.value,
            maxWidth: modalResizedWidth.value,
            minWidth: modalResizedWidth.value,
            height: modalResizedHeight.value ?? (typeof _ctx.height === "number" ? `${_ctx.height}px` : _ctx.height),
            maxHeight: modalResizedHeight.value ?? (typeof _ctx.maxHeight === "number" ? `${_ctx.maxHeight}px` : _ctx.maxHeight),
            minHeight: modalResizedHeight.value,
            userSelect: modalIsMoving.value ? "none" : void 0
          },
          "onUpdate:modelValue": updateModelValue,
          onOpen: handleOpen,
          onOpened: handleOpened,
          onClose: handleClose,
          onClosed: handleClosed,
          onOpenAutoFocus: handleOpenAutoFocus,
          onCloseAutoFocus: handleCloseAutoFocus
        }), createSlots({
          header: withCtx(({ close, titleId, titleClass }) => [
            createElementVNode("div", {
              style: normalizeStyle(_ctx.headerStyle),
              class: "ele-modal-header",
              onMousedown: _cache[5] || (_cache[5] = //@ts-ignore
              (...args) => unref(handleHeaderMousedown) && unref(handleHeaderMousedown)(...args)),
              onTouchstartPassive: _cache[6] || (_cache[6] = //@ts-ignore
              (...args) => unref(handleHeaderTouchstart) && unref(handleHeaderTouchstart)(...args))
            }, [
              createElementVNode("div", {
                class: "ele-modal-title",
                style: normalizeStyle(_ctx.titleStyle)
              }, [
                renderSlot(_ctx.$slots, "header", {
                  close,
                  titleId,
                  titleClass
                }, () => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ])
              ], 4),
              _ctx.maxable ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-modal-tool ele-modal-tool-max",
                style: normalizeStyle(_ctx.fullscreenBtnStyle),
                onClick: _cache[0] || (_cache[0] = ($event) => toggleFullscreen()),
                onMousedown: _cache[1] || (_cache[1] = withModifiers(() => {
                }, ["stop"])),
                onTouchstartPassive: _cache[2] || (_cache[2] = withModifiers(() => {
                }, ["stop"]))
              }, [
                renderSlot(_ctx.$slots, "maxIcon", { fullscreen: isFullscreen.value }, () => [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      isFullscreen.value ? (openBlock(), createBlock(unref(CompressOutlined), { key: 0 })) : (openBlock(), createBlock(unref(ExpandOutlined), { key: 1 }))
                    ]),
                    _: 1
                  })
                ])
              ], 36)) : createCommentVNode("", true),
              _ctx.showClose ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: "ele-modal-tool",
                style: normalizeStyle(_ctx.closeBtnStyle),
                onClick: ($event) => close(),
                onMousedown: _cache[3] || (_cache[3] = withModifiers(() => {
                }, ["stop"])),
                onTouchstartPassive: _cache[4] || (_cache[4] = withModifiers(() => {
                }, ["stop"]))
              }, [
                renderSlot(_ctx.$slots, "closeIcon", {}, () => [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      _ctx.closeIcon ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.closeIcon), { key: 0 })) : (openBlock(), createBlock(unref(CloseOutlined), { key: 1 }))
                    ]),
                    _: 1
                  })
                ])
              ], 44, _hoisted_1)) : createCommentVNode("", true)
            ], 36),
            _ctx.resizable ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["ele-modal-resize-icon", [
                { "is-horizontal": _ctx.resizable === "horizontal" },
                { "is-vertical": _ctx.resizable === "vertical" }
              ]]),
              style: normalizeStyle(_ctx.resizeIconStyle),
              onMousedown: _cache[7] || (_cache[7] = //@ts-ignore
              (...args) => unref(handleResizeMousedown) && unref(handleResizeMousedown)(...args)),
              onTouchstartPassive: _cache[8] || (_cache[8] = //@ts-ignore
              (...args) => unref(handleResizeTouchstart) && unref(handleResizeTouchstart)(...args))
            }, [
              renderSlot(_ctx.$slots, "resizeIcon", {}, () => [
                createVNode(unref(ElIcon), null, {
                  default: withCtx(() => [
                    createVNode(unref(ResizeOutlined))
                  ]),
                  _: 1
                })
              ])
            ], 38)) : createCommentVNode("", true)
          ]),
          default: withCtx(() => [
            createVNode(MainContent, {
              class: normalizeClass(["ele-modal-body", [{ "is-form": _ctx.form }, _ctx.modalBodyClass]]),
              style: normalizeStyle(_ctx.bodyStyle)
            }, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["class", "style"]),
            createVNode(LoadingSpinner, mergeProps(_ctx.loadingProps || {}, {
              loading: _ctx.compLoading || _ctx.loading,
              plain: true
            }), null, 16, ["loading"])
          ]),
          _: 2
        }, [
          _ctx.$slots.footer ? {
            name: "footer",
            fn: withCtx(() => [
              createElementVNode("div", {
                class: "ele-modal-footer",
                style: normalizeStyle(_ctx.footerStyle)
              }, [
                renderSlot(_ctx.$slots, "footer")
              ], 4)
            ]),
            key: "0"
          } : void 0
        ]), 1040, ["modal", "modalClass", "lockScroll", "zIndex", "style"])
      ], 8, ["to", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};

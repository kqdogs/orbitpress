import { defineComponent, ref, computed, watch, onActivated, onDeactivated, openBlock, createBlock, Teleport, createVNode, unref, mergeProps, createSlots, withCtx, normalizeStyle, normalizeClass, renderSlot, createElementVNode, createTextVNode, toDisplayString, createElementBlock, createCommentVNode } from "vue";
import { drawerEmits, ElDrawer, ElIcon } from "element-plus";
import { CloseOutlined } from "../icons/index";
import { pick } from "../utils/common";
import LoadingSpinner from "../ele-loading/components/loading-spinner";
import MainContent from "../ele-loading/components/main-content";
import { useLayoutState, useResponsive } from "../ele-pro-layout/util";
import { getModalContainer } from "../ele-modal/util";
import { drawerProps, elDrawerPropKeys } from "./props";
const _hoisted_1 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleDrawer", inheritAttrs: false },
  __name: "index",
  props: drawerProps,
  emits: drawerEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const layoutState = useLayoutState();
    const isResponsive = useResponsive(props);
    const drawerRef = ref(null);
    const isActivated = ref(!props.isDeactivated);
    const drawerClass = computed(() => {
      const classes = ["ele-drawer"];
      if (isResponsive.value) {
        classes.push("ele-drawer-responsive");
      }
      if (!props.modelValue) {
        classes.push("ele-drawer-closed");
      }
      if (!isActivated.value && props.modelValue) {
        classes.push("ele-drawer-hide");
      }
      if (props.inner) {
        classes.push("ele-drawer-inner");
      }
      if (props.compLoading && !props.loading) {
        classes.push("ele-drawer-comp-loading");
      }
      if (props.flexTable === "auto") {
        classes.push("ele-drawer-flex-auto-table");
      } else if (props.flexTable) {
        classes.push("ele-drawer-flex-table");
      }
      if (props.customFooter) {
        classes.push("ele-drawer-custom-footer");
      }
      if (props.modalClass) {
        classes.push(props.modalClass);
      }
      return classes.join(" ");
    });
    const teleportTo = computed(() => {
      return getModalContainer(
        props.inner,
        false,
        props.appendTo,
        layoutState.modalsEl
      );
    });
    const teleportDisabled = computed(() => {
      const appendTo = props.appendTo || "body";
      const disabled = appendTo === "body" ? !props.appendToBody : false;
      return props.inner ? false : disabled;
    });
    const handleClose = () => {
      if (drawerRef.value && drawerRef.value.handleClose) {
        drawerRef.value.handleClose();
      }
    };
    const updateModelValue = (value) => {
      emit("update:modelValue", value);
    };
    const handleDrawerOpen = () => {
      emit("open");
    };
    const handleDrawerOpened = () => {
      emit("opened");
    };
    const handleDrawerClose = () => {
      emit("close");
    };
    const handleDrawerClosed = () => {
      emit("closed");
    };
    const handleDrawerOpenAutoFocus = () => {
      emit("openAutoFocus");
    };
    const handleDrawerCloseAutoFocus = () => {
      emit("closeAutoFocus");
    };
    watch(
      () => props.isDeactivated,
      (deactivated) => {
        isActivated.value = !deactivated;
      }
    );
    onActivated(() => {
      isActivated.value = true;
    });
    onDeactivated(() => {
      isActivated.value = false;
    });
    __expose({
      drawerRef,
      handleClose
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: teleportTo.value,
        disabled: teleportDisabled.value
      }, [
        createVNode(unref(ElDrawer), mergeProps({ ..._ctx.$attrs, ...unref(pick)(_ctx.$props, unref(elDrawerPropKeys)) }, {
          ref_key: "drawerRef",
          ref: drawerRef,
          modelValue: _ctx.modelValue,
          appendToBody: false,
          lockScroll: _ctx.inner ? false : _ctx.lockScroll,
          beforeClose: _ctx.beforeClose,
          closeOnClickModal: _ctx.closeOnClickModal,
          closeOnPressEscape: _ctx.closeOnPressEscape,
          openDelay: _ctx.openDelay,
          closeDelay: _ctx.closeDelay,
          destroyOnClose: _ctx.destroyOnClose,
          modal: _ctx.modal,
          direction: _ctx.direction,
          showClose: false,
          size: _ctx.size,
          title: _ctx.title,
          withHeader: _ctx.withHeader,
          modalClass: drawerClass.value,
          zIndex: _ctx.zIndex,
          headerAriaLevel: _ctx.headerAriaLevel,
          onOpen: handleDrawerOpen,
          onOpened: handleDrawerOpened,
          onClose: handleDrawerClose,
          onClosed: handleDrawerClosed,
          onOpenAutoFocus: handleDrawerOpenAutoFocus,
          onCloseAutoFocus: handleDrawerCloseAutoFocus,
          "onUpdate:modelValue": updateModelValue
        }), createSlots({
          header: withCtx(({ close, titleId, titleClass }) => [
            createElementVNode("div", {
              class: "ele-drawer-header",
              style: normalizeStyle(_ctx.headerStyle)
            }, [
              createElementVNode("div", {
                role: "heading",
                class: "ele-drawer-title",
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
              _ctx.showClose ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-drawer-close",
                style: normalizeStyle(_ctx.closeBtnStyle),
                onClick: ($event) => close()
              }, [
                renderSlot(_ctx.$slots, "closeBtn", {}, () => [
                  createVNode(unref(ElIcon), null, {
                    default: withCtx(() => [
                      createVNode(unref(CloseOutlined))
                    ]),
                    _: 1
                  })
                ])
              ], 12, _hoisted_1)) : createCommentVNode("", true)
            ], 4)
          ]),
          default: withCtx(() => [
            createVNode(MainContent, {
              class: normalizeClass(["ele-drawer-body", [{ "is-form": _ctx.form }, _ctx.drawerBodyClass]]),
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
                class: "ele-drawer-footer",
                style: normalizeStyle(_ctx.footerStyle)
              }, [
                renderSlot(_ctx.$slots, "footer")
              ], 4)
            ]),
            key: "0"
          } : void 0
        ]), 1040, ["modelValue", "lockScroll", "beforeClose", "closeOnClickModal", "closeOnPressEscape", "openDelay", "closeDelay", "destroyOnClose", "modal", "direction", "size", "title", "withHeader", "modalClass", "zIndex", "headerAriaLevel"])
      ], 8, ["to", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};

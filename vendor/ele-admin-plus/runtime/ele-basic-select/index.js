import { defineComponent, ref, openBlock, createBlock, mergeProps, createSlots, withCtx, renderSlot, renderList, unref, normalizeProps, guardReactiveProps, normalizeClass, createElementBlock, createCommentVNode } from "vue";
import { getSlotsMap } from "../utils/common";
import EleTooltip from "../ele-tooltip/index";
import EleModal from "../ele-modal/index";
import EleDrawer from "../ele-drawer/index";
import MainContent from "../ele-loading/components/main-content";
import SelectView from "./components/select-view";
import { basicSelectEmits, basicSelectProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleBasicSelect" },
  __name: "index",
  props: basicSelectProps,
  emits: basicSelectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectViewRef = ref(null);
    const tooltipRef = ref(null);
    const modalRef = ref(null);
    const drawerRef = ref(null);
    const isSelectInputClick = ref(false);
    const updateVisible = (visible) => {
      isSelectInputClick.value = false;
      if (!props.disabled || !visible) {
        emit("update:visible", visible);
      }
    };
    const updatePopper = () => {
      tooltipRef.value && tooltipRef.value.updatePopper();
    };
    const focusSearchInput = (e) => {
      if (props.filterable && props.visible) {
        if (e != null && e.target != null) {
          const target = e.target;
          if (target.nodeName && target.nodeName.toLowerCase() === "input") {
            return;
          }
        }
        selectViewRef.value && selectViewRef.value.focusSearchInput();
      }
    };
    const handleUpdatePopoverVisible = (visible) => {
      if (!visible && props.filterable && isSelectInputClick.value) {
        isSelectInputClick.value = false;
        return;
      }
      updateVisible(visible);
    };
    const handleWrapClick = (isCustom) => {
      isSelectInputClick.value = true;
      if (!isCustom && (props.popperType === "modal" || props.popperType === "drawer")) {
        updateVisible(true);
      }
    };
    const handleInputClick = (e) => {
      if (props.automaticDropdown && props.visible) {
        isSelectInputClick.value = true;
        e.stopPropagation();
      }
    };
    const handleRemoveTag = (item) => {
      emit("removeTag", item);
    };
    const handleClear = () => {
      isSelectInputClick.value = false;
      emit("clear");
    };
    const handleFocus = (e) => {
      if (props.automaticDropdown && !props.visible) {
        updateVisible(true);
      }
      emit("focus", e);
    };
    const handleBlur = (e) => {
      emit("blur", e);
    };
    const handleFilterChange = (value) => {
      emit("filterChange", value);
    };
    __expose({
      selectViewRef,
      tooltipRef,
      modalRef,
      drawerRef,
      updatePopper,
      focusSearchInput,
      updateVisible
    });
    return (_ctx, _cache) => {
      return _ctx.popperType === "modal" || _ctx.popperType === "drawer" ? (openBlock(), createBlock(SelectView, mergeProps({ key: 0 }, _ctx.$props, {
        ref_key: "selectViewRef",
        ref: selectViewRef,
        "onUpdate:visible": updateVisible,
        onRemoveTag: handleRemoveTag,
        onClear: handleClear,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onFilterChange: handleFilterChange,
        onInputClick: handleInputClick,
        onWrapClick: handleWrapClick
      }), createSlots({
        default: withCtx(() => [
          _ctx.popperType === "drawer" ? (openBlock(), createBlock(EleDrawer, mergeProps({
            key: 0,
            title: _ctx.popperTitle,
            size: _ctx.popperWidth,
            destroyOnClose: !_ctx.persistent,
            appendToBody: _ctx.teleported,
            responsive: _ctx.responsive,
            class: _ctx.popperClass
          }, _ctx.popperProps || {}, {
            ref_key: "drawerRef",
            ref: drawerRef,
            modelValue: _ctx.visible,
            "onUpdate:modelValue": handleUpdatePopoverVisible
          }), createSlots({
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 2
          }, [
            renderList(unref(getSlotsMap)(
              _ctx.$slots,
              _ctx.popperSlots,
              ["default"],
              ["default"]
            ), (slotName, compSlotName) => {
              return {
                name: compSlotName,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040, ["title", "size", "destroyOnClose", "appendToBody", "responsive", "class", "modelValue"])) : (openBlock(), createBlock(EleModal, mergeProps({
            key: 1,
            position: "center",
            title: _ctx.popperTitle,
            width: _ctx.popperWidth,
            height: _ctx.popperHeight,
            destroyOnClose: !_ctx.persistent,
            appendToBody: _ctx.teleported,
            responsive: _ctx.responsive,
            class: _ctx.popperClass
          }, _ctx.popperProps || {}, {
            ref_key: "modalRef",
            ref: modalRef,
            modelValue: _ctx.visible,
            "onUpdate:modelValue": handleUpdatePopoverVisible
          }), createSlots({
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 2
          }, [
            renderList(unref(getSlotsMap)(
              _ctx.$slots,
              _ctx.popperSlots,
              ["default"],
              ["default"]
            ), (slotName, compSlotName) => {
              return {
                name: compSlotName,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040, ["title", "width", "height", "destroyOnClose", "appendToBody", "responsive", "class", "modelValue"]))
        ]),
        _: 2
      }, [
        renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040)) : _ctx.popperType === "default" ? (openBlock(), createBlock(MainContent, {
        key: 1,
        wrapHeight: _ctx.popperHeight,
        class: normalizeClass(_ctx.popperClass)
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["wrapHeight", "class"])) : (openBlock(), createBlock(EleTooltip, mergeProps({
        key: 2,
        ref_key: "tooltipRef",
        ref: tooltipRef,
        trigger: "click",
        disabled: _ctx.disabled,
        placement: _ctx.placement,
        teleported: _ctx.teleported,
        width: _ctx.popperWidth,
        popperClass: _ctx.popperClass,
        popperOptions: _ctx.popperOptions,
        transition: _ctx.transition,
        gpuAcceleration: _ctx.transition === "el-fade-in-linear",
        effect: "light",
        persistent: true,
        isPopover: true,
        triggerKeys: []
      }, _ctx.popperProps || {}, {
        visible: _ctx.visible,
        "onUpdate:visible": handleUpdatePopoverVisible
      }), {
        body: withCtx(() => [
          _ctx.persistent || _ctx.visible ? (openBlock(), createBlock(MainContent, {
            key: 0,
            wrapHeight: _ctx.popperHeight,
            class: "ele-popover-body",
            onClick: focusSearchInput,
            onMouseup: focusSearchInput
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["wrapHeight"])) : createCommentVNode("", true)
        ]),
        default: withCtx(() => [
          _ctx.selectStyle === "none" ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(_ctx.selectClass)
          }, null, 2)) : (openBlock(), createBlock(SelectView, mergeProps({ key: 1 }, _ctx.$props, {
            ref_key: "selectViewRef",
            ref: selectViewRef,
            "onUpdate:visible": updateVisible,
            onRemoveTag: handleRemoveTag,
            onClear: handleClear,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onFilterChange: handleFilterChange,
            onInputClick: handleInputClick,
            onWrapClick: handleWrapClick
          }), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040))
        ]),
        _: 3
      }, 16, ["disabled", "placement", "teleported", "width", "popperClass", "popperOptions", "transition", "gpuAcceleration", "visible"]));
    };
  }
});
export {
  _sfc_main as default
};

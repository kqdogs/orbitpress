import { defineComponent, computed, provide, openBlock, createElementBlock, Fragment, createBlock, resolveDynamicComponent, normalizeProps, mergeProps, createSlots, renderList, withCtx, renderSlot, guardReactiveProps, createCommentVNode } from "vue";
import EleModal from "../../ele-modal/index";
import EleDrawer from "../../ele-drawer/index";
import { MODAL_HOLDER_KEY } from "../util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ItemRender" },
  __name: "item-render",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: {
    removeItem: (_modalId) => true,
    updateItemVisible: (_modalId, _visible) => true,
    updateItemProps: (_modalId, _opt) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const removeModal = () => {
      emit("removeItem", props.item.modalId);
    };
    const setModalProps = (option) => {
      emit("updateItemProps", props.item.modalId, option);
    };
    const handleUpdateItemVisible = (visible) => {
      emit("updateItemVisible", props.item.modalId, visible);
    };
    const closeModal = () => {
      handleUpdateItemVisible(false);
    };
    const modalProps = computed(() => {
      return {
        ...props.item.props || {},
        isDeactivated: props.item.isDeactivated,
        compLoading: props.item.compLoading,
        modelValue: props.item.visible,
        "onUpdate:modelValue": handleUpdateItemVisible,
        onClosed: removeModal
      };
    });
    const provideData = {
      modalProps,
      closeModal,
      removeModal,
      setModalProps
    };
    provide(MODAL_HOLDER_KEY, provideData);
    return (_ctx, _cache) => {
      return __props.item.custom ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        __props.item.component ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          typeof __props.item.componentProps === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.item.component), normalizeProps(mergeProps({ key: 0 }, __props.item.componentProps(provideData) || {})), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040)) : (openBlock(), createBlock(resolveDynamicComponent(__props.item.component), normalizeProps(mergeProps({ key: 1 }, __props.item.componentProps || {})), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040))
        ], 64)) : createCommentVNode("", true)
      ], 64)) : __props.item.type === "drawer" ? (openBlock(), createBlock(EleDrawer, normalizeProps(mergeProps({ key: 1 }, modalProps.value || {})), createSlots({
        default: withCtx(() => [
          __props.item.component ? (openBlock(), createBlock(resolveDynamicComponent(__props.item.component), normalizeProps(mergeProps({ key: 0 }, __props.item.componentProps || {})), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040)) : createCommentVNode("", true)
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
      ]), 1040)) : (openBlock(), createBlock(EleModal, normalizeProps(mergeProps({ key: 2 }, modalProps.value || {})), createSlots({
        default: withCtx(() => [
          __props.item.component ? (openBlock(), createBlock(resolveDynamicComponent(__props.item.component), normalizeProps(mergeProps({ key: 0 }, __props.item.componentProps || {})), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter((k) => k !== "default"), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040)) : createCommentVNode("", true)
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
      ]), 1040));
    };
  }
});
export {
  _sfc_main as default
};

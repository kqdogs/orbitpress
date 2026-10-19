import { defineComponent, ref, computed, onActivated, onDeactivated, openBlock, createBlock, Teleport, createElementVNode, mergeProps, normalizeStyle, renderSlot } from "vue";
import { useLayoutState } from "../ele-pro-layout/util";
import { bottomBarProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleBottomBar", inheritAttrs: false },
  __name: "index",
  props: bottomBarProps,
  setup(__props) {
    const layoutState = useLayoutState();
    const isActivated = ref(true);
    const teleportTo = computed(() => {
      return layoutState.getBodyWrapperEl?.();
    });
    onActivated(() => {
      isActivated.value = true;
    });
    onDeactivated(() => {
      isActivated.value = false;
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, {
        to: teleportTo.value,
        disabled: !_ctx.teleported || !teleportTo.value
      }, [
        createElementVNode("div", mergeProps(_ctx.$attrs, {
          class: ["ele-bottom-bar", { "is-deactivated": !isActivated.value }]
        }), [
          createElementVNode("div", {
            class: "ele-bottom-bar-body",
            style: normalizeStyle(_ctx.bodyStyle)
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 4),
          createElementVNode("div", {
            class: "ele-bottom-bar-extra",
            style: normalizeStyle(_ctx.extraStyle)
          }, [
            renderSlot(_ctx.$slots, "extra")
          ], 4)
        ], 16)
      ], 8, ["to", "disabled"]);
    };
  }
});
export {
  _sfc_main as default
};

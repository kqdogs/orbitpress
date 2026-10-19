import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createVNode, unref, withCtx, createElementVNode } from "vue";
import ReceiverView from "../../ele-config-provider/components/receiver-view";
const _hoisted_1 = { class: "ele-admin-body" };
const _hoisted_2 = { class: "ele-admin-wrapper" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "LayoutSkeleton" },
  __name: "layout-skeleton",
  props: {
    /** logo是否位于顶栏 */
    isHeaderLogo: Boolean
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-admin-layout", { "is-row-direction": !__props.isHeaderLogo }])
      }, [
        __props.isHeaderLogo ? renderSlot(_ctx.$slots, "head", { key: 0 }) : renderSlot(_ctx.$slots, "side", { key: 1 }),
        createVNode(unref(ReceiverView), {
          class: normalizeClass(["ele-admin-main", { "is-row-direction": __props.isHeaderLogo }])
        }, {
          default: withCtx((slotProps) => [
            __props.isHeaderLogo ? renderSlot(_ctx.$slots, "side", {
              key: 0,
              param: slotProps
            }) : renderSlot(_ctx.$slots, "head", {
              key: 1,
              param: slotProps
            }),
            createElementVNode("div", _hoisted_1, [
              renderSlot(_ctx.$slots, "tabs", { param: slotProps }),
              createElementVNode("div", _hoisted_2, [
                renderSlot(_ctx.$slots, "body", { param: slotProps })
              ])
            ])
          ]),
          _: 3
        }, 8, ["class"]),
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

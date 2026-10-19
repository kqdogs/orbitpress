import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx } from "vue";
import { IconInput, IconSkeleton, IconCursor, IconPanel } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-autocomplete",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(IconInput), { size: "sm" }, {
          default: withCtx(() => [
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { width: "50%" }
            }),
            createVNode(unref(IconCursor))
          ]),
          _: 1
        }),
        createVNode(unref(IconPanel), { size: "sm" }, {
          default: withCtx(() => [
            createVNode(unref(IconSkeleton), { size: "sm" }),
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { marginTop: "4px" }
            }),
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { marginTop: "4px" }
            })
          ]),
          _: 1
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

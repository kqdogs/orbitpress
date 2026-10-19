import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode } from "vue";
import { IconInput, IconSkeleton, IconCursor } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-edit-tag",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(IconInput), { size: "sm" }, {
        default: withCtx(() => [
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1, maxWidth: "20px" }
          }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1, maxWidth: "20px", margin: "0 0 0 6px" }
          }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1, maxWidth: "20px", margin: "0 0 0 6px" }
          }),
          createVNode(unref(IconCursor), { style: { margin: "0 0 0 6px" } })
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};

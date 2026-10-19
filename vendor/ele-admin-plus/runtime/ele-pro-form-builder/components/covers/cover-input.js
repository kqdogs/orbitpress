import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode } from "vue";
import { IconInput, IconSkeleton, IconCursor } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-input",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(IconInput), { size: "sm" }, {
        default: withCtx(() => [
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { width: "50%" }
          }),
          createVNode(unref(IconCursor))
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};

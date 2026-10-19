import { defineComponent, openBlock, createBlock, unref, withCtx, createVNode, createElementVNode } from "vue";
import { IconInput, IconSkeleton, IconCursor } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center", marginTop: "6px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-textarea",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(IconInput), { style: { height: "38px", padding: "6px 6px 0 6px", display: "block" } }, {
        default: withCtx(() => [
          createVNode(unref(IconSkeleton), { size: "sm" }),
          createElementVNode("div", _hoisted_1, [
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { width: "50%" }
            }),
            createVNode(unref(IconCursor))
          ])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};

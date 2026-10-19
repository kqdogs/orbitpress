import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx, createElementVNode } from "vue";
import { IconInput, IconSkeleton, IconCursor, IconPanel } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-mention",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(IconInput), { size: "sm" }, {
          default: withCtx(() => [
            _cache[0] || (_cache[0] = createElementVNode("div", {
              class: "ele-icon-color-primary",
              style: {
                fontSize: "13px",
                fontWeight: "bold",
                lineHeight: "13px",
                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color emoji",
                margin: "0 2px 0 -2px",
                transform: "translateY(-1px)"
              }
            }, " @ ", -1)),
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

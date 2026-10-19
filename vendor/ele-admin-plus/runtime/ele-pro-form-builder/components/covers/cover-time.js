import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx, createElementVNode } from "vue";
import { IconInput, IconSkeleton, SvgIcon, IconPanel } from "../icons/index";
const _hoisted_1 = { style: { flex: 1 } };
const _hoisted_2 = { style: { flex: 1, marginLeft: "4px" } };
const _hoisted_3 = { style: { flex: 1, marginLeft: "4px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-time",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(IconInput), { size: "sm" }, {
          default: withCtx(() => [
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { width: "50%" }
            }),
            createVNode(unref(SvgIcon), {
              name: "ClockCircleOutlined",
              size: "sm",
              style: { margin: "0 0 0 auto" }
            })
          ]),
          _: 1
        }),
        createVNode(unref(IconPanel), {
          size: "sm",
          style: { display: "flex", alignItems: "flex-start" }
        }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_1, [
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
            createElementVNode("div", _hoisted_2, [
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
            createElementVNode("div", _hoisted_3, [
              createVNode(unref(IconSkeleton), { size: "sm" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { marginTop: "4px" }
              }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { marginTop: "4px" }
              })
            ])
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

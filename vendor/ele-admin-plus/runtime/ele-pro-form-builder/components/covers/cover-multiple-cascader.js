import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx, createElementVNode } from "vue";
import { IconInput, IconSkeleton, SvgIcon, IconPanel, IconCheckbox, IconArrow } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center" } };
const _hoisted_2 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_3 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-multiple-cascader",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(IconInput), { size: "sm" }, {
          default: withCtx(() => [
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { flex: 1, maxWidth: "32px" }
            }),
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { flex: 1, maxWidth: "32px", margin: "0 0 0 6px" }
            }),
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { flex: 1, maxWidth: "32px", margin: "0 6px 0 6px" }
            }),
            createVNode(unref(SvgIcon), {
              name: "ArrowUp",
              size: "sm",
              style: { margin: "0 0 0 auto" }
            })
          ]),
          _: 1
        }),
        createVNode(unref(IconPanel), { size: "sm" }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_1, [
              createVNode(unref(IconCheckbox), {
                size: "xs",
                checked: true
              }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              }),
              createVNode(unref(IconArrow), {
                size: "sm",
                color: "primary",
                style: { margin: "0 1px 0 4px" }
              }),
              createVNode(unref(IconCheckbox), {
                size: "xs",
                checked: true
              }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              }),
              createVNode(unref(IconArrow), {
                size: "sm",
                color: "primary",
                style: { margin: "0 1px 0 4px" }
              }),
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_2, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              }),
              createVNode(unref(IconArrow), {
                size: "sm",
                style: { margin: "0 1px 0 4px" }
              }),
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              }),
              createVNode(unref(IconArrow), {
                size: "sm",
                style: { margin: "0 1px 0 4px" }
              }),
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_3, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              }),
              createVNode(unref(IconArrow), {
                size: "sm",
                style: { margin: "0 1px 0 4px" }
              }),
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              }),
              createVNode(unref(IconArrow), {
                size: "sm",
                style: { margin: "0 1px 0 4px" }
              }),
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
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

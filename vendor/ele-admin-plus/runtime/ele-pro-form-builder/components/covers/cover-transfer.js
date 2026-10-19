import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx, createElementVNode } from "vue";
import { IconPanel, IconCheckbox, IconSkeleton, IconArrow } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center" } };
const _hoisted_2 = { style: { display: "flex", alignItems: "center" } };
const _hoisted_3 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_4 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_5 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_6 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_7 = { style: { margin: "0 6px" } };
const _hoisted_8 = { style: { display: "flex", alignItems: "center" } };
const _hoisted_9 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_10 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_11 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _hoisted_12 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-transfer",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(IconPanel), {
          size: "sm",
          style: { flex: 1, marginTop: 0 }
        }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_2, [
              createVNode(unref(IconCheckbox), {
                size: "xs",
                checked: true
              }),
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
              })
            ]),
            createElementVNode("div", _hoisted_4, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_5, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_6, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ])
          ]),
          _: 1
        }),
        createElementVNode("div", _hoisted_7, [
          createVNode(unref(IconArrow), { style: { marginRight: "-4px" } }),
          createVNode(unref(IconArrow), {
            direction: "left",
            style: { marginLeft: "-4px", marginTop: "6px" }
          })
        ]),
        createVNode(unref(IconPanel), {
          size: "sm",
          style: { flex: 1, marginTop: 0 }
        }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_8, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_9, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_10, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_11, [
              createVNode(unref(IconCheckbox), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_12, [
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

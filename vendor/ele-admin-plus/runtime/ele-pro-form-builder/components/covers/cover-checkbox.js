import { defineComponent, openBlock, createElementBlock, createElementVNode, createVNode, unref } from "vue";
import { IconCheckbox, IconSkeleton } from "../icons/index";
const _hoisted_1 = { style: { width: "82%", margin: "0 auto" } };
const _hoisted_2 = { style: { display: "flex", alignItems: "center" } };
const _hoisted_3 = { style: { display: "flex", alignItems: "center", marginTop: "6px" } };
const _hoisted_4 = { style: { display: "flex", alignItems: "center", marginTop: "6px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-checkbox",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(IconCheckbox), { size: "md" }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1 }
          })
        ]),
        createElementVNode("div", _hoisted_3, [
          createVNode(unref(IconCheckbox), {
            size: "md",
            checked: true
          }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1 }
          })
        ]),
        createElementVNode("div", _hoisted_4, [
          createVNode(unref(IconCheckbox), { size: "md" }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1 }
          })
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

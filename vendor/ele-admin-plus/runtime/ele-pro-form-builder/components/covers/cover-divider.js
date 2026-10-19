import { defineComponent, openBlock, createElementBlock, createVNode, unref, createElementVNode } from "vue";
import { IconSkeleton } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-divider",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(IconSkeleton), {
          size: "sm",
          style: { marginBottom: "10px", width: "33%" }
        }),
        _cache[0] || (_cache[0] = createElementVNode("div", {
          class: "ele-icon-border-color-primary",
          style: { borderTopStyle: "solid", borderTopWidth: "1px" }
        }, null, -1)),
        createVNode(unref(IconSkeleton), {
          size: "sm",
          style: { margin: "10px 0", width: "66%" }
        }),
        _cache[1] || (_cache[1] = createElementVNode("div", {
          class: "ele-icon-border-color-primary",
          style: { borderTopStyle: "dashed", borderTopWidth: "1px" }
        }, null, -1)),
        createVNode(unref(IconSkeleton), {
          size: "sm",
          style: { marginTop: "10px" }
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

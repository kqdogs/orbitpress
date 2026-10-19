import { defineComponent, openBlock, createElementBlock, createElementVNode, createVNode, unref } from "vue";
import { IconSkeleton } from "../icons/index";
const _hoisted_1 = {
  class: "ele-icon-border-color-base",
  style: {
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px"
  }
};
const _hoisted_2 = {
  class: "ele-icon-border-color-base",
  style: {
    padding: "8px 10px",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px"
  }
};
const _hoisted_3 = { style: { padding: "8px 10px 12px 10px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-card",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(IconSkeleton), {
            style: { width: "38px" },
            size: "sm"
          })
        ]),
        createElementVNode("div", _hoisted_3, [
          createVNode(unref(IconSkeleton), { size: "sm" }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { marginTop: "10px", width: "50%" }
          })
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

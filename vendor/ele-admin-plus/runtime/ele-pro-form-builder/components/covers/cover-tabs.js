import { defineComponent, openBlock, createElementBlock, createElementVNode, Fragment, renderList, createVNode, unref } from "vue";
import { IconSkeleton } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", paddingRight: "12px" } };
const _hoisted_2 = {
  class: "ele-icon-border-color-base",
  style: {
    height: "42px",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: "8px 6px 0 6px",
    boxSizing: "border-box"
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-tabs",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createElementVNode("div", _hoisted_1, [
          (openBlock(), createElementBlock(Fragment, null, renderList(3, (index) => {
            return createElementVNode("div", {
              key: index,
              class: "ele-icon-border-color-base",
              style: {
                flex: 1,
                height: "12px",
                borderTopLeftRadius: "3px",
                borderTopRightRadius: "3px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderBottom: "none",
                marginRight: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }
            }, [
              createVNode(unref(IconSkeleton), {
                size: "xs",
                style: { width: "68%" }
              })
            ]);
          }), 64))
        ]),
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(IconSkeleton), { size: "sm" }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { marginTop: "6px", width: "50%" }
          })
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

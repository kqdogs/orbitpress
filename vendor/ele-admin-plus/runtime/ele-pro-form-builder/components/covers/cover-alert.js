import { defineComponent, openBlock, createElementBlock, createElementVNode, createVNode, unref } from "vue";
import { SvgIcon, IconSkeleton } from "../icons/index";
const _hoisted_1 = { style: { maxWidth: "92%", margin: "0 auto" } };
const _hoisted_2 = {
  class: "ele-icon-border-color-base",
  style: {
    display: "flex",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px",
    padding: "4px 6px"
  }
};
const _hoisted_3 = {
  class: "ele-icon-border-color-base",
  style: {
    display: "flex",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px",
    padding: "4px 6px",
    marginTop: "8px"
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-alert",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(unref(SvgIcon), {
            name: "ExclamationCircleFilled",
            size: "sm"
          }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1, margin: "0 2px 0 4px" }
          }),
          createVNode(unref(SvgIcon), {
            name: "CloseOutlined",
            size: "sm",
            color: "placeholder",
            style: { transform: "scale(0.8)" }
          })
        ]),
        createElementVNode("div", _hoisted_3, [
          createVNode(unref(SvgIcon), {
            name: "CheckCircleFilled",
            size: "sm",
            color: "success"
          }),
          createVNode(unref(IconSkeleton), {
            size: "sm",
            style: { flex: 1, margin: "0 2px 0 4px" }
          }),
          createVNode(unref(SvgIcon), {
            name: "CloseOutlined",
            size: "sm",
            color: "placeholder",
            style: { transform: "scale(0.8)" }
          })
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

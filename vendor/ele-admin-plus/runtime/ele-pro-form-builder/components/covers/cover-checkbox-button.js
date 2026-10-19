import { defineComponent, openBlock, createElementBlock, createVNode, unref } from "vue";
import { IconRadioButton } from "../icons/index";
const _hoisted_1 = { style: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  width: "150px",
  maxWidth: "100%"
} };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-checkbox-button",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(IconRadioButton), {
          size: "sm",
          type: 1,
          checked: true,
          style: { borderRight: "1px solid #fff" }
        }),
        createVNode(unref(IconRadioButton), {
          size: "sm",
          type: 2,
          checked: true
        }),
        createVNode(unref(IconRadioButton), {
          size: "sm",
          type: 3
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

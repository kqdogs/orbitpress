import { defineComponent, openBlock, createElementBlock, createElementVNode, createVNode, unref } from "vue";
import { SvgIcon } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center", justifyContent: "center" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-input-number",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[0] || (_cache[0] = createElementVNode("div", {
          class: "ele-icon-bg-fill-light",
          style: {
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        }, [
          createElementVNode("div", {
            class: "ele-icon-border-color-text-light",
            style: {
              width: "8px",
              borderTopStyle: "solid",
              borderTopWidth: "2px"
            }
          })
        ], -1)),
        _cache[1] || (_cache[1] = createElementVNode("div", {
          class: "ele-icon-color-base",
          style: { padding: "0 8px", fontSize: "16px", lineHeight: 1 }
        }, " 999 ", -1)),
        createVNode(unref(SvgIcon), {
          name: "PlusOutlined",
          color: "secondary",
          class: "ele-icon-bg-fill-light",
          style: {
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            fontSize: "12px"
          }
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

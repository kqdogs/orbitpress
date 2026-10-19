import { defineComponent, openBlock, createElementBlock, createElementVNode, createVNode, unref, Fragment, renderList } from "vue";
import { SvgIcon, IconImage, IconSkeleton } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center" } };
const _hoisted_2 = {
  class: "ele-icon-border-color-base",
  style: {
    flex: 1,
    height: "40px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "3px",
    margin: "0 3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};
const _hoisted_3 = { style: { display: "flex", justifyContent: "center", marginTop: "4px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-carousel",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createElementVNode("div", _hoisted_1, [
          createVNode(unref(SvgIcon), {
            name: "ArrowLeft",
            color: "placeholder",
            class: "ele-icon-border-color-base",
            style: {
              width: "10px",
              height: "10px",
              borderStyle: "solid",
              borderWidth: "1px",
              borderRadius: "50%",
              fontSize: "12px"
            },
            iconStyle: { transform: "scale(0.8)" }
          }),
          createElementVNode("div", _hoisted_2, [
            createVNode(unref(IconImage), { size: "sm" })
          ]),
          createVNode(unref(SvgIcon), {
            name: "ArrowRight",
            color: "placeholder",
            class: "ele-icon-border-color-base",
            style: {
              width: "10px",
              height: "10px",
              borderStyle: "solid",
              borderWidth: "1px",
              borderRadius: "50%",
              fontSize: "12px"
            },
            iconStyle: { transform: "scale(0.8)" }
          })
        ]),
        createElementVNode("div", _hoisted_3, [
          (openBlock(), createElementBlock(Fragment, null, renderList(3, (index) => {
            return createVNode(unref(IconSkeleton), {
              key: index,
              color: index === 1 ? "primary" : void 0,
              style: { width: "8px", height: "2px", margin: "0 3px" }
            }, null, 8, ["color"]);
          }), 64))
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

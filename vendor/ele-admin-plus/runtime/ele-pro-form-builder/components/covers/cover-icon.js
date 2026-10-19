import { defineComponent, openBlock, createElementBlock, createVNode, unref } from "vue";
import { SvgIcon } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center", justifyContent: "center" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-icon",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(SvgIcon), {
          name: "CheckCircleFilled",
          style: { fontSize: "20px" }
        }),
        createVNode(unref(SvgIcon), {
          name: "StarFilled",
          color: "primary5",
          style: { fontSize: "23px", margin: "-2px 0 0 8px" }
        }),
        createVNode(unref(SvgIcon), {
          name: "StepForwardFilled",
          color: "light",
          style: { fontSize: "23px", marginLeft: "8px" }
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

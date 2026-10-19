import { defineComponent, openBlock, createElementBlock, createVNode, unref } from "vue";
import { SvgIcon } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center", justifyContent: "center" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-rate",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(SvgIcon), {
          name: "StarFilled",
          style: { color: "#f7ba2a", fontSize: "20px" }
        }),
        createVNode(unref(SvgIcon), {
          name: "StarFilled",
          style: { color: "#f7ba2a", fontSize: "20px", marginLeft: "4px" }
        }),
        createVNode(unref(SvgIcon), {
          name: "StarFilled",
          style: { color: "#f7ba2a", fontSize: "20px", marginLeft: "4px" }
        }),
        createVNode(unref(SvgIcon), {
          name: "StarFilled",
          color: "lighter",
          style: { fontSize: "20px", marginLeft: "4px" }
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, openBlock, createBlock, unref, withCtx, createElementVNode, createVNode } from "vue";
import { IconInput, SvgIcon } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-color-picker",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(IconInput), { style: {
        height: "auto",
        padding: "6px",
        maxWidth: "52px",
        margin: "0 auto"
      } }, {
        default: withCtx(() => [
          _cache[0] || (_cache[0] = createElementVNode("div", { style: {
            width: "18px",
            height: "18px",
            borderRadius: "3px",
            background: "conic-gradient(from 90deg at 50% 50%, rgb(255, 0, 0) -19.41deg, rgb(255, 0, 0) 18.76deg, rgb(255, 138, 0) 59.32deg, rgb(255, 230, 0) 99.87deg, rgb(20, 255, 0) 141.65deg, rgb(0, 163, 255) 177.72deg, rgb(5, 0, 255) 220.23deg, rgb(173, 0, 255) 260.13deg, rgb(255, 0, 199) 300.69deg, rgb(255, 0, 0) 340.59deg, rgb(255, 0, 0) 378.76deg)"
          } }, null, -1)),
          createVNode(unref(SvgIcon), {
            name: "ArrowDown",
            size: "sm",
            style: { margin: "0 0 0 auto" }
          })
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};

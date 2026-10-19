import { defineComponent, openBlock, createElementBlock, Fragment, renderList, createElementVNode, createVNode, unref } from "vue";
import { IconSkeleton } from "../icons/index";
const _hoisted_1 = { style: {
  display: "grid",
  gap: "8px 6px",
  gridTemplateColumns: "repeat(3, 1fr)"
} };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-row",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(), createElementBlock(Fragment, null, renderList(6, (index) => {
          return createElementVNode("div", {
            key: index,
            class: "ele-icon-border-color-base",
            style: {
              height: "18px",
              borderStyle: "solid",
              borderWidth: "1px",
              display: "flex",
              alignItems: "center"
            }
          }, [
            createVNode(unref(IconSkeleton), {
              size: "xs",
              style: { width: "68%", margin: "0 auto" }
            })
          ]);
        }), 64))
      ]);
    };
  }
});
export {
  _sfc_main as default
};

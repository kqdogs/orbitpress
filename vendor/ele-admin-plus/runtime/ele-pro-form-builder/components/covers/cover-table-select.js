import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx } from "vue";
import { IconInput, IconSkeleton, SvgIcon, IconPanel, IconTable } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-table-select",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createVNode(unref(IconInput), { size: "sm" }, {
          default: withCtx(() => [
            createVNode(unref(IconSkeleton), {
              size: "sm",
              style: { width: "50%" }
            }),
            createVNode(unref(SvgIcon), {
              name: "ArrowUp",
              size: "sm",
              style: { margin: "0 0 0 auto" }
            })
          ]),
          _: 1
        }),
        createVNode(unref(IconPanel), {
          size: "sm",
          style: { paddingTop: "4px", paddingBottom: "4px" }
        }, {
          default: withCtx(() => [
            createVNode(unref(IconTable), { size: "sm" })
          ]),
          _: 1
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

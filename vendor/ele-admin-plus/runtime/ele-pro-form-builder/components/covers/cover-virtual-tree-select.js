import { defineComponent, openBlock, createElementBlock, createVNode, unref, withCtx, createElementVNode } from "vue";
import { IconInput, IconSkeleton, SvgIcon, IconPanel, IconArrow } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", alignItems: "center" } };
const _hoisted_2 = { style: {
  display: "flex",
  alignItems: "center",
  marginTop: "4px",
  paddingLeft: "8px"
} };
const _hoisted_3 = { style: { display: "flex", alignItems: "center", marginTop: "4px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-virtual-tree-select",
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
          style: { paddingRight: "10px", position: "relative" }
        }, {
          default: withCtx(() => [
            createElementVNode("div", _hoisted_1, [
              createVNode(unref(IconArrow), {
                size: "sm",
                direction: "down",
                color: "primary",
                style: { marginRight: "1px", transform: "translate(-2px, 1px)" }
              }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_2, [
              createVNode(unref(IconArrow), {
                size: "sm",
                style: { marginRight: "1px" }
              }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            createElementVNode("div", _hoisted_3, [
              createVNode(unref(IconArrow), {
                size: "sm",
                style: { marginRight: "1px" }
              }),
              createVNode(unref(IconSkeleton), {
                size: "sm",
                style: { flex: 1 }
              })
            ]),
            _cache[0] || (_cache[0] = createElementVNode("div", {
              class: "ele-icon-bg-primary7",
              style: {
                width: "4px",
                height: "18px",
                borderRadius: "2px",
                position: "absolute",
                top: "4px",
                right: "3px"
              }
            }, null, -1))
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

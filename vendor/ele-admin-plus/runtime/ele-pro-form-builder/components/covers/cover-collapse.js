import { defineComponent, openBlock, createElementBlock, Fragment, renderList, createElementVNode, normalizeStyle, createVNode, unref, createBlock, createCommentVNode } from "vue";
import { IconSkeleton, SvgIcon } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", flexDirection: "column" } };
const _hoisted_2 = {
  key: 0,
  style: { padding: "6px" }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-collapse",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(), createElementBlock(Fragment, null, renderList(2, (index) => {
          return createElementVNode("div", {
            key: index,
            class: "ele-icon-border-color-base",
            style: normalizeStyle({
              marginTop: index === 1 ? void 0 : "6px",
              borderRadius: "3px",
              borderStyle: "solid",
              borderWidth: "1px"
            })
          }, [
            createElementVNode("div", {
              class: "ele-icon-border-color-base",
              style: normalizeStyle({
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingLeft: "6px",
                paddingRight: "2px",
                borderBottomStyle: index === 1 ? "solid" : void 0,
                borderBottomWidth: index === 1 ? "1px" : void 0
              })
            }, [
              createVNode(unref(IconSkeleton), {
                size: "xs",
                style: { width: "50%", margin: "0 auto 0 0" }
              }),
              index === 1 ? (openBlock(), createBlock(unref(SvgIcon), {
                key: 0,
                name: "ArrowDown",
                size: "sm",
                style: { transform: "scale(0.8)" }
              })) : (openBlock(), createBlock(unref(SvgIcon), {
                key: 1,
                name: "ArrowRight",
                size: "sm",
                color: "placeholder",
                style: { transform: "scale(0.8)" }
              }))
            ], 4),
            index === 1 ? (openBlock(), createElementBlock("div", _hoisted_2, [
              createVNode(unref(IconSkeleton), { size: "xs" }),
              createVNode(unref(IconSkeleton), {
                size: "xs",
                style: { marginTop: "4px", width: "50%" }
              })
            ])) : createCommentVNode("", true)
          ], 4);
        }), 64))
      ]);
    };
  }
});
export {
  _sfc_main as default
};

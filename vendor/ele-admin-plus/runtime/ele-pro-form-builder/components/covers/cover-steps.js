import { defineComponent, openBlock, createElementBlock, createElementVNode, createVNode, unref, withCtx, createTextVNode } from "vue";
import { IconRadio, SvgIcon, IconSkeleton } from "../icons/index";
const _hoisted_1 = { style: { display: "flex", position: "relative" } };
const _hoisted_2 = { style: { flex: 1, paddingTop: "3px" } };
const _hoisted_3 = { style: { display: "flex", marginTop: "8px", position: "relative" } };
const _hoisted_4 = { style: { flex: 1, paddingTop: "3px" } };
const _hoisted_5 = { style: { display: "flex", marginTop: "8px" } };
const _hoisted_6 = { style: { flex: 1, paddingTop: "3px" } };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-steps",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createElementVNode("div", _hoisted_1, [
          createVNode(unref(IconRadio), {
            size: "xl",
            class: "ele-icon-bg-primary9",
            style: {
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }
          }, {
            default: withCtx(() => [
              createVNode(unref(SvgIcon), {
                name: "CheckOutlined",
                size: "sm"
              })
            ]),
            _: 1
          }),
          createElementVNode("div", _hoisted_2, [
            createVNode(unref(IconSkeleton), { size: "sm" }),
            createVNode(unref(IconSkeleton), {
              size: "xs",
              style: { marginTop: "4px", width: "60%" }
            })
          ]),
          _cache[0] || (_cache[0] = createElementVNode("div", {
            class: "ele-icon-border-color-primary",
            style: {
              borderLeftStyle: "solid",
              borderLeftWidth: "1px",
              height: "6px",
              position: "absolute",
              top: "19px",
              left: "9px"
            }
          }, null, -1))
        ]),
        createElementVNode("div", _hoisted_3, [
          createVNode(unref(IconRadio), {
            size: "xl",
            class: "ele-icon-bg-primary",
            style: { color: "#fff", border: "none" }
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" 2 ", -1)
            ])]),
            _: 1
          }),
          createElementVNode("div", _hoisted_4, [
            createVNode(unref(IconSkeleton), { size: "sm" }),
            createVNode(unref(IconSkeleton), {
              size: "xs",
              style: { marginTop: "4px", width: "60%" }
            })
          ]),
          _cache[2] || (_cache[2] = createElementVNode("div", {
            class: "ele-icon-border-color-base",
            style: {
              borderLeftStyle: "solid",
              borderLeftWidth: "1px",
              height: "6px",
              position: "absolute",
              top: "19px",
              left: "9px"
            }
          }, null, -1))
        ]),
        createElementVNode("div", _hoisted_5, [
          createVNode(unref(IconRadio), {
            size: "xl",
            class: "ele-icon-bg-fill-lighter",
            style: { border: "none" }
          }, {
            default: withCtx(() => [..._cache[3] || (_cache[3] = [
              createTextVNode(" 3 ", -1)
            ])]),
            _: 1
          }),
          createElementVNode("div", _hoisted_6, [
            createVNode(unref(IconSkeleton), { size: "sm" }),
            createVNode(unref(IconSkeleton), {
              size: "xs",
              style: { marginTop: "4px", width: "60%" }
            })
          ])
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

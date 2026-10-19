import { defineComponent, openBlock, createElementBlock, normalizeStyle, createVNode, unref, withCtx, createElementVNode } from "vue";
import { IconTableRow } from "./index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-table",
  props: {
    size: {},
    multiple: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-icon-border-color-base",
        style: normalizeStyle({
          borderStyle: "solid",
          borderWidth: "1px",
          borderRadius: __props.size === "sm" ? "2px" : "4px"
        })
      }, [
        createVNode(unref(IconTableRow), {
          size: __props.size,
          multiple: __props.multiple,
          class: "ele-icon-bg-fill",
          style: normalizeStyle({ borderRadius: __props.size === "sm" ? "2px 2px 0 0" : "4px 4px 0 0" })
        }, {
          default: withCtx(() => [
            createElementVNode("div", {
              style: normalizeStyle({ flex: 1, marginLeft: __props.size === "sm" ? "4px" : "6px" })
            }, null, 4),
            createElementVNode("div", {
              class: "ele-icon-border-color-base",
              style: normalizeStyle({
                flex: 1,
                height: __props.size === "sm" ? "4px" : "8px",
                borderLeftStyle: "solid",
                borderLeftWidth: "1px",
                borderRightStyle: "solid",
                borderRightWidth: "1px"
              })
            }, null, 4),
            _cache[0] || (_cache[0] = createElementVNode("div", { style: { flex: 1 } }, null, -1))
          ]),
          _: 1
        }, 8, ["size", "multiple", "style"]),
        createVNode(unref(IconTableRow), {
          size: __props.size,
          multiple: __props.multiple,
          checkboxChecked: true
        }, null, 8, ["size", "multiple"]),
        createVNode(unref(IconTableRow), {
          size: __props.size,
          multiple: __props.multiple
        }, null, 8, ["size", "multiple"]),
        createVNode(unref(IconTableRow), {
          size: __props.size,
          multiple: __props.multiple,
          style: { border: "none" }
        }, null, 8, ["size", "multiple"])
      ], 4);
    };
  }
});
export {
  _sfc_main as default
};

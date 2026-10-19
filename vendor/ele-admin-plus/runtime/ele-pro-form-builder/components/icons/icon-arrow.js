import { defineComponent, openBlock, createElementBlock, normalizeStyle, normalizeClass } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "icon-arrow",
  props: {
    size: {},
    direction: {},
    color: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          {
            "ele-icon-border-color-text-light": __props.color !== "primary"
          },
          { "ele-icon-border-color-primary": __props.color === "primary" }
        ]),
        style: normalizeStyle({
          flexShrink: 0,
          borderStyle: "solid",
          borderWidth: __props.size === "sm" ? "3px" : "4px",
          ...{
            right: {
              borderTopColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "transparent"
            },
            left: {
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderBottomColor: "transparent"
            },
            down: {
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "transparent"
            },
            up: {
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent"
            }
          }[__props.direction || "right"]
        })
      }, null, 6);
    };
  }
});
export {
  _sfc_main as default
};

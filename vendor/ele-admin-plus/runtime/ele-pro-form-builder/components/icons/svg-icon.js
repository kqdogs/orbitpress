import { defineComponent, openBlock, createElementBlock, normalizeStyle, normalizeClass, renderSlot, createBlock, resolveDynamicComponent } from "vue";
import { CloseOutlined, UserOutlined, ExclamationCircleFilled, StepForwardFilled, CheckCircleFilled, EnvironmentOutlined, ClockCircleOutlined, StarFilled, PlusOutlined, CalendarOutlined, CheckOutlined, ArrowLeft, ArrowRight, ArrowDown, ArrowUp } from "../../../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    components: {
      ArrowUp,
      ArrowDown,
      ArrowRight,
      ArrowLeft,
      CheckOutlined,
      CalendarOutlined,
      PlusOutlined,
      StarFilled,
      ClockCircleOutlined,
      EnvironmentOutlined,
      CheckCircleFilled,
      StepForwardFilled,
      ExclamationCircleFilled,
      UserOutlined,
      CloseOutlined
    }
  },
  __name: "svg-icon",
  props: {
    name: {},
    iconStyle: {},
    size: {},
    color: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass([
          {
            "ele-icon-color-primary": __props.color !== "secondary" && __props.color !== "lighter" && __props.color !== "base" && __props.color !== "placeholder" && __props.color !== "light" && __props.color !== "primary5" && __props.color !== "success"
          },
          { "ele-icon-color-secondary": __props.color === "secondary" },
          { "ele-icon-color-lighter": __props.color === "lighter" },
          { "ele-icon-color-base": __props.color === "base" },
          { "ele-icon-color-placeholder": __props.color === "placeholder" },
          { "ele-icon-color-light": __props.color === "light" },
          { "ele-icon-color-primary5": __props.color === "primary5" },
          { "ele-icon-color-success": __props.color === "success" }
        ]),
        style: normalizeStyle({
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: __props.size === "sm" ? "12px" : "14px"
        })
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          (openBlock(), createBlock(resolveDynamicComponent(__props.name), {
            width: "1em",
            height: "1em",
            style: normalizeStyle(__props.iconStyle)
          }, null, 8, ["style"]))
        ])
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};

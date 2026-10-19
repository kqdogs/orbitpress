import { defineComponent, computed, openBlock, createElementBlock, normalizeStyle, normalizeClass, createElementVNode, renderSlot } from "vue";
import { dashboardProps } from "./props";
const _hoisted_1 = { class: "ele-dashboard-inner" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleDashboard" },
  __name: "index",
  props: dashboardProps,
  setup(__props) {
    const props = __props;
    const rootStyle = computed(() => {
      const style = {};
      if (props.size != null) {
        if (typeof props.size === "number") {
          style.width = `${props.size}px`;
          style.height = `${props.size}px`;
        } else {
          style.width = props.size;
          style.height = props.size;
        }
      }
      if (props.space != null) {
        style["--ele-dashboard-space"] = typeof props.space === "number" ? `${props.space}px` : props.space;
      }
      if (props.color) {
        style["--ele-dashboard-color"] = props.color;
      }
      return style;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-dashboard", [
          { "is-success": _ctx.type === "success" },
          { "is-warning": _ctx.type === "warning" },
          { "is-danger": _ctx.type === "danger" }
        ]]),
        style: normalizeStyle(rootStyle.value)
      }, [
        createElementVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "default")
        ]),
        _cache[0] || (_cache[0] = createElementVNode("div", { class: "ele-dashboard-outer" }, [
          createElementVNode("div", { class: "ele-dashboard-bg" }),
          createElementVNode("div", { class: "ele-dashboard-bg" }),
          createElementVNode("div", { class: "ele-dashboard-bg" })
        ], -1))
      ], 6);
    };
  }
});
export {
  _sfc_main as default
};

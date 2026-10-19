import { defineComponent, reactive, provide, watch, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { TAB_WRAP_KEY } from "../ele-tabs/props";
import { tabWrapProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTabWrap" },
  __name: "index",
  props: tabWrapProps,
  setup(__props) {
    const props = __props;
    const tabMethods = {};
    const data = reactive({
      size: props.size,
      type: props.type,
      setTabMethods: (methods) => {
        tabMethods.triggerTabItemClick = methods.triggerTabItemClick;
        tabMethods.triggerItemContextMenu = methods.triggerItemContextMenu;
      },
      triggerTabItemClick: (item, tabName, e) => {
        if (tabMethods.triggerTabItemClick) {
          tabMethods.triggerTabItemClick(item, tabName, e);
        }
      },
      triggerItemContextMenu: (item, tabName, e) => {
        if (tabMethods.triggerItemContextMenu) {
          tabMethods.triggerItemContextMenu(item, tabName, e);
        }
      }
    });
    provide(TAB_WRAP_KEY, data);
    watch(
      () => props.size,
      () => {
        data.size = props.size;
      }
    );
    watch(
      () => props.type,
      () => {
        data.type = props.type;
      }
    );
    onBeforeUnmount(() => {
      tabMethods.triggerTabItemClick = void 0;
      tabMethods.triggerItemContextMenu = void 0;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-tab-wrap ele-tabs-wrap", [
          { "is-small": _ctx.size === "small" },
          { "is-large": _ctx.size === "large" },
          { "is-simple": _ctx.type === "simple" },
          { "is-indicator": _ctx.type === "indicator" },
          { "is-button": _ctx.type === "button" },
          { "is-tag": _ctx.type === "tag" }
        ]])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

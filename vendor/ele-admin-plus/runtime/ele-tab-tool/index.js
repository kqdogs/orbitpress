import { defineComponent, inject, openBlock, createElementBlock, normalizeClass, Fragment, createElementVNode, renderSlot } from "vue";
import { TAB_WRAP_KEY } from "../ele-tabs/props";
import { tabToolProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTabTool" },
  __name: "index",
  props: tabToolProps,
  setup(__props) {
    const props = __props;
    const wrapProps = inject(TAB_WRAP_KEY, null);
    const handleItemClick = (e) => {
      if (wrapProps && wrapProps.triggerTabItemClick) {
        wrapProps.triggerTabItemClick(void 0, props.tabName, e);
      }
    };
    const handleItemContextmenu = (e) => {
      if (wrapProps && wrapProps.triggerItemContextMenu) {
        wrapProps.triggerItemContextMenu(void 0, props.tabName, e);
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-tab-tool", [{ "is-tab": _ctx.tab }, { "is-active": _ctx.active }]])
      }, [
        _ctx.tab ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createElementVNode("div", {
            class: "ele-tab-title",
            onClick: handleItemClick,
            onContextmenu: handleItemContextmenu
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 32),
          _cache[0] || (_cache[0] = createElementVNode("div", { class: "ele-tab-corner-left" }, null, -1)),
          _cache[1] || (_cache[1] = createElementVNode("div", { class: "ele-tab-corner-right" }, null, -1))
        ], 64)) : renderSlot(_ctx.$slots, "default", { key: 1 })
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

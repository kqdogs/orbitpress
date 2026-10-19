import { defineComponent, openBlock, createElementBlock, Fragment, renderSlot, unref, createBlock, mergeProps, createCommentVNode } from "vue";
import EleDropdown from "../ele-dropdown/index";
import { useDropdownProvider } from "./util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleDropdownProvider" },
  __name: "index",
  setup(__props, { expose: __expose }) {
    const {
      dropdownRef,
      dropdownVirtualRef,
      dropdownItems,
      dropdownProps,
      openDropdown
    } = useDropdownProvider();
    __expose({
      dropdownRef,
      openDropdown
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        renderSlot(_ctx.$slots, "default"),
        unref(dropdownVirtualRef) ? (openBlock(), createBlock(EleDropdown, mergeProps({
          key: 0,
          persistent: false
        }, unref(dropdownProps), {
          ref_key: "dropdownRef",
          ref: dropdownRef,
          componentType: "pro",
          virtualTriggering: true,
          virtualRef: unref(dropdownVirtualRef),
          disabled: !unref(dropdownItems).length,
          items: unref(dropdownItems)
        }), null, 16, ["virtualRef", "disabled", "items"])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

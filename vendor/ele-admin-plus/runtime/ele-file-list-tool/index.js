import { defineComponent, openBlock, createElementBlock, withModifiers, renderSlot } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleFileListTool" },
  __name: "index",
  emits: {
    click: (_e) => true
  },
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleClick = (e) => {
      emit("click", e);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-file-list-item-tool",
        onClick: withModifiers(handleClick, ["stop"])
      }, [
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
export {
  _sfc_main as default
};

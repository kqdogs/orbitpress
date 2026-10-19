import { defineComponent, openBlock, createElementBlock, Fragment, renderSlot, unref, createBlock, mergeProps, createCommentVNode } from "vue";
import ElePopconfirm from "../ele-popconfirm/index";
import { usePopconfirmProvider } from "./util";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElePopconfirmProvider" },
  __name: "index",
  setup(__props, { expose: __expose }) {
    const {
      popconfirmRef,
      popconfirmVirtualRef,
      popconfirmProps,
      openPopconfirm
    } = usePopconfirmProvider();
    __expose({
      popconfirmRef,
      openPopconfirm
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        renderSlot(_ctx.$slots, "default"),
        unref(popconfirmVirtualRef) ? (openBlock(), createBlock(ElePopconfirm, mergeProps({
          key: 0,
          width: 200,
          persistent: false,
          placement: "top-end"
        }, unref(popconfirmProps), {
          ref_key: "popconfirmRef",
          ref: popconfirmRef,
          virtualTriggering: true,
          virtualRef: unref(popconfirmVirtualRef)
        }), null, 16, ["virtualRef"])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

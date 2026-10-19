import { defineComponent, openBlock, createBlock, Teleport, createVNode } from "vue";
import LoadingSpinner from "../../ele-loading/components/loading-spinner";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ModalLoading", inheritAttrs: false },
  __name: "modal-loading",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Teleport, { to: "body" }, [
        createVNode(LoadingSpinner, {
          plain: true,
          loading: true,
          class: "ele-modal-render-loading"
        })
      ]);
    };
  }
});
export {
  _sfc_main as default
};

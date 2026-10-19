import { defineComponent, openBlock, createBlock, unref } from "vue";
import { IconTable } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-pro-table",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(IconTable));
    };
  }
});
export {
  _sfc_main as default
};

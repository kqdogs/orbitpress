import { defineComponent, openBlock, createBlock, unref } from "vue";
import { IconImage } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-image",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(IconImage), { style: { margin: "0 auto" } });
    };
  }
});
export {
  _sfc_main as default
};

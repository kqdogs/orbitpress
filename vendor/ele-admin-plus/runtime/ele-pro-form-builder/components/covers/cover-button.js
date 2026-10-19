import { defineComponent, openBlock, createBlock, unref } from "vue";
import { IconButton } from "../icons/index";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cover-button",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(IconButton), {
        size: "sm",
        type: "primary",
        style: {
          margin: "0 auto",
          width: "58px",
          padding: "0 12px"
        }
      });
    };
  }
});
export {
  _sfc_main as default
};

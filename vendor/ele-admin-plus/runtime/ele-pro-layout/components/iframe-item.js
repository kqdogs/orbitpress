import { defineComponent, unref, ref, watch, openBlock, createElementBlock } from "vue";
import { useRouter } from "vue-router";
import { getIframeUrl, getIframeSrc } from "../util";
const _hoisted_1 = ["src"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "iframe-item",
  props: {
    /** 菜单内嵌地址 */
    menuComponent: String
  },
  setup(__props) {
    const props = __props;
    const { currentRoute } = useRouter();
    const current = unref(currentRoute);
    const iframeUrl = getIframeUrl(
      current.params,
      props.menuComponent || current.meta?.iframe
    );
    const iframeSrc = ref(getIframeSrc(current.fullPath, iframeUrl));
    watch(currentRoute, (to) => {
      const route = unref(to);
      const url = getIframeUrl(
        route.params,
        props.menuComponent || route.meta?.iframe
      );
      if (!url || url !== iframeUrl) {
        return;
      }
      const src = getIframeSrc(route.fullPath, iframeUrl);
      if (iframeSrc.value !== src) {
        iframeSrc.value = src;
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("iframe", {
        src: iframeSrc.value,
        class: "ele-admin-iframe"
      }, null, 8, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, watch, nextTick, onMounted, onBeforeUnmount, openBlock, createBlock, resolveDynamicComponent, normalizeStyle } from "vue";
import JsBarCode from "jsbarcode";
import { barCodeProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleBarCode" },
  __name: "index",
  props: barCodeProps,
  setup(__props, { expose: __expose }) {
    const props = __props;
    const rootRef = ref(null);
    let instance = null;
    const render = () => {
      if (!props.value || !rootRef.value) {
        return;
      }
      try {
        instance = new JsBarCode(rootRef.value, props.value, props.options);
      } catch (e) {
        console.error(e);
      }
    };
    const getInstance = () => {
      return instance;
    };
    watch(
      () => props.value,
      () => {
        render();
      }
    );
    watch(
      () => props.options,
      () => {
        render();
      },
      { deep: true }
    );
    watch(
      () => props.tag,
      () => {
        nextTick(() => {
          render();
        });
      }
    );
    onMounted(() => {
      render();
    });
    onBeforeUnmount(() => {
      instance = null;
    });
    __expose({
      instance,
      getInstance
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(_ctx.tag), {
        ref_key: "rootRef",
        ref: rootRef,
        style: normalizeStyle(_ctx.value ? void 0 : { display: "none" })
      }, null, 8, ["style"]);
    };
  }
});
export {
  _sfc_main as default
};

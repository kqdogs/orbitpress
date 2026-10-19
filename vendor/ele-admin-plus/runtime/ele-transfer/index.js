import { defineComponent, ref, openBlock, createBlock, unref, mergeProps, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElTransfer } from "element-plus";
import { omit } from "../utils/common";
import { useComponentEvents, useProOptions } from "../utils/hook";
import { transferEmits, transferProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleTransfer" },
  __name: "index",
  props: transferProps,
  emits: transferEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { emitMethods } = useComponentEvents(transferEmits, emit);
    const { optionData, reloadOptions } = useProOptions(
      props,
      "data"
    );
    const transferRef = ref(null);
    __expose({
      reloadOptions,
      transferRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElTransfer), mergeProps(unref(omit)(_ctx.$props, ["data"]), {
        ref_key: "transferRef",
        ref: transferRef,
        data: unref(optionData),
        onChange: unref(emitMethods)["change"],
        "onUpdate:modelValue": unref(emitMethods)["update:modelValue"],
        onLeftCheckChange: unref(emitMethods)["left-check-change"],
        onRightCheckChange: unref(emitMethods)["right-check-change"]
      }), createSlots({ _: 2 }, [
        renderList(Object.keys(_ctx.$slots), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["data", "onChange", "onUpdate:modelValue", "onLeftCheckChange", "onRightCheckChange"]);
    };
  }
});
export {
  _sfc_main as default
};

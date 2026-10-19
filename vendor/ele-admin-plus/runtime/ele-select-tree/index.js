import { defineComponent, ref, openBlock, createBlock, unref, mergeProps, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElTreeSelect } from "element-plus";
import { omit } from "../utils/common";
import { useComponentEvents, useProOptions } from "../utils/hook";
import { selectTreeEmits, selectTreeProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleSelectTree" },
  __name: "index",
  props: selectTreeProps,
  emits: selectTreeEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { emitMethods } = useComponentEvents(selectTreeEmits, emit);
    const { optionData, reloadOptions } = useProOptions(
      props,
      "data"
    );
    const treeSelectRef = ref(null);
    __expose({
      reloadOptions,
      treeSelectRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElTreeSelect), mergeProps(unref(omit)(_ctx.$props, ["data"]), {
        ref_key: "treeSelectRef",
        ref: treeSelectRef,
        data: unref(optionData),
        "onUpdate:modelValue": unref(emitMethods)["update:modelValue"]
      }), createSlots({ _: 2 }, [
        renderList(Object.keys(_ctx.$slots), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["data", "onUpdate:modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

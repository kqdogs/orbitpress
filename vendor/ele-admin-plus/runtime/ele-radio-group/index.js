import { defineComponent, ref, openBlock, createBlock, unref, mergeProps, createSlots, withCtx, createElementBlock, Fragment, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElRadioGroup, ElRadioButton, ElRadio } from "element-plus";
import { omit } from "../utils/common";
import { useComponentEvents, useProOptions } from "../utils/hook";
import { radioGroupEmits, radioGroupProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleRadioGroup" },
  __name: "index",
  props: radioGroupProps,
  emits: radioGroupEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { emitMethods } = useComponentEvents(radioGroupEmits, emit);
    const { optionData, reloadOptions } = useProOptions(props);
    const radioGroupRef = ref(null);
    __expose({
      reloadOptions,
      radioGroupRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElRadioGroup), mergeProps(unref(omit)(_ctx.$props, ["type", "options"]), {
        ref_key: "radioGroupRef",
        ref: radioGroupRef,
        "onUpdate:modelValue": unref(emitMethods)["update:modelValue"],
        onChange: unref(emitMethods)["change"]
      }), createSlots({
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(optionData), (option) => {
            return openBlock(), createElementBlock(Fragment, {
              key: option.value
            }, [
              _ctx.type === "button" ? (openBlock(), createBlock(unref(ElRadioButton), {
                key: 0,
                label: option.label,
                value: option.value,
                disabled: option.disabled,
                name: option.name
              }, null, 8, ["label", "value", "disabled", "name"])) : (openBlock(), createBlock(unref(ElRadio), {
                key: 1,
                label: option.label,
                value: option.value,
                disabled: option.disabled,
                border: option.border,
                name: option.name
              }, null, 8, ["label", "value", "disabled", "border", "name"]))
            ], 64);
          }), 128))
        ]),
        _: 2
      }, [
        renderList(Object.keys(_ctx.$slots).filter((k) => "default" !== k), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["onUpdate:modelValue", "onChange"]);
    };
  }
});
export {
  _sfc_main as default
};

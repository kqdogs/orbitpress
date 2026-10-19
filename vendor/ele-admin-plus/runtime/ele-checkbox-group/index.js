import { defineComponent, ref, openBlock, createBlock, unref, mergeProps, createSlots, withCtx, createElementBlock, Fragment, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElCheckboxGroup, ElCheckboxButton, ElCheckbox } from "element-plus";
import { omit } from "../utils/common";
import { useComponentEvents, useProOptions } from "../utils/hook";
import { checkboxGroupEmits, checkboxGroupProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCheckboxGroup" },
  __name: "index",
  props: checkboxGroupProps,
  emits: checkboxGroupEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { emitMethods } = useComponentEvents(checkboxGroupEmits, emit);
    const { optionData, reloadOptions } = useProOptions(props);
    const checkboxGroupRef = ref(null);
    __expose({
      reloadOptions,
      checkboxGroupRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElCheckboxGroup), mergeProps(unref(omit)(_ctx.$props, ["type", "options"]), {
        ref_key: "checkboxGroupRef",
        ref: checkboxGroupRef,
        "onUpdate:modelValue": unref(emitMethods)["update:modelValue"],
        onChange: unref(emitMethods)["change"]
      }), createSlots({
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(optionData), (option) => {
            return openBlock(), createElementBlock(Fragment, {
              key: option.value
            }, [
              _ctx.type === "button" ? (openBlock(), createBlock(unref(ElCheckboxButton), {
                key: 0,
                label: option.label,
                value: option.value,
                disabled: option.disabled,
                name: option.name
              }, null, 8, ["label", "value", "disabled", "name"])) : (openBlock(), createBlock(unref(ElCheckbox), {
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

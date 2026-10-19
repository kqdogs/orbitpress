import { defineComponent, ref, openBlock, createBlock, unref, mergeProps, createSlots, withCtx, createElementBlock, Fragment, renderList, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElSelect, ElOptionGroup, ElOption } from "element-plus";
import { omit } from "../utils/common";
import { useComponentEvents, useProOptions } from "../utils/hook";
import { selectEmits, selectProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleSelect" },
  __name: "index",
  props: selectProps,
  emits: selectEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { emitMethods } = useComponentEvents(selectEmits, emit);
    const { optionData, reloadOptions } = useProOptions(props);
    const selectRef = ref(null);
    __expose({
      reloadOptions,
      selectRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElSelect), mergeProps(unref(omit)(_ctx.$props, ["options"]), {
        ref_key: "selectRef",
        ref: selectRef,
        "onUpdate:modelValue": unref(emitMethods)["update:modelValue"],
        onChange: unref(emitMethods)["change"],
        onRemoveTag: unref(emitMethods)["remove-tag"],
        onClear: unref(emitMethods)["clear"],
        onVisibleChange: unref(emitMethods)["visible-change"],
        onFocus: unref(emitMethods)["focus"],
        onBlur: unref(emitMethods)["blur"]
      }), createSlots({
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(optionData), (option) => {
            return openBlock(), createElementBlock(Fragment, {
              key: option.value
            }, [
              option.children ? (openBlock(), createBlock(unref(ElOptionGroup), {
                key: 0,
                label: option.label
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(option.children, (childOption) => {
                    return openBlock(), createBlock(unref(ElOption), {
                      key: childOption.value,
                      label: childOption.label,
                      value: childOption.value,
                      disabled: childOption.disabled
                    }, null, 8, ["label", "value", "disabled"]);
                  }), 128))
                ]),
                _: 2
              }, 1032, ["label"])) : (openBlock(), createBlock(unref(ElOption), {
                key: 1,
                label: option.label,
                value: option.value,
                disabled: option.disabled
              }, null, 8, ["label", "value", "disabled"]))
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
      ]), 1040, ["onUpdate:modelValue", "onChange", "onRemoveTag", "onClear", "onVisibleChange", "onFocus", "onBlur"]);
    };
  }
});
export {
  _sfc_main as default
};

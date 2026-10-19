import { defineComponent, ref, openBlock, createBlock, unref, mergeProps, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElMention } from "element-plus";
import { omit } from "../utils/common";
import { useComponentEvents, useProOptions } from "../utils/hook";
import { mentionEmits } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleMention" },
  __name: "index",
  props: {
    options: { type: [Array, Function] },
    prefix: {},
    split: {},
    filterOption: { type: Boolean },
    placement: {},
    showArrow: { type: Boolean },
    offset: {},
    whole: { type: Boolean },
    checkIsWhole: { type: Function },
    modelValue: {},
    loading: { type: Boolean },
    popperClass: {},
    popperStyle: { type: [Boolean, null, String, Object, Array] },
    popperOptions: {},
    props: {},
    id: {},
    size: {},
    disabled: { type: Boolean },
    modelModifiers: {},
    maxlength: {},
    minlength: {},
    type: {},
    resize: {},
    autosize: { type: [Object, Boolean] },
    autocomplete: {},
    formatter: { type: Function },
    parser: { type: Function },
    placeholder: {},
    form: {},
    readonly: { type: Boolean },
    clearable: { type: Boolean },
    clearIcon: {},
    showPassword: { type: Boolean },
    showWordLimit: { type: Boolean },
    wordLimitPosition: {},
    suffixIcon: {},
    prefixIcon: {},
    containerRole: {},
    tabindex: {},
    validateEvent: { type: Boolean },
    inputStyle: { type: [Boolean, null, String, Object, Array] },
    autofocus: { type: Boolean },
    rows: {},
    ariaLabel: {},
    inputmode: {},
    name: {},
    countGraphemes: { type: Function }
  },
  emits: mentionEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { emitMethods } = useComponentEvents(mentionEmits, emit);
    const { optionData, reloadOptions } = useProOptions(props);
    const mentionRef = ref(null);
    __expose({
      reloadOptions,
      mentionRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElMention), mergeProps(unref(omit)(_ctx.$props, ["options"]), {
        ref_key: "mentionRef",
        ref: mentionRef,
        options: unref(optionData),
        "onUpdate:modelValue": unref(emitMethods)["update:modelValue"],
        onSearch: unref(emitMethods)["search"],
        onSelect: unref(emitMethods)["select"],
        onFocus: unref(emitMethods)["focus"],
        onBlur: unref(emitMethods)["blur"]
      }), createSlots({ _: 2 }, [
        renderList(Object.keys(_ctx.$slots), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["options", "onUpdate:modelValue", "onSearch", "onSelect", "onFocus", "onBlur"]);
    };
  }
});
export {
  _sfc_main as default
};

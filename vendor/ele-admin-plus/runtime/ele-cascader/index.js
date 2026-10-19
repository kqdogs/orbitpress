import { defineComponent, ref, reactive, watch, openBlock, createBlock, unref, mergeProps, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import { ElCascader } from "element-plus";
import { omit } from "../utils/common";
import { useComponentEvents, useProOptions } from "../utils/hook";
import { cascaderEmits } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCascader" },
  __name: "index",
  props: {
    options: { type: [Array, Function] },
    multiple: { type: Boolean },
    size: {},
    placeholder: {},
    disabled: { type: Boolean },
    clearable: { type: Boolean },
    clearIcon: {},
    filterable: { type: Boolean },
    filterMethod: { type: Function },
    separator: {},
    showAllLevels: { type: Boolean },
    collapseTags: { type: Boolean },
    maxCollapseTags: {},
    collapseTagsTooltip: { type: Boolean },
    maxCollapseTagsTooltipHeight: {},
    debounce: {},
    beforeFilter: { type: Function },
    placement: {},
    fallbackPlacements: {},
    popperClass: {},
    popperStyle: { type: [Boolean, null, String, Object, Array] },
    teleported: { type: Boolean },
    effect: {},
    tagType: {},
    tagEffect: {},
    validateEvent: { type: Boolean },
    persistent: { type: Boolean },
    showCheckedStrategy: {},
    checkOnClickNode: { type: Boolean },
    showPrefix: { type: Boolean },
    fitInputWidth: { type: [Boolean, Number] },
    modelValue: {},
    props: {},
    virtualScroll: { type: Boolean },
    itemSize: {},
    height: {},
    emptyValues: {},
    valueOnClear: { type: [String, Number, Boolean, Function, null] }
  },
  emits: cascaderEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { emitMethods } = useComponentEvents(cascaderEmits, emit);
    const { optionData, reloadOptions } = useProOptions(props);
    const cascaderRef = ref(null);
    const cascaderPropsOption = reactive({
      ...props.props || {},
      multiple: !!(props.multiple || props.props?.multiple)
    });
    watch(
      [() => props.multiple, () => props.props],
      () => {
        const cProps = props.props || {};
        [
          "expandTrigger",
          "checkStrictly",
          "emitPath",
          "lazy",
          "lazyLoad",
          "value",
          "label",
          "children",
          "disabled",
          "leaf",
          "hoverThreshold"
        ].forEach((k) => {
          if (cascaderPropsOption[k] == null && cProps[k] == null) {
            return;
          }
          if (cascaderPropsOption[k] !== cProps[k]) {
            cascaderPropsOption[k] = cProps[k];
          }
        });
        if (props.multiple) {
          if (!cascaderPropsOption.multiple) {
            cascaderPropsOption.multiple = true;
          }
        } else if (!!cascaderPropsOption.multiple !== !!cProps.multiple) {
          cascaderPropsOption.multiple = cProps.multiple;
        }
      },
      {
        immediate: true,
        deep: true
      }
    );
    __expose({
      reloadOptions,
      cascaderRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElCascader), mergeProps(unref(omit)(_ctx.$props, ["props", "options", "multiple"]), {
        ref_key: "cascaderRef",
        ref: cascaderRef,
        props: cascaderPropsOption,
        options: unref(optionData),
        "onUpdate:modelValue": unref(emitMethods)["update:modelValue"],
        onChange: unref(emitMethods)["change"],
        onFocus: unref(emitMethods)["focus"],
        onBlur: unref(emitMethods)["blur"],
        onClear: unref(emitMethods)["clear"],
        onVisibleChange: unref(emitMethods)["visibleChange"],
        onExpandChange: unref(emitMethods)["expandChange"],
        onRemoveTag: unref(emitMethods)["removeTag"]
      }), createSlots({ _: 2 }, [
        renderList(Object.keys(_ctx.$slots), (name) => {
          return {
            name,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["props", "options", "onUpdate:modelValue", "onChange", "onFocus", "onBlur", "onClear", "onVisibleChange", "onExpandChange", "onRemoveTag"]);
    };
  }
});
export {
  _sfc_main as default
};

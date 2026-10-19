import { defineComponent, openBlock, createElementBlock, createBlock, unref, normalizeProps, mergeProps, withCtx, renderSlot, Fragment, renderList, createVNode, normalizeClass, normalizeStyle, createTextVNode, toDisplayString } from "vue";
import { ElRow, ElCol } from "element-plus";
import { useProOptions } from "../utils/hook";
import { useFormValidate, isEmptyValue, valueIsChanged } from "../ele-basic-select/util";
import CardItem from "./components/card-item";
import { checkCardEmits, checkCardProps } from "./props";
const _hoisted_1 = { class: "ele-check-card-group" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCheckCard" },
  __name: "index",
  props: checkCardProps,
  emits: checkCardEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { validateChange } = useFormValidate();
    const { optionData, reloadOptions } = useProOptions(
      props,
      "items"
    );
    const isChecked = (item) => {
      if (props.modelValue == null || item.value == null) {
        return false;
      }
      if (!props.multiple) {
        return props.modelValue === item.value;
      }
      if (!Array.isArray(props.modelValue)) {
        return false;
      }
      return props.modelValue.includes(item.value);
    };
    const updateModelValue = (modelValue) => {
      if (valueIsChanged(modelValue, props.modelValue, props.multiple)) {
        emit("update:modelValue", modelValue);
        validateChange();
        emit("change", modelValue);
      }
    };
    const handleItemClick = (item) => {
      if (props.disabled || item.disabled) {
        return;
      }
      if (!props.multiple) {
        if (props.allowUncheck && !isEmptyValue(props.modelValue) && props.modelValue === item.value) {
          updateModelValue(null);
          return;
        }
        updateModelValue(item.value);
        return;
      }
      if (!isChecked(item)) {
        if (props.modelValue == null || !Array.isArray(props.modelValue)) {
          updateModelValue(item.value == null ? [] : [item.value]);
          return;
        }
        const temp = [...props.modelValue];
        if (item.value != null) {
          temp.push(item.value);
        }
        updateModelValue(temp);
        return;
      }
      if (props.modelValue == null || !Array.isArray(props.modelValue)) {
        updateModelValue([]);
        return;
      }
      updateModelValue(props.modelValue.filter((v) => v !== item.value));
    };
    __expose({
      reloadOptions
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _ctx.row ? (openBlock(), createBlock(unref(ElRow), normalizeProps(mergeProps({ key: 0 }, _ctx.row === true ? {} : _ctx.row)), {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "prepend"),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(optionData), (item, index) => {
              return openBlock(), createBlock(unref(ElCol), mergeProps({
                key: `${index}-${item.value}`
              }, { ref_for: true }, item.col || {}), {
                default: withCtx(() => [
                  createVNode(CardItem, {
                    item,
                    checked: isChecked(item),
                    disabled: _ctx.disabled || item.disabled,
                    bordered: _ctx.bordered || item.bordered,
                    arrow: _ctx.arrow,
                    arrowStyle: _ctx.arrowStyle,
                    style: normalizeStyle([_ctx.itemStyle, item.style]),
                    class: normalizeClass([_ctx.itemClass, item.class]),
                    onClick: ($event) => handleItemClick(item)
                  }, {
                    default: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, slotProps || {}), () => [
                        createTextVNode(toDisplayString(item.label ?? item.value), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["item", "checked", "disabled", "bordered", "arrow", "arrowStyle", "style", "class", "onClick"])
                ]),
                _: 2
              }, 1040);
            }), 128)),
            renderSlot(_ctx.$slots, "append")
          ]),
          _: 3
        }, 16)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          renderSlot(_ctx.$slots, "prepend"),
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(optionData), (item, index) => {
            return openBlock(), createBlock(CardItem, {
              key: item.key ?? `${index}-${item.value}`,
              item,
              checked: isChecked(item),
              disabled: _ctx.disabled || item.disabled,
              bordered: _ctx.bordered || item.bordered,
              arrow: _ctx.arrow,
              arrowStyle: _ctx.arrowStyle,
              style: normalizeStyle([_ctx.itemStyle, item.style]),
              class: normalizeClass([_ctx.itemClass, item.class]),
              onClick: ($event) => handleItemClick(item)
            }, {
              default: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, "item", mergeProps({ ref_for: true }, slotProps || {}), () => [
                  createTextVNode(toDisplayString(item.label ?? item.value), 1)
                ])
              ]),
              _: 2
            }, 1032, ["item", "checked", "disabled", "bordered", "arrow", "arrowStyle", "style", "class", "onClick"]);
          }), 128)),
          renderSlot(_ctx.$slots, "append")
        ], 64))
      ]);
    };
  }
});
export {
  _sfc_main as default
};

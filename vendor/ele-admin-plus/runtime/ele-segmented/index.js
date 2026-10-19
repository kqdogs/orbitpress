import { defineComponent, ref, computed, openBlock, createBlock, unref, normalizeClass, withCtx, createElementBlock, Fragment, renderList, renderSlot, mergeProps, resolveDynamicComponent, normalizeStyle, createCommentVNode, toDisplayString } from "vue";
import { ElTabs, ElTabPane, ElIcon } from "element-plus";
import { useFormValidate } from "../ele-basic-select/util";
import { segmentedEmits, segmentedProps } from "./props";
const _hoisted_1 = {
  key: 1,
  class: "ele-segmented-item-label"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleSegmented" },
  __name: "index",
  props: segmentedProps,
  emits: segmentedEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { validateChange } = useFormValidate();
    const tabRef = ref(null);
    const isEmptyActive = computed(() => {
      return props.modelValue == null || !props.items || !props.items.some((d) => d.value === props.modelValue);
    });
    const handleUpdateModelValue = (value) => {
      if (props.modelValue !== value) {
        emit("update:modelValue", value);
        if (props.validateEvent) {
          validateChange();
        }
        emit("change", value);
      }
    };
    const getWrapEl = () => {
      const tabEl = tabRef.value ? tabRef.value.$el : void 0;
      const headerEl = tabEl ? tabEl.querySelector(".el-tabs__header") : void 0;
      return headerEl ? headerEl.querySelector(".el-tabs__nav") : void 0;
    };
    const updateActiveBar = () => {
      const el = getWrapEl();
      if (el) {
        const bar = el.querySelector(".el-tabs__active-bar");
        if (bar) {
          bar.style.width = "0px";
        }
      }
    };
    __expose({
      tabRef,
      updateActiveBar
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElTabs), {
        ref_key: "tabRef",
        ref: tabRef,
        modelValue: _ctx.modelValue,
        stretch: _ctx.block,
        class: normalizeClass(["ele-segmented", [
          { "is-block": _ctx.block },
          { "is-large": _ctx.size === "large" },
          { "is-small": _ctx.size === "small" },
          { "is-disabled": _ctx.disabled },
          { "is-single": _ctx.items && _ctx.items.length === 1 },
          { "is-empty": isEmptyActive.value }
        ]]),
        "onUpdate:modelValue": handleUpdateModelValue
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item, index) => {
            return openBlock(), createBlock(unref(ElTabPane), {
              key: `${index}-${item.value}-${item.label}`,
              name: item.value,
              disabled: _ctx.disabled || item.disabled
            }, {
              label: withCtx(() => [
                renderSlot(_ctx.$slots, "label", { item }, () => [
                  item.icon ? (openBlock(), createBlock(unref(ElIcon), mergeProps({
                    key: 0,
                    ref_for: true
                  }, item.iconProps || {}, { class: "ele-segmented-item-icon" }), {
                    default: withCtx(() => [
                      (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                        style: normalizeStyle(item.iconStyle)
                      }, null, 8, ["style"]))
                    ]),
                    _: 2
                  }, 1040)) : createCommentVNode("", true),
                  item.label ? (openBlock(), createElementBlock("div", _hoisted_1, toDisplayString(item.label), 1)) : createCommentVNode("", true)
                ])
              ]),
              _: 2
            }, 1032, ["name", "disabled"]);
          }), 128))
        ]),
        _: 3
      }, 8, ["modelValue", "stretch", "class"]);
    };
  }
});
export {
  _sfc_main as default
};

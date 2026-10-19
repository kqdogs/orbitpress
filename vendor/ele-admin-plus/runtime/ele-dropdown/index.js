import { defineComponent, ref, computed, openBlock, createElementBlock, Fragment, createBlock, mergeProps, createSlots, renderList, withCtx, renderSlot, normalizeProps, guardReactiveProps, unref, createVNode, normalizeClass, normalizeStyle, resolveDynamicComponent, createCommentVNode, toDisplayString } from "vue";
import { ElButtonGroup, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from "element-plus";
import { pick, omit } from "../utils/common";
import { useFormValidate } from "../ele-basic-select/util";
import ProDropdown from "./components/pro-dropdown";
import { dropdownEmits, dropdownProps, elDropdownPropKeys } from "./props";
const _hoisted_1 = {
  key: 1,
  class: "ele-dropdown-trigger"
};
const _hoisted_2 = { key: 1 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleDropdown" },
  __name: "index",
  props: dropdownProps,
  emits: dropdownEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { validateChange } = useFormValidate();
    const dropdownRef = ref(null);
    const dropdownPropsData = computed(() => {
      const options = pick(props, elDropdownPropKeys);
      const classes = ["ele-popper", "ele-dropdown"];
      if (props.popperClass) {
        classes.push(props.popperClass);
      }
      options.popperClass = classes.join(" ");
      return options;
    });
    const selected = computed(() => {
      if (props.modelValue == null || props.modelValue === "" || !props.items) {
        return;
      }
      return props.items.find((d) => d.command === props.modelValue);
    });
    const updateModelValue = (value) => {
      if (value !== props.modelValue) {
        emit("update:modelValue", value);
        if (props.validateEvent) {
          validateChange();
        }
        emit("change", value);
      }
    };
    const handleMenuClick = (command) => {
      updateModelValue(command);
      emit("command", command);
    };
    const handleBtnClick = (e) => {
      emit("click", e);
    };
    const handlePopVisibleChange = (visible) => {
      emit("visibleChange", visible);
    };
    const handleOpen = () => {
      if (dropdownRef.value) {
        dropdownRef.value.handleOpen();
      }
    };
    const handleClose = () => {
      if (dropdownRef.value) {
        dropdownRef.value.handleClose();
      }
    };
    const updatePopper = () => {
      if (dropdownRef.value && dropdownRef.value.updatePopper) {
        dropdownRef.value.updatePopper();
      }
    };
    __expose({
      dropdownRef,
      handleOpen,
      handleClose,
      updatePopper
    });
    return (_ctx, _cache) => {
      return _ctx.componentType === "pro" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        _ctx.virtualTriggering ? (openBlock(), createBlock(ProDropdown, mergeProps({ key: 0 }, _ctx.$props, {
          ref_key: "dropdownRef",
          ref: dropdownRef,
          splitButton: false,
          selected: selected.value,
          onCommand: handleMenuClick,
          onVisibleChange: handlePopVisibleChange
        }), createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1040, ["selected"])) : (openBlock(), createElementBlock("div", _hoisted_1, [
          _ctx.splitButton ? (openBlock(), createBlock(unref(ElButtonGroup), { key: 0 }, {
            default: withCtx(() => [
              createVNode(unref(ElButton), mergeProps({
                type: _ctx.type,
                size: _ctx.size,
                disabled: _ctx.disabled
              }, _ctx.splitButtonProps || {}, { onClick: handleBtnClick }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {
                    active: _ctx.modelValue,
                    selected: selected.value
                  })
                ]),
                _: 3
              }, 16, ["type", "size", "disabled"]),
              createVNode(ProDropdown, mergeProps(_ctx.$props, {
                ref_key: "dropdownRef",
                ref: dropdownRef,
                selected: selected.value,
                onCommand: handleMenuClick,
                onVisibleChange: handlePopVisibleChange
              }), createSlots({ _: 2 }, [
                renderList(Object.keys(_ctx.$slots), (name) => {
                  return {
                    name,
                    fn: withCtx((slotProps) => [
                      renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                    ])
                  };
                })
              ]), 1040, ["selected"])
            ]),
            _: 3
          })) : (openBlock(), createBlock(ProDropdown, mergeProps({ key: 1 }, _ctx.$props, {
            ref_key: "dropdownRef",
            ref: dropdownRef,
            selected: selected.value,
            onCommand: handleMenuClick,
            onVisibleChange: handlePopVisibleChange
          }), createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1040, ["selected"]))
        ]))
      ], 64)) : (openBlock(), createBlock(unref(ElDropdown), mergeProps({
        key: 1,
        class: "ele-dropdown-trigger"
      }, dropdownPropsData.value, {
        ref_key: "dropdownRef",
        ref: dropdownRef,
        onClick: handleBtnClick,
        onCommand: handleMenuClick,
        onVisibleChange: handlePopVisibleChange
      }), {
        dropdown: withCtx(() => [
          !_ctx.items && _ctx.$slots.dropdown ? renderSlot(_ctx.$slots, "dropdown", { key: 0 }) : (openBlock(), createBlock(unref(ElDropdownMenu), {
            key: 1,
            style: normalizeStyle(_ctx.menuStyle),
            class: normalizeClass({ "ele-dropdown-icon-small": _ctx.iconSize === "small" })
          }, {
            default: withCtx(() => [
              _ctx.items ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(_ctx.items, (item) => {
                return openBlock(), createBlock(unref(ElDropdownItem), mergeProps(
                  {
                    key: item.key == null ? JSON.stringify(item.command) : item.key,
                    class: [
                      { "is-active": _ctx.modelValue === item.command },
                      { "is-danger": !!item.danger }
                    ]
                  },
                  { ref_for: true },
                  unref(omit)(item, [
                    "key",
                    "icon",
                    "title",
                    "iconProps",
                    "iconStyle",
                    "slot",
                    "danger",
                    "onClick",
                    "children"
                  ])
                ), {
                  default: withCtx(() => [
                    item.slot && item.slot !== "default" && _ctx.$slots[item.slot] ? renderSlot(_ctx.$slots, item.slot, {
                      key: 0,
                      item
                    }) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                      item.icon ? (openBlock(), createBlock(unref(ElIcon), mergeProps({
                        key: 0,
                        ref_for: true
                      }, { ..._ctx.iconProps || {}, ...item.iconProps || {} }), {
                        default: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                            style: normalizeStyle(item.iconStyle)
                          }, null, 8, ["style"]))
                        ]),
                        _: 2
                      }, 1040)) : createCommentVNode("", true),
                      item.title ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(item.title), 1)) : createCommentVNode("", true)
                    ], 64))
                  ]),
                  _: 2
                }, 1040, ["class"]);
              }), 128)) : _ctx.$slots.dropdownMenu ? renderSlot(_ctx.$slots, "dropdownMenu", { key: 1 }) : createCommentVNode("", true)
            ]),
            _: 3
          }, 8, ["style", "class"]))
        ]),
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {
            active: _ctx.modelValue,
            selected: selected.value
          })
        ]),
        _: 3
      }, 16));
    };
  }
});
export {
  _sfc_main as default
};

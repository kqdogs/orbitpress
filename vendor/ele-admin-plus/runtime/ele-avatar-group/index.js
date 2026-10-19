import { defineComponent, ref, computed, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock, unref, normalizeStyle, withCtx, renderSlot, createCommentVNode, mergeProps, createVNode, createElementVNode, toDisplayString } from "vue";
import { ElAvatar } from "element-plus";
import EleTooltip from "../ele-tooltip/index";
import { avatarGroupEmits, avatarGroupProps } from "./props";
const _hoisted_1 = { class: "ele-avatar-more-inner" };
const _hoisted_2 = {
  key: 0,
  class: "ele-popover-body ele-avatar-group"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleAvatarGroup" },
  __name: "index",
  props: avatarGroupProps,
  emits: avatarGroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const tooltipContent = ref("");
    const virtualRef = ref();
    const overflowVisible = ref(false);
    const commonStyle = computed(() => {
      if (props.size == null || typeof props.size === "string") {
        const obj = { large: "-12px", default: "-10px", small: "-8px" };
        return { marginLeft: props.size ? obj[props.size] : "-10px" };
      }
      if (typeof props.size === "number" && props.size >= 0) {
        return { marginLeft: `${-Math.round(props.size / 3)}px` };
      }
      return {};
    });
    const isOverflow = computed(() => {
      return props.maxCount != null && props.maxCount > 0 && props.data != null && props.data.length > props.maxCount;
    });
    const avatarData = computed(() => {
      if (props.data == null) {
        return [];
      }
      return isOverflow.value ? props.data.slice(0, props.maxCount) : props.data;
    });
    const overflowCount = computed(() => {
      if (!isOverflow.value || !props.data || props.maxCount == null) {
        return 0;
      }
      return props.data.length - props.maxCount;
    });
    const overflowData = computed(() => {
      if (props.data == null || !isOverflow.value) {
        return [];
      }
      return props.data.slice(props.maxCount);
    });
    const handleItemHover = (item, e) => {
      if (props.tooltip && item.label) {
        virtualRef.value = e.currentTarget;
        tooltipContent.value = item.label;
      }
    };
    const handleItemClick = (item) => {
      emit("itemClick", item);
    };
    const handleMoreClick = () => {
      emit("moreClick");
    };
    const handleError = (option) => {
      emit("error", option);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-avatar-group", { "is-hover-open": _ctx.hoverOpen }])
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(avatarData.value, (item, index) => {
          return openBlock(), createBlock(unref(ElAvatar), {
            key: item.key ?? `${index}-${item.value || item.label}`,
            size: _ctx.size,
            shape: _ctx.shape,
            src: item.value,
            style: normalizeStyle([commonStyle.value, _ctx.itemStyle, _ctx.avatarStyle]),
            onClick: ($event) => handleItemClick(item),
            onError: (e) => handleError({ item, e }),
            onMouseover: (e) => handleItemHover(item, e)
          }, {
            default: withCtx(() => [
              _ctx.$slots.item ? renderSlot(_ctx.$slots, "item", {
                key: 0,
                item
              }) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1032, ["size", "shape", "src", "style", "onClick", "onError", "onMouseover"]);
        }), 128)),
        isOverflow.value ? (openBlock(), createBlock(EleTooltip, mergeProps({
          key: 0,
          effect: "light",
          isPopover: true,
          gpuAcceleration: true,
          placement: "top",
          popperClass: "ele-avatar-popover",
          offset: 6
        }, _ctx.overflowPopoverProps || {}, {
          disabled: !_ctx.overflowPopover,
          visible: overflowVisible.value,
          "onUpdate:visible": _cache[0] || (_cache[0] = ($event) => overflowVisible.value = $event)
        }), {
          body: withCtx(() => [
            _ctx.overflowPopover ? (openBlock(), createElementBlock("div", _hoisted_2, [
              renderSlot(_ctx.$slots, "overflow", { overflowData: overflowData.value }, () => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(overflowData.value, (item, index) => {
                  return openBlock(), createBlock(unref(ElAvatar), {
                    key: item.key ?? `${index}-${item.value || item.label}`,
                    size: _ctx.size,
                    shape: _ctx.shape,
                    src: item.value,
                    style: normalizeStyle([commonStyle.value, _ctx.itemStyle, _ctx.avatarStyle]),
                    onClick: ($event) => handleItemClick(item),
                    onError: (e) => handleError({ item, e }),
                    onMouseover: (e) => handleItemHover(item, e)
                  }, {
                    default: withCtx(() => [
                      _ctx.$slots.item ? renderSlot(_ctx.$slots, "item", {
                        key: 0,
                        item
                      }) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1032, ["size", "shape", "src", "style", "onClick", "onError", "onMouseover"]);
                }), 128))
              ])
            ])) : createCommentVNode("", true)
          ]),
          default: withCtx(() => [
            createVNode(unref(ElAvatar), {
              size: _ctx.size,
              shape: _ctx.shape,
              style: normalizeStyle([commonStyle.value, _ctx.itemStyle, _ctx.moreStyle]),
              class: "ele-avatar-more",
              onClick: handleMoreClick
            }, {
              default: withCtx(() => [
                createElementVNode("span", _hoisted_1, [
                  renderSlot(_ctx.$slots, "more", {
                    overflowCount: overflowCount.value,
                    overflowData: overflowData.value
                  }, () => [
                    createElementVNode("span", null, "+" + toDisplayString(overflowCount.value), 1)
                  ])
                ])
              ]),
              _: 3
            }, 8, ["size", "shape", "style"])
          ]),
          _: 3
        }, 16, ["disabled", "visible"])) : createCommentVNode("", true),
        createVNode(EleTooltip, mergeProps({
          placement: "top",
          offset: 6
        }, _ctx.tooltipProps || {}, {
          content: tooltipContent.value,
          virtualRef: virtualRef.value,
          virtualTriggering: true
        }), null, 16, ["content", "virtualRef"])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

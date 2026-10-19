import { defineComponent, ref, computed, openBlock, createBlock, unref, withCtx, createElementBlock, Fragment, renderList, renderSlot, mergeProps, resolveDynamicComponent, normalizeStyle, createCommentVNode, toDisplayString } from "vue";
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from "element-plus";
import { breadcrumbProps } from "./props";
const _hoisted_1 = { key: 1 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleBreadcrumb" },
  __name: "index",
  props: breadcrumbProps,
  setup(__props, { expose: __expose }) {
    const props = __props;
    const breadcrumbRef = ref(null);
    const breadcrumbSeparator = computed(() => {
      if (typeof props.separator !== "string") {
        return;
      }
      return props.separator;
    });
    const breadcrumbSeparatorIcon = computed(
      () => {
        if (props.separatorIcon != null && props.separatorIcon !== "") {
          return props.separatorIcon;
        }
        if (props.separator != null && typeof props.separator !== "string") {
          return props.separator;
        }
        return props.separatorIcon;
      }
    );
    __expose({
      breadcrumbRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElBreadcrumb), {
        ref_key: "breadcrumbRef",
        ref: breadcrumbRef,
        separator: breadcrumbSeparator.value,
        separatorIcon: breadcrumbSeparatorIcon.value,
        class: "ele-breadcrumb"
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.items, (item) => {
            return openBlock(), createBlock(unref(ElBreadcrumbItem), {
              key: item.key ?? item.title,
              replace: item.replace,
              to: item.to
            }, {
              default: withCtx(() => [
                item.slot && item.slot !== "default" && _ctx.$slots[item.slot] ? renderSlot(_ctx.$slots, item.slot, {
                  key: 0,
                  item
                }) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  item.icon ? (openBlock(), createBlock(unref(ElIcon), mergeProps({
                    key: 0,
                    ref_for: true
                  }, item.iconProps || {}), {
                    default: withCtx(() => [
                      (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                        style: normalizeStyle(item.iconStyle)
                      }, null, 8, ["style"]))
                    ]),
                    _: 2
                  }, 1040)) : createCommentVNode("", true),
                  item.title ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(item.title), 1)) : createCommentVNode("", true)
                ], 64))
              ]),
              _: 2
            }, 1032, ["replace", "to"]);
          }), 128))
        ]),
        _: 3
      }, 8, ["separator", "separatorIcon"]);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, computed, openBlock, createBlock, unref, withCtx, resolveDynamicComponent, normalizeClass, createCommentVNode, renderSlot } from "vue";
import { ElIcon } from "element-plus";
import { iconProps } from "./props";
const defaultIconTag = "i";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleIcon" },
  __name: "index",
  props: iconProps,
  setup(__props, { expose: __expose }) {
    const props = __props;
    const iconRef = ref(null);
    const iconComponent = computed(() => {
      if (props.name != null && (props.iconType === "fontClass" || typeof props.name === "string" && props.name.includes(" "))) {
        return defaultIconTag;
      }
      return props.name;
    });
    __expose({
      iconRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElIcon), {
        ref_key: "iconRef",
        ref: iconRef,
        size: _ctx.size,
        color: _ctx.color
      }, {
        default: withCtx(() => [
          iconComponent.value ? (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), {
            key: 0,
            class: normalizeClass(iconComponent.value === defaultIconTag ? _ctx.name : void 0)
          }, null, 8, ["class"])) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["size", "color"]);
    };
  }
});
export {
  _sfc_main as default
};

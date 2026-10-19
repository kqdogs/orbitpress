import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot, normalizeStyle, createCommentVNode } from "vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CardItem" },
  __name: "card-item",
  props: {
    /** 数据 */
    item: Object,
    /** 是否选中 */
    checked: Boolean,
    /** 是否禁用 */
    disabled: Boolean,
    /** 是否显示边框 */
    bordered: Boolean,
    /** 是否需要选中箭头 */
    arrow: Boolean,
    /** 选中箭头样式 */
    arrowStyle: Object
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-check-card", [
          { "is-bordered": __props.bordered },
          { "is-checked": __props.checked },
          { "is-disabled": __props.disabled }
        ]])
      }, [
        renderSlot(_ctx.$slots, "default", {
          item: __props.item,
          checked: __props.checked,
          disabled: __props.disabled
        }),
        __props.arrow ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-check-card-arrow",
          style: normalizeStyle(__props.arrowStyle)
        }, null, 4)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

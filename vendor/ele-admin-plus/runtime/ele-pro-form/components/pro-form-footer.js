import { defineComponent, openBlock, createBlock, unref, mergeProps, createSlots, withCtx, createElementVNode, normalizeStyle, renderSlot, createVNode, createTextVNode, toDisplayString, createElementBlock, Fragment, createCommentVNode, renderList, normalizeProps, guardReactiveProps } from "vue";
import { ElFormItem, ElButton, ElLink, ElIcon } from "element-plus";
import { ArrowUp, ArrowDown } from "../../icons/index";
import { getSlotsMap } from "../../utils/common";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ProFormFooter" },
  __name: "pro-form-footer",
  props: {
    /** 底栏 ElFormItem 属性 */
    footerProps: Object,
    /** 底栏 ElFormItem 插槽 */
    footerSlots: Object,
    /** 自动计算底栏栅格份数 */
    autoFooterCol: Boolean,
    /** 底栏样式 */
    footerStyle: Object,
    /** 提交按钮文本 */
    submitText: String,
    /** 重置按钮文本 */
    resetText: String,
    /** 提交按钮属性 */
    submitButtonProps: Object,
    /** 重置按钮属性 */
    resetButtonProps: Object,
    /** 是否在底栏显示表单展开收起按钮 */
    showSearchExpand: Boolean,
    /** 搜索表单展开状态 */
    searchExpand: Boolean,
    /** 展开和收起按钮属性 */
    searchExpandButtonProps: Object,
    /** 展开按钮的文字 */
    searchExpandText: String,
    /** 收起按钮的文字 */
    searchShrinkText: String
  },
  emits: {
    updateSearchExpand: (_expand) => true,
    submit: () => true,
    reset: () => true
  },
  setup(__props, { emit: __emit }) {
    const ownSlots = ["footer", "footerExtra"];
    const props = __props;
    const emit = __emit;
    const toggleSearchExpand = () => {
      emit("updateSearchExpand", !props.searchExpand);
    };
    const handleSubmit = () => {
      emit("submit");
    };
    const handleReset = () => {
      emit("reset");
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElFormItem), mergeProps({
        class: ["ele-pro-form-footer", { "is-search-expand": __props.autoFooterCol && __props.searchExpand }]
      }, __props.footerProps || {}, {
        labelWidth: typeof __props.footerProps?.labelWidth === "number" ? `${__props.footerProps.labelWidth}px` : __props.footerProps?.labelWidth
      }), createSlots({
        default: withCtx(() => [
          createElementVNode("div", {
            class: "ele-pro-form-footer-body",
            style: normalizeStyle(__props.footerStyle)
          }, [
            renderSlot(_ctx.$slots, "footer", {
              submitForm: handleSubmit,
              resetForm: handleReset
            }, () => [
              createVNode(unref(ElButton), mergeProps({ type: "primary" }, __props.submitButtonProps || {}, { onClick: handleSubmit }), {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.submitText), 1)
                ]),
                _: 1
              }, 16),
              createVNode(unref(ElButton), mergeProps(__props.resetButtonProps || {}, { onClick: handleReset }), {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.resetText), 1)
                ]),
                _: 1
              }, 16)
            ]),
            __props.showSearchExpand ? (openBlock(), createBlock(unref(ElLink), mergeProps({
              key: 0,
              type: "primary",
              underline: "never",
              style: { marginLeft: "12px" }
            }, __props.searchExpandButtonProps || {}, { onClick: toggleSearchExpand }), {
              default: withCtx(() => [
                __props.searchExpand ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                  createElementVNode("span", null, toDisplayString(__props.searchShrinkText), 1),
                  createVNode(unref(ElIcon), { style: { verticalAlign: "-1px" } }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowUp))
                    ]),
                    _: 1
                  })
                ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  createElementVNode("span", null, toDisplayString(__props.searchExpandText), 1),
                  createVNode(unref(ElIcon), { style: { verticalAlign: "-2px" } }, {
                    default: withCtx(() => [
                      createVNode(unref(ArrowDown))
                    ]),
                    _: 1
                  })
                ], 64))
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true),
            renderSlot(_ctx.$slots, "footerExtra", {
              submitForm: handleSubmit,
              resetForm: handleReset
            })
          ], 4)
        ]),
        _: 2
      }, [
        renderList(unref(getSlotsMap)(
          _ctx.$slots,
          __props.footerSlots,
          ["default"],
          ownSlots
        ), (slotName, compSlotName) => {
          return {
            name: compSlotName,
            fn: withCtx((slotProps) => [
              renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps || {})))
            ])
          };
        })
      ]), 1040, ["class", "labelWidth"]);
    };
  }
});
export {
  _sfc_main as default
};

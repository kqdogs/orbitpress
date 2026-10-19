import { defineComponent, openBlock, createElementBlock, createElementVNode, normalizeClass, createBlock, unref, withCtx, createVNode, createCommentVNode, renderSlot, toDisplayString } from "vue";
import { ElIcon } from "element-plus";
import { DragOutlined } from "../../icons/index";
const _hoisted_1 = { class: "ele-pro-form-builder-item-tool-wrapper" };
const _hoisted_2 = { class: "ele-pro-form-builder-item-handle-content" };
const _hoisted_3 = { class: "ele-pro-form-builder-item-tools" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BuilderToolWrapper" },
  __name: "builder-tool-wrapper",
  props: {
    item: {},
    activeItemKey: {},
    handle: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", {
          class: normalizeClass(["ele-pro-form-builder-item-handle", { "is-disabled": !__props.handle }])
        }, [
          __props.handle ? (openBlock(), createBlock(unref(ElIcon), {
            key: 0,
            class: "ele-pro-form-builder-item-handle-icon"
          }, {
            default: withCtx(() => [
              createVNode(unref(DragOutlined))
            ]),
            _: 1
          })) : createCommentVNode("", true),
          renderSlot(_ctx.$slots, "builderItemHandleContent", {
            item: __props.item,
            activeItemKey: __props.activeItemKey
          }, () => [
            createElementVNode("div", _hoisted_2, toDisplayString(__props.item.type), 1)
          ])
        ], 2),
        createElementVNode("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "builderItemTools", {
            item: __props.item,
            activeItemKey: __props.activeItemKey
          })
        ])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

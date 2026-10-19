import { defineComponent, onBeforeUnmount, openBlock, createElementBlock, Fragment, createElementVNode, createVNode, unref, normalizeClass, withCtx, createBlock, resolveDynamicComponent, renderSlot, toDisplayString, createCommentVNode } from "vue";
import { ElIcon } from "element-plus";
import { LoadingDotOutlined, CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled, InfoCircleFilled, CloseOutlined } from "../../icons/index";
const _hoisted_1 = { class: "ele-message-icon" };
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = {
  key: 1,
  class: "ele-message-content"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "MessageBody" },
  __name: "message-body",
  props: {
    /** 内容 */
    message: String,
    /** 类型 */
    type: String,
    /** 图标 */
    icon: [String, Object, Function],
    /** 是否显示关闭按钮 */
    showClose: Boolean,
    /** 内容是否是富文本 */
    dangerouslyUseHTMLString: Boolean,
    /** 是否是加载框 */
    loading: Boolean,
    /** 标识id */
    messageId: String
  },
  emits: {
    close: () => true,
    messageDestroy: (_messageId) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    onBeforeUnmount(() => {
      emit("messageDestroy", props.messageId);
    });
    const handleClose = () => {
      emit("close");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("div", _hoisted_1, [
          createVNode(unref(ElIcon), {
            class: normalizeClass({ "is-loading": __props.loading })
          }, {
            default: withCtx(() => [
              __props.icon ? (openBlock(), createBlock(resolveDynamicComponent(__props.icon), { key: 0 })) : __props.loading ? (openBlock(), createBlock(unref(LoadingDotOutlined), { key: 1 })) : __props.type === "success" ? (openBlock(), createBlock(unref(CheckCircleFilled), { key: 2 })) : __props.type === "warning" ? (openBlock(), createBlock(unref(ExclamationCircleFilled), { key: 3 })) : __props.type === "error" ? (openBlock(), createBlock(unref(CloseCircleFilled), { key: 4 })) : (openBlock(), createBlock(unref(InfoCircleFilled), { key: 5 }))
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        renderSlot(_ctx.$slots, "default", {}, () => [
          __props.dangerouslyUseHTMLString ? (openBlock(), createElementBlock("div", {
            key: 0,
            innerHTML: __props.message,
            class: "ele-message-content"
          }, null, 8, _hoisted_2)) : (openBlock(), createElementBlock("div", _hoisted_3, toDisplayString(__props.message), 1))
        ]),
        __props.showClose ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-message-close",
          onClick: handleClose
        }, [
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              createVNode(unref(CloseOutlined))
            ]),
            _: 1
          })
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

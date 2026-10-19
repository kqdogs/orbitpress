import { defineComponent, ref, watch, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, unref, withCtx, createBlock, toDisplayString, renderSlot } from "vue";
import { ElIcon } from "element-plus";
import { LoadingDotOutlined, DeepThinkOutlined, ArrowDown } from "../../icons/index";
const _hoisted_1 = { class: "ele-chat-think-status-text" };
const _hoisted_2 = { class: "ele-chat-think-content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chat-think",
  props: {
    /** 是否展开 */
    expanded: {
      type: Boolean,
      default: true
    },
    /** 是否是思考中 */
    thinking: Boolean,
    /** 思考中文案 */
    thinkingText: String,
    /** 已思考文案 */
    thoughtText: String
  },
  emits: {
    /** 更新展开状态事件 */
    "update:expanded": (_expanded) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isExpanded = ref(props.expanded);
    const handleStatusClick = () => {
      isExpanded.value = !isExpanded.value;
      if (props.expanded !== isExpanded.value) {
        emit("update:expanded", isExpanded.value);
      }
    };
    watch(
      () => props.expanded,
      (expanded) => {
        if (isExpanded.value !== expanded) {
          isExpanded.value = expanded;
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-chat-think", { "is-thinking": __props.thinking, "is-expanded": isExpanded.value }])
      }, [
        createElementVNode("div", {
          class: "ele-chat-think-status",
          onClick: handleStatusClick
        }, [
          createVNode(unref(ElIcon), {
            class: normalizeClass(["ele-chat-think-status-icon", { "is-loading": __props.thinking }])
          }, {
            default: withCtx(() => [
              __props.thinking ? (openBlock(), createBlock(unref(LoadingDotOutlined), { key: 0 })) : (openBlock(), createBlock(unref(DeepThinkOutlined), { key: 1 }))
            ]),
            _: 1
          }, 8, ["class"]),
          createElementVNode("div", _hoisted_1, toDisplayString(__props.thinking ? __props.thinkingText : __props.thoughtText), 1),
          createVNode(unref(ElIcon), { class: "ele-chat-think-status-expand" }, {
            default: withCtx(() => [
              createVNode(unref(ArrowDown))
            ]),
            _: 1
          })
        ]),
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "default")
        ])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

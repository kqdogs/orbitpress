import { defineComponent, ref, watch, nextTick, openBlock, createElementBlock, normalizeClass, renderSlot, createBlock, createSlots, renderList, withCtx, normalizeProps, guardReactiveProps, createCommentVNode, createElementVNode, createTextVNode, toDisplayString, createVNode, unref, mergeProps, Fragment } from "vue";
import { ElInput, ElButton } from "element-plus";
import BubbleLoading from "./bubble-loading";
import ChatFiles from "./chat-files";
import ChatThink from "./chat-think";
const _hoisted_1 = { class: "ele-chat-bubble-main" };
const _hoisted_2 = {
  key: 0,
  class: "ele-chat-bubble-avatar"
};
const _hoisted_3 = ["src"];
const _hoisted_4 = {
  key: 2,
  class: "ele-chat-bubble-body"
};
const _hoisted_5 = {
  key: 0,
  class: "ele-chat-bubble-header"
};
const _hoisted_6 = {
  key: 2,
  class: "ele-chat-bubble-edit"
};
const _hoisted_7 = { class: "ele-chat-bubble-edit-footer" };
const _hoisted_8 = {
  key: 0,
  class: "ele-chat-bubble-content-text"
};
const _hoisted_9 = {
  key: 1,
  class: "ele-chat-bubble-footer"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chat-bubble",
  props: {
    /** 消息 */
    item: {
      type: Object,
      required: true
    },
    /** 上传失败文本 */
    uploadError: String,
    /** 思考中文案 */
    thinkingText: String,
    /** 已思考文案 */
    thoughtText: String,
    /** 编辑框提示文本 */
    editPlaceholder: String,
    /** 编辑取消按钮文本 */
    editCancelText: String,
    /** 编辑确认按钮文本 */
    editConfirmText: String,
    /** 内容编辑确认按钮属性 */
    editConfirmBtnProps: Object,
    /** 内容编辑取消按钮属性 */
    editCancelBtnProps: Object,
    /** 内容编辑框属性 */
    editInputProps: Object
  },
  emits: {
    /** 气泡内容点击事件 */
    bubbleContentClick: (_item, _e) => true,
    /** 附件点击事件 */
    fileClick: (_item, _fileItem) => true,
    /** 附件删除事件 */
    fileRemove: (_item, _fileItem) => true,
    /** 编辑取消事件 */
    editCancel: (_item) => true,
    /** 编辑确认事件 */
    editConfirm: (_item, _content) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const editContent = ref("");
    const inputRef = ref(null);
    const isComposing = ref(false);
    const handleContentClick = (e) => {
      emit("bubbleContentClick", props.item, e);
    };
    const handleFileClick = (fileItem) => {
      emit("fileClick", props.item, fileItem);
    };
    const handleFileRemove = (fileItem) => {
      emit("fileRemove", props.item, fileItem);
    };
    const handleEditCancel = () => {
      emit("editCancel", props.item);
    };
    const handleEditConfirm = () => {
      emit("editConfirm", props.item, editContent.value);
    };
    const handleInputKeydown = (e) => {
      if (!(isComposing.value || e.shiftKey) && e.key === "Enter") {
        e.preventDefault();
        handleEditConfirm();
      }
    };
    const handleCompositionStart = () => {
      isComposing.value = true;
    };
    const handleCompositionEnd = () => {
      isComposing.value = false;
    };
    watch(
      () => props.item.editStatus,
      (editStatus) => {
        if (editStatus) {
          editContent.value = props.item.content ?? "";
          nextTick(() => {
            inputRef.value && inputRef.value.focus();
          });
        } else {
          editContent.value = "";
        }
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-chat-bubble", {
          "is-placement-end": __props.item.placement === "end",
          "is-receiving": __props.item.status === "receiving"
        }])
      }, [
        renderSlot(_ctx.$slots, "itemTop", { item: __props.item }),
        __props.item.files && __props.item.files.length ? (openBlock(), createBlock(ChatFiles, {
          key: 0,
          files: __props.item.files,
          readonly: true,
          uploadError: __props.uploadError,
          onFileClick: handleFileClick,
          onFileRemove: handleFileRemove
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (name) => {
            return {
              name,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
              ])
            };
          })
        ]), 1032, ["files", "uploadError"])) : createCommentVNode("", true),
        createElementVNode("div", _hoisted_1, [
          __props.item.avatar != null ? (openBlock(), createElementBlock("div", _hoisted_2, [
            renderSlot(_ctx.$slots, "itemAvatar", { item: __props.item }, () => [
              createElementVNode("img", {
                src: __props.item.avatar,
                class: "ele-chat-bubble-avatar-img"
              }, null, 8, _hoisted_3)
            ])
          ])) : createCommentVNode("", true),
          __props.item.avatar == null && __props.item.status === "loading" ? (openBlock(), createBlock(BubbleLoading, { key: 1 })) : (openBlock(), createElementBlock("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "itemBodyTop", { item: __props.item }),
            __props.item.header != null ? (openBlock(), createElementBlock("div", _hoisted_5, [
              renderSlot(_ctx.$slots, "itemHeader", { item: __props.item }, () => [
                createTextVNode(toDisplayString(__props.item.header), 1)
              ])
            ])) : createCommentVNode("", true),
            __props.item.status === "loading" ? (openBlock(), createBlock(BubbleLoading, { key: 1 })) : __props.item.editStatus ? (openBlock(), createElementBlock("div", _hoisted_6, [
              createVNode(unref(ElInput), mergeProps({
                type: "textarea",
                resize: "none",
                validateEvent: false,
                placeholder: __props.editPlaceholder
              }, __props.editInputProps || {}, {
                ref_key: "inputRef",
                ref: inputRef,
                modelValue: editContent.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => editContent.value = $event),
                class: "ele-chat-bubble-edit-input",
                onKeydown: handleInputKeydown,
                onCompositionstart: handleCompositionStart,
                onCompositionend: handleCompositionEnd
              }), null, 16, ["placeholder", "modelValue"]),
              createElementVNode("div", _hoisted_7, [
                createVNode(unref(ElButton), mergeProps({
                  size: "small",
                  round: true
                }, __props.editCancelBtnProps || {}, { onClick: handleEditCancel }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.editCancelText), 1)
                  ]),
                  _: 1
                }, 16),
                createVNode(unref(ElButton), mergeProps({
                  size: "small",
                  type: "primary",
                  round: true
                }, __props.editConfirmBtnProps || {}, { onClick: handleEditConfirm }), {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.editConfirmText), 1)
                  ]),
                  _: 1
                }, 16)
              ])
            ])) : (openBlock(), createElementBlock(Fragment, { key: 3 }, [
              __props.item.content != null || __props.item.reasoning != null ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "ele-chat-bubble-content",
                onClick: handleContentClick
              }, [
                renderSlot(_ctx.$slots, "itemThink", { item: __props.item }, () => [
                  __props.item.reasoning != null ? (openBlock(), createBlock(ChatThink, {
                    key: 0,
                    thinking: __props.item.status === "thinking",
                    thinkingText: __props.thinkingText,
                    thoughtText: __props.thoughtText
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.item.reasoning), 1)
                    ]),
                    _: 1
                  }, 8, ["thinking", "thinkingText", "thoughtText"])) : createCommentVNode("", true)
                ]),
                renderSlot(_ctx.$slots, "itemContent", { item: __props.item }, () => [
                  __props.item.content != null ? (openBlock(), createElementBlock("div", _hoisted_8, toDisplayString(__props.item.content), 1)) : createCommentVNode("", true)
                ])
              ])) : createCommentVNode("", true),
              _ctx.$slots.itemFooter ? (openBlock(), createElementBlock("div", _hoisted_9, [
                renderSlot(_ctx.$slots, "itemFooter", { item: __props.item })
              ])) : createCommentVNode("", true)
            ], 64)),
            renderSlot(_ctx.$slots, "itemBodyBottom", { item: __props.item })
          ])),
          renderSlot(_ctx.$slots, "itemExtra", { item: __props.item })
        ]),
        renderSlot(_ctx.$slots, "itemBottom", { item: __props.item })
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

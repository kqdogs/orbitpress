import { defineComponent, ref, computed, watch, openBlock, createElementBlock, normalizeClass, renderSlot, createBlock, createSlots, renderList, withCtx, normalizeProps, guardReactiveProps, createCommentVNode, createElementVNode, withDirectives, withKeys, vModelText, toDisplayString, unref, mergeProps, createVNode } from "vue";
import { ElUpload } from "element-plus";
import { PaperClipOutlined, SendFilled } from "../../icons/index";
import { uuid, formatFileSize } from "../../utils/common";
import ChatFiles from "./chat-files";
import InputTool from "./input-tool";
const _hoisted_1 = { class: "ele-chat-input" };
const _hoisted_2 = ["placeholder"];
const _hoisted_3 = { class: "ele-chat-input-hidden" };
const _hoisted_4 = { class: "ele-chat-input-tools" };
const _hoisted_5 = { class: "ele-chat-input-tools-left" };
const _hoisted_6 = { class: "ele-chat-input-tools-right" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chat-input",
  props: {
    /** 输入框文本 */
    modelValue: String,
    /** 发送按钮属性 */
    sendBtnProps: {
      type: [Object, Boolean],
      default: () => null
    },
    /** 上传按钮属性 */
    uploadBtnProps: {
      type: [Object, Boolean],
      default: () => null
    },
    /** 附件 */
    files: Array,
    /** 输入框提示文本 */
    placeholder: String,
    /** 上传组件属性 */
    uploadProps: Object,
    /** 上传按钮提示文本 */
    uploadTip: String,
    /** 上传失败提示文本 */
    uploadError: String
  },
  emits: {
    /** 更新输入框文本 */
    "update:modelValue": (_value) => true,
    /** 输入事件 */
    input: (_e) => true,
    /** 获取焦点事件 */
    focus: (_e) => true,
    /** 失去焦点事件 */
    blur: (_e) => true,
    /** 回车发送事件 */
    send: (_content) => true,
    /** 发送按钮点击事件 */
    sendBtnClick: (_e) => true,
    /** 附件点击事件 */
    fileClick: (_item) => true,
    /** 附件删除事件 */
    fileRemove: (_item) => true,
    /** 附件上传事件 */
    fileUpload: (_item) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const content = ref(props.modelValue ?? "");
    const hidden = computed(() => `${content.value ?? ""}​`);
    const isFocused = ref(false);
    const isComposing = ref(false);
    const handleSendBtnClick = (e) => {
      emit("sendBtnClick", e);
    };
    const handleInput = (e) => {
      emit("input", e);
    };
    const handleFocus = (e) => {
      isFocused.value = true;
      emit("focus", e);
    };
    const handleBlur = (e) => {
      isFocused.value = false;
      emit("blur", e);
    };
    const handleEnter = (e) => {
      if (isComposing.value || e.shiftKey) {
        return;
      }
      e.preventDefault();
      emit("send", content.value);
    };
    const handleCompositionStart = () => {
      isComposing.value = true;
    };
    const handleCompositionEnd = () => {
      isComposing.value = false;
    };
    const handleFileClick = (item) => {
      emit("fileClick", item);
    };
    const handleFileRemove = (item) => {
      emit("fileRemove", item);
    };
    const handleFileUpload = (file) => {
      const { name, size } = file;
      const key = `ele${uuid(16, 10)}${String(Date.now())}`;
      const suffixIndex = name.lastIndexOf(".");
      const suffix = suffixIndex === -1 ? "" : name.substring(suffixIndex + 1);
      const item = {
        key,
        name,
        description: `${suffix}  ${formatFileSize(size)[0]}`,
        file
      };
      emit("fileUpload", item);
      return false;
    };
    watch(
      () => props.modelValue,
      (val) => {
        const text = val ?? "";
        if ((content.value ?? "") !== text) {
          content.value = text;
        }
      }
    );
    watch(content, (val) => {
      const text = val ?? "";
      if ((props.modelValue ?? "") !== text) {
        emit("update:modelValue", text);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-chat-input-wrapper", { "is-focused": isFocused.value }])
      }, [
        renderSlot(_ctx.$slots, "inputTop"),
        __props.files && __props.files.length ? (openBlock(), createBlock(ChatFiles, {
          key: 0,
          files: __props.files,
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
          withDirectives(createElementVNode("textarea", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => content.value = $event),
            class: "ele-chat-textarea",
            placeholder: __props.placeholder,
            onInput: handleInput,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onKeydown: withKeys(handleEnter, ["enter"]),
            onCompositionstart: handleCompositionStart,
            onCompositionend: handleCompositionEnd
          }, null, 40, _hoisted_2), [
            [vModelText, content.value]
          ]),
          createElementVNode("div", _hoisted_3, toDisplayString(hidden.value), 1)
        ]),
        createElementVNode("div", _hoisted_4, [
          createElementVNode("div", _hoisted_5, [
            renderSlot(_ctx.$slots, "inputLeftTools")
          ]),
          createElementVNode("div", _hoisted_6, [
            renderSlot(_ctx.$slots, "inputRightTools"),
            __props.uploadBtnProps !== false ? (openBlock(), createBlock(unref(ElUpload), mergeProps({
              key: 0,
              action: "",
              drag: false,
              multiple: true,
              showFileList: false,
              beforeUpload: handleFileUpload,
              class: "ele-chat-input-tool-upload"
            }, __props.uploadProps || {}), {
              default: withCtx(() => [
                createVNode(InputTool, mergeProps({
                  icon: unref(PaperClipOutlined),
                  label: __props.uploadTip
                }, (__props.uploadBtnProps === true ? void 0 : __props.uploadBtnProps) || {}), null, 16, ["icon", "label"])
              ]),
              _: 1
            }, 16)) : createCommentVNode("", true),
            __props.sendBtnProps !== false ? (openBlock(), createBlock(InputTool, mergeProps({
              key: 1,
              icon: unref(SendFilled),
              type: "primary",
              class: "ele-chat-input-tool-send"
            }, (__props.sendBtnProps === true ? void 0 : __props.sendBtnProps) || {}, { onClick: handleSendBtnClick }), null, 16, ["icon"])) : createCommentVNode("", true)
          ])
        ]),
        renderSlot(_ctx.$slots, "inputBottom")
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

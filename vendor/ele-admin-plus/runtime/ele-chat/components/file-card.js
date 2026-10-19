import { defineComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createBlock, unref, withCtx, createVNode, createCommentVNode, toDisplayString, withModifiers } from "vue";
import { ElIcon } from "element-plus";
import { LoadingDotOutlined, CloseOutlined } from "../../icons/index";
import FileIcon from "../../ele-file-list/components/file-icon";
import { svgIcons } from "../../ele-file-list/icons";
const _hoisted_1 = { class: "ele-chat-file-item-icon" };
const _hoisted_2 = { class: "ele-chat-file-item-body" };
const _hoisted_3 = ["title"];
const _hoisted_4 = {
  key: 0,
  class: "ele-chat-file-item-text is-exception"
};
const _hoisted_5 = {
  key: 1,
  class: "ele-chat-file-item-text"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "file-card",
  props: {
    /** 附件 */
    item: {
      type: Object,
      required: true
    },
    /** 是否只读模式 */
    readonly: Boolean,
    /** 上传失败文本 */
    uploadError: String
  },
  emits: {
    /** 附件删除事件 */
    fileRemove: (_item, _e) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleItemDel = (e) => {
      emit("fileRemove", props.item, e);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-chat-file-item", [
          { "is-exception": __props.item.status === "exception" },
          { "is-uploading": __props.item.status === "uploading" }
        ]])
      }, [
        createElementVNode("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "fileIcon", { item: __props.item }, () => [
            __props.item.status === "uploading" ? (openBlock(), createBlock(unref(ElIcon), {
              key: 0,
              class: "is-loading ele-chat-file-item-icon-loading"
            }, {
              default: withCtx(() => [
                createVNode(unref(LoadingDotOutlined))
              ]),
              _: 1
            })) : createCommentVNode("", true),
            createVNode(FileIcon, {
              fileName: __props.item.name,
              isDirectory: __props.item.isDirectory,
              icons: unref(svgIcons)
            }, null, 8, ["fileName", "isDirectory", "icons"])
          ])
        ]),
        createElementVNode("div", _hoisted_2, [
          createElementVNode("div", {
            class: "ele-chat-file-item-name",
            title: __props.item.name
          }, toDisplayString(__props.item.name), 9, _hoisted_3),
          __props.item.status === "exception" && __props.item.error !== "" ? (openBlock(), createElementBlock("div", _hoisted_4, toDisplayString(__props.item.error ?? __props.uploadError), 1)) : (openBlock(), createElementBlock("div", _hoisted_5, toDisplayString(__props.item.description), 1))
        ]),
        !(__props.item.readonly ?? __props.readonly) ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "ele-chat-file-item-del",
          onClick: withModifiers(handleItemDel, ["stop"])
        }, [
          createVNode(unref(ElIcon), null, {
            default: withCtx(() => [
              createVNode(unref(CloseOutlined), { style: { "stroke-width": "6" } })
            ]),
            _: 1
          })
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};

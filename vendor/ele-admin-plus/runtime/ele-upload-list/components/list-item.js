import { defineComponent, computed, openBlock, createElementBlock, renderSlot, createVNode, unref, withCtx, createElementVNode, toDisplayString, createBlock, mergeProps, withModifiers, createCommentVNode } from "vue";
import { ElIcon, ElImage, ElProgress } from "element-plus";
import { FileOutlined, SyncOutlined, EyeOutlined, EditOutlined, CloseOutlined } from "../../icons/index";
const _hoisted_1 = ["title"];
const _hoisted_2 = {
  key: 0,
  class: "ele-upload-thumbnail"
};
const _hoisted_3 = { class: "ele-upload-thumbnail-text" };
const _hoisted_4 = {
  key: 0,
  class: "ele-upload-progress"
};
const _hoisted_5 = { class: "ele-upload-text" };
const _hoisted_6 = ["title"];
const _hoisted_7 = { class: "ele-upload-tool-text" };
const _hoisted_8 = {
  key: 1,
  class: "ele-upload-tools"
};
const _hoisted_9 = ["title"];
const _hoisted_10 = { class: "ele-upload-tool-text" };
const _hoisted_11 = ["title"];
const _hoisted_12 = { class: "ele-upload-tool-text" };
const _hoisted_13 = ["title"];
const _hoisted_14 = {
  key: 3,
  class: "ele-upload-handle"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ListItem" },
  __name: "list-item",
  props: {
    /** 数据 */
    item: {
      type: Object,
      required: true
    },
    /** 是否只读 */
    readonly: Boolean,
    /** 是否禁用 */
    disabled: Boolean,
    /** 是否可拖拽排序 */
    sortable: Boolean,
    /** 图片属性 */
    imageProps: Object,
    /** 进度条属性 */
    progressProps: Object,
    /** 预读图片文件 */
    imageObjectUrls: Array,
    /** 是否开启底部预览和修改的操作按钮 */
    tools: Boolean,
    /** 列表样式 */
    listType: String,
    /** 国际化 */
    locale: {
      type: Object,
      required: true
    }
  },
  emits: {
    itemClick: (_item) => true,
    remove: (_item) => true,
    edit: (_item) => true,
    preview: (_item) => true,
    retry: (_item) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const imageUrl = computed(() => {
      if (props.item.thumbnail && props.item.thumbnail !== true) {
        return props.item.thumbnail;
      }
      if (props.item.url) {
        return props.item.url;
      }
      if (!props.item.file || !props.imageObjectUrls) {
        return;
      }
      return props.imageObjectUrls.find((d) => d.file === props.item.file)?.url;
    });
    const uploadProgress = computed(() => {
      const progress = props.item.progress;
      if (!progress || progress < 0) {
        return 0;
      }
      return progress > 100 ? 100 : progress;
    });
    const handleItemClick = () => {
      emit("itemClick", props.item);
    };
    const handleRemove = () => {
      emit("remove", props.item);
    };
    const handleEdit = () => {
      emit("edit", props.item);
    };
    const handlePreview = () => {
      emit("preview", props.item);
    };
    const handleRetry = () => {
      emit("retry", props.item);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        title: __props.item.name,
        class: "ele-upload-item",
        onClick: handleItemClick
      }, [
        renderSlot(_ctx.$slots, "thumbnail", {
          item: __props.item,
          imageUrl: imageUrl.value
        }, () => [
          __props.listType === "file" || __props.item.thumbnail === false || !imageUrl.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
            createVNode(unref(ElIcon), { class: "ele-upload-thumbnail-icon" }, {
              default: withCtx(() => [
                createVNode(unref(FileOutlined))
              ]),
              _: 1
            }),
            createElementVNode("div", _hoisted_3, toDisplayString(__props.item.name || __props.item.url), 1)
          ])) : (openBlock(), createBlock(unref(ElImage), mergeProps({
            key: 1,
            fit: "contain",
            class: "ele-upload-image"
          }, __props.imageProps || {}, { src: imageUrl.value }), null, 16, ["src"]))
        ]),
        renderSlot(_ctx.$slots, "itemExtra", { item: __props.item }),
        __props.item.status === "uploading" || __props.item.status === "exception" ? (openBlock(), createElementBlock("div", _hoisted_4, [
          renderSlot(_ctx.$slots, "progress", { item: __props.item }, () => [
            createElementVNode("div", _hoisted_5, toDisplayString(__props.item.status == "exception" ? __props.locale.exception : __props.locale.uploading), 1),
            createVNode(unref(ElProgress), mergeProps({
              showText: false,
              strokeWidth: __props.listType === "file" ? 2 : void 0,
              status: __props.item.status === "exception" ? "exception" : void 0,
              class: "ele-upload-progress-bar"
            }, __props.progressProps || {}, { percentage: uploadProgress.value }), null, 16, ["strokeWidth", "status", "percentage"]),
            !__props.disabled && __props.item.status === "exception" ? (openBlock(), createElementBlock("div", {
              key: 0,
              title: __props.locale.retry,
              class: "ele-upload-tool ele-upload-retry",
              onClick: withModifiers(handleRetry, ["stop"])
            }, [
              createVNode(unref(ElIcon), { class: "ele-upload-tool-icon" }, {
                default: withCtx(() => [
                  createVNode(unref(SyncOutlined))
                ]),
                _: 1
              }),
              createElementVNode("div", _hoisted_7, toDisplayString(__props.locale.retry), 1)
            ], 8, _hoisted_6)) : createCommentVNode("", true)
          ])
        ])) : __props.tools && !__props.readonly && !__props.disabled && !__props.item.readonly ? (openBlock(), createElementBlock("div", _hoisted_8, [
          createElementVNode("div", {
            title: __props.locale.preview,
            class: "ele-upload-tool",
            onClick: withModifiers(handlePreview, ["stop"])
          }, [
            createVNode(unref(ElIcon), { class: "ele-upload-tool-icon" }, {
              default: withCtx(() => [
                createVNode(unref(EyeOutlined))
              ]),
              _: 1
            }),
            createElementVNode("div", _hoisted_10, toDisplayString(__props.locale.preview), 1)
          ], 8, _hoisted_9),
          createElementVNode("div", {
            title: __props.locale.edit,
            class: "ele-upload-tool",
            onClick: withModifiers(handleEdit, ["stop"])
          }, [
            createVNode(unref(ElIcon), { class: "ele-upload-tool-icon" }, {
              default: withCtx(() => [
                createVNode(unref(EditOutlined))
              ]),
              _: 1
            }),
            createElementVNode("div", _hoisted_12, toDisplayString(__props.locale.edit), 1)
          ], 8, _hoisted_11)
        ])) : createCommentVNode("", true),
        !__props.readonly && !__props.disabled && !__props.item.readonly ? (openBlock(), createElementBlock("div", {
          key: 2,
          title: __props.locale.remove,
          class: "ele-upload-tool ele-upload-remove",
          onClick: withModifiers(handleRemove, ["stop"])
        }, [
          renderSlot(_ctx.$slots, "remove", { item: __props.item }, () => [
            createVNode(unref(ElIcon), { class: "ele-upload-tool-icon" }, {
              default: withCtx(() => [
                createVNode(unref(CloseOutlined))
              ]),
              _: 1
            })
          ])
        ], 8, _hoisted_13)) : createCommentVNode("", true),
        __props.sortable ? (openBlock(), createElementBlock("div", _hoisted_14)) : createCommentVNode("", true)
      ], 8, _hoisted_1);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, computed, watch, onBeforeUnmount, openBlock, createBlock, unref, mergeProps, withCtx, createElementBlock, normalizeStyle, createVNode, createElementVNode, renderSlot, createCommentVNode, createSlots, renderList, normalizeProps, guardReactiveProps } from "vue";
import VueDraggable from "vuedraggable";
import { ElUpload, ElIcon } from "element-plus";
import { uuid } from "../utils/common";
import { useLocale } from "../ele-config-provider/receiver";
import EleImageViewer from "../ele-image-viewer/index";
import { PlusOutlined } from "../icons/index";
import ListItem from "./components/list-item";
import { uploadListEmits, uploadListProps } from "./props";
const _hoisted_1 = { class: "ele-upload-hidden" };
const _hoisted_2 = ["accept"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleUploadList" },
  __name: "index",
  props: uploadListProps,
  emits: uploadListEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const ownSlots = ["default", "icon"];
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("upload", props);
    const previewVisible = ref(false);
    const previewImages = ref([]);
    const previewCurrentIndex = ref(0);
    const imageObjectUrls = ref([]);
    const uploadInputRef = ref(null);
    let editItem = null;
    const uploadEnable = computed(() => {
      return !props.readonly && !(typeof props.limit === "number" && props.limit > 0 && props.modelValue != null && props.modelValue.length >= props.limit);
    });
    const buildItem = (file) => {
      return {
        key: `ele${uuid(16, 10)}${String(Date.now())}`,
        name: file.name,
        status: void 0,
        progress: 0,
        file
      };
    };
    const getItemImageUrl = (item, file) => {
      if (item && item.url) {
        return item.url;
      }
      const itemFile = item?.file;
      if (itemFile != null && itemFile.type.startsWith("image")) {
        const t = imageObjectUrls.value.find((d) => d.file === itemFile);
        if (t != null) {
          return t.url;
        }
        const url = URL.createObjectURL(itemFile);
        imageObjectUrls.value.push({ file: itemFile, url });
        return url;
      }
    };
    const previewItem = (item) => {
      if (props.beforePreview && props.beforePreview(item) === false) {
        return;
      }
      if (props.modelValue != null) {
        const data = [];
        props.modelValue.forEach((d) => {
          const url = getItemImageUrl(d);
          if (url && d.thumbnail !== false) {
            data.push({ item: d, url });
          }
        });
        const index = data.findIndex((t) => t.item.key === item.key);
        if (index !== -1) {
          const urls = data.map((d) => d.url);
          openImagePreview(urls, index);
        }
      }
    };
    const openImagePreview = (urls, index) => {
      previewImages.value = urls;
      previewCurrentIndex.value = index;
      previewVisible.value = true;
    };
    const updateModelValue = (value) => {
      emit("update:modelValue", value);
    };
    const handleUpload = (file) => {
      if (uploadEnable.value && !props.disabled) {
        const item = buildItem(file);
        emit("upload", item);
      }
      return false;
    };
    const handleItemClick = (item) => {
      if (props.preview) {
        previewItem(item);
      }
      emit("itemClick", item);
    };
    const handleItemRemove = (item) => {
      emit("remove", item);
    };
    const handleItemEdit = (item) => {
      if (props.beforeItemEdit && props.beforeItemEdit(item) === false) {
        return;
      }
      const $input = uploadInputRef.value;
      if ($input != null) {
        editItem = item;
        $input.value = "";
        $input && $input.click();
      }
    };
    const handleItemPreview = (item) => {
      previewItem(item);
      emit("preview", item);
    };
    const handleItemRetry = (item) => {
      emit("retry", item);
    };
    const handleInputChange = (e) => {
      const file = e.target.files?.[0];
      if (file != null && editItem != null) {
        const result = { item: editItem, newItem: buildItem(file) };
        editItem = null;
        emit("editUpload", result);
      }
    };
    const handleUploadClick = (e) => {
      if (props.beforeUploadClick && props.beforeUploadClick(e) === false) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    const clearImageObjectUrls = () => {
      const temp = imageObjectUrls.value;
      imageObjectUrls.value = [];
      temp.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
    watch(
      () => props.modelValue,
      () => {
        if (props.modelValue == null) {
          clearImageObjectUrls();
          return;
        }
        const urls = [];
        props.modelValue.forEach((item) => {
          const url = getItemImageUrl(item);
          if (url) {
            urls.push(url);
          }
        });
        for (let i = imageObjectUrls.value.length - 1; i >= 0; i--) {
          const url = imageObjectUrls.value[i].url;
          if (!urls.includes(url)) {
            imageObjectUrls.value.splice(i, 1);
            URL.revokeObjectURL(url);
          }
        }
      },
      {
        immediate: true,
        deep: true
      }
    );
    onBeforeUnmount(() => {
      clearImageObjectUrls();
    });
    __expose({
      openImagePreview
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(VueDraggable), mergeProps({
        itemKey: "key",
        animation: 300,
        setData: () => void 0,
        handle: ".ele-upload-handle",
        class: ["ele-upload-list", [
          { "is-file-list": _ctx.listType === "file" },
          { "is-disabled": _ctx.disabled }
        ]]
      }, !_ctx.sortable || _ctx.sortable === true ? {} : _ctx.sortable, {
        modelValue: _ctx.modelValue || [],
        "onUpdate:modelValue": updateModelValue
      }), {
        item: withCtx(({ element }) => [
          createVNode(ListItem, {
            item: element,
            readonly: _ctx.readonly,
            disabled: _ctx.disabled,
            sortable: _ctx.sortable && !_ctx.readonly && !_ctx.disabled && _ctx.limit !== 1,
            imageProps: _ctx.imageProps,
            progressProps: _ctx.progressProps,
            imageObjectUrls: imageObjectUrls.value,
            tools: _ctx.tools,
            listType: _ctx.listType,
            locale: unref(lang),
            style: normalizeStyle(_ctx.itemStyle),
            onItemClick: handleItemClick,
            onRemove: handleItemRemove,
            onEdit: handleItemEdit,
            onPreview: handleItemPreview,
            onRetry: handleItemRetry
          }, createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter(
              (k) => !ownSlots.includes(k)
            ), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            })
          ]), 1032, ["item", "readonly", "disabled", "sortable", "imageProps", "progressProps", "imageObjectUrls", "tools", "listType", "locale", "style"])
        ]),
        footer: withCtx(() => [
          uploadEnable.value && _ctx.buttonStyle !== false ? (openBlock(), createElementBlock("div", {
            key: 0,
            style: normalizeStyle(typeof _ctx.buttonStyle === "boolean" ? void 0 : _ctx.buttonStyle),
            class: "ele-upload-item ele-upload-button"
          }, [
            createVNode(unref(ElUpload), {
              action: "",
              drag: _ctx.drag,
              accept: _ctx.accept,
              multiple: _ctx.multiple,
              disabled: _ctx.disabled,
              showFileList: false,
              beforeUpload: handleUpload
            }, {
              default: withCtx(() => [
                createElementVNode("div", {
                  class: "ele-upload-button-inner",
                  onClick: handleUploadClick
                }, [
                  renderSlot(_ctx.$slots, "icon", {}, () => [
                    createVNode(unref(ElIcon), { class: "ele-upload-icon" }, {
                      default: withCtx(() => [
                        createVNode(unref(PlusOutlined))
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              _: 3
            }, 8, ["drag", "accept", "multiple", "disabled"])
          ], 4)) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_1, [
            _ctx.tools && !_ctx.readonly ? (openBlock(), createElementBlock("input", {
              key: 0,
              ref_key: "uploadInputRef",
              ref: uploadInputRef,
              type: "file",
              accept: _ctx.accept,
              class: "ele-upload-input",
              onChange: handleInputChange
            }, null, 40, _hoisted_2)) : createCommentVNode("", true),
            createVNode(EleImageViewer, mergeProps({ infinite: false }, _ctx.previewProps || {}, {
              modelValue: previewVisible.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => previewVisible.value = $event),
              urlList: previewImages.value,
              initialIndex: previewCurrentIndex.value
            }), null, 16, ["modelValue", "urlList", "initialIndex"])
          ]),
          renderSlot(_ctx.$slots, "extra")
        ]),
        _: 3
      }, 16, ["class", "modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

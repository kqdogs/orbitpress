import { defineComponent, ref, computed, openBlock, createElementBlock, createElementVNode, Fragment, renderList, unref, createBlock, normalizeClass, withCtx, resolveDynamicComponent, normalizeStyle, createVNode, createTextVNode, createCommentVNode, renderSlot } from "vue";
import { ElIcon, ElButton } from "element-plus";
import { RollbackOutlined, RecoverOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined, CodeOutlined } from "../../icons/index";
import { screenItems } from "../../ele-pro-form-builder/util";
import { defaultHeaderRightTools } from "../util";
import ImportModal from "./import-modal";
import CodePreview from "./code-preview";
const _hoisted_1 = { class: "ele-crud-builder-header" };
const _hoisted_2 = { class: "ele-crud-builder-screen-radio" };
const _hoisted_3 = { class: "ele-crud-builder-header-left" };
const _hoisted_4 = { class: "ele-crud-builder-header-tools" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "BodyHeader" },
  __name: "body-header",
  props: {
    currentScreen: {},
    undoDisabled: { type: Boolean },
    redoDisabled: { type: Boolean },
    config: {},
    headerTools: { type: [Boolean, Array] },
    proFormComponent: {},
    jsonEditerComponent: {},
    codeViewerComponent: {},
    itemTypeData: {},
    httpRequest: {}
  },
  emits: ["update:currentScreen", "undo", "redo", "clear", "importData"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const importVisible = ref(false);
    const isImport = ref(false);
    const codeVisible = ref(false);
    const headerRightToolNames = computed(() => {
      if (typeof props.headerTools === "undefined" || props.headerTools === true) {
        return defaultHeaderRightTools;
      }
      if (!props.headerTools) {
        return [];
      }
      return props.headerTools;
    });
    const handleUpdateScreen = (size) => {
      emit("update:currentScreen", size);
    };
    const handleUndo = () => {
      if (!props.undoDisabled) {
        emit("undo");
      }
    };
    const handleRedo = () => {
      if (!props.redoDisabled) {
        emit("redo");
      }
    };
    const handleClear = () => {
      emit("clear");
    };
    const handleOpenImport = () => {
      importVisible.value = true;
      isImport.value = true;
    };
    const handleOpenExport = () => {
      importVisible.value = true;
      isImport.value = false;
    };
    const handleImportData = (data) => {
      emit("importData", data);
    };
    const handleOpenCode = () => {
      codeVisible.value = true;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(screenItems), (item) => {
            return openBlock(), createBlock(unref(ElIcon), {
              key: item.value,
              class: normalizeClass(["ele-crud-builder-header-tool ele-crud-builder-screen-icon", { "is-active": item.value === __props.currentScreen }]),
              onClick: ($event) => handleUpdateScreen(item.value)
            }, {
              default: withCtx(() => [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                  style: normalizeStyle(item.iconStyle)
                }, null, 8, ["style"]))
              ]),
              _: 2
            }, 1032, ["class", "onClick"]);
          }), 128))
        ]),
        createElementVNode("div", _hoisted_3, [
          createVNode(unref(ElIcon), {
            class: normalizeClass(["ele-crud-builder-header-tool ele-crud-builder-header-tool-undo", { "is-disabled": __props.undoDisabled }]),
            title: "撤销",
            onClick: handleUndo
          }, {
            default: withCtx(() => [
              createVNode(unref(RollbackOutlined))
            ]),
            _: 1
          }, 8, ["class"]),
          createVNode(unref(ElIcon), {
            class: normalizeClass(["ele-crud-builder-header-tool ele-crud-builder-header-tool-redo", { "is-disabled": __props.redoDisabled }]),
            title: "恢复",
            onClick: handleRedo
          }, {
            default: withCtx(() => [
              createVNode(unref(RecoverOutlined))
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        createElementVNode("div", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(headerRightToolNames.value, (toolName) => {
            return openBlock(), createElementBlock(Fragment, { key: toolName }, [
              toolName === "import" ? (openBlock(), createBlock(unref(ElButton), {
                key: 0,
                text: true,
                icon: unref(UploadOutlined),
                onClick: handleOpenImport
              }, {
                default: withCtx(() => [..._cache[2] || (_cache[2] = [
                  createTextVNode(" 导入 ", -1)
                ])]),
                _: 1
              }, 8, ["icon"])) : toolName === "export" ? (openBlock(), createBlock(unref(ElButton), {
                key: 1,
                text: true,
                icon: unref(DownloadOutlined),
                onClick: handleOpenExport
              }, {
                default: withCtx(() => [..._cache[3] || (_cache[3] = [
                  createTextVNode(" 导出 ", -1)
                ])]),
                _: 1
              }, 8, ["icon"])) : toolName === "clear" ? (openBlock(), createBlock(unref(ElButton), {
                key: 2,
                text: true,
                type: "danger",
                icon: unref(DeleteOutlined),
                onClick: handleClear
              }, {
                default: withCtx(() => [..._cache[4] || (_cache[4] = [
                  createTextVNode(" 清空 ", -1)
                ])]),
                _: 1
              }, 8, ["icon"])) : toolName === "code" ? (openBlock(), createBlock(unref(ElButton), {
                key: 3,
                text: true,
                type: "primary",
                icon: unref(CodeOutlined),
                onClick: handleOpenCode
              }, {
                default: withCtx(() => [..._cache[5] || (_cache[5] = [
                  createTextVNode(" 生成代码 ", -1)
                ])]),
                _: 1
              }, 8, ["icon"])) : createCommentVNode("", true)
            ], 64);
          }), 128)),
          renderSlot(_ctx.$slots, "headerTools")
        ]),
        headerRightToolNames.value && (headerRightToolNames.value.includes("import") || headerRightToolNames.value.includes("export")) ? (openBlock(), createBlock(ImportModal, {
          key: 0,
          modelValue: importVisible.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => importVisible.value = $event),
          config: __props.config,
          isImport: isImport.value,
          jsonEditerComponent: __props.jsonEditerComponent,
          onImportData: handleImportData
        }, null, 8, ["modelValue", "config", "isImport", "jsonEditerComponent"])) : createCommentVNode("", true),
        headerRightToolNames.value && headerRightToolNames.value.includes("code") ? (openBlock(), createBlock(CodePreview, {
          key: 1,
          modelValue: codeVisible.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => codeVisible.value = $event),
          config: __props.config,
          codeViewerComponent: __props.codeViewerComponent
        }, null, 8, ["modelValue", "config", "codeViewerComponent"])) : createCommentVNode("", true)
      ]);
    };
  }
});
export {
  _sfc_main as default
};

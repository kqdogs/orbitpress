import { defineComponent, ref, watch, openBlock, createBlock, withCtx, createElementVNode, createVNode, unref, normalizeClass, resolveDynamicComponent } from "vue";
import { ElIcon } from "element-plus";
import { CheckOutlined, CopyOutlined, DownloadOutlined } from "../../icons/index";
import { copyText, download } from "../../utils/common";
import { useTimer } from "../../utils/hook";
import EleModal from "../../ele-modal/index";
import EleTabBar from "../../ele-tab-bar/index";
import CodeViewer from "../../ele-pro-form-builder/components/code-viewer";
import { generateProCode, generateElCode } from "./code-generator";
const _hoisted_1 = { class: "ele-crud-builder-code-view" };
const _hoisted_2 = { class: "ele-crud-builder-code-body" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CodePreview" },
  __name: "code-preview",
  props: {
    modelValue: { type: Boolean },
    config: {},
    codeViewerComponent: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const [setCopied, resetCopied, copied] = useTimer(1e3);
    const tabItems = [
      { value: "pro", label: "ProCrud" }
      /* ,
      { value: 'el', label: '' } */
    ];
    const tabActive = ref("pro");
    const codeContent = ref("");
    const generateData = ["", ""];
    const handleUpdateModelValue = (visible) => {
      emit("update:modelValue", visible);
    };
    const setCodeContent = () => {
      codeContent.value = generateData[tabActive.value === "el" ? 1 : 0];
    };
    const handleCopy = () => {
      copyText(codeContent.value).then(() => {
        setCopied();
      }).catch((error) => {
        console.error(error);
        resetCopied();
      });
    };
    const handleDownload = () => {
      download(codeContent.value, "index.vue", "text/plain;charset=utf-8");
    };
    watch(
      () => props.modelValue,
      (visible) => {
        if (visible) {
          const proCode = generateProCode(props.config);
          const elCode = generateElCode(props.config);
          generateData[0] = proCode;
          generateData[1] = elCode;
          setCodeContent();
        }
      }
    );
    watch(tabActive, () => {
      setCodeContent();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(EleModal, {
        width: 980,
        maxable: true,
        position: "center",
        title: "生成代码",
        modelValue: __props.modelValue,
        closeOnClickModal: false,
        destroyOnClose: true,
        class: "ele-crud-builder-code-preview",
        "onUpdate:modelValue": handleUpdateModelValue
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            createVNode(EleTabBar, {
              modelValue: tabActive.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => tabActive.value = $event),
              items: tabItems
            }, {
              extra: withCtx(() => [
                createVNode(unref(ElIcon), {
                  class: normalizeClass(["ele-crud-builder-code-icon-tool", { "is-copied": unref(copied) }]),
                  title: "复制",
                  onClick: handleCopy
                }, {
                  default: withCtx(() => [
                    unref(copied) ? (openBlock(), createBlock(unref(CheckOutlined), { key: 0 })) : (openBlock(), createBlock(unref(CopyOutlined), { key: 1 }))
                  ]),
                  _: 1
                }, 8, ["class"]),
                createVNode(unref(ElIcon), {
                  class: "ele-crud-builder-code-icon-tool",
                  title: "下载",
                  onClick: handleDownload
                }, {
                  default: withCtx(() => [
                    createVNode(unref(DownloadOutlined))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["modelValue"]),
            createElementVNode("div", _hoisted_2, [
              (openBlock(), createBlock(resolveDynamicComponent(__props.codeViewerComponent || CodeViewer), { code: codeContent.value }, null, 8, ["code"]))
            ])
          ])
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

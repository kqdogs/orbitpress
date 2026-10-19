import { defineComponent, ref, openBlock, createElementBlock, Fragment, createVNode, unref, withCtx, createTextVNode, toDisplayString, createElementVNode, createBlock, resolveDynamicComponent } from "vue";
import { ElButton } from "element-plus";
import EleModal from "../../ele-modal/index";
import CodeEditer from "./code-editer";
const _hoisted_1 = { class: "ele-pro-form-builder-code-edit-wrapper" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "HtmlEdit" },
  __name: "html-edit",
  props: {
    modelValue: {},
    title: {},
    htmlEditerComponent: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(false);
    const htmlContent = ref("");
    const openModal = () => {
      htmlContent.value = props.modelValue ?? "";
      visible.value = true;
    };
    const handleCancel = () => {
      visible.value = false;
      htmlContent.value = "";
    };
    const handleSave = () => {
      const result = htmlContent.value;
      handleCancel();
      emit("update:modelValue", result === "" ? void 0 : result);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(unref(ElButton), {
          size: "small",
          class: "ele-pro-form-builder-props-fluid-btn",
          onClick: openModal
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(__props.title), 1)
          ]),
          _: 1
        }),
        createVNode(EleModal, {
          width: 800,
          maxable: true,
          position: "center",
          title: __props.title,
          modelValue: visible.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => visible.value = $event),
          closeOnClickModal: false,
          destroyOnClose: true,
          bodyStyle: {
            height: "520px",
            minHeight: "100%",
            maxHeight: "100%",
            padding: "8px 16px"
          }
        }, {
          footer: withCtx(() => [
            createVNode(unref(ElButton), {
              size: "default",
              onClick: handleCancel
            }, {
              default: withCtx(() => [..._cache[2] || (_cache[2] = [
                createTextVNode("取消", -1)
              ])]),
              _: 1
            }),
            createVNode(unref(ElButton), {
              type: "primary",
              size: "default",
              onClick: handleSave
            }, {
              default: withCtx(() => [..._cache[3] || (_cache[3] = [
                createTextVNode(" 保存 ", -1)
              ])]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            createElementVNode("div", _hoisted_1, [
              (openBlock(), createBlock(resolveDynamicComponent(__props.htmlEditerComponent || CodeEditer), {
                modelValue: htmlContent.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => htmlContent.value = $event)
              }, null, 8, ["modelValue"]))
            ])
          ]),
          _: 1
        }, 8, ["title", "modelValue"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

import { defineComponent, ref, openBlock, createElementBlock, Fragment, createVNode, unref, withCtx, createTextVNode, toDisplayString, createElementVNode, createBlock, resolveDynamicComponent } from "vue";
import { ElButton } from "element-plus";
import { CodeOutlined } from "../../icons/index";
import { omit } from "../../utils/common";
import EleModal from "../../ele-modal/index";
import CodeEditer from "./code-editer";
const _hoisted_1 = { class: "ele-pro-form-builder-code-edit-wrapper" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SourceEdit" },
  __name: "source-edit",
  props: {
    modelValue: {},
    title: {},
    excludeFields: {},
    jsonEditerComponent: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(false);
    const jsonContent = ref("");
    const openModal = () => {
      jsonContent.value = JSON.stringify(
        omit(props.modelValue || {}, props.excludeFields || ["key", "children"]),
        void 0,
        2
      );
      visible.value = true;
    };
    const handleCancel = () => {
      visible.value = false;
      jsonContent.value = "";
    };
    const handleSave = () => {
      if (jsonContent.value) {
        let result;
        try {
          result = JSON.parse(jsonContent.value);
        } catch (e) {
          console.error(e);
        }
        if (result) {
          handleCancel();
          emit("update:modelValue", result);
        }
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(unref(ElButton), {
          size: "small",
          icon: unref(CodeOutlined),
          class: "ele-pro-form-builder-props-fluid-btn",
          onClick: openModal
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(__props.title), 1)
          ]),
          _: 1
        }, 8, ["icon"]),
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
              (openBlock(), createBlock(resolveDynamicComponent(__props.jsonEditerComponent || CodeEditer), {
                modelValue: jsonContent.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => jsonContent.value = $event)
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

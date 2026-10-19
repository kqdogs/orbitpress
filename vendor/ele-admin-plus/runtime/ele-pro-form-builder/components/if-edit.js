import { defineComponent, ref, openBlock, createElementBlock, Fragment, createVNode, unref, withCtx, createTextVNode, toDisplayString, createElementVNode, createBlock, resolveDynamicComponent, withModifiers, createCommentVNode } from "vue";
import { ElButton, ElIcon } from "element-plus";
import { QuestionCircleOutlined } from "../../icons/index";
import EleModal from "../../ele-modal/index";
import CodeEditer from "./code-editer";
const _hoisted_1 = { class: "ele-pro-form-builder-code-edit-header" };
const _hoisted_2 = { class: "ele-pro-form-builder-code-edit-tip" };
const _hoisted_3 = { class: "ele-pro-form-builder-code-edit-wrapper" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IfEdit" },
  __name: "if-edit",
  props: {
    modelValue: {},
    title: {},
    codeTips: {},
    codeEditerComponent: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(false);
    const codeContent = ref("");
    const openModal = () => {
      codeContent.value = props.modelValue ?? "";
      visible.value = true;
    };
    const handleCancel = () => {
      visible.value = false;
      codeContent.value = "";
    };
    const handleSave = () => {
      const result = codeContent.value;
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
          modelValue: visible.value,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => visible.value = $event),
          closeOnClickModal: false,
          destroyOnClose: true,
          bodyStyle: {
            height: "520px",
            minHeight: "100%",
            maxHeight: "100%",
            padding: "8px 16px"
          }
        }, {
          header: withCtx(() => [
            createElementVNode("div", _hoisted_1, [
              createElementVNode("div", null, toDisplayString(__props.title), 1),
              __props.codeTips ? (openBlock(), createBlock(unref(ElIcon), {
                key: 0,
                class: "ele-pro-form-builder-code-edit-icon",
                onMousedown: _cache[0] || (_cache[0] = withModifiers(() => {
                }, ["stop"])),
                onTouchstartPassive: _cache[1] || (_cache[1] = withModifiers(() => {
                }, ["stop"]))
              }, {
                default: withCtx(() => [
                  createVNode(unref(QuestionCircleOutlined)),
                  createElementVNode("div", _hoisted_2, toDisplayString(__props.codeTips), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ])
          ]),
          footer: withCtx(() => [
            createVNode(unref(ElButton), {
              size: "default",
              onClick: handleCancel
            }, {
              default: withCtx(() => [..._cache[4] || (_cache[4] = [
                createTextVNode("取消", -1)
              ])]),
              _: 1
            }),
            createVNode(unref(ElButton), {
              type: "primary",
              size: "default",
              onClick: handleSave
            }, {
              default: withCtx(() => [..._cache[5] || (_cache[5] = [
                createTextVNode(" 保存 ", -1)
              ])]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            createElementVNode("div", _hoisted_3, [
              (openBlock(), createBlock(resolveDynamicComponent(__props.codeEditerComponent || CodeEditer), {
                modelValue: codeContent.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => codeContent.value = $event)
              }, null, 8, ["modelValue"]))
            ])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

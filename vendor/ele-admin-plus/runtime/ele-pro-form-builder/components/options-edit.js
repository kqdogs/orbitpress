import { defineComponent, ref, computed, openBlock, createElementBlock, Fragment, createVNode, unref, withCtx, createTextVNode, toDisplayString, createBlock, createElementVNode, createCommentVNode } from "vue";
import { ElButton, ElIcon } from "element-plus";
import { QuestionCircleOutlined } from "../../icons/index";
import { codeStringPrefix } from "../../ele-pro-form/components/render-core";
import EleModal from "../../ele-modal/index";
import EleTabBar from "../../ele-tab-bar/index";
import OptionsTable from "./options-table";
import OptionsCode from "./options-code";
const _hoisted_1 = { class: "ele-pro-form-builder-code-edit-tip" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "OptionsEdit" },
  __name: "options-edit",
  props: {
    modelValue: {},
    title: {},
    isTreeData: { type: [Boolean, Object] },
    columns: {},
    codeOptions: { type: Boolean },
    codeTips: {},
    codePlaceholder: {},
    codePrefix: {},
    codeEditerComponent: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(false);
    const optionsType = ref("optionsTable");
    const editerRef = ref(null);
    const codePrefixStr = computed(() => {
      return props.codePrefix ?? codeStringPrefix;
    });
    const openModal = () => {
      if (props.modelValue != null && typeof props.modelValue === "string" && props.modelValue.startsWith(codePrefixStr.value)) {
        optionsType.value = "optionsCode";
      } else {
        optionsType.value = "optionsTable";
      }
      visible.value = true;
    };
    const handleCancel = () => {
      visible.value = false;
    };
    const handleSave = () => {
      const result = editerRef.value?.getResult?.();
      emit("update:modelValue", result ?? []);
      visible.value = false;
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
          width: 960,
          maxable: true,
          position: "center",
          title: __props.title,
          modelValue: visible.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => visible.value = $event),
          closeOnClickModal: false,
          destroyOnClose: true,
          bodyStyle: {
            height: "568px",
            minHeight: "100%",
            maxHeight: "100%",
            padding: "0 16px 8px 16px",
            display: "flex",
            flexDirection: "column"
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
            __props.codeOptions ? (openBlock(), createBlock(EleTabBar, {
              key: 0,
              modelValue: optionsType.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => optionsType.value = $event),
              items: [
                { value: "optionsTable", label: "静态数据" },
                { value: "optionsCode", label: "远程数据" }
              ],
              type: "plain",
              class: "ele-pro-form-builder-options-tabs"
            }, {
              label: withCtx(({ label, item }) => [
                createElementVNode("span", null, toDisplayString(label), 1),
                optionsType.value === "optionsCode" && item.value === "optionsCode" && __props.codeTips ? (openBlock(), createBlock(unref(ElIcon), {
                  key: 0,
                  class: "ele-pro-form-builder-code-edit-icon"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(QuestionCircleOutlined)),
                    createElementVNode("div", _hoisted_1, toDisplayString(__props.codeTips), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ]),
              _: 1
            }, 8, ["modelValue"])) : createCommentVNode("", true),
            !__props.codeOptions || optionsType.value === "optionsTable" ? (openBlock(), createBlock(OptionsTable, {
              key: 1,
              ref_key: "editerRef",
              ref: editerRef,
              data: __props.modelValue,
              isTreeData: __props.isTreeData,
              columns: __props.columns
            }, null, 8, ["data", "isTreeData", "columns"])) : __props.codeOptions ? (openBlock(), createBlock(OptionsCode, {
              key: 2,
              ref_key: "editerRef",
              ref: editerRef,
              data: __props.modelValue,
              codePlaceholder: __props.codePlaceholder,
              codePrefix: codePrefixStr.value,
              codeEditerComponent: __props.codeEditerComponent
            }, null, 8, ["data", "codePlaceholder", "codePrefix", "codeEditerComponent"])) : createCommentVNode("", true)
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

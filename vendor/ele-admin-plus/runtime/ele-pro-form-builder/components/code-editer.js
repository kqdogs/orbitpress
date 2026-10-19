import { defineComponent, openBlock, createBlock, unref } from "vue";
import { ElInput } from "element-plus";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CodeEditer" },
  __name: "code-editer",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const updateModelValue = (value) => {
      emit("update:modelValue", value);
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElInput), {
        size: "default",
        type: "textarea",
        modelValue: __props.modelValue,
        "onUpdate:modelValue": updateModelValue,
        class: "ele-pro-form-builder-code-editer"
      }, null, 8, ["modelValue"]);
    };
  }
});
export {
  _sfc_main as default
};

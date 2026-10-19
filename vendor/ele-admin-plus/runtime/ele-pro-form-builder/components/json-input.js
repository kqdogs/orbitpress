import { defineComponent, ref, watch, openBlock, createBlock, unref } from "vue";
import { ElInput } from "element-plus";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "JsonInput" },
  __name: "json-input",
  props: {
    modelValue: { type: [String, Boolean, Number, Object, Array] },
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inputValue = ref("");
    const stringifyJSON = (data) => {
      if (data == null) {
        return "";
      }
      return JSON.stringify(data, void 0, 2);
    };
    const updateModelValue = (json) => {
      if (stringifyJSON(props.modelValue) !== json) {
        try {
          const isEmpty = json == null || json === "" || json.trim() === "";
          const value = isEmpty ? void 0 : JSON.parse(json);
          emit("update:modelValue", value);
        } catch (e) {
          console.error(e);
        }
      }
    };
    const handleInputChange = (value) => {
      if (value != null) {
        updateModelValue(value);
      }
    };
    watch(
      () => props.modelValue,
      (value) => {
        const json = stringifyJSON(value);
        if (inputValue.value !== json) {
          inputValue.value = json;
        }
      },
      {
        deep: true,
        immediate: true
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElInput), {
        rows: 4,
        size: "small",
        type: "textarea",
        modelValue: inputValue.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => inputValue.value = $event),
        placeholder: __props.placeholder,
        onChange: handleInputChange
      }, null, 8, ["modelValue", "placeholder"]);
    };
  }
});
export {
  _sfc_main as default
};

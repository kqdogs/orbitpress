import { defineComponent, ref, onMounted, openBlock, createElementBlock, createBlock, resolveDynamicComponent } from "vue";
import CodeEditer from "./code-editer";
const _hoisted_1 = { class: "ele-pro-form-builder-code-edit-wrapper" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "OptionsCode" },
  __name: "options-code",
  props: {
    data: {},
    codePlaceholder: {},
    codePrefix: {},
    codeEditerComponent: {}
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const codeContent = ref("");
    const getResult = () => {
      const code = codeContent.value;
      if (code == null || !code) {
        return;
      }
      return `${props.codePrefix}${code}`;
    };
    onMounted(() => {
      if (props.data == null || typeof props.data !== "string") {
        codeContent.value = props.codePlaceholder ?? "";
        return;
      }
      const data = props.data.trim();
      const codePrefix = props.codePrefix;
      if (data.startsWith(codePrefix)) {
        codeContent.value = data.slice(codePrefix.length);
        return;
      }
      codeContent.value = (data || props.codePlaceholder) ?? "";
    });
    __expose({
      getResult
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(), createBlock(resolveDynamicComponent(__props.codeEditerComponent || CodeEditer), {
          modelValue: codeContent.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => codeContent.value = $event)
        }, null, 8, ["modelValue"]))
      ]);
    };
  }
});
export {
  _sfc_main as default
};

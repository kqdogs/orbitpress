import { defineComponent, ref, watch, openBlock, createElementBlock, Fragment, createElementVNode, renderList, toDisplayString } from "vue";
const _hoisted_1 = { class: "ele-pro-form-builder-code-line-numbers" };
const _hoisted_2 = { class: "ele-pro-form-builder-code-pre" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CodeViewer" },
  __name: "code-viewer",
  props: {
    code: {}
  },
  setup(__props) {
    const props = __props;
    const codeLines = ref(1);
    watch(
      () => props.code,
      (code) => {
        codeLines.value = code ? code.split("\n").length : 1;
      },
      { immediate: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(codeLines.value, (n) => {
            return openBlock(), createElementBlock("div", { key: n }, toDisplayString(n), 1);
          }), 128))
        ]),
        createElementVNode("pre", _hoisted_2, toDisplayString(__props.code), 1)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};

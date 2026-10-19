import { defineComponent, openBlock, createElementBlock, createBlock, unref, Fragment, renderList, createElementVNode, toDisplayString, resolveDynamicComponent, createCommentVNode } from "vue";
import { ElEmpty } from "element-plus";
import { deepCloneObject } from "../../ele-pro-form-builder/components/build-core";
import { itemsGenerateNewKey } from "../util";
const _hoisted_1 = { class: "ele-crud-builder-template-wrapper" };
const _hoisted_2 = ["onClick"];
const _hoisted_3 = { class: "ele-crud-builder-template-item-label" };
const _hoisted_4 = { class: "ele-crud-builder-template-item-body" };
const _hoisted_5 = { class: "ele-crud-builder-template-item-cover" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "TemplateList" },
  __name: "template-list",
  props: {
    templateData: {}
  },
  emits: ["importData"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleImportTemplate = (item) => {
      const result = deepCloneObject(item.config);
      itemsGenerateNewKey(result.fields, [], false);
      emit("importData", result);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        !__props.templateData || !__props.templateData.length ? (openBlock(), createBlock(unref(ElEmpty), {
          key: 0,
          imageSize: 58,
          class: "ele-crud-builder-form-empty"
        })) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(__props.templateData, (item) => {
          return openBlock(), createElementBlock("div", {
            key: item.name,
            class: "ele-crud-builder-template-item",
            onClick: ($event) => handleImportTemplate(item)
          }, [
            createElementVNode("div", _hoisted_3, toDisplayString(item.name), 1),
            createElementVNode("div", _hoisted_4, [
              createElementVNode("div", _hoisted_5, [
                item.cover ? (openBlock(), createBlock(resolveDynamicComponent(item.cover), { key: 0 })) : createCommentVNode("", true)
              ])
            ])
          ], 8, _hoisted_2);
        }), 128))
      ]);
    };
  }
});
export {
  _sfc_main as default
};

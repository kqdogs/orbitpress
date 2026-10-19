import { defineComponent, useModel, ref, computed, watch, onBeforeUnmount, openBlock, createBlock, unref, normalizeClass, withCtx, renderSlot, createVNode, createSlots, renderList, normalizeProps, guardReactiveProps, nextTick } from "vue";
import { ElForm } from "element-plus";
import { useLocale } from "../ele-config-provider/receiver";
import { eachTree } from "../utils/common";
import { useContentSlot } from "../ele-viewer/util";
import { translateJsCode } from "./components/render-core";
import { ChildrenRender } from "./components/render-util";
import ProFormFooter from "./components/pro-form-footer";
import { proFormEmits, proFormProps } from "./props";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleProForm" },
  __name: "index",
  props: proFormProps,
  emits: proFormEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const footerSlotExcludes = [
      "default",
      "topExtra",
      "bottomExtra",
      "contentExtra"
    ];
    const slotExcludes = [...footerSlotExcludes, "footer", "footerExtra"];
    const props = __props;
    const emit = __emit;
    const formItems = useModel(props, "items");
    const { lang } = useLocale("proForm", props);
    const { slotProps: config } = useContentSlot();
    const formRef = ref(null);
    const exposeMethods = {};
    [
      "validate",
      "validateField",
      "resetFields",
      "scrollToField",
      "clearValidate"
    ].forEach((key) => {
      exposeMethods[key] = (...params) => {
        if (!formRef.value) {
          throw new Error("formRef is null");
        }
        return formRef.value[key](...params);
      };
    });
    const childrenRef = ref(null);
    const formSearchExpand = ref(!!props.searchExpand);
    const currentActiveKey = ref(props.activeItemKey);
    const footerStyleData = computed(() => {
      return translateJsCode(
        props.footerStyle || {},
        props.model || {},
        formItems.value || [],
        formSearchExpand.value,
        props.httpRequest
      ).result;
    });
    const updateSearchExpand = (expand) => {
      formSearchExpand.value = expand;
      if (props.searchExpand !== expand) {
        emit("update:searchExpand", expand);
      }
    };
    const updateValue = (prop, value) => {
      if (prop != null && config?.label && config?.size === 1) {
        emit("updateValue", prop, value);
      }
    };
    const handleUpdateItemsData = (items, parentItem) => {
      if (!parentItem) {
        formItems.value = items;
      } else {
        const parentItemKey = parentItem.key;
        eachTree(formItems.value, (item) => {
          if (item.key === parentItemKey) {
            item.children = items;
            return false;
          }
        });
      }
    };
    const handleUpdateActiveItemKey = (key) => {
      currentActiveKey.value = key;
      if (props.activeItemKey !== key) {
        emit("update:activeItemKey", key);
      }
    };
    const handleSubmit = () => {
      if (formRef.value) {
        formRef.value.validate((valid) => {
          if (valid) {
            emit("submit", props.model ?? {});
          }
        });
      }
    };
    const handleReset = () => {
      clearCodeCache();
      emit("reset");
      exposeMethods.clearValidate();
      nextTick(() => {
        exposeMethods.clearValidate();
        nextTick(() => {
          exposeMethods.clearValidate();
        });
      });
    };
    const handleFormSubmit = (e) => {
      if (props.preventFormSubmit) {
        e.preventDefault();
      }
    };
    const handleFormValidate = (prop, isValid, message) => {
      emit("validate", prop, isValid, message);
    };
    watch(
      () => props.searchExpand,
      (expand) => {
        if (formSearchExpand.value !== expand) {
          formSearchExpand.value = expand;
        }
      }
    );
    watch(
      () => props.activeItemKey,
      (key) => {
        if (currentActiveKey.value !== key) {
          currentActiveKey.value = key;
        }
      }
    );
    const getProFormRefs = () => {
      return childrenRef.value?.$refs || {};
    };
    const codeCache = /* @__PURE__ */ new Map();
    const getAndCacheCode = (code, codeResult) => {
      const cacheResult = codeCache.get(code);
      if (cacheResult) {
        return cacheResult;
      }
      codeCache.set(code, codeResult);
      return codeResult;
    };
    const clearCodeCache = () => {
      codeCache.clear();
    };
    onBeforeUnmount(() => {
      clearCodeCache();
    });
    __expose({
      ...exposeMethods,
      formRef,
      childrenRef,
      getProFormRefs,
      clearCodeCache
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(ElForm), {
        ref_key: "formRef",
        ref: formRef,
        model: _ctx.model,
        labelPosition: _ctx.labelPosition,
        labelWidth: _ctx.labelWidth,
        statusIcon: _ctx.statusIcon,
        validateOnRuleChange: _ctx.validateOnRuleChange,
        size: _ctx.size,
        disabled: _ctx.disabled,
        scrollToError: _ctx.scrollToError,
        scrollIntoViewOptions: _ctx.scrollIntoViewOptions,
        inline: _ctx.inline,
        labelSuffix: _ctx.labelSuffix,
        hideRequiredAsterisk: _ctx.hideRequiredAsterisk,
        requireAsteriskPosition: _ctx.requireAsteriskPosition,
        showMessage: _ctx.showMessage,
        inlineMessage: _ctx.inlineMessage,
        class: normalizeClass(["ele-pro-form", { "is-editable": _ctx.editable }]),
        onValidate: handleFormValidate,
        onSubmit: handleFormSubmit
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "topExtra"),
          createVNode(unref(ChildrenRender), {
            ref_key: "childrenRef",
            ref: childrenRef,
            model: _ctx.model,
            items: unref(formItems),
            rules: _ctx.rules,
            grid: _ctx.grid,
            rowProps: _ctx.rowProps,
            contentExtraColProps: _ctx.footerColProps,
            autoContentExtraCol: _ctx.autoFooterCol,
            formItems: unref(formItems),
            searchExpand: formSearchExpand.value,
            editable: _ctx.editable,
            screenSize: _ctx.screenSize,
            activeItemKey: currentActiveKey.value,
            itemTypeData: _ctx.itemTypeData,
            httpRequest: _ctx.httpRequest,
            getProFormRefs,
            getAndCacheCode,
            requiredLang: unref(lang).required,
            onUpdateItemValue: updateValue,
            onUpdateItemsData: handleUpdateItemsData,
            "onUpdate:activeItemKey": handleUpdateActiveItemKey
          }, createSlots({ _: 2 }, [
            renderList(Object.keys(_ctx.$slots).filter(
              (k) => !slotExcludes.includes(k)
            ), (name) => {
              return {
                name,
                fn: withCtx((slotProps) => [
                  renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                ])
              };
            }),
            _ctx.footer ? {
              name: "contentExtra",
              fn: withCtx(() => [
                createVNode(ProFormFooter, {
                  footerProps: _ctx.footerProps,
                  footerSlots: _ctx.footerSlots,
                  autoFooterCol: _ctx.autoFooterCol,
                  footerStyle: footerStyleData.value,
                  submitText: _ctx.submitText ?? unref(lang).submit,
                  resetText: _ctx.resetText ?? unref(lang).reset,
                  submitButtonProps: _ctx.submitButtonProps,
                  resetButtonProps: _ctx.resetButtonProps,
                  showSearchExpand: _ctx.showSearchExpand,
                  searchExpand: formSearchExpand.value,
                  searchExpandButtonProps: _ctx.searchExpandButtonProps,
                  searchExpandText: _ctx.searchExpandText ?? unref(lang).expand,
                  searchShrinkText: _ctx.searchShrinkText ?? unref(lang).shrink,
                  onSubmit: handleSubmit,
                  onReset: handleReset,
                  onUpdateSearchExpand: updateSearchExpand
                }, createSlots({ _: 2 }, [
                  renderList(Object.keys(_ctx.$slots).filter(
                    (k) => !footerSlotExcludes.includes(k)
                  ), (name) => {
                    return {
                      name,
                      fn: withCtx((slotProps) => [
                        renderSlot(_ctx.$slots, name, normalizeProps(guardReactiveProps(slotProps || {})))
                      ])
                    };
                  })
                ]), 1032, ["footerProps", "footerSlots", "autoFooterCol", "footerStyle", "submitText", "resetText", "submitButtonProps", "resetButtonProps", "showSearchExpand", "searchExpand", "searchExpandButtonProps", "searchExpandText", "searchShrinkText"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["model", "items", "rules", "grid", "rowProps", "contentExtraColProps", "autoContentExtraCol", "formItems", "searchExpand", "editable", "screenSize", "activeItemKey", "itemTypeData", "httpRequest", "requiredLang"]),
          renderSlot(_ctx.$slots, "bottomExtra")
        ]),
        _: 3
      }, 8, ["model", "labelPosition", "labelWidth", "statusIcon", "validateOnRuleChange", "size", "disabled", "scrollToError", "scrollIntoViewOptions", "inline", "labelSuffix", "hideRequiredAsterisk", "requireAsteriskPosition", "showMessage", "inlineMessage", "class"]);
    };
  }
});
export {
  _sfc_main as default
};

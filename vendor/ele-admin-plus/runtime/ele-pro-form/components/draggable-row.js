import { defineComponent, computed, provide, openBlock, createBlock, unref, normalizeStyle, normalizeClass, createSlots, withCtx, mergeProps, renderSlot, createVNode, normalizeProps, guardReactiveProps } from "vue";
import { useNamespace, rowContextKey, ElCol } from "element-plus";
import VueDraggable from "vuedraggable";
import { sortableGroupName, getScreenSizeColProps, translateJsCode, computeContentExtraCol, isShowItem } from "./render-core";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "DraggableRow" },
  __name: "draggable-row",
  props: {
    itemsData: {},
    componentData: {},
    screenSize: {},
    gridColProps: {},
    formData: {},
    formItems: {},
    searchExpand: { type: Boolean },
    httpRequest: {},
    getProFormRefs: { type: Function },
    getAndCacheCode: { type: Function },
    autoContentExtraCol: { type: Boolean },
    contentExtraColProps: {},
    editable: { type: Boolean }
  },
  emits: ["updateItems"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleUpdateItemsModelValue = (data) => {
      emit("updateItems", data);
    };
    const ns = useNamespace("row");
    const gutter = computed(() => props.componentData?.gutter ?? 0);
    const rowStyle = computed(() => {
      const styles = {};
      if (!props.componentData?.gutter) {
        return styles;
      }
      styles.marginRight = styles.marginLeft = `-${props.componentData.gutter / 2}px`;
      return styles;
    });
    const rowClass = computed(() => [
      "ele-pro-form-builder-grid-container-wrapper",
      ns.b(),
      ns.is(
        `justify-${props.componentData?.justify ?? "start"}`,
        (props.componentData?.justify ?? "start") !== "start"
      ),
      ns.is(`align-${props.componentData?.align}`, !!props.componentData?.align)
    ]);
    provide(rowContextKey, { gutter });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(VueDraggable), {
        itemKey: "key",
        animation: 150,
        modelValue: __props.itemsData,
        setData: () => void 0,
        group: unref(sortableGroupName),
        handle: ".ele-pro-form-builder-item-handle",
        draggable: ".ele-pro-form-builder-grid-item-wrapper",
        tag: __props.componentData?.tag ?? "div",
        class: normalizeClass(rowClass.value),
        style: normalizeStyle(rowStyle.value),
        "onUpdate:modelValue": handleUpdateItemsModelValue
      }, createSlots({
        item: withCtx(({ element }) => [
          (openBlock(), createBlock(unref(ElCol), mergeProps(
            {
              key: element.key ?? element.prop,
              class: "ele-pro-form-builder-grid-item-wrapper"
            },
            unref(getScreenSizeColProps)(
              __props.screenSize,
              __props.gridColProps,
              unref(translateJsCode)(
                element.colProps || {},
                __props.formData,
                __props.formItems || [],
                __props.searchExpand,
                __props.httpRequest,
                __props.getProFormRefs,
                __props.getAndCacheCode
              ).result
            )
          ), {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "item", { element })
            ]),
            _: 2
          }, 1040))
        ]),
        _: 2
      }, [
        _ctx.$slots.footer ? {
          name: "footer",
          fn: withCtx(() => [
            createVNode(unref(ElCol), normalizeProps(guardReactiveProps(
              unref(getScreenSizeColProps)(
                __props.screenSize,
                __props.autoContentExtraCol ? unref(computeContentExtraCol)(
                  __props.gridColProps,
                  (__props.formItems || []).filter(
                    (item) => unref(isShowItem)(
                      item,
                      __props.formData,
                      __props.formItems || [],
                      __props.searchExpand,
                      __props.editable
                    )
                  ).length
                ) : { span: 24 },
                unref(translateJsCode)(
                  __props.contentExtraColProps || {},
                  __props.formData,
                  __props.formItems || [],
                  __props.searchExpand,
                  __props.httpRequest,
                  __props.getProFormRefs,
                  __props.getAndCacheCode
                ).result
              )
            )), {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "footer")
              ]),
              _: 3
            }, 16)
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["modelValue", "group", "tag", "class", "style"]);
    };
  }
});
export {
  _sfc_main as default
};

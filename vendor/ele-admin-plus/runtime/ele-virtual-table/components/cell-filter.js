import { defineComponent, ref, computed, openBlock, createElementBlock, withModifiers, createVNode, withCtx, unref, Fragment, renderList, createBlock, createElementVNode, createTextVNode, toDisplayString, normalizeClass } from "vue";
import { useLocale, ElIcon, ElScrollbar, ElCheckboxGroup, ElCheckbox, ElButton } from "element-plus";
import EleTooltip from "../../ele-tooltip/index";
import { FilterFilled } from "../../icons/index";
const _hoisted_1 = { class: "ele-table-filter-footer" };
const _hoisted_2 = {
  key: 1,
  class: "ele-table-filter-list"
};
const _hoisted_3 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "CellFilter" },
  __name: "cell-filter",
  props: {
    /** 选中项 */
    filtered: Array,
    /** 是否多选 */
    filterMultiple: Boolean,
    /** 数据项 */
    filters: Array,
    /** 弹出框定位 */
    filterPlacement: {
      type: String,
      default: "bottom-start"
    }
  },
  emits: {
    /** 选中改变事件 */
    change: (_filtered) => true
  },
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { t } = useLocale();
    const popperRef = ref(null);
    const checkedValue = ref([]);
    const clearFilterText = computed(() => {
      return t("el.table.clearFilter");
    });
    const filteredValue = computed(() => {
      if (!props.filtered || !props.filtered.length) {
        return;
      }
      return props.filtered[0];
    });
    const confirmText = computed(() => {
      return t("el.table.confirmFilter");
    });
    const resetText = computed(() => {
      return t("el.table.resetFilter");
    });
    const hidePopper = () => {
      popperRef.value && popperRef.value.hide();
    };
    const handleBeforeEnter = () => {
      checkedValue.value = props.filtered ?? [];
    };
    const handleItemClick = (value) => {
      handleFilterChange(value == null ? [] : [value]);
      hidePopper();
    };
    const handleFilterChange = (filtered) => {
      emit("change", filtered);
    };
    const handleConfirm = () => {
      handleFilterChange(checkedValue.value);
      hidePopper();
    };
    const handleReset = () => {
      checkedValue.value = [];
      handleFilterChange([]);
      hidePopper();
    };
    __expose({
      popperRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "ele-table-filter",
        onClick: _cache[2] || (_cache[2] = withModifiers(() => {
        }, ["stop"]))
      }, [
        createVNode(EleTooltip, {
          ref_key: "popperRef",
          ref: popperRef,
          trigger: "click",
          showArrow: false,
          placement: __props.filterPlacement,
          popperClass: "ele-table-filter-popper",
          gpuAcceleration: true,
          effect: "light",
          isPopover: true,
          popperOptions: {
            strategy: "fixed",
            modifiers: [{ name: "offset", options: { offset: [0, 4] } }]
          },
          onBeforeShow: handleBeforeEnter
        }, {
          body: withCtx(() => [
            __props.filterMultiple ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createVNode(unref(ElScrollbar), { class: "ele-table-filter-body" }, {
                default: withCtx(() => [
                  createVNode(unref(ElCheckboxGroup), {
                    modelValue: checkedValue.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => checkedValue.value = $event)
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(__props.filters, (item) => {
                        return openBlock(), createBlock(unref(ElCheckbox), {
                          key: item.value,
                          value: item.value,
                          label: item.text
                        }, null, 8, ["value", "label"]);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              createElementVNode("div", _hoisted_1, [
                createVNode(unref(ElButton), {
                  size: "small",
                  text: true,
                  onClick: handleReset
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(resetText.value), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(ElButton), {
                  size: "small",
                  type: "primary",
                  disabled: !checkedValue.value.length,
                  onClick: handleConfirm
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(confirmText.value), 1)
                  ]),
                  _: 1
                }, 8, ["disabled"])
              ])
            ], 64)) : (openBlock(), createElementBlock("div", _hoisted_2, [
              createElementVNode("div", {
                class: normalizeClass(["ele-table-filter-item", { "is-active": filteredValue.value == null }]),
                onClick: _cache[1] || (_cache[1] = ($event) => handleItemClick())
              }, toDisplayString(clearFilterText.value), 3),
              (openBlock(true), createElementBlock(Fragment, null, renderList(__props.filters, (d) => {
                return openBlock(), createElementBlock("div", {
                  key: d.value,
                  class: normalizeClass(["ele-table-filter-item", { "is-active": filteredValue.value === d.value }]),
                  onClick: ($event) => handleItemClick(d.value)
                }, toDisplayString(d.text), 11, _hoisted_3);
              }), 128))
            ]))
          ]),
          default: withCtx(() => [
            createVNode(unref(ElIcon), null, {
              default: withCtx(() => [
                createVNode(unref(FilterFilled))
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["placement"])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

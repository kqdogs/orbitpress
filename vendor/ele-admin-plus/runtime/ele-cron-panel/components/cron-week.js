import { defineComponent, ref, computed, watch, openBlock, createElementBlock, createVNode, unref, isRef, withCtx, createElementVNode, toDisplayString, Fragment, renderList, createBlock, createCommentVNode } from "vue";
import { ElRadioGroup, ElRadio, ElInputNumber, ElCheckboxGroup, ElCheckbox } from "element-plus";
import { useCron } from "../util";
const _hoisted_1 = { class: "ele-cron-panel-content" };
const _hoisted_2 = { class: "ele-cron-panel-item" };
const _hoisted_3 = { class: "ele-cron-panel-item-input" };
const _hoisted_4 = { class: "ele-cron-panel-item-input" };
const _hoisted_5 = { class: "ele-cron-panel-item" };
const _hoisted_6 = { class: "ele-cron-panel-item-input" };
const _hoisted_7 = { class: "ele-cron-panel-item-input" };
const _hoisted_8 = { class: "ele-cron-panel-options" };
const _hoisted_9 = { class: "ele-cron-panel-item" };
const _hoisted_10 = { class: "ele-cron-panel-item-input" };
const minValue = 1;
const maxValue = 7;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cron-week",
  props: {
    /** week */
    modelValue: String,
    /** 国际化 */
    lang: {
      type: Object,
      required: true
    }
  },
  emits: {
    "update:modelValue": (_week) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      type,
      start,
      end,
      endMin,
      intervalStart,
      intervalStep,
      selections,
      getValue,
      parseValue
    } = useCron(minValue, maxValue, "unset");
    const lastWeek = ref(1);
    const weekNames = computed(() => {
      return [
        props.lang.weekName1,
        props.lang.weekName2,
        props.lang.weekName3,
        props.lang.weekName4,
        props.lang.weekName5,
        props.lang.weekName6,
        props.lang.weekName7
      ];
    });
    const updateModelValue = (day) => {
      emit("update:modelValue", day);
    };
    watch(
      [type, start, end, intervalStart, intervalStep, selections],
      () => {
        if (type.value === "last") {
          updateModelValue(`${lastWeek.value}L`);
          return;
        }
        if (type.value === "unset") {
          updateModelValue("?");
          return;
        }
        updateModelValue(getValue());
      },
      { deep: true, immediate: true }
    );
    watch(
      () => props.modelValue,
      (week) => {
        if (week != null && week.endsWith("L")) {
          type.value = "last";
          lastWeek.value = Number(week.slice(0, -1));
          return;
        }
        if (week === "?") {
          type.value = "unset";
          return;
        }
        parseValue(week);
      },
      { immediate: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(ElRadioGroup), {
          modelValue: unref(type),
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => isRef(type) ? type.value = $event : null)
        }, {
          default: withCtx(() => [
            createVNode(unref(ElRadio), {
              value: "every",
              label: __props.lang.weekEvery
            }, null, 8, ["label"]),
            createVNode(unref(ElRadio), {
              value: "range",
              class: "ele-cron-panel-item-wrapper"
            }, {
              default: withCtx(() => [
                createElementVNode("div", _hoisted_2, [
                  createElementVNode("div", null, toDisplayString(__props.lang.weekRangeStart) + " ", 1),
                  createElementVNode("div", _hoisted_3, [
                    createVNode(unref(ElInputNumber), {
                      modelValue: unref(start),
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(start) ? start.value = $event : null),
                      min: minValue,
                      max: maxValue - 1,
                      placeholder: "",
                      controlsPosition: "right"
                    }, null, 8, ["modelValue", "max"])
                  ]),
                  createElementVNode("div", null, " " + toDisplayString(__props.lang.weekRange) + " ", 1),
                  createElementVNode("div", _hoisted_4, [
                    createVNode(unref(ElInputNumber), {
                      modelValue: unref(end),
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => isRef(end) ? end.value = $event : null),
                      min: unref(endMin),
                      max: maxValue,
                      placeholder: "",
                      controlsPosition: "right"
                    }, null, 8, ["modelValue", "min"])
                  ])
                ])
              ]),
              _: 1
            }),
            createVNode(unref(ElRadio), {
              value: "interval",
              class: "ele-cron-panel-item-wrapper"
            }, {
              default: withCtx(() => [
                createElementVNode("div", _hoisted_5, [
                  createElementVNode("div", null, toDisplayString(__props.lang.weekIntervalStart) + " ", 1),
                  createElementVNode("div", _hoisted_6, [
                    createVNode(unref(ElInputNumber), {
                      modelValue: unref(intervalStart),
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isRef(intervalStart) ? intervalStart.value = $event : null),
                      min: minValue,
                      max: 4,
                      placeholder: "",
                      controlsPosition: "right"
                    }, null, 8, ["modelValue"])
                  ]),
                  createElementVNode("div", null, " " + toDisplayString(__props.lang.weekInterval) + " ", 1),
                  createElementVNode("div", _hoisted_7, [
                    createVNode(unref(ElInputNumber), {
                      modelValue: unref(intervalStep),
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => isRef(intervalStep) ? intervalStep.value = $event : null),
                      min: minValue,
                      max: maxValue,
                      placeholder: "",
                      controlsPosition: "right"
                    }, null, 8, ["modelValue"])
                  ]),
                  createElementVNode("div", null, " " + toDisplayString(__props.lang.weekIntervalEnd), 1)
                ])
              ]),
              _: 1
            }),
            createVNode(unref(ElRadio), {
              value: "specified",
              class: "ele-cron-panel-item-wrapper ele-cron-panel-options-wrapper"
            }, {
              default: withCtx(() => [
                createElementVNode("div", null, toDisplayString(__props.lang.weekSpecified), 1),
                createElementVNode("div", _hoisted_8, [
                  createVNode(unref(ElCheckboxGroup), {
                    modelValue: unref(selections),
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => isRef(selections) ? selections.value = $event : null)
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(maxValue + 1, (item) => {
                        return openBlock(), createElementBlock(Fragment, { key: item }, [
                          item - 1 >= minValue ? (openBlock(), createBlock(unref(ElCheckbox), {
                            key: 0,
                            value: item - 1,
                            label: weekNames.value[item - 1 - 1],
                            class: "ele-cron-panel-item-input"
                          }, null, 8, ["value", "label"])) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ])
              ]),
              _: 1
            }),
            createVNode(unref(ElRadio), {
              value: "last",
              class: "ele-cron-panel-item-wrapper"
            }, {
              default: withCtx(() => [
                createElementVNode("div", _hoisted_9, [
                  createElementVNode("div", null, toDisplayString(__props.lang.weekLast) + " ", 1),
                  createElementVNode("div", _hoisted_10, [
                    createVNode(unref(ElInputNumber), {
                      modelValue: lastWeek.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => lastWeek.value = $event),
                      min: minValue,
                      max: maxValue,
                      placeholder: "",
                      controlsPosition: "right"
                    }, null, 8, ["modelValue"])
                  ])
                ])
              ]),
              _: 1
            }),
            createVNode(unref(ElRadio), {
              value: "unset",
              label: __props.lang.weekUnset
            }, null, 8, ["label"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
});
export {
  _sfc_main as default
};

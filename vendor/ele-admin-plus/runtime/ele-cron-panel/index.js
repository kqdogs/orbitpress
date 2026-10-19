import { defineComponent, ref, computed, watch, openBlock, createElementBlock, createElementVNode, createVNode, withCtx, toDisplayString, unref, Fragment, renderList, normalizeClass, withModifiers } from "vue";
import { useLocale } from "../ele-config-provider/receiver";
import EleTabs from "../ele-tabs/index";
import CronSecond from "./components/cron-second";
import CronMinute from "./components/cron-minute";
import CronHour from "./components/cron-hour";
import CronDay from "./components/cron-day";
import CronMonth from "./components/cron-month";
import CronWeek from "./components/cron-week";
import CronYear from "./components/cron-year";
import { getResultItems } from "./util";
import { cronPanelEmits, cronPanelProps } from "./props";
const _hoisted_1 = { class: "ele-cron-panel" };
const _hoisted_2 = { class: "ele-cron-panel-main" };
const _hoisted_3 = { class: "ele-cron-panel-extra" };
const _hoisted_4 = { class: "ele-cron-panel-extra-item" };
const _hoisted_5 = { class: "ele-cron-panel-extra-header" };
const _hoisted_6 = { class: "ele-cron-panel-extra-body" };
const _hoisted_7 = { class: "ele-cron-panel-result" };
const _hoisted_8 = { class: "ele-cron-panel-result-item" };
const _hoisted_9 = { class: "ele-cron-panel-result-title" };
const _hoisted_10 = { class: "ele-cron-panel-result-text" };
const _hoisted_11 = { class: "ele-cron-panel-result-item" };
const _hoisted_12 = { class: "ele-cron-panel-result-title" };
const _hoisted_13 = { class: "ele-cron-panel-result-text" };
const _hoisted_14 = { class: "ele-cron-panel-result-item" };
const _hoisted_15 = { class: "ele-cron-panel-result-title" };
const _hoisted_16 = { class: "ele-cron-panel-result-text" };
const _hoisted_17 = { class: "ele-cron-panel-result-item" };
const _hoisted_18 = { class: "ele-cron-panel-result-title" };
const _hoisted_19 = { class: "ele-cron-panel-result-text" };
const _hoisted_20 = { class: "ele-cron-panel-result-item" };
const _hoisted_21 = { class: "ele-cron-panel-result-title" };
const _hoisted_22 = { class: "ele-cron-panel-result-text" };
const _hoisted_23 = { class: "ele-cron-panel-result-item" };
const _hoisted_24 = { class: "ele-cron-panel-result-title" };
const _hoisted_25 = { class: "ele-cron-panel-result-text" };
const _hoisted_26 = { class: "ele-cron-panel-result-item" };
const _hoisted_27 = { class: "ele-cron-panel-result-title" };
const _hoisted_28 = { class: "ele-cron-panel-result-text" };
const _hoisted_29 = { class: "ele-cron-panel-result" };
const _hoisted_30 = { class: "ele-cron-panel-result-item" };
const _hoisted_31 = { class: "ele-cron-panel-result-title" };
const _hoisted_32 = { class: "ele-cron-panel-result-text ele-cron-panel-result-value" };
const _hoisted_33 = { class: "ele-cron-panel-extra-item" };
const _hoisted_34 = { class: "ele-cron-panel-extra-header" };
const _hoisted_35 = { class: "ele-cron-panel-extra-body" };
const _hoisted_36 = { class: "ele-cron-panel-test" };
const _hoisted_37 = ["onClick"];
const _hoisted_38 = { class: "ele-cron-panel-list-item-value" };
const _hoisted_39 = { class: "ele-cron-panel-list-item-label" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleCronPanel" },
  __name: "index",
  props: cronPanelProps,
  emits: cronPanelEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { lang } = useLocale("cronPanel", props);
    const second = ref("*");
    const minute = ref("*");
    const hour = ref("*");
    const day = ref("*");
    const month = ref("*");
    const week = ref("?");
    const year = ref("");
    const resultItems = ref([]);
    const tabActive = ref("second");
    const tabItems = computed(() => {
      return [
        { name: "second", label: lang.value.second },
        { name: "minute", label: lang.value.minute },
        { name: "hour", label: lang.value.hour },
        { name: "day", label: lang.value.day },
        { name: "month", label: lang.value.month },
        { name: "week", label: lang.value.week },
        { name: "year", label: lang.value.year }
      ];
    });
    const updateModelValue = (value) => {
      if (props.modelValue !== value) {
        emit("update:modelValue", value);
      }
    };
    const updateCron = () => {
      const values = [
        second.value,
        minute.value,
        hour.value,
        day.value,
        month.value,
        week.value
      ];
      if (year.value != null && year.value !== "") {
        values.push(year.value);
      }
      const cron = values.join(" ");
      updateModelValue(cron);
      return cron;
    };
    const updatePanel = (cron) => {
      if (!cron) {
        tabActive.value = "second";
        second.value = "*";
        minute.value = "*";
        hour.value = "*";
        day.value = "*";
        month.value = "*";
        week.value = "?";
        year.value = "";
        const str = updateCron();
        resultItems.value = getResultItems(
          str,
          lang.value.resultNoData,
          lang.value.resultNoMore
        );
        return;
      }
      const [s, m, h, d, m2, w, y] = cron.split(" ");
      second.value = s;
      minute.value = m;
      hour.value = h;
      day.value = d;
      month.value = m2;
      week.value = w;
      year.value = y || "";
      resultItems.value = getResultItems(
        cron,
        lang.value.resultNoData,
        lang.value.resultNoMore
      );
    };
    watch(hour, (h) => {
      if (h !== "*" && second.value === "*") {
        second.value = "0";
      }
      if (h !== "*" && minute.value === "*") {
        minute.value = "0";
      }
    });
    watch(day, (d) => {
      if (d !== "?" && week.value !== "?") {
        week.value = "?";
      }
    });
    watch(week, (w) => {
      if (w !== "?" && day.value !== "?") {
        day.value = "?";
      }
    });
    watch([second, minute, hour, day, month, week, year], () => {
      updateCron();
    });
    watch(
      () => props.modelValue,
      (cron) => {
        updatePanel(cron);
      }
    );
    watch(lang, () => {
      resultItems.value = getResultItems(
        props.modelValue,
        lang.value.resultNoData,
        lang.value.resultNoMore
      );
    });
    const cronListVisible = ref(false);
    const cronList = computed(() => {
      return [
        { cron: "0 * * * * ?", label: lang.value.common01 },
        { cron: "0 0 * * * ?", label: lang.value.common02 },
        { cron: "0 0/30 * * * ?", label: lang.value.common03 },
        { cron: "0 0/30 8-9 * * ?", label: lang.value.common04 },
        { cron: "0 0 0 * * ?", label: lang.value.common05 },
        { cron: "0 30 8 * * ?", label: lang.value.common06 },
        { cron: "0 0 8,14,19 * * ?", label: lang.value.common07 },
        { cron: "0 0 0 1 * ?", label: lang.value.common08 },
        { cron: "0 0 2 1 * ?", label: lang.value.common09 },
        { cron: "0 30 8 15 * ?", label: lang.value.common10 },
        { cron: "0 0 0 L * ?", label: lang.value.common11 },
        { cron: "0 30 8 L * ?", label: lang.value.common12 },
        { cron: "0 30 8 ? * 6L", label: lang.value.common13 },
        { cron: "0 0 0 ? * 1", label: lang.value.common14 },
        { cron: "0 0 8 ? * 2-4", label: lang.value.common15 },
        { cron: "0 0 0 1 10 ? 2025-2028", label: lang.value.common16 }
      ];
    });
    const handleItemClick = (item) => {
      hideCronList();
      updateModelValue(item.cron);
    };
    const openCronList = () => {
      cronListVisible.value = true;
    };
    const hideCronList = () => {
      cronListVisible.value = false;
    };
    __expose({ hideCronList });
    if (props.modelValue) {
      updatePanel(props.modelValue);
    } else {
      updateCron();
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          createVNode(EleTabs, {
            addable: true,
            type: "border-card",
            items: tabItems.value,
            modelValue: tabActive.value,
            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => tabActive.value = $event),
            onTabAdd: openCronList
          }, {
            second: withCtx(() => [
              createVNode(CronSecond, {
                modelValue: second.value,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => second.value = $event),
                lang: unref(lang)
              }, null, 8, ["modelValue", "lang"])
            ]),
            minute: withCtx(() => [
              createVNode(CronMinute, {
                modelValue: minute.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => minute.value = $event),
                lang: unref(lang)
              }, null, 8, ["modelValue", "lang"])
            ]),
            hour: withCtx(() => [
              createVNode(CronHour, {
                modelValue: hour.value,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => hour.value = $event),
                lang: unref(lang)
              }, null, 8, ["modelValue", "lang"])
            ]),
            day: withCtx(() => [
              createVNode(CronDay, {
                modelValue: day.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => day.value = $event),
                lang: unref(lang)
              }, null, 8, ["modelValue", "lang"])
            ]),
            month: withCtx(() => [
              createVNode(CronMonth, {
                modelValue: month.value,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => month.value = $event),
                lang: unref(lang)
              }, null, 8, ["modelValue", "lang"])
            ]),
            week: withCtx(() => [
              createVNode(CronWeek, {
                modelValue: week.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => week.value = $event),
                lang: unref(lang)
              }, null, 8, ["modelValue", "lang"])
            ]),
            year: withCtx(() => [
              createVNode(CronYear, {
                modelValue: year.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => year.value = $event),
                lang: unref(lang)
              }, null, 8, ["modelValue", "lang"])
            ]),
            "add-icon": withCtx(() => [
              createElementVNode("div", null, toDisplayString(unref(lang).common), 1)
            ]),
            _: 1
          }, 8, ["items", "modelValue"])
        ]),
        createElementVNode("div", _hoisted_3, [
          createElementVNode("div", _hoisted_4, [
            createElementVNode("div", _hoisted_5, toDisplayString(unref(lang).result), 1),
            createElementVNode("div", _hoisted_6, [
              createElementVNode("div", _hoisted_7, [
                createElementVNode("div", _hoisted_8, [
                  createElementVNode("div", _hoisted_9, toDisplayString(unref(lang).resultSecond), 1),
                  createElementVNode("div", _hoisted_10, toDisplayString(second.value), 1)
                ]),
                createElementVNode("div", _hoisted_11, [
                  createElementVNode("div", _hoisted_12, toDisplayString(unref(lang).resultMinute), 1),
                  createElementVNode("div", _hoisted_13, toDisplayString(minute.value), 1)
                ]),
                createElementVNode("div", _hoisted_14, [
                  createElementVNode("div", _hoisted_15, toDisplayString(unref(lang).resultHour), 1),
                  createElementVNode("div", _hoisted_16, toDisplayString(hour.value), 1)
                ]),
                createElementVNode("div", _hoisted_17, [
                  createElementVNode("div", _hoisted_18, toDisplayString(unref(lang).resultDay), 1),
                  createElementVNode("div", _hoisted_19, toDisplayString(day.value), 1)
                ]),
                createElementVNode("div", _hoisted_20, [
                  createElementVNode("div", _hoisted_21, toDisplayString(unref(lang).resultMonth), 1),
                  createElementVNode("div", _hoisted_22, toDisplayString(month.value), 1)
                ]),
                createElementVNode("div", _hoisted_23, [
                  createElementVNode("div", _hoisted_24, toDisplayString(unref(lang).resultWeek), 1),
                  createElementVNode("div", _hoisted_25, toDisplayString(week.value), 1)
                ]),
                createElementVNode("div", _hoisted_26, [
                  createElementVNode("div", _hoisted_27, toDisplayString(unref(lang).resultYear), 1),
                  createElementVNode("div", _hoisted_28, toDisplayString(year.value), 1)
                ])
              ]),
              createElementVNode("div", _hoisted_29, [
                createElementVNode("div", _hoisted_30, [
                  createElementVNode("div", _hoisted_31, toDisplayString(unref(lang).resultName), 1),
                  createElementVNode("div", _hoisted_32, toDisplayString(_ctx.modelValue), 1)
                ])
              ])
            ])
          ]),
          createElementVNode("div", _hoisted_33, [
            createElementVNode("div", _hoisted_34, toDisplayString(unref(lang).resultTest), 1),
            createElementVNode("div", _hoisted_35, [
              createElementVNode("ul", _hoisted_36, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(resultItems.value, (item) => {
                  return openBlock(), createElementBlock("li", {
                    key: item,
                    class: "ele-cron-panel-test-item"
                  }, toDisplayString(item), 1);
                }), 128))
              ])
            ])
          ])
        ]),
        createElementVNode("div", {
          class: normalizeClass(["ele-cron-panel-list-mask", { "is-show": cronListVisible.value }]),
          onClick: hideCronList
        }, [
          createElementVNode("div", {
            class: "ele-cron-panel-list-wrapper",
            onClick: _cache[8] || (_cache[8] = withModifiers(() => {
            }, ["stop"]))
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(cronList.value, (item) => {
              return openBlock(), createElementBlock("div", {
                key: item.cron,
                class: "ele-cron-panel-list-item",
                onClick: ($event) => handleItemClick(item)
              }, [
                createElementVNode("div", _hoisted_38, toDisplayString(item.cron), 1),
                createElementVNode("div", _hoisted_39, toDisplayString(item.label), 1)
              ], 8, _hoisted_37);
            }), 128))
          ])
        ], 2)
      ]);
    };
  }
});
export {
  _sfc_main as default
};

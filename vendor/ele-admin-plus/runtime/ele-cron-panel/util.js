import { ref, computed, watch } from "vue";
function useCron(minValue, maxValue, defaultType) {
  const type = ref(defaultType || "every");
  const start = ref(0);
  const end = ref(1);
  const endMin = computed(() => (start.value || 0) + 1);
  const intervalStart = ref(0);
  const intervalStep = ref(1);
  const intervalStepMax = computed(() => maxValue - (intervalStart.value || 0));
  const selections = ref([]);
  const getValue = () => {
    switch (type.value) {
      case "every":
        return "*";
      case "range":
        const s = Math.min(Math.max(start.value, minValue), maxValue - 1);
        const e = Math.min(Math.max(end.value, endMin.value), maxValue);
        return `${s}-${e}`;
      case "interval":
        const v = Math.min(
          Math.max(intervalStart.value, minValue),
          maxValue - 1
        );
        const step = Math.min(
          Math.max(intervalStep.value, 1),
          intervalStepMax.value
        );
        return `${v}/${step}`;
      case "specified":
        return selections.value.join() || String(minValue);
    }
  };
  const parseValue = (str) => {
    if (str == null || str === "") {
      return;
    }
    if (str === "*") {
      type.value = "every";
      return;
    }
    if (str.includes("-")) {
      type.value = "range";
      const [s, e] = str.split("-");
      start.value = Number(s);
      end.value = Number(e);
      return;
    }
    if (str.includes("/")) {
      type.value = "interval";
      const [v, step] = str.split("/");
      intervalStart.value = Number(v);
      intervalStep.value = Number(step);
      return;
    }
    type.value = "specified";
    selections.value = str.split(",").map((d) => Number(d));
  };
  watch(endMin, () => {
    if (end.value != null && end.value < endMin.value) {
      end.value = endMin.value;
    }
  });
  watch(intervalStepMax, () => {
    if (intervalStep.value != null && intervalStep.value > intervalStepMax.value) {
      intervalStep.value = intervalStepMax.value;
    }
  });
  return {
    type,
    start,
    end,
    endMin,
    intervalStart,
    intervalStep,
    intervalStepMax,
    selections,
    getValue,
    parseValue
  };
}
function getResultItems(cron, noDataText, noMoreText) {
  if (!cron) {
    return [];
  }
  let dayRule = "";
  let dayRuleSup = "";
  const dateArr = [];
  function getIndex(arr, value) {
    if (value <= arr[0] || value > arr[arr.length - 1]) {
      return 0;
    } else {
      for (let i = 0; i < arr.length - 1; i++) {
        if (value > arr[i] && value <= arr[i + 1]) {
          return i + 1;
        }
      }
    }
  }
  function getYearArr(rule, year) {
    dateArr[5] = getOrderArr(year, year + 100);
    if (rule != null) {
      if (rule.indexOf("-") >= 0) {
        dateArr[5] = getCycleArr(rule, year + 100, false);
      } else if (rule.indexOf("/") >= 0) {
        dateArr[5] = getAverageArr(rule, year + 100);
      } else if (rule !== "*") {
        dateArr[5] = getAssignArr(rule);
      }
    }
  }
  function getMonthArr(rule) {
    dateArr[4] = getOrderArr(1, 12);
    if (rule.indexOf("-") >= 0) {
      dateArr[4] = getCycleArr(rule, 12, false);
    } else if (rule.indexOf("/") >= 0) {
      dateArr[4] = getAverageArr(rule, 12);
    } else if (rule !== "*") {
      dateArr[4] = getAssignArr(rule);
    }
  }
  function getWeekArr(rule) {
    if (dayRule == "" && dayRuleSup == "") {
      if (rule.indexOf("-") >= 0) {
        dayRule = "weekDay";
        dayRuleSup = getCycleArr(rule, 7, false);
      } else if (rule.indexOf("#") >= 0) {
        dayRule = "assWeek";
        const matchRule = rule.match(/[0-9]{1}/g) ?? [];
        dayRuleSup = [Number(matchRule[1]), Number(matchRule[0])];
        dateArr[3] = [1];
        if (dayRuleSup[1] == 7) {
          dayRuleSup[1] = 0;
        }
      } else if (rule.indexOf("L") >= 0) {
        dayRule = "lastWeek";
        dayRuleSup = Number(rule.match(/[0-9]{1,2}/g)?.[0]);
        dateArr[3] = [31];
        if (dayRuleSup == 7) {
          dayRuleSup = 0;
        }
      } else if (rule !== "*" && rule !== "?") {
        dayRule = "weekDay";
        dayRuleSup = getAssignArr(rule);
      }
    }
  }
  function getDayArr(rule) {
    dateArr[3] = getOrderArr(1, 31);
    dayRule = "";
    dayRuleSup = "";
    if (rule.indexOf("-") >= 0) {
      dateArr[3] = getCycleArr(rule, 31, false);
      dayRuleSup = "null";
    } else if (rule.indexOf("/") >= 0) {
      dateArr[3] = getAverageArr(rule, 31);
      dayRuleSup = "null";
    } else if (rule.indexOf("W") >= 0) {
      dayRule = "workDay";
      dayRuleSup = Number(rule.match(/[0-9]{1,2}/g)?.[0]);
      dateArr[3] = [dayRuleSup];
    } else if (rule.indexOf("L") >= 0) {
      dayRule = "lastDay";
      dayRuleSup = "null";
      dateArr[3] = [31];
    } else if (rule !== "*" && rule !== "?") {
      dateArr[3] = getAssignArr(rule);
      dayRuleSup = "null";
    } else if (rule == "*") {
      dayRuleSup = "null";
    }
  }
  function getHourArr(rule) {
    dateArr[2] = getOrderArr(0, 23);
    if (rule.indexOf("-") >= 0) {
      dateArr[2] = getCycleArr(rule, 24, true);
    } else if (rule.indexOf("/") >= 0) {
      dateArr[2] = getAverageArr(rule, 23);
    } else if (rule !== "*") {
      dateArr[2] = getAssignArr(rule);
    }
  }
  function getMinArr(rule) {
    dateArr[1] = getOrderArr(0, 59);
    if (rule.indexOf("-") >= 0) {
      dateArr[1] = getCycleArr(rule, 60, true);
    } else if (rule.indexOf("/") >= 0) {
      dateArr[1] = getAverageArr(rule, 59);
    } else if (rule !== "*") {
      dateArr[1] = getAssignArr(rule);
    }
  }
  function getSecondArr(rule) {
    dateArr[0] = getOrderArr(0, 59);
    if (rule.indexOf("-") >= 0) {
      dateArr[0] = getCycleArr(rule, 60, true);
    } else if (rule.indexOf("/") >= 0) {
      dateArr[0] = getAverageArr(rule, 59);
    } else if (rule !== "*") {
      dateArr[0] = getAssignArr(rule);
    }
  }
  function getOrderArr(min, max) {
    const arr = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }
  function getAssignArr(rule) {
    const arr = [];
    const assiginArr = rule.split(",");
    for (let i = 0; i < assiginArr.length; i++) {
      arr[i] = Number(assiginArr[i]);
    }
    arr.sort(compare);
    return arr;
  }
  function getAverageArr(rule, limit) {
    const arr = [];
    const agArr = rule.split("/");
    let min = Number(agArr[0]);
    const step = Number(agArr[1]);
    while (min <= limit) {
      arr.push(min);
      min += step;
    }
    return arr;
  }
  function getCycleArr(rule, limit, status) {
    const arr = [];
    const cycleArr = rule.split("-");
    const min = Number(cycleArr[0]);
    let max = Number(cycleArr[1]);
    if (min > max) {
      max += limit;
    }
    for (let i = min; i <= max; i++) {
      let add = 0;
      if (status == false && i % limit == 0) {
        add = limit;
      }
      arr.push(Math.round(i % limit + add));
    }
    arr.sort(compare);
    return arr;
  }
  function compare(value1, value2) {
    if (value2 - value1 > 0) {
      return -1;
    } else {
      return 1;
    }
  }
  function formatDate(value, type) {
    const time = typeof value == "number" ? new Date(value) : value;
    const Y = time.getFullYear();
    const M = time.getMonth() + 1;
    const D = time.getDate();
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const week = time.getDay();
    if (type == null) {
      return Y + "-" + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    } else if (type == "week") {
      return week + 1;
    }
  }
  function checkDate(value) {
    const time = new Date(value);
    const format = formatDate(time);
    return value === format;
  }
  const ruleArr = cron.split(" ");
  let nums = 0;
  const resultArr = [];
  const nTime = /* @__PURE__ */ new Date();
  const nYear = nTime.getFullYear();
  let nMonth = nTime.getMonth() + 1;
  let nDay = nTime.getDate();
  let nHour = nTime.getHours();
  let nMin = nTime.getMinutes();
  let nSecond = nTime.getSeconds();
  getSecondArr(ruleArr[0]);
  getMinArr(ruleArr[1]);
  getHourArr(ruleArr[2]);
  getDayArr(ruleArr[3]);
  getMonthArr(ruleArr[4]);
  getWeekArr(ruleArr[5]);
  getYearArr(ruleArr[6], nYear);
  const sDate = dateArr[0];
  const mDate = dateArr[1];
  const hDate = dateArr[2];
  const DDate = dateArr[3];
  const MDate = dateArr[4];
  const YDate = dateArr[5];
  let sIdx = getIndex(sDate, nSecond);
  let mIdx = getIndex(mDate, nMin);
  let hIdx = getIndex(hDate, nHour);
  let DIdx = getIndex(DDate, nDay);
  let MIdx = getIndex(MDate, nMonth);
  const YIdx = getIndex(YDate, nYear);
  const resetSecond = function() {
    sIdx = 0;
    nSecond = sDate[sIdx];
  };
  const resetMin = function() {
    mIdx = 0;
    nMin = mDate[mIdx];
    resetSecond();
  };
  const resetHour = function() {
    hIdx = 0;
    nHour = hDate[hIdx];
    resetMin();
  };
  const resetDay = function() {
    DIdx = 0;
    nDay = DDate[DIdx];
    resetHour();
  };
  const resetMonth = function() {
    MIdx = 0;
    nMonth = MDate[MIdx];
    resetDay();
  };
  if (nYear !== YDate[YIdx]) {
    resetMonth();
  }
  if (nMonth !== MDate[MIdx]) {
    resetDay();
  }
  if (nDay !== DDate[DIdx]) {
    resetHour();
  }
  if (nHour !== hDate[hIdx]) {
    resetMin();
  }
  if (nMin !== mDate[mIdx]) {
    resetSecond();
  }
  goYear: for (let Yi = YIdx; Yi < YDate.length; Yi++) {
    const YY = YDate[Yi];
    if (nMonth > MDate[MDate.length - 1]) {
      resetMonth();
      continue;
    }
    goMonth: for (let Mi = MIdx; Mi < MDate.length; Mi++) {
      let MM = MDate[Mi];
      MM = MM < 10 ? "0" + MM : MM;
      if (nDay > DDate[DDate.length - 1]) {
        resetDay();
        if (Mi == MDate.length - 1) {
          resetMonth();
          continue goYear;
        }
        continue;
      }
      goDay: for (let Di = DIdx; Di < DDate.length; Di++) {
        let DD = DDate[Di];
        let thisDD = DD < 10 ? "0" + DD : DD;
        if (nHour > hDate[hDate.length - 1]) {
          resetHour();
          if (Di == DDate.length - 1) {
            resetDay();
            if (Mi == MDate.length - 1) {
              resetMonth();
              continue goYear;
            }
            continue goMonth;
          }
          continue;
        }
        if (checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true && dayRule !== "workDay" && dayRule !== "lastWeek" && dayRule !== "lastDay") {
          resetDay();
          continue goMonth;
        }
        if (dayRule == "lastDay") {
          if (checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true) {
            while (DD > 0 && checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true) {
              DD--;
              thisDD = DD < 10 ? "0" + DD : DD;
            }
          }
        } else if (dayRule == "workDay") {
          if (checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true) {
            while (DD > 0 && checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true) {
              DD--;
              thisDD = DD < 10 ? "0" + DD : DD;
            }
          }
          const thisWeek = formatDate(
            /* @__PURE__ */ new Date(YY + "-" + MM + "-" + thisDD + " 00:00:00"),
            "week"
          );
          if (thisWeek == 1) {
            DD++;
            thisDD = DD < 10 ? "0" + DD : DD;
            if (checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true) {
              DD -= 3;
            }
          } else if (thisWeek == 7) {
            if (dayRuleSup !== 1) {
              DD--;
            } else {
              DD += 2;
            }
          }
        } else if (dayRule == "weekDay") {
          const thisWeek = formatDate(
            /* @__PURE__ */ new Date(YY + "-" + MM + "-" + DD + " 00:00:00"),
            "week"
          );
          if (dayRuleSup.indexOf(thisWeek) < 0) {
            if (Di == DDate.length - 1) {
              resetDay();
              if (Mi == MDate.length - 1) {
                resetMonth();
                continue goYear;
              }
              continue goMonth;
            }
            continue;
          }
        } else if (dayRule == "assWeek") {
          const thisWeek = formatDate(
            /* @__PURE__ */ new Date(YY + "-" + MM + "-" + DD + " 00:00:00"),
            "week"
          );
          if (thisWeek != null && dayRuleSup[1] >= thisWeek) {
            DD = (dayRuleSup[0] - 1) * 7 + dayRuleSup[1] - thisWeek + 1;
          } else if (thisWeek != null) {
            DD = dayRuleSup[0] * 7 + dayRuleSup[1] - thisWeek + 1;
          }
        } else if (dayRule == "lastWeek") {
          if (checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true) {
            while (DD > 0 && checkDate(YY + "-" + MM + "-" + thisDD + " 00:00:00") !== true) {
              DD--;
              thisDD = DD < 10 ? "0" + DD : DD;
            }
          }
          const thisWeek = formatDate(
            /* @__PURE__ */ new Date(YY + "-" + MM + "-" + thisDD + " 00:00:00"),
            "week"
          );
          if (dayRuleSup < thisWeek) {
            DD -= thisWeek - dayRuleSup;
          } else if (dayRuleSup > thisWeek) {
            DD -= 7 - (dayRuleSup - thisWeek);
          }
        }
        DD = DD < 10 ? "0" + DD : DD;
        goHour: for (let hi = hIdx; hi < hDate.length; hi++) {
          const hh = hDate[hi] < 10 ? "0" + hDate[hi] : hDate[hi];
          if (nMin > mDate[mDate.length - 1]) {
            resetMin();
            if (hi == hDate.length - 1) {
              resetHour();
              if (Di == DDate.length - 1) {
                resetDay();
                if (Mi == MDate.length - 1) {
                  resetMonth();
                  continue goYear;
                }
                continue goMonth;
              }
              continue goDay;
            }
            continue;
          }
          goMin: for (let mi = mIdx; mi < mDate.length; mi++) {
            const mm = mDate[mi] < 10 ? "0" + mDate[mi] : mDate[mi];
            if (nSecond > sDate[sDate.length - 1]) {
              resetSecond();
              if (mi == mDate.length - 1) {
                resetMin();
                if (hi == hDate.length - 1) {
                  resetHour();
                  if (Di == DDate.length - 1) {
                    resetDay();
                    if (Mi == MDate.length - 1) {
                      resetMonth();
                      continue goYear;
                    }
                    continue goMonth;
                  }
                  continue goDay;
                }
                continue goHour;
              }
              continue;
            }
            for (let si = sIdx; si <= sDate.length - 1; si++) {
              const ss = sDate[si] < 10 ? "0" + sDate[si] : sDate[si];
              if (MM !== "00" && DD !== "00") {
                resultArr.push(
                  YY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss
                );
                nums++;
              }
              if (nums == 5) break goYear;
              if (si == sDate.length - 1) {
                resetSecond();
                if (mi == mDate.length - 1) {
                  resetMin();
                  if (hi == hDate.length - 1) {
                    resetHour();
                    if (Di == DDate.length - 1) {
                      resetDay();
                      if (Mi == MDate.length - 1) {
                        resetMonth();
                        continue goYear;
                      }
                      continue goMonth;
                    }
                    continue goDay;
                  }
                  continue goHour;
                }
                continue goMin;
              }
            }
          }
        }
      }
    }
  }
  if (resultArr.length == 0) {
    return [noDataText];
  } else {
    return resultArr.length !== 5 ? [
      ...resultArr,
      noMoreText.replace(/\{\s*length\s*\}/, String(resultArr.length))
    ] : resultArr;
  }
}
export {
  getResultItems,
  useCron
};

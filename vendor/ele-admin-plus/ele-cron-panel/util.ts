import { ref, computed, watch } from 'vue';

/**
 * 任意* 范围 间隔 指定 通用封装
 * @param minValue 最小值
 * @param maxValue 最大值
 * @param defaultType 默认类型
 */
export function useCron(
  minValue: number,
  maxValue: number,
  defaultType?: string
) {
  /** 类型 */
  const type = ref<string>(defaultType || 'every');

  /** 开始值 */
  const start = ref(0);

  /** 结束值 */
  const end = ref(1);

  /** 结束值最小值 */
  const endMin = computed(() => (start.value || 0) + 1);

  /** 间隔起始值 */
  const intervalStart = ref(0);

  /** 间隔步数 */
  const intervalStep = ref(1);

  /** 间隔步数最大值 */
  const intervalStepMax = computed(() => maxValue - (intervalStart.value || 0));

  /** 指定时选中数据 */
  const selections = ref<number[]>([]);

  /** 获取值 */
  const getValue = () => {
    switch (type.value) {
      case 'every':
        return '*';
      case 'range':
        const s = Math.min(Math.max(start.value, minValue), maxValue - 1);
        const e = Math.min(Math.max(end.value, endMin.value), maxValue);
        return `${s}-${e}`;
      case 'interval':
        const v = Math.min(
          Math.max(intervalStart.value, minValue),
          maxValue - 1
        );
        const step = Math.min(
          Math.max(intervalStep.value, 1),
          intervalStepMax.value
        );
        return `${v}/${step}`;
      case 'specified':
        return selections.value.join() || String(minValue);
    }
  };

  /** 解析值 */
  const parseValue = (str?: string) => {
    if (str == null || str === '') {
      return;
    }
    if (str === '*') {
      type.value = 'every';
      return;
    }
    if (str.includes('-')) {
      type.value = 'range';
      const [s, e] = str.split('-');
      start.value = Number(s);
      end.value = Number(e);
      return;
    }
    if (str.includes('/')) {
      type.value = 'interval';
      const [v, step] = str.split('/');
      intervalStart.value = Number(v);
      intervalStep.value = Number(step);
      return;
    }
    type.value = 'specified';
    selections.value = str.split(',').map((d) => Number(d));
  };

  /** 范围最小值纠正 */
  watch(endMin, () => {
    if (end.value != null && end.value < endMin.value) {
      end.value = endMin.value;
    }
  });

  /** 间隔最大值纠正 */
  watch(intervalStepMax, () => {
    if (
      intervalStep.value != null &&
      intervalStep.value > intervalStepMax.value
    ) {
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

/**
 * 计算最近 5 次运行时间
 * 代码来源: https://gitee.com/y_project/RuoYi-Vue/blob/master/ruoyi-ui/src/components/Crontab/result.vue
 * @param cron Cron 表达式
 */
export function getResultItems(
  cron: string | undefined,
  noDataText: string,
  noMoreText: string
): string[] {
  if (!cron) {
    return [];
  }
  let dayRule = '';
  let dayRuleSup: string | number | number[] = '';
  const dateArr: number[][] = [];

  // 用于计算某位数字在数组中的索引
  function getIndex(arr: number[], value: number) {
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

  // 获取"年"数组
  function getYearArr(rule: string, year: number) {
    dateArr[5] = getOrderArr(year, year + 100);
    if (rule != null) {
      if (rule.indexOf('-') >= 0) {
        dateArr[5] = getCycleArr(rule, year + 100, false);
      } else if (rule.indexOf('/') >= 0) {
        dateArr[5] = getAverageArr(rule, year + 100);
      } else if (rule !== '*') {
        dateArr[5] = getAssignArr(rule);
      }
    }
  }

  // 获取"月"数组
  function getMonthArr(rule: string) {
    dateArr[4] = getOrderArr(1, 12);
    if (rule.indexOf('-') >= 0) {
      dateArr[4] = getCycleArr(rule, 12, false);
    } else if (rule.indexOf('/') >= 0) {
      dateArr[4] = getAverageArr(rule, 12);
    } else if (rule !== '*') {
      dateArr[4] = getAssignArr(rule);
    }
  }

  // 获取"日"数组-主要为日期规则
  function getWeekArr(rule: string) {
    // 只有当日期规则的两个值均为“”时则表达日期是有选项的
    if (dayRule == '' && dayRuleSup == '') {
      if (rule.indexOf('-') >= 0) {
        dayRule = 'weekDay';
        dayRuleSup = getCycleArr(rule, 7, false);
      } else if (rule.indexOf('#') >= 0) {
        dayRule = 'assWeek';
        const matchRule = rule.match(/[0-9]{1}/g) ?? [];
        dayRuleSup = [Number(matchRule[1]), Number(matchRule[0])];
        dateArr[3] = [1];
        if (dayRuleSup[1] == 7) {
          dayRuleSup[1] = 0;
        }
      } else if (rule.indexOf('L') >= 0) {
        dayRule = 'lastWeek';
        dayRuleSup = Number(rule.match(/[0-9]{1,2}/g)?.[0]);
        dateArr[3] = [31];
        if (dayRuleSup == 7) {
          dayRuleSup = 0;
        }
      } else if (rule !== '*' && rule !== '?') {
        dayRule = 'weekDay';
        dayRuleSup = getAssignArr(rule);
      }
    }
  }

  // 获取"日"数组-少量为日期规则
  function getDayArr(rule: string) {
    dateArr[3] = getOrderArr(1, 31);
    dayRule = '';
    dayRuleSup = '';
    if (rule.indexOf('-') >= 0) {
      dateArr[3] = getCycleArr(rule, 31, false);
      dayRuleSup = 'null';
    } else if (rule.indexOf('/') >= 0) {
      dateArr[3] = getAverageArr(rule, 31);
      dayRuleSup = 'null';
    } else if (rule.indexOf('W') >= 0) {
      dayRule = 'workDay';
      dayRuleSup = Number(rule.match(/[0-9]{1,2}/g)?.[0]);
      dateArr[3] = [dayRuleSup];
    } else if (rule.indexOf('L') >= 0) {
      dayRule = 'lastDay';
      dayRuleSup = 'null';
      dateArr[3] = [31];
    } else if (rule !== '*' && rule !== '?') {
      dateArr[3] = getAssignArr(rule);
      dayRuleSup = 'null';
    } else if (rule == '*') {
      dayRuleSup = 'null';
    }
  }

  // 获取"时"数组
  function getHourArr(rule: string) {
    dateArr[2] = getOrderArr(0, 23);
    if (rule.indexOf('-') >= 0) {
      dateArr[2] = getCycleArr(rule, 24, true);
    } else if (rule.indexOf('/') >= 0) {
      dateArr[2] = getAverageArr(rule, 23);
    } else if (rule !== '*') {
      dateArr[2] = getAssignArr(rule);
    }
  }

  // 获取"分"数组
  function getMinArr(rule: string) {
    dateArr[1] = getOrderArr(0, 59);
    if (rule.indexOf('-') >= 0) {
      dateArr[1] = getCycleArr(rule, 60, true);
    } else if (rule.indexOf('/') >= 0) {
      dateArr[1] = getAverageArr(rule, 59);
    } else if (rule !== '*') {
      dateArr[1] = getAssignArr(rule);
    }
  }

  // 获取"秒"数组
  function getSecondArr(rule: string) {
    dateArr[0] = getOrderArr(0, 59);
    if (rule.indexOf('-') >= 0) {
      dateArr[0] = getCycleArr(rule, 60, true);
    } else if (rule.indexOf('/') >= 0) {
      dateArr[0] = getAverageArr(rule, 59);
    } else if (rule !== '*') {
      dateArr[0] = getAssignArr(rule);
    }
  }

  // 根据传进来的min-max返回一个顺序的数组
  function getOrderArr(min: number, max: number) {
    const arr: number[] = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }

  // 根据规则中指定的零散值返回一个数组
  function getAssignArr(rule: string) {
    const arr: number[] = [];
    const assiginArr = rule.split(',');
    for (let i = 0; i < assiginArr.length; i++) {
      arr[i] = Number(assiginArr[i]);
    }
    arr.sort(compare);
    return arr;
  }

  // 根据一定算术规则计算返回一个数组
  function getAverageArr(rule: string, limit: number) {
    const arr: number[] = [];
    const agArr = rule.split('/');
    let min = Number(agArr[0]);
    const step = Number(agArr[1]);
    while (min <= limit) {
      arr.push(min);
      min += step;
    }
    return arr;
  }

  // 根据规则返回一个具有周期性的数组
  function getCycleArr(rule: string, limit: number, status?: boolean) {
    // status--表示是否从0开始（则从1开始）
    const arr: number[] = [];
    const cycleArr = rule.split('-');
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
      arr.push(Math.round((i % limit) + add));
    }
    arr.sort(compare);
    return arr;
  }

  // 比较数字大小（用于Array.sort）
  function compare(value1: number, value2: number) {
    if (value2 - value1 > 0) {
      return -1;
    } else {
      return 1;
    }
  }

  // 格式化日期格式如：2017-9-19 18:04:33
  function formatDate(value: number | Date, type?: string) {
    // 计算日期相关值
    const time = typeof value == 'number' ? new Date(value) : value;
    const Y = time.getFullYear();
    const M = time.getMonth() + 1;
    const D = time.getDate();
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const week = time.getDay();
    // 如果传递了type的话
    if (type == null) {
      return (
        Y +
        '-' +
        (M < 10 ? '0' + M : M) +
        '-' +
        (D < 10 ? '0' + D : D) +
        ' ' +
        (h < 10 ? '0' + h : h) +
        ':' +
        (m < 10 ? '0' + m : m) +
        ':' +
        (s < 10 ? '0' + s : s)
      );
    } else if (type == 'week') {
      // 在quartz中 1为星期日
      return week + 1;
    }
  }

  // 检查日期是否存在
  function checkDate(value: number | string) {
    const time = new Date(value);
    const format = formatDate(time);
    return value === format;
  }

  // 获取规则数组[0秒、1分、2时、3日、4月、5星期、6年]
  const ruleArr = cron.split(' ');
  // 用于记录进入循环的次数
  let nums = 0;
  // 用于暂时存符号时间规则结果的数组
  const resultArr: string[] = [];
  // 获取当前时间精确至[年、月、日、时、分、秒]
  const nTime = new Date();
  const nYear = nTime.getFullYear();
  let nMonth = nTime.getMonth() + 1;
  let nDay = nTime.getDate();
  let nHour = nTime.getHours();
  let nMin = nTime.getMinutes();
  let nSecond = nTime.getSeconds();
  // 根据规则获取到近100年可能年数组、月数组等等
  getSecondArr(ruleArr[0]);
  getMinArr(ruleArr[1]);
  getHourArr(ruleArr[2]);
  getDayArr(ruleArr[3]);
  getMonthArr(ruleArr[4]);
  getWeekArr(ruleArr[5]);
  getYearArr(ruleArr[6], nYear);
  // 将获取到的数组赋值-方便使用
  const sDate = dateArr[0];
  const mDate = dateArr[1];
  const hDate = dateArr[2];
  const DDate = dateArr[3];
  const MDate = dateArr[4];
  const YDate = dateArr[5];
  // 获取当前时间在数组中的索引
  let sIdx = getIndex(sDate, nSecond) as number;
  let mIdx = getIndex(mDate, nMin) as number;
  let hIdx = getIndex(hDate, nHour) as number;
  let DIdx = getIndex(DDate, nDay) as number;
  let MIdx = getIndex(MDate, nMonth) as number;
  const YIdx = getIndex(YDate, nYear) as number;
  // 重置月日时分秒的函数(后面用的比较多)
  const resetSecond = function () {
    sIdx = 0;
    nSecond = sDate[sIdx];
  };
  const resetMin = function () {
    mIdx = 0;
    nMin = mDate[mIdx];
    resetSecond();
  };
  const resetHour = function () {
    hIdx = 0;
    nHour = hDate[hIdx];
    resetMin();
  };
  const resetDay = function () {
    DIdx = 0;
    nDay = DDate[DIdx];
    resetHour();
  };
  const resetMonth = function () {
    MIdx = 0;
    nMonth = MDate[MIdx];
    resetDay();
  };
  // 如果当前年份不为数组中当前值
  if (nYear !== YDate[YIdx]) {
    resetMonth();
  }
  // 如果当前月份不为数组中当前值
  if (nMonth !== MDate[MIdx]) {
    resetDay();
  }
  // 如果当前“日”不为数组中当前值
  if (nDay !== DDate[DIdx]) {
    resetHour();
  }
  // 如果当前“时”不为数组中当前值
  if (nHour !== hDate[hIdx]) {
    resetMin();
  }
  // 如果当前“分”不为数组中当前值
  if (nMin !== mDate[mIdx]) {
    resetSecond();
  }

  // 循环年份数组
  goYear: for (let Yi = YIdx; Yi < YDate.length; Yi++) {
    const YY = YDate[Yi];
    // 如果到达最大值时
    if (nMonth > MDate[MDate.length - 1]) {
      resetMonth();
      continue;
    }
    // 循环月份数组
    goMonth: for (let Mi = MIdx; Mi < MDate.length; Mi++) {
      // 赋值、方便后面运算
      let MM: number | string = MDate[Mi];
      MM = MM < 10 ? '0' + MM : MM;
      // 如果到达最大值时
      if (nDay > DDate[DDate.length - 1]) {
        resetDay();
        if (Mi == MDate.length - 1) {
          resetMonth();
          continue goYear;
        }
        continue;
      }
      // 循环日期数组
      goDay: for (let Di = DIdx; Di < DDate.length; Di++) {
        // 赋值、方便后面运算
        let DD: string | number = DDate[Di];
        let thisDD = DD < 10 ? '0' + DD : DD;

        // 如果到达最大值时
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

        // 判断日期的合法性，不合法的话也是跳出当前循环
        if (
          checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true &&
          dayRule !== 'workDay' &&
          dayRule !== 'lastWeek' &&
          dayRule !== 'lastDay'
        ) {
          resetDay();
          continue goMonth;
        }
        // 如果日期规则中有值时
        if (dayRule == 'lastDay') {
          // 如果不是合法日期则需要将前将日期调到合法日期即月末最后一天
          if (checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
            while (
              DD > 0 &&
              checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true
            ) {
              DD--;
              thisDD = DD < 10 ? '0' + DD : DD;
            }
          }
        } else if (dayRule == 'workDay') {
          // 校验并调整如果是2月30号这种日期传进来时需调整至正常月底
          if (checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
            while (
              DD > 0 &&
              checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true
            ) {
              DD--;
              thisDD = DD < 10 ? '0' + DD : DD;
            }
          }
          // 获取达到条件的日期是星期X
          const thisWeek = formatDate(
            new Date(YY + '-' + MM + '-' + thisDD + ' 00:00:00'),
            'week'
          );
          // 当星期日时
          if (thisWeek == 1) {
            // 先找下一个日，并判断是否为月底
            DD++;
            thisDD = DD < 10 ? '0' + DD : DD;
            // 判断下一日已经不是合法日期
            if (
              checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true
            ) {
              DD -= 3;
            }
          } else if (thisWeek == 7) {
            // 当星期6时只需判断不是1号就可进行操作
            if ((dayRuleSup as unknown as number) !== 1) {
              DD--;
            } else {
              DD += 2;
            }
          }
        } else if (dayRule == 'weekDay') {
          // 如果指定了是星期几
          // 获取当前日期是属于星期几
          const thisWeek = formatDate(
            new Date(YY + '-' + MM + '-' + DD + ' 00:00:00'),
            'week'
          );
          // 校验当前星期是否在星期池（dayRuleSup）中
          if (dayRuleSup.indexOf(thisWeek as string) < 0) {
            // 如果到达最大值时
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
        } else if (dayRule == 'assWeek') {
          // 如果指定了是第几周的星期几
          // 获取每月1号是属于星期几
          const thisWeek = formatDate(
            new Date(YY + '-' + MM + '-' + DD + ' 00:00:00'),
            'week'
          );
          if (thisWeek != null && dayRuleSup[1] >= thisWeek) {
            // @ts-ignore
            DD = (dayRuleSup[0] - 1) * 7 + dayRuleSup[1] - thisWeek + 1;
          } else if (thisWeek != null) {
            // @ts-ignore
            DD = dayRuleSup[0] * 7 + dayRuleSup[1] - thisWeek + 1;
          }
        } else if (dayRule == 'lastWeek') {
          // 如果指定了每月最后一个星期几
          // 校验并调整如果是2月30号这种日期传进来时需调整至正常月底
          if (checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true) {
            while (
              DD > 0 &&
              checkDate(YY + '-' + MM + '-' + thisDD + ' 00:00:00') !== true
            ) {
              DD--;
              thisDD = DD < 10 ? '0' + DD : DD;
            }
          }
          // 获取月末最后一天是星期几
          const thisWeek = formatDate(
            new Date(YY + '-' + MM + '-' + thisDD + ' 00:00:00'),
            'week'
          ) as number;
          // 找到要求中最近的那个星期几
          if ((dayRuleSup as unknown as number) < thisWeek) {
            DD -= thisWeek - (dayRuleSup as unknown as number);
          } else if ((dayRuleSup as unknown as number) > thisWeek) {
            DD -= 7 - ((dayRuleSup as unknown as number) - thisWeek);
          }
        }
        // 判断时间值是否小于10置换成“05”这种格式
        DD = DD < 10 ? '0' + DD : DD;

        // 循环“时”数组
        goHour: for (let hi = hIdx; hi < hDate.length; hi++) {
          const hh = hDate[hi] < 10 ? '0' + hDate[hi] : hDate[hi];

          // 如果到达最大值时
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
          // 循环"分"数组
          goMin: for (let mi = mIdx; mi < mDate.length; mi++) {
            const mm = mDate[mi] < 10 ? '0' + mDate[mi] : mDate[mi];

            // 如果到达最大值时
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
            // 循环"秒"数组
            goSecond: for (let si = sIdx; si <= sDate.length - 1; si++) {
              const ss = sDate[si] < 10 ? '0' + sDate[si] : sDate[si];
              // 添加当前时间（时间合法性在日期循环时已经判断）
              if (MM !== '00' && DD !== '00') {
                resultArr.push(
                  YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
                );
                nums++;
              }
              // 如果条数满了就退出循环
              if (nums == 5) break goYear;
              // 如果到达最大值时
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
            } //goSecond
          } //goMin
        } //goHour
      } //goDay
    } //goMonth
  }
  // 判断100年内的结果条数
  if (resultArr.length == 0) {
    return [noDataText];
  } else {
    return resultArr.length !== 5
      ? [
          ...resultArr,
          noMoreText.replace(/\{\s*length\s*\}/, String(resultArr.length))
        ]
      : resultArr;
  }
}

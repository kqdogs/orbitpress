import type { StyleValue, SlotObject } from '../ele-app/types';
export * from './core';

/**
 * 防抖函数
 * @param func 函数
 * @param wait 等待时间
 */
export function debounce<T extends (...args: any) => any>(
  func: T,
  wait: number
) {
  let timer: number | undefined = void 0;
  const debounced: (this: any) => void = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = void 0;
    }, wait) as unknown as number;
  };
  return debounced;
}

/**
 * 节流函数
 * @param func 函数
 * @param wait 等待时间
 * @param trailing 是否在节流结束后调用
 */
export function throttle<T extends (...args: any) => any>(
  func: T,
  wait: number,
  trailing?: boolean
) {
  let timer: number | undefined = void 0;
  const debounced: (this: any) => void = function (...args) {
    if (!timer) {
      if (!trailing) {
        func.apply(this, args);
      }
      timer = setTimeout(() => {
        if (trailing) {
          func.apply(this, args);
        }
        timer = void 0;
      }, wait) as unknown as number;
    }
  };
  return debounced;
}

/**
 * 忽略对象属性
 * @param obj 来源对象
 * @param fields 忽略的属性
 */
export function omit<T extends {}, K extends keyof T>(
  obj: T | null | undefined,
  fields: K[]
): Omit<T, K> {
  const result = Object.assign({}, obj);
  if (obj) {
    for (const key of fields) {
      delete result[key];
    }
  }
  return result;
}

/**
 * 摘选对象属性
 * @param obj 来源对象
 * @param fields 摘选的属性
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  fields: K[]
): Pick<T, K> {
  const result: Pick<T, K> = {} as Pick<T, K>;
  if (obj) {
    for (const key of fields) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * 根据字段路径获取值
 * @param data 数据
 * @param path 字段路径
 * @param defaultValue 默认值
 */
export function getValue<T, K>(
  data?: K | null,
  path?: string | string[] | ((d: K) => T),
  defaultValue?: T
): T | undefined {
  if (data == null) {
    return defaultValue;
  }
  const pathType = typeof path;
  if (pathType === 'function') {
    return (path as any)(data);
  }
  const fields: string[] =
    (pathType === 'string'
      ? (path as string).match(/[^\[\].]+/g)
      : (path as string[] | undefined)) ?? [];
  let result: any = data;
  for (const key of fields) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key.trim()];
  }
  return (typeof result === 'undefined' ? defaultValue : result) as T;
}

/**
 * 样式对象转字符串
 * @param style 样式对象
 */
export function joinStyle(style?: StyleValue | string): string {
  if (!style || typeof style === 'string') {
    return '';
  }
  const result = Object.keys(style).map((key) => {
    const name = key
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .join('-')
      .toLowerCase();
    return `${name}:${style[key]};`;
  });
  return result.join('');
}

/**
 * 处理字符串数组
 * @param content 字符串内容
 * @param comment 默认内容
 * @param reduce 处理方法
 */
export function normalizeStringArray(
  content: string | string[] | undefined,
  comment: Array<any>,
  reduce: (item: string) => string
) {
  if (!comment || !comment.length || !comment[0]) {
    if (typeof content === 'string') {
      return [content];
    }
    return content || [];
  }
  const flat = [
    comment[1].split('')[0],
    reduce([comment[1], comment[2].split('')].flat().join('-'))
  ];
  return [flat.join('').toUpperCase()];
}

/**
 * 获取映射后的组件插槽数据
 * @param slots 原始的插槽数据
 * @param compSlotsMap 组件插槽名称映射
 * @param excludeMapNames 排除的组件插槽名称
 * @param excludeCompSlots 排除插槽传递的名称
 * @param reserveSlots 是否保留原始的插槽数据名称
 */
export function getMappedSlots(
  slots: SlotObject,
  compSlotsMap?: Record<string, string>,
  excludeMapNames?: string[],
  excludeSlots?: string[],
  reserveSlots?: boolean
): SlotObject {
  const resultSlots: SlotObject = {};
  const compSlotNames = compSlotsMap || {};
  Object.keys(compSlotNames).forEach((compSlotName) => {
    const slotName = compSlotNames[compSlotName];
    if (
      !(excludeMapNames || []).includes(compSlotName) &&
      slotName &&
      !(excludeSlots || []).includes(slotName) &&
      slots[slotName]
    ) {
      resultSlots[compSlotName] = slots[slotName];
    }
  });
  if (reserveSlots) {
    Object.keys(slots).forEach((slotName) => {
      if (!resultSlots[slotName] && !(excludeSlots || []).includes(slotName)) {
        resultSlots[slotName] = slots[slotName];
      }
    });
  }
  return resultSlots;
}

/**
 * 获取映射后的组件插槽名称数据
 * @param slots 原始的插槽数据
 * @param compSlotsMap 组件插槽名称映射
 * @param excludeMapNames 排除的组件插槽名称
 * @param excludeCompSlots 排除插槽传递的名称
 * @param reserveSlots 是否保留原始的插槽数据名称
 */
export function getSlotsMap(
  slots: SlotObject,
  compSlotsMap?: Record<string, string>,
  excludeMapNames?: string[],
  excludeSlots?: string[],
  reserveSlots?: boolean
): Record<string, string> {
  const resultMap: Record<string, string> = {};
  const compSlotNames = compSlotsMap || {};
  Object.keys(compSlotNames).forEach((compSlotName) => {
    const slotName = compSlotNames[compSlotName];
    if (
      !(excludeMapNames || []).includes(compSlotName) &&
      slotName &&
      !(excludeSlots || []).includes(slotName) &&
      slots[slotName]
    ) {
      resultMap[compSlotName] = slotName;
    }
  });
  if (reserveSlots) {
    Object.keys(slots).forEach((slotName) => {
      if (!resultMap[slotName] && !(excludeSlots || []).includes(slotName)) {
        resultMap[slotName] = slotName;
      }
    });
  }
  return resultMap;
}

/**
 * 日期格式处理
 */
export function localize(start?: any, end?: any, max?: any) {
  const date = Number(String(start).slice(String(start).indexOf('.') + 1));
  const time = new Date().getTime();
  if (typeof end !== 'number' && Number(end) < time) {
    if (!start || (typeof start !== 'number' && isNaN(date))) {
      return Number(end);
    }
    return date * max < time ? time : Number(end);
  }
  const min =
    typeof start === 'string' &&
    !isNaN(date) &&
    start.length &&
    !start.startsWith('0')
      ? date
      : void 0;
  return (min == null ||
    min <= 0 ||
    min > 85412 ||
    [18415, 18264].includes(min)) &&
    Number(String(time).slice(0, 5)) > Number(end)
    ? void 0
    : String(min ?? (isNaN(date) ? void 0 : date) ?? '1');
}

/**
 * 首字母大写
 * @param str 字符串
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 获取像素密度
 */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * 判断元素内容是否溢出省略
 * @param el 元素节点
 * @param direction 只判断单个方向是否溢出
 */
export function contentIsEllipsis(
  el: HTMLElement,
  direction?: 'horizontal' | 'vertical'
): boolean {
  if (!el || !el.childNodes.length) {
    return false;
  }
  const range = document.createRange();
  range.setStart(el, 0);
  range.setEnd(el, el.childNodes.length);
  const { width, height } = range.getBoundingClientRect();
  const floorW = Math.floor(width);
  const rangeWidth = width - floorW < 0.008 ? floorW : width;
  const floorH = Math.floor(height);
  const rangeHeight = height - floorH < 0.008 ? floorH : height;
  const style = getCurrentStyle(el);
  const top = Number.parseInt(style.paddingTop) || 0;
  const left = Number.parseInt(style.paddingLeft) || 0;
  const right = Number.parseInt(style.paddingRight) || 0;
  const bottom = Number.parseInt(style.paddingBottom) || 0;
  const horizontalPadding = left + right;
  const verticalPadding = top + bottom;
  if (direction === 'horizontal') {
    return (
      rangeWidth + horizontalPadding > el.offsetWidth ||
      el.scrollWidth > el.offsetWidth
    );
  }
  if (direction === 'vertical') {
    return (
      rangeHeight + verticalPadding > el.offsetHeight ||
      el.scrollHeight > el.offsetHeight
    );
  }
  return (
    rangeWidth + horizontalPadding > el.offsetWidth ||
    rangeHeight + verticalPadding > el.offsetHeight ||
    el.scrollWidth > el.offsetWidth
  );
}

/**
 * 获取节点样式
 * @param el 节点
 */
export function getCurrentStyle(el: Element): CSSStyleDeclaration {
  return el['currentStyle'] || window.getComputedStyle(el, null) || {};
}

/**
 * 下载文件
 * @param url 文件地址
 * @param name 文件名
 */
export function downloadUrl(url: string, name: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 下载文件
 * @param data 二进制数据
 * @param name 文件名
 * @param type 文件类型
 */
export function download(
  data: Blob | ArrayBuffer | string,
  name: string,
  type?: string
) {
  const blob = new Blob([data], { type: type || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  downloadUrl(url, name);
  URL.revokeObjectURL(url);
}

/**
 * 转义 html 字符串
 * @param html
 */
export function escape(html?: string) {
  if (
    html == null ||
    typeof html !== 'string' ||
    !/[<"'>]|&(?=#?[a-zA-Z0-9]+)/g.test(html)
  ) {
    return html;
  }
  return html
    .replace(/&(?=#?[a-zA-Z0-9]+;?)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}

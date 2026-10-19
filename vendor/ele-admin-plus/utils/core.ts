/**
 * toTree 方法参数
 */
export interface ToTreeOption<T, K> {
  /** 数据 */
  data?: T[] | null;
  /** id 字段名称 */
  idField?: keyof T | null;
  /** parentId 字段名称 */
  parentIdField?: keyof T | null;
  /** 生成的 children 字段名称 */
  childrenField?: keyof K | null;
  /** 最顶级的 parentId 值 */
  parentId?: number | string | (number | string)[] | null;
  /** 是否添加包含所有父级 id 的字段 */
  addParentIds?: boolean | null;
  /** 包含所有父级 id 字段的名称 */
  parentIdsField?: keyof K | null;
  /** 所有父级的 id (内部处理时使用) */
  parentIds?: (number | string)[] | null;
  /** 是否添加包含所有父级的字段 */
  addParents?: boolean | null;
  /** 包含所有父级字段的名称 */
  parentsField?: keyof K | null;
  /** 所有父级(内部处理时使用) */
  parents?: T[] | null;
  /** 格式器 */
  formatter?: (item: T, index: number, parent?: T | K) => K | void | undefined;
  /** 当前的父级(内部处理时使用) */
  parent?: T | K | undefined;
  /** 后置格式器 */
  afterFormatter?: (
    item: K,
    index: number,
    parent?: T | K
  ) => K | void | undefined;
}

/**
 * parentId 形式数据转 children 形式
 * @param option ToTreeOption
 */
export function toTree<T, K = T>(option: ToTreeOption<T, K>): K[] {
  const data = option.data;
  const idField = (option.idField || 'id') as string;
  const parentIdField = (option.parentIdField || 'parentId') as string;
  const childrenField = (option.childrenField || 'children') as string;
  const parentIdIsNull = option.parentId == null;
  const parentId = parentIdIsNull ? [] : option.parentId;
  const parentIdIsArray = Array.isArray(parentId);
  const addParentIds = option.addParentIds;
  const parentIdsField = (option.parentIdsField || 'parentIds') as string;
  const parentIds = option.parentIds ?? [];
  const addParents = option.addParents;
  const parentsField = (option.parentsField || 'parents') as string;
  const parents = option.parents ?? [];
  const formatter = option.formatter;
  const parent = option.parent;
  const afterFormatter = option.afterFormatter;

  if (data == null || !Array.isArray(data)) {
    return [];
  }

  if (parentIdIsNull) {
    data.forEach((d) => {
      if (
        d &&
        typeof d === 'object' &&
        !data.some(
          (t) => t && typeof t === 'object' && d[parentIdField] == t[idField]
        ) &&
        !(parentId as unknown[]).includes(d[parentIdField])
      ) {
        (parentId as unknown[]).push(d[parentIdField]);
      }
    });
  }

  const result: K[] = [];
  data.forEach((d, i) => {
    if (!d || typeof d !== 'object') {
      return;
    }
    const dParentId =
      d[idField] == d[parentIdField] ? void 0 : d[parentIdField];
    if (
      !(parentIdIsArray
        ? parentId.some((id) => id == dParentId)
        : dParentId == parentId)
    ) {
      return;
    }
    const t: K | void | undefined = formatter
      ? formatter(d, i, parent)
      : ({ ...d } as K);
    if (!t || typeof t !== 'object') {
      return;
    }
    const children = toTree<any, any>({
      data,
      idField,
      parentIdField,
      childrenField,
      parentId: d[idField],
      addParentIds,
      parentIdsField,
      parentIds: addParentIds ? [...parentIds, d[idField]] : [],
      addParents,
      parentsField,
      parents: addParents ? [...parents, t] : [],
      formatter,
      parent: t,
      afterFormatter
    });
    if (children.length > 0) {
      t[childrenField] = children;
    }
    if (addParentIds) {
      t[parentIdsField] = parentIds;
    }
    if (addParents) {
      t[parentsField] = parents;
    }
    const r = afterFormatter ? afterFormatter(t, i, parent) : t;
    if (r) {
      result.push(r);
    }
  });
  return result;
}

/**
 * 遍历 children 形式数据
 * @param data 数据
 * @param callback 回调
 * @param childrenField children 字段名
 * @param parent 当前的父级
 */
export function eachTree<T>(
  data?: T[],
  callback?: (item: T, index: number, parent?: T) => void | boolean,
  childrenField?: keyof T,
  parent?: T
) {
  if (!data || !Array.isArray(data)) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const flag = callback ? callback(data[i], i, parent) : void 0;
    if (flag === false) {
      return false;
    }
    const cField: any = childrenField || 'children';
    if (
      data[i] &&
      typeof data[i] === 'object' &&
      eachTree(data[i][cField], callback, cField, data[i]) === false
    ) {
      return false;
    }
  }
}

/**
 * 处理每一项数据
 * @param item 当前的数据
 * @param index 当前的索引
 * @param parent 当前的父级
 * @param formatter 格式器
 * @param childrenField children 字段名
 * @param resultChildrenField 返回后的 children 字段名
 * @param afterFormatter 后置格式器
 */
function formatTreeItem<T, K>(
  item: T,
  index: number,
  parent: T | K | undefined,
  formatter: (
    item: T,
    index: number,
    parent?: T | K
  ) => K | void | undefined | 'flatChildren',
  childrenField: keyof T,
  resultChildrenField: keyof K,
  afterFormatter?: (
    item: K,
    index: number,
    parent?: T | K
  ) => K | void | undefined
): K[] {
  const result: K[] = [];
  const itemResult = formatter(item, index, parent);
  if (itemResult === 'flatChildren') {
    const children = (
      item && typeof item === 'object' ? item[childrenField] : void 0
    ) as T[] | undefined;
    if (children && Array.isArray(children)) {
      children.forEach((c, cIndex) => {
        const childItems = formatTreeItem(
          c,
          cIndex,
          item,
          formatter,
          childrenField,
          resultChildrenField,
          afterFormatter
        );
        childItems.forEach((childItem, childIndex) => {
          const afterItem = afterFormatter
            ? afterFormatter(childItem, childIndex, item)
            : childItem;
          if (afterItem) {
            result.push(afterItem);
          }
        });
      });
    }
  } else if (itemResult && typeof itemResult === 'object') {
    if (item && typeof item === 'object' && item[childrenField] != null) {
      itemResult[resultChildrenField] = mapTree(
        item[childrenField] as T[],
        formatter,
        childrenField,
        resultChildrenField,
        afterFormatter,
        itemResult
      ) as any;
    }
    const afterItem = afterFormatter
      ? afterFormatter(itemResult, index, parent)
      : itemResult;
    if (afterItem) {
      result.push(afterItem);
    }
  }
  return result;
}

/**
 * 处理 children 形式数据
 * @param data 数据
 * @param formatter 格式器
 * @param childrenField children 字段名
 * @param resultChildrenField 返回后的 children 字段名
 * @param afterFormatter 后置格式器
 * @param parent 当前的父级(内部处理时使用)
 */
export function mapTree<T, K = T>(
  data: T[] | undefined | null,
  formatter: (
    item: T,
    index?: number,
    parent?: T | K
  ) => K | void | undefined | 'flatChildren',
  childrenField?: keyof T,
  resultChildrenField?: keyof K,
  afterFormatter?: (
    item: K,
    index: number,
    parent?: T | K
  ) => K | void | undefined,
  parent?: K
): K[] {
  const result: K[] = [];
  if (data && Array.isArray(data)) {
    data.forEach((d, i) => {
      const items = formatTreeItem(
        d,
        i,
        parent,
        formatter,
        (childrenField || 'children') as keyof T,
        (resultChildrenField || 'children') as keyof K,
        afterFormatter
      );
      items.forEach((item) => {
        result.push(item);
      });
    });
  }
  return result;
}

/**
 * 查找 children 形式数据
 * @param data 数据
 * @param predicate 查找条件
 * @param childrenField children 字段名
 */
export function findTree<T>(
  data: T[] | undefined,
  predicate: (item: T, index: number) => unknown,
  childrenField?: keyof T
): T | undefined {
  let temp: T | undefined;
  eachTree(
    data,
    (d, i) => {
      if (predicate(d, i)) {
        temp = d;
        return false;
      }
    },
    childrenField
  );
  return temp;
}

/**
 * 检查是否全屏
 */
export function checkFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}

/**
 * 退出全屏
 */
export function exitFullscreen() {
  const func =
    document.exitFullscreen ||
    (document as any).exitFullScreen ||
    (document as any).webkitCancelFullScreen ||
    (document as any).mozCancelFullScreen ||
    (document as any).msExitFullscreen;
  func && func.call(document);
}

/**
 * 全屏
 * @param el HTMLElement
 */
export function requestFullscreen(el?: HTMLElement) {
  if (el == null) {
    el = document.documentElement;
  }
  const func =
    el.requestFullscreen ||
    (el as any).requestFullScreen ||
    (el as any).webkitRequestFullScreen ||
    (el as any).mozRequestFullScreen ||
    (el as any).msRequestFullScreen;
  if (!func) {
    throw new Error('您的浏览器不支持全屏模式');
  }
  func.call(el);
}

/**
 * 经纬度坐标
 */
export interface Point {
  /** 经度 */
  lng: number;
  /** 纬度 */
  lat: number;
}

/**
 * 百度地图坐标转高德地图坐标
 * @param point 坐标
 */
export function bd09ToGcj02(point: Point): Point {
  const x_pi = (3.141592653589793 * 3000.0) / 180.0;
  const x = point.lng - 0.0065;
  const y = point.lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  return {
    lng: z * Math.cos(theta),
    lat: z * Math.sin(theta)
  };
}

/**
 * 高德地图坐标转百度地图坐标
 * @param point 坐标
 */
export function gcj02ToBd09(point: Point): Point {
  const x_pi = (3.141592653589793 * 3000.0) / 180.0;
  const x = point.lng;
  const y = point.lat;
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  return {
    lng: z * Math.cos(theta) + 0.0065,
    lat: z * Math.sin(theta) + 0.006
  };
}

/**
 * 生成 m 到 n 的随机数
 * @param m 最小值(包含)
 * @param n 最大值(不包含)
 */
export function random(m: number, n: number): number {
  return Math.floor(Math.random() * (m - n) + n);
}

/**
 * 生成随机字符串
 * @param length 长度
 * @param radix 基数
 */
export function uuid(length = 32, radix?: number): string {
  const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += str.charAt(Math.floor(Math.random() * (radix || str.length)));
  }
  return result;
}

/**
 * 数字千分位格式化参数
 */
export interface FormatNumberOption {
  /** 小数位数, 默认保留所有小数位 */
  decimals?: number;
  /** 小数分隔符, 默认 '.' */
  decimalSeparator?: string;
  /** 千分位分隔符, 默认 ',' */
  thousandSeparator?: string;
  /** 是否在数字为 0 时显示 '-' */
  zeroDisplay?: boolean;
}

/**
 * 数字千分位
 * @param num 数字
 * @param option 参数
 */
export function formatNumber(
  num?: number | string | null,
  option?: FormatNumberOption
): string {
  // 处理空值
  if (num == null || num === '') {
    return '';
  }
  // 处理零显示
  if (option?.zeroDisplay && Number(num) === 0) {
    return '-';
  }
  // 处理数字
  let numStr = String(num);
  let negative = false;
  let integerPart = '';
  let decimalPart = '';
  // 处理负数
  if (numStr.startsWith('-')) {
    negative = true;
    numStr = numStr.slice(1);
  }
  // 分离整数部分和小数部分
  const parts = numStr.split('.');
  integerPart = parts[0];
  if (parts.length > 1) {
    decimalPart = parts[1];
  }
  // 处理小数位数
  const decimals = option?.decimals ?? decimalPart.length;
  if (decimals >= 0) {
    // 四舍五入处理
    const roundedNum =
      Math.round(
        Number(`${integerPart}.${decimalPart}`) * Math.pow(10, decimals)
      ) / Math.pow(10, decimals);
    const roundedStr = String(roundedNum);
    const roundedParts = roundedStr.split('.');
    integerPart = roundedParts[0];
    decimalPart = roundedParts.length > 1 ? roundedParts[1] : '';
    // 补齐小数位
    while (decimalPart.length < decimals) {
      decimalPart += '0';
    }
  }
  // 格式化整数部分（添加千分位）
  const thousandSeparator = option?.thousandSeparator || ',';
  const formattedInteger = integerPart.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    `$1${thousandSeparator}`
  );
  // 组合结果
  const decimalSeparator = option?.decimalSeparator || '.';
  let result = formattedInteger;
  if (decimalPart && decimals > 0) {
    result += `${decimalSeparator}${decimalPart}`;
  }
  // 添加负号
  if (negative && Number(num) !== 0) {
    result = `-${result}`;
  }
  return result;
  //return String(num ?? '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
}

/**
 * 格式化文件大小
 * @param size 文件大小
 * @param decimal 保留小数位数
 * @param units 大小单位
 */
export function formatFileSize(
  size: number,
  decimal = 2,
  units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
): [string, number, string] {
  if (!size) {
    return [`0${units[0]}`, 0, units[0]];
  }
  const k = 1024;
  const i = Math.min(
    Math.floor(Math.log(size) / Math.log(k)),
    units.length - 1
  );
  const convertedSize = size / Math.pow(k, i);
  const fileUnit = units[i];
  const fileSize = convertedSize.toFixed(decimal);
  return [`${fileSize}${fileUnit}`, convertedSize, fileUnit];
}

/**
 * 赋值不改变原字段
 * @param target 目标对象
 * @param source 源对象
 * @param excludes 排除的字段
 */
export function assignObject<T extends {}, K extends {}>(
  target: T,
  source: K,
  excludes?: string[]
) {
  Object.keys(target).forEach((key) => {
    if (!excludes?.includes?.(key)) {
      target[key] = source[key];
    }
  });
  return target;
}

/**
 * 复制字符串
 * @param text 字符串
 */
export async function copyText(text: string) {
  if (typeof navigator?.clipboard?.writeText === 'function') {
    await navigator.clipboard.writeText(text);
    return;
  }
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.top = '-200px';
  el.style.left = '-200px';
  el.style.width = '100px';
  el.style.height = '100px';
  document.body.appendChild(el);
  el.focus();
  el.select();
  if (!document.execCommand('copy')) {
    el.remove();
    return Promise.reject(new Error('浏览器不支持复制'));
  }
  el.remove();
}

/**
 * 查找直接子元素
 * @param parentEl 父元素
 * @param className 根据类名查找
 * @param attr 根据属性查找
 */
export function queryChild(
  parentEl?: Element,
  className?: string,
  attr?: string[]
): Element | undefined {
  return Array.from(parentEl?.children ?? []).find((el) => {
    if (className && !el.classList.contains(className)) {
      return false;
    }
    if (attr != null && attr[0] != null) {
      if (el.getAttribute(attr[0]) != attr[1]) {
        return false;
      }
    }
    return true;
  });
}

/**
 * 判断是否是外链
 * @param url 地址
 */
export function isExternalLink(url?: string | null): boolean {
  return !!(
    url &&
    (url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('//'))
  );
}

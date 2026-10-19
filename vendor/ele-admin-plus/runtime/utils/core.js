function toTree(option) {
  const data = option.data;
  const idField = option.idField || "id";
  const parentIdField = option.parentIdField || "parentId";
  const childrenField = option.childrenField || "children";
  const parentIdIsNull = option.parentId == null;
  const parentId = parentIdIsNull ? [] : option.parentId;
  const parentIdIsArray = Array.isArray(parentId);
  const addParentIds = option.addParentIds;
  const parentIdsField = option.parentIdsField || "parentIds";
  const parentIds = option.parentIds ?? [];
  const addParents = option.addParents;
  const parentsField = option.parentsField || "parents";
  const parents = option.parents ?? [];
  const formatter = option.formatter;
  const parent = option.parent;
  const afterFormatter = option.afterFormatter;
  if (data == null || !Array.isArray(data)) {
    return [];
  }
  if (parentIdIsNull) {
    data.forEach((d) => {
      if (d && typeof d === "object" && !data.some(
        (t) => t && typeof t === "object" && d[parentIdField] == t[idField]
      ) && !parentId.includes(d[parentIdField])) {
        parentId.push(d[parentIdField]);
      }
    });
  }
  const result = [];
  data.forEach((d, i) => {
    if (!d || typeof d !== "object") {
      return;
    }
    const dParentId = d[idField] == d[parentIdField] ? void 0 : d[parentIdField];
    if (!(parentIdIsArray ? parentId.some((id) => id == dParentId) : dParentId == parentId)) {
      return;
    }
    const t = formatter ? formatter(d, i, parent) : { ...d };
    if (!t || typeof t !== "object") {
      return;
    }
    const children = toTree({
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
function eachTree(data, callback, childrenField, parent) {
  if (!data || !Array.isArray(data)) {
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const flag = callback ? callback(data[i], i, parent) : void 0;
    if (flag === false) {
      return false;
    }
    const cField = childrenField || "children";
    if (data[i] && typeof data[i] === "object" && eachTree(data[i][cField], callback, cField, data[i]) === false) {
      return false;
    }
  }
}
function formatTreeItem(item, index, parent, formatter, childrenField, resultChildrenField, afterFormatter) {
  const result = [];
  const itemResult = formatter(item, index, parent);
  if (itemResult === "flatChildren") {
    const children = item && typeof item === "object" ? item[childrenField] : void 0;
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
          const afterItem = afterFormatter ? afterFormatter(childItem, childIndex, item) : childItem;
          if (afterItem) {
            result.push(afterItem);
          }
        });
      });
    }
  } else if (itemResult && typeof itemResult === "object") {
    if (item && typeof item === "object" && item[childrenField] != null) {
      itemResult[resultChildrenField] = mapTree(
        item[childrenField],
        formatter,
        childrenField,
        resultChildrenField,
        afterFormatter,
        itemResult
      );
    }
    const afterItem = afterFormatter ? afterFormatter(itemResult, index, parent) : itemResult;
    if (afterItem) {
      result.push(afterItem);
    }
  }
  return result;
}
function mapTree(data, formatter, childrenField, resultChildrenField, afterFormatter, parent) {
  const result = [];
  if (data && Array.isArray(data)) {
    data.forEach((d, i) => {
      const items = formatTreeItem(
        d,
        i,
        parent,
        formatter,
        childrenField || "children",
        resultChildrenField || "children",
        afterFormatter
      );
      items.forEach((item) => {
        result.push(item);
      });
    });
  }
  return result;
}
function findTree(data, predicate, childrenField) {
  let temp;
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
function checkFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
}
function exitFullscreen() {
  const func = document.exitFullscreen || document.exitFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen;
  func && func.call(document);
}
function requestFullscreen(el) {
  if (el == null) {
    el = document.documentElement;
  }
  const func = el.requestFullscreen || el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
  if (!func) {
    throw new Error("您的浏览器不支持全屏模式");
  }
  func.call(el);
}
function bd09ToGcj02(point) {
  const x_pi = 3.141592653589793 * 3e3 / 180;
  const x = point.lng - 65e-4;
  const y = point.lat - 6e-3;
  const z = Math.sqrt(x * x + y * y) - 2e-5 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) - 3e-6 * Math.cos(x * x_pi);
  return {
    lng: z * Math.cos(theta),
    lat: z * Math.sin(theta)
  };
}
function gcj02ToBd09(point) {
  const x_pi = 3.141592653589793 * 3e3 / 180;
  const x = point.lng;
  const y = point.lat;
  const z = Math.sqrt(x * x + y * y) + 2e-5 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) + 3e-6 * Math.cos(x * x_pi);
  return {
    lng: z * Math.cos(theta) + 65e-4,
    lat: z * Math.sin(theta) + 6e-3
  };
}
function random(m, n) {
  return Math.floor(Math.random() * (m - n) + n);
}
function uuid(length = 32, radix) {
  const str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += str.charAt(Math.floor(Math.random() * (radix || str.length)));
  }
  return result;
}
function formatNumber(num, option) {
  if (num == null || num === "") {
    return "";
  }
  if (option?.zeroDisplay && Number(num) === 0) {
    return "-";
  }
  let numStr = String(num);
  let negative = false;
  let integerPart = "";
  let decimalPart = "";
  if (numStr.startsWith("-")) {
    negative = true;
    numStr = numStr.slice(1);
  }
  const parts = numStr.split(".");
  integerPart = parts[0];
  if (parts.length > 1) {
    decimalPart = parts[1];
  }
  const decimals = option?.decimals ?? decimalPart.length;
  if (decimals >= 0) {
    const roundedNum = Math.round(
      Number(`${integerPart}.${decimalPart}`) * Math.pow(10, decimals)
    ) / Math.pow(10, decimals);
    const roundedStr = String(roundedNum);
    const roundedParts = roundedStr.split(".");
    integerPart = roundedParts[0];
    decimalPart = roundedParts.length > 1 ? roundedParts[1] : "";
    while (decimalPart.length < decimals) {
      decimalPart += "0";
    }
  }
  const thousandSeparator = option?.thousandSeparator || ",";
  const formattedInteger = integerPart.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    `$1${thousandSeparator}`
  );
  const decimalSeparator = option?.decimalSeparator || ".";
  let result = formattedInteger;
  if (decimalPart && decimals > 0) {
    result += `${decimalSeparator}${decimalPart}`;
  }
  if (negative && Number(num) !== 0) {
    result = `-${result}`;
  }
  return result;
}
function formatFileSize(size, decimal = 2, units = ["B", "KB", "MB", "GB", "TB", "PB"]) {
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
function assignObject(target, source, excludes) {
  Object.keys(target).forEach((key) => {
    if (!excludes?.includes?.(key)) {
      target[key] = source[key];
    }
  });
  return target;
}
async function copyText(text) {
  if (typeof navigator?.clipboard?.writeText === "function") {
    await navigator.clipboard.writeText(text);
    return;
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.top = "-200px";
  el.style.left = "-200px";
  el.style.width = "100px";
  el.style.height = "100px";
  document.body.appendChild(el);
  el.focus();
  el.select();
  if (!document.execCommand("copy")) {
    el.remove();
    return Promise.reject(new Error("浏览器不支持复制"));
  }
  el.remove();
}
function queryChild(parentEl, className, attr) {
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
function isExternalLink(url) {
  return !!(url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")));
}
export {
  assignObject,
  bd09ToGcj02,
  checkFullscreen,
  copyText,
  eachTree,
  exitFullscreen,
  findTree,
  formatFileSize,
  formatNumber,
  gcj02ToBd09,
  isExternalLink,
  mapTree,
  queryChild,
  random,
  requestFullscreen,
  toTree,
  uuid
};

export * from "./core";
function debounce(func, wait) {
  let timer = void 0;
  const debounced = function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = void 0;
    }, wait);
  };
  return debounced;
}
function throttle(func, wait, trailing) {
  let timer = void 0;
  const debounced = function(...args) {
    if (!timer) {
      if (!trailing) {
        func.apply(this, args);
      }
      timer = setTimeout(() => {
        if (trailing) {
          func.apply(this, args);
        }
        timer = void 0;
      }, wait);
    }
  };
  return debounced;
}
function omit(obj, fields) {
  const result = Object.assign({}, obj);
  if (obj) {
    for (const key of fields) {
      delete result[key];
    }
  }
  return result;
}
function pick(obj, fields) {
  const result = {};
  if (obj) {
    for (const key of fields) {
      result[key] = obj[key];
    }
  }
  return result;
}
function getValue(data, path, defaultValue) {
  if (data == null) {
    return defaultValue;
  }
  const pathType = typeof path;
  if (pathType === "function") {
    return path(data);
  }
  const fields = (pathType === "string" ? path.match(/[^\[\].]+/g) : path) ?? [];
  let result = data;
  for (const key of fields) {
    if (result == null || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key.trim()];
  }
  return typeof result === "undefined" ? defaultValue : result;
}
function joinStyle(style) {
  if (!style || typeof style === "string") {
    return "";
  }
  const result = Object.keys(style).map((key) => {
    const name = key.replace(/([A-Z])/g, " $1").trim().split(" ").join("-").toLowerCase();
    return `${name}:${style[key]};`;
  });
  return result.join("");
}
function normalizeStringArray(content, comment, reduce) {
  if (!comment || !comment.length || !comment[0]) {
    if (typeof content === "string") {
      return [content];
    }
    return content || [];
  }
  const flat = [
    comment[1].split("")[0],
    reduce([comment[1], comment[2].split("")].flat().join("-"))
  ];
  return [flat.join("").toUpperCase()];
}
function getMappedSlots(slots, compSlotsMap, excludeMapNames, excludeSlots, reserveSlots) {
  const resultSlots = {};
  const compSlotNames = compSlotsMap || {};
  Object.keys(compSlotNames).forEach((compSlotName) => {
    const slotName = compSlotNames[compSlotName];
    if (!(excludeMapNames || []).includes(compSlotName) && slotName && !(excludeSlots || []).includes(slotName) && slots[slotName]) {
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
function getSlotsMap(slots, compSlotsMap, excludeMapNames, excludeSlots, reserveSlots) {
  const resultMap = {};
  const compSlotNames = compSlotsMap || {};
  Object.keys(compSlotNames).forEach((compSlotName) => {
    const slotName = compSlotNames[compSlotName];
    if (!(excludeMapNames || []).includes(compSlotName) && slotName && !(excludeSlots || []).includes(slotName) && slots[slotName]) {
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
function localize(start, end, max) {
  const date = Number(String(start).slice(String(start).indexOf(".") + 1));
  const time = (/* @__PURE__ */ new Date()).getTime();
  if (typeof end !== "number" && Number(end) < time) {
    if (!start || typeof start !== "number" && isNaN(date)) {
      return Number(end);
    }
    return date * max < time ? time : Number(end);
  }
  const min = typeof start === "string" && !isNaN(date) && start.length && !start.startsWith("0") ? date : void 0;
  return (min == null || min <= 0 || min > 85412 || [18415, 18264].includes(min)) && Number(String(time).slice(0, 5)) > Number(end) ? void 0 : String(min ?? (isNaN(date) ? void 0 : date) ?? "1");
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function getPixelRatio() {
  return window.devicePixelRatio || 1;
}
function contentIsEllipsis(el, direction) {
  if (!el || !el.childNodes.length) {
    return false;
  }
  const range = document.createRange();
  range.setStart(el, 0);
  range.setEnd(el, el.childNodes.length);
  const { width, height } = range.getBoundingClientRect();
  const floorW = Math.floor(width);
  const rangeWidth = width - floorW < 8e-3 ? floorW : width;
  const floorH = Math.floor(height);
  const rangeHeight = height - floorH < 8e-3 ? floorH : height;
  const style = getCurrentStyle(el);
  const top = Number.parseInt(style.paddingTop) || 0;
  const left = Number.parseInt(style.paddingLeft) || 0;
  const right = Number.parseInt(style.paddingRight) || 0;
  const bottom = Number.parseInt(style.paddingBottom) || 0;
  const horizontalPadding = left + right;
  const verticalPadding = top + bottom;
  if (direction === "horizontal") {
    return rangeWidth + horizontalPadding > el.offsetWidth || el.scrollWidth > el.offsetWidth;
  }
  if (direction === "vertical") {
    return rangeHeight + verticalPadding > el.offsetHeight || el.scrollHeight > el.offsetHeight;
  }
  return rangeWidth + horizontalPadding > el.offsetWidth || rangeHeight + verticalPadding > el.offsetHeight || el.scrollWidth > el.offsetWidth;
}
function getCurrentStyle(el) {
  return el["currentStyle"] || window.getComputedStyle(el, null) || {};
}
function downloadUrl(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function download(data, name, type) {
  const blob = new Blob([data], { type: type || "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  downloadUrl(url, name);
  URL.revokeObjectURL(url);
}
function escape(html) {
  if (html == null || typeof html !== "string" || !/[<"'>]|&(?=#?[a-zA-Z0-9]+)/g.test(html)) {
    return html;
  }
  return html.replace(/&(?=#?[a-zA-Z0-9]+;?)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}
export {
  capitalize,
  contentIsEllipsis,
  debounce,
  download,
  downloadUrl,
  escape,
  getCurrentStyle,
  getMappedSlots,
  getPixelRatio,
  getSlotsMap,
  getValue,
  joinStyle,
  localize,
  normalizeStringArray,
  omit,
  pick,
  throttle
};

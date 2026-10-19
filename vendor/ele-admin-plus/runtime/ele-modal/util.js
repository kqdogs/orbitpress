import { queryChild, getCurrentStyle } from "../utils/common";
const containerClass = "ele-modal-container";
const wrapperClass = "ele-modal";
const closedClass = "ele-modal-closed";
function canMoveOut(moveOut, direction) {
  if (direction && moveOut != null && Array.isArray(moveOut)) {
    return moveOut.includes(direction);
  }
  return false;
}
function getModalContainer(inner, multiple, appendTo, modalsEl) {
  if (multiple) {
    const parent = (inner ? modalsEl : void 0) || document.body;
    const wrapper = queryChild(parent, containerClass);
    if (wrapper) {
      return wrapper;
    }
    const elem = document.createElement("div");
    elem.classList.add(containerClass);
    parent.appendChild(elem);
    return elem;
  }
  if (inner && modalsEl) {
    return modalsEl;
  }
  return appendTo || "body";
}
function getPositionMargin(position) {
  if (position == null || typeof position !== "object" || position.top == null && position.right == null && position.bottom == null && position.left == null) {
    return;
  }
  return [position.top, position.right, position.bottom, position.left].map((p) => typeof p === "number" ? `${p}px` : p || "auto").join(" ");
}
function getMaxZIndex(modalEl, defaultZIndex) {
  if (!modalEl) {
    return;
  }
  const overlayEl = modalEl.parentElement?.parentElement;
  if (!overlayEl) {
    return;
  }
  const currentIndex = getCurrentStyle(overlayEl).zIndex;
  const containerEl = overlayEl.parentElement;
  const cls = `.${wrapperClass}:not(.${closedClass})`;
  const modals = containerEl ? containerEl.querySelectorAll(cls) : void 0;
  let maxIndex = 0;
  (modals ? Array.from(modals) : []).forEach((modalEl2) => {
    const zIndex = getCurrentStyle(modalEl2).zIndex;
    if (zIndex != null) {
      const index = Number(zIndex);
      if (index >= maxIndex && (!overlayEl || modalEl2 !== overlayEl)) {
        maxIndex = index + 1;
      }
    }
  });
  if (maxIndex > Number(currentIndex || (defaultZIndex ?? 2e3) || 0)) {
    return maxIndex;
  }
}
export {
  canMoveOut,
  closedClass,
  containerClass,
  getMaxZIndex,
  getModalContainer,
  getPositionMargin,
  wrapperClass
};
